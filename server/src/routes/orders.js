const router          = require("express").Router();
const pool            = require("../db");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// ── Helpers ───────────────────────────────────────────────────
async function generateOrderNumber(client) {
  const { rows } = await client.query("SELECT COUNT(*) FROM orders");
  const next = parseInt(rows[0].count) + 1;
  return `SNH-${String(next).padStart(4, "0")}`;
}

function resolveUnitPrice(variety, quantity) {
  if (quantity >= 30000) return parseFloat(variety.price_30k);
  if (quantity >= 15000) return parseFloat(variety.price_15k);
  return parseFloat(variety.price_ex_factory);
}

// ── POST /api/orders/place ────────────────────────────────────
router.post("/place", async (req, res) => {
  const {
    customer_name,
    customer_phone,
    customer_email,
    delivery_address,
    delivery_city,
    delivery_state    = "Maharashtra",
    delivery_pincode,
    delivery_landmark,
    payment_method,
    payment_type      = "advance",   // "advance" | "full"
    notes,
  } = req.body;

  if (!customer_name || !customer_phone || !delivery_address || !delivery_city || !delivery_pincode || !payment_method)
    return res.status(400).json({ success: false, message: "Name, phone, address, city, pincode and payment method are required" });

  if (!["razorpay", "cod", "bank"].includes(payment_method))
    return res.status(400).json({ success: false, message: "payment_method must be razorpay, cod or bank" });

  if (!["advance", "full"].includes(payment_type))
    return res.status(400).json({ success: false, message: "payment_type must be advance or full" });

  if (!/^\d{6}$/.test(delivery_pincode))
    return res.status(400).json({ success: false, message: "Enter a valid 6-digit pincode" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Fetch cart items
    const { rows: cartItems } = await client.query(
      `SELECT
         ci.quantity, ci.delivery_type,
         v.id            AS variety_id,
         v.name          AS variety_name,
         v.company,
         v.stock,
         v.price_ex_factory,
         v.price_15k,
         v.price_30k,
         v.delivery_local_charge,
         v.delivery_250km_charge,
         cr.name         AS crop_name
       FROM cart_items ci
       JOIN varieties v  ON v.id  = ci.variety_id
       JOIN crops     cr ON cr.id = v.crop_id
       WHERE ci.user_id = $1`,
      [req.session.userId]
    );

    if (cartItems.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Validate stock
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.variety_name}. Available: ${item.stock}`,
        });
      }
    }

    // 3. Calculate totals
    let totalAmount = 0;
    let totalPlants = 0;

    const lineItems = cartItems.map((item) => {
      const unitPrice     = resolveUnitPrice(item, item.quantity);
      const delivCharge   = item.delivery_type === "local"
        ? parseFloat(item.delivery_local_charge)
        : parseFloat(item.delivery_250km_charge);
      const deliveryTotal = delivCharge * item.quantity;
      const lineTotal     = (unitPrice * item.quantity) + deliveryTotal;

      totalAmount += lineTotal;
      totalPlants += item.quantity;

      return {
        variety_id:      item.variety_id,
        variety_name:    item.variety_name,
        crop_name:       item.crop_name,
        company:         item.company,
        quantity:        item.quantity,
        delivery_type:   item.delivery_type,
        unit_price:      unitPrice,
        delivery_charge: deliveryTotal,
        line_total:      lineTotal,
      };
    });

    // 4. Payment calculations — 25% advance / 75% remaining
    const ADVANCE_PCT    = 25;
    const advanceAmount  = parseFloat((totalAmount * ADVANCE_PCT / 100).toFixed(2));
    const remainingAmount = parseFloat((totalAmount - advanceAmount).toFixed(2));

    // Determine initial payment_status
    // COD / bank orders start as "pending" until payment confirmed externally
    // For now all orders start as "pending" — admin marks them paid
    const initialPaymentStatus = "pending";

    // Order status: confirmed once advance is committed
    const initialOrderStatus = "pending";

    // 5. Create order
    const orderNumber = await generateOrderNumber(client);

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (
         order_number, user_id,
         customer_name, customer_phone, customer_email,
         delivery_address, delivery_city, delivery_state,
         delivery_pincode, delivery_landmark,
         payment_method, payment_type,
         advance_percentage, advance_amount, remaining_amount,
         payment_status, order_status,
         total_amount, total_plants, notes
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING *`,
      [
        orderNumber, req.session.userId,
        customer_name.trim(), customer_phone.trim(), customer_email || null,
        delivery_address.trim(), delivery_city.trim(), delivery_state.trim(),
        delivery_pincode.trim(), delivery_landmark || null,
        payment_method, payment_type,
        ADVANCE_PCT, advanceAmount, remainingAmount,
        initialPaymentStatus, initialOrderStatus,
        totalAmount.toFixed(2), totalPlants, notes || null,
      ]
    );

    const order = orderRows[0];

    // 6. Insert order items
    for (const item of lineItems) {
      await client.query(
        `INSERT INTO order_items
           (order_id, variety_id, variety_name, crop_name, company,
            quantity, delivery_type, unit_price, delivery_charge, line_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          order.id, item.variety_id, item.variety_name, item.crop_name, item.company,
          item.quantity, item.delivery_type, item.unit_price, item.delivery_charge, item.line_total,
        ]
      );
    }

    // 7. Deduct stock
    for (const item of cartItems) {
      await client.query(
        "UPDATE varieties SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.variety_id]
      );
    }

    // 8. Clear cart
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [req.session.userId]);

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        order_number:       order.order_number,
        order_id:           order.id,
        total_amount:       order.total_amount,
        advance_amount:     order.advance_amount,
        remaining_amount:   order.remaining_amount,
        advance_percentage: order.advance_percentage,
        payment_type:       order.payment_type,
        total_plants:       order.total_plants,
        order_status:       order.order_status,
        payment_status:     order.payment_status,
        payment_method:     order.payment_method,
        items:              lineItems,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("place order error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to place order" });
  } finally {
    client.release();
  }
});

// ── GET /api/orders ───────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         o.id, o.order_number, o.order_status, o.payment_method,
         o.payment_status, o.payment_type,
         o.advance_percentage, o.advance_amount, o.remaining_amount,
         o.total_amount, o.total_plants,
         o.delivery_city, o.delivery_state, o.created_at,
         json_agg(json_build_object(
           'variety_name',  oi.variety_name,
           'crop_name',     oi.crop_name,
           'company',       oi.company,
           'quantity',      oi.quantity,
           'unit_price',    oi.unit_price,
           'line_total',    oi.line_total,
           'delivery_type', oi.delivery_type
         ) ORDER BY oi.id) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.session.userId]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("get orders error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// ── GET /api/orders/:orderNumber ──────────────────────────────
router.get("/:orderNumber", async (req, res) => {
  try {
    const { rows: orderRows } = await pool.query(
      "SELECT * FROM orders WHERE order_number = $1 AND user_id = $2",
      [req.params.orderNumber, req.session.userId]
    );

    if (orderRows.length === 0)
      return res.status(404).json({ success: false, message: "Order not found" });

    const order = orderRows[0];
    const { rows: items } = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1 ORDER BY id",
      [order.id]
    );

    return res.json({ success: true, data: { ...order, items } });
  } catch (err) {
    console.error("get order detail error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
});

// ── PATCH /api/orders/:orderNumber/cancel ─────────────────────
router.patch("/:orderNumber/cancel", async (req, res) => {
  try {
    const { reason } = req.body;
    const { rows, rowCount } = await pool.query(
      `UPDATE orders SET order_status = 'cancelled', payment_status = 'cancelled'
       WHERE order_number = $1 AND user_id = $2
         AND order_status IN ('pending','confirmed')
       RETURNING id, order_number, order_status`,
      [req.params.orderNumber, req.session.userId]
    );
    if (rowCount === 0)
      return res.status(404).json({ success: false, message: "Order not found or cannot be cancelled" });
    return res.json({ success: true, message: "Order cancelled", data: rows[0] });
  } catch (err) {
    console.error("cancel order error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
});

module.exports = router;
