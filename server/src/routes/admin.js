const router            = require("express").Router();
const pool              = require("../db");
const { requireAdmin }  = require("../middleware/auth");

// All admin routes require admin role
router.use(requireAdmin);

// ── GET /api/admin/dashboard ──────────────────────────────────
router.get("/dashboard", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*)                          FROM orders)                          AS total_orders,
        (SELECT COUNT(*)                          FROM orders WHERE order_status = 'pending')    AS pending_orders,
        (SELECT COUNT(*)                          FROM orders WHERE order_status = 'confirmed')  AS confirmed_orders,
        (SELECT COUNT(*)                          FROM orders WHERE order_status = 'shipped')    AS shipped_orders,
        (SELECT COUNT(*)                          FROM orders WHERE order_status = 'delivered')  AS delivered_orders,
        (SELECT COALESCE(SUM(total_amount), 0)    FROM orders WHERE order_status != 'cancelled') AS total_revenue,
        (SELECT COALESCE(SUM(total_plants), 0)    FROM orders WHERE order_status != 'cancelled') AS total_plants_sold,
        (SELECT COUNT(*)                          FROM users  WHERE role = 'customer')           AS total_customers,
        (SELECT COUNT(*)                          FROM varieties WHERE is_active = TRUE)         AS active_varieties,
        (SELECT COUNT(*)                          FROM varieties WHERE stock < 5000 AND is_active = TRUE) AS low_stock_count
    `);

    // Monthly revenue (last 12 months)
    const { rows: monthly } = await pool.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
        EXTRACT(MONTH FROM created_at)                  AS month_num,
        COALESCE(SUM(total_amount), 0)                  AS revenue,
        COUNT(*)                                        AS orders
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '12 months'
        AND order_status != 'cancelled'
      GROUP BY DATE_TRUNC('month', created_at), EXTRACT(MONTH FROM created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    // Crop-wise sales
    const { rows: cropSales } = await pool.query(`
      SELECT
        oi.crop_name,
        SUM(oi.quantity)   AS total_plants,
        SUM(oi.line_total) AS total_revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.order_status != 'cancelled'
      GROUP BY oi.crop_name
      ORDER BY total_plants DESC
      LIMIT 6
    `);

    // Low stock varieties
    const { rows: lowStock } = await pool.query(`
      SELECT v.id, v.slug, v.name, v.stock, cr.name AS crop_name, v.company
      FROM varieties v
      JOIN crops cr ON cr.id = v.crop_id
      WHERE v.stock < 5000 AND v.is_active = TRUE
      ORDER BY v.stock ASC
      LIMIT 10
    `);

    return res.json({
      success: true,
      data: {
        stats:     rows[0],
        monthly,
        cropSales,
        lowStock,
      },
    });
  } catch (err) {
    console.error("admin dashboard error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch dashboard" });
  }
});

// ── GET /api/admin/orders ─────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where  = "";
    const params = [];
    if (status) {
      params.push(status);
      where = `WHERE o.order_status = $1`;
    }

    const { rows } = await pool.query(
      `SELECT
         o.id, o.order_number, o.order_status, o.payment_method,
         o.payment_status, o.payment_type,
         o.advance_percentage, o.advance_amount, o.remaining_amount,
         o.total_amount, o.total_plants,
         o.customer_name, o.customer_phone, o.customer_email,
         o.delivery_city, o.delivery_state, o.delivery_pincode,
         o.created_at, o.updated_at,
         json_agg(json_build_object(
           'variety_name',  oi.variety_name,
           'crop_name',     oi.crop_name,
           'quantity',      oi.quantity,
           'unit_price',    oi.unit_price,
           'line_total',    oi.line_total,
           'delivery_type', oi.delivery_type
         ) ORDER BY oi.id) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       ${where}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, parseInt(limit), offset]
    );

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(DISTINCT o.id) FROM orders o ${where}`,
      params
    );

    return res.json({
      success: true,
      data:    rows,
      total:   parseInt(countRows[0].count),
      page:    parseInt(page),
      limit:   parseInt(limit),
    });
  } catch (err) {
    console.error("admin orders error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// ── PATCH /api/admin/orders/:id/status ────────────────────────
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: `status must be one of: ${validStatuses.join(", ")}` });

    const { rows, rowCount } = await pool.query(
      `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING id, order_number, order_status`,
      [status, req.params.id]
    );

    if (rowCount === 0)
      return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("admin update order error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to update order status" });
  }
});

// ── PATCH /api/admin/orders/:id/payment ───────────────────────
// Marks advance paid → order confirmed, or marks remaining paid → fully paid
router.patch("/orders/:id/payment", async (req, res) => {
  try {
    const { payment_status } = req.body;
    const valid = ["pending", "advance_paid", "fully_paid", "partially_paid", "cancelled", "refunded"];

    if (!valid.includes(payment_status))
      return res.status(400).json({ success: false, message: `payment_status must be one of: ${valid.join(", ")}` });

    // When advance is paid → auto-confirm the order
    // When fully paid → keep/set order as confirmed (or delivered if already shipped)
    let orderStatusUpdate = "";
    if (payment_status === "advance_paid") {
      orderStatusUpdate = `, order_status = CASE WHEN order_status = 'pending' THEN 'confirmed' ELSE order_status END`;
    } else if (payment_status === "fully_paid") {
      orderStatusUpdate = `, order_status = CASE WHEN order_status = 'pending' THEN 'confirmed' ELSE order_status END`;
    }

    const { rows, rowCount } = await pool.query(
      `UPDATE orders SET payment_status = $1${orderStatusUpdate}
       WHERE id = $2
       RETURNING id, order_number, payment_status, order_status, advance_amount, remaining_amount, total_amount`,
      [payment_status, req.params.id]
    );

    if (rowCount === 0)
      return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("admin update payment error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to update payment status" });
  }
});

// ── GET /api/admin/varieties ──────────────────────────────────
router.get("/varieties", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        v.id, v.slug, v.name, v.company, v.stock, v.is_active,
        v.price_ex_factory, v.price_15k, v.price_30k,
        v.delivery_local_charge, v.delivery_250km_charge,
        v.min_order_qty, v.duration_days,
        cr.name  AS crop_name,  cr.slug AS crop_slug,
        cat.name AS category_name
      FROM varieties v
      JOIN crops      cr  ON cr.id  = v.crop_id
      JOIN categories cat ON cat.id = cr.category_id
      ORDER BY cr.sort_order, v.id
    `);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("admin varieties error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch varieties" });
  }
});

// ── PATCH /api/admin/varieties/:id ───────────────────────────
router.patch("/varieties/:id", async (req, res) => {
  try {
    const allowed = [
      "name", "company", "stock", "is_active",
      "price_ex_factory", "price_15k", "price_30k",
      "delivery_local_charge", "delivery_250km_charge",
      "min_order_qty", "description",
    ];

    const updates = [];
    const params  = [];
    let   i       = 1;

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates.push(`${key} = $${i++}`);
        params.push(req.body[key]);
      }
    }

    if (updates.length === 0)
      return res.status(400).json({ success: false, message: "No valid fields to update" });

    params.push(req.params.id);
    const { rows, rowCount } = await pool.query(
      `UPDATE varieties SET ${updates.join(", ")} WHERE id = $${i} RETURNING id, slug, name, stock, is_active`,
      params
    );

    if (rowCount === 0)
      return res.status(404).json({ success: false, message: "Variety not found" });

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("admin update variety error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to update variety" });
  }
});

// ── POST /api/admin/varieties ─────────────────────────────────
router.post("/varieties", async (req, res) => {
  try {
    const {
      slug, name, company, crop_id,
      duration_days = 28, stock = 0, min_order_qty = 1000,
      price_ex_factory, price_15k, price_30k,
      delivery_local_charge = 0, delivery_250km_charge = 0,
      description = "", features = [],
    } = req.body;

    if (!slug || !name || !company || !crop_id || !price_ex_factory || !price_15k || !price_30k)
      return res.status(400).json({ success: false, message: "slug, name, company, crop_id and prices are required" });

    const { rows } = await pool.query(
      `INSERT INTO varieties
         (slug, name, company, crop_id, duration_days, stock, min_order_qty,
          price_ex_factory, price_15k, price_30k,
          delivery_local_charge, delivery_250km_charge,
          description, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id, slug, name, stock, is_active`,
      [
        slug, name, company, crop_id, duration_days, stock, min_order_qty,
        price_ex_factory, price_15k, price_30k,
        delivery_local_charge, delivery_250km_charge,
        description, features,
      ]
    );

    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ success: false, message: "A variety with this slug already exists" });
    console.error("admin add variety error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to add variety" });
  }
});

// ── DELETE /api/admin/varieties/:id ──────────────────────────
router.delete("/varieties/:id", async (req, res) => {
  try {
    // Soft delete — set is_active = false
    const { rows, rowCount } = await pool.query(
      `UPDATE varieties SET is_active = FALSE WHERE id = $1 RETURNING id, slug, name`,
      [req.params.id]
    );

    if (rowCount === 0)
      return res.status(404).json({ success: false, message: "Variety not found" });

    return res.json({ success: true, data: rows[0], message: "Variety deactivated" });
  } catch (err) {
    console.error("admin delete variety error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to deactivate variety" });
  }
});

// ── GET /api/admin/customers ──────────────────────────────────
router.get("/customers", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        u.id, u.name, u.phone, u.email, u.address, u.created_at,
        COUNT(o.id)                       AS total_orders,
        COALESCE(SUM(o.total_amount), 0)  AS total_spent,
        COALESCE(SUM(o.total_plants), 0)  AS total_plants,
        MAX(o.created_at)                 AS last_order_at
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id AND o.order_status != 'cancelled'
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY total_spent DESC
    `);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("admin customers error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
});

// ── GET /api/admin/customers/:id ─────────────────────────────
router.get("/customers/:id", async (req, res) => {
  try {
    const { rows: userRows } = await pool.query(
      "SELECT id, name, phone, email, address, created_at FROM users WHERE id = $1 AND role = 'customer'",
      [req.params.id]
    );

    if (userRows.length === 0)
      return res.status(404).json({ success: false, message: "Customer not found" });

    const { rows: orders } = await pool.query(
      `SELECT id, order_number, order_status, total_amount, total_plants, created_at
       FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    return res.json({ success: true, data: { ...userRows[0], orders } });
  } catch (err) {
    console.error("admin customer detail error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch customer" });
  }
});

// ── GET /api/admin/categories ─────────────────────────────────
router.get("/categories", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        cat.id, cat.slug, cat.name, cat.icon,
        COUNT(DISTINCT cr.id)  AS crop_count,
        COUNT(DISTINCT v.id)   AS variety_count
      FROM categories cat
      LEFT JOIN crops     cr ON cr.category_id = cat.id
      LEFT JOIN varieties v  ON v.crop_id = cr.id AND v.is_active = TRUE
      GROUP BY cat.id
      ORDER BY cat.sort_order
    `);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("admin categories error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
});

module.exports = router;
