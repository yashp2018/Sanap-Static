const router = require("express").Router();
const pool   = require("../db");

// ── GET /api/categories ───────────────────────────────────────
router.get("/categories", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, slug, name, icon FROM categories ORDER BY sort_order, id"
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("categories error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
});

// ── GET /api/crops?category=slug ──────────────────────────────
router.get("/crops", async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT cr.id, cr.slug, cr.name, cr.image_url,
             cat.slug AS category_slug, cat.name AS category_name,
             COUNT(v.id) FILTER (WHERE v.is_active) AS varieties
      FROM crops cr
      JOIN categories cat ON cat.id = cr.category_id
      LEFT JOIN varieties v ON v.crop_id = cr.id
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` WHERE cat.slug = $1`;
    }

    query += " GROUP BY cr.id, cat.slug, cat.name ORDER BY cr.sort_order, cr.id";

    const { rows } = await pool.query(query, params);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("crops error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch crops" });
  }
});

// ── GET /api/varieties?crop=slug&category=slug&search=text ────
router.get("/varieties", async (req, res) => {
  try {
    const { crop, category, search } = req.query;

    let query = `
      SELECT v.id, v.slug, v.name, v.company, v.image_url,
             v.duration_days, v.stock, v.min_order_qty,
             v.price_ex_factory, v.price_15k, v.price_30k,
             v.delivery_local_charge, v.delivery_250km_charge,
             v.features, v.available_months,
             cr.slug AS crop_slug, cr.name AS crop_name,
             cat.slug AS category_slug, cat.name AS category_name
      FROM varieties v
      JOIN crops cr      ON cr.id  = v.crop_id
      JOIN categories cat ON cat.id = cr.category_id
      WHERE v.is_active = TRUE
    `;
    const params = [];
    let i = 1;

    if (crop) {
      params.push(crop);
      query += ` AND cr.slug = $${i++}`;
    }
    if (category) {
      params.push(category);
      query += ` AND cat.slug = $${i++}`;
    }
    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      query += ` AND (LOWER(v.name) LIKE $${i} OR LOWER(v.company) LIKE $${i} OR LOWER(cr.name) LIKE $${i})`;
      i++;
    }

    query += " ORDER BY cr.sort_order, v.id";

    const { rows } = await pool.query(query, params);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("varieties error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch varieties" });
  }
});

// ── GET /api/variety/:slug ────────────────────────────────────
router.get("/variety/:slug", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT v.*,
              cr.slug AS crop_slug, cr.name AS crop_name,
              cat.slug AS category_slug, cat.name AS category_name
       FROM varieties v
       JOIN crops cr       ON cr.id  = v.crop_id
       JOIN categories cat ON cat.id = cr.category_id
       WHERE v.slug = $1 AND v.is_active = TRUE`,
      [req.params.slug]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Variety not found" });

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("variety detail error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch variety" });
  }
});

module.exports = router;
