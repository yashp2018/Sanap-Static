const router              = require("express").Router();
const pool                = require("../db");
const { requireAuth }     = require("../middleware/auth");

// All cart routes require login
router.use(requireAuth);

// ── Helper: fetch full cart for a user ────────────────────────
async function getCartRows(userId) {
  const { rows } = await pool.query(
    `SELECT
       ci.id, ci.quantity, ci.delivery_type, ci.added_at,
       v.id            AS variety_id,
       v.slug          AS variety_slug,
       v.name          AS variety_name,
       v.company,
       v.image_url,
       v.stock,
       v.min_order_qty,
       v.price_ex_factory,
       v.price_15k,
       v.price_30k,
       v.delivery_local_charge,
       v.delivery_250km_charge,
       cr.name         AS crop_name,
       cat.name        AS category_name
     FROM cart_items ci
     JOIN varieties  v   ON v.id   = ci.variety_id
     JOIN crops      cr  ON cr.id  = v.crop_id
     JOIN categories cat ON cat.id = cr.category_id
     WHERE ci.user_id = $1
     ORDER BY ci.added_at DESC`,
    [userId]
  );
  return rows;
}

// ── GET /api/cart ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const rows = await getCartRows(req.session.userId);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("cart get error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
});

// ── POST /api/cart/add ────────────────────────────────────────
router.post("/add", async (req, res) => {
  try {
    const { variety_id, quantity, delivery_type = "local" } = req.body;

    if (!variety_id || !quantity)
      return res.status(400).json({ success: false, message: "variety_id and quantity are required" });

    if (!["local", "250km"].includes(delivery_type))
      return res.status(400).json({ success: false, message: "delivery_type must be local or 250km" });

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1)
      return res.status(400).json({ success: false, message: "quantity must be a positive number" });

    // Check variety exists and has enough stock
    const { rows: vRows } = await pool.query(
      "SELECT id, stock, min_order_qty FROM varieties WHERE id = $1 AND is_active = TRUE",
      [variety_id]
    );
    if (vRows.length === 0)
      return res.status(404).json({ success: false, message: "Variety not found" });

    const variety = vRows[0];
    if (qty < variety.min_order_qty)
      return res.status(400).json({ success: false, message: `Minimum order quantity is ${variety.min_order_qty}` });

    if (qty > variety.stock)
      return res.status(400).json({ success: false, message: `Only ${variety.stock} plants available in stock` });

    // Upsert — if same variety already in cart, update qty + delivery_type
    await pool.query(
      `INSERT INTO cart_items (user_id, variety_id, quantity, delivery_type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, variety_id)
       DO UPDATE SET quantity = $3, delivery_type = $4`,
      [req.session.userId, variety_id, qty, delivery_type]
    );

    const rows = await getCartRows(req.session.userId);
    return res.status(201).json({ success: true, data: rows });
  } catch (err) {
    console.error("cart add error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to add to cart" });
  }
});

// ── PATCH /api/cart/update ────────────────────────────────────
router.patch("/update", async (req, res) => {
  try {
    const { variety_id, quantity, delivery_type } = req.body;

    if (!variety_id)
      return res.status(400).json({ success: false, message: "variety_id is required" });

    // Check item belongs to this user
    const { rows: existing } = await pool.query(
      "SELECT ci.id, v.stock, v.min_order_qty FROM cart_items ci JOIN varieties v ON v.id = ci.variety_id WHERE ci.user_id = $1 AND ci.variety_id = $2",
      [req.session.userId, variety_id]
    );
    if (existing.length === 0)
      return res.status(404).json({ success: false, message: "Item not in cart" });

    const updates = [];
    const params  = [];
    let   i       = 1;

    if (quantity !== undefined) {
      const qty = parseInt(quantity);
      if (isNaN(qty) || qty < 1)
        return res.status(400).json({ success: false, message: "quantity must be a positive number" });
      if (qty < existing[0].min_order_qty)
        return res.status(400).json({ success: false, message: `Minimum order quantity is ${existing[0].min_order_qty}` });
      if (qty > existing[0].stock)
        return res.status(400).json({ success: false, message: `Only ${existing[0].stock} plants available` });
      updates.push(`quantity = $${i++}`);
      params.push(qty);
    }

    if (delivery_type !== undefined) {
      if (!["local", "250km"].includes(delivery_type))
        return res.status(400).json({ success: false, message: "delivery_type must be local or 250km" });
      updates.push(`delivery_type = $${i++}`);
      params.push(delivery_type);
    }

    if (updates.length === 0)
      return res.status(400).json({ success: false, message: "Nothing to update" });

    params.push(req.session.userId, variety_id);
    await pool.query(
      `UPDATE cart_items SET ${updates.join(", ")} WHERE user_id = $${i++} AND variety_id = $${i}`,
      params
    );

    const rows = await getCartRows(req.session.userId);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("cart update error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to update cart" });
  }
});

// ── DELETE /api/cart/:varietyId ───────────────────────────────
router.delete("/:varietyId", async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND variety_id = $2",
      [req.session.userId, req.params.varietyId]
    );

    if (rowCount === 0)
      return res.status(404).json({ success: false, message: "Item not in cart" });

    const rows = await getCartRows(req.session.userId);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("cart remove error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to remove from cart" });
  }
});

// ── DELETE /api/cart ──────────────────────────────────────────
router.delete("/", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1",
      [req.session.userId]
    );
    return res.json({ success: true, data: [] });
  } catch (err) {
    console.error("cart clear error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
});

module.exports = router;
