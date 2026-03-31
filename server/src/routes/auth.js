const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const pool    = require("../db");
const { requireAuth } = require("../middleware/auth");

// ── Helpers ───────────────────────────────────────────────────
function safeUser(row) {
  return {
    id:    row.id,
    name:  row.name,
    email: row.email  || null,
    phone: row.phone,
    role:  row.role,
  };
}

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""));
}

// ── POST /api/auth/register ───────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, address } = req.body;

    // Validation
    if (!name || !phone || !password)
      return res.status(400).json({ success: false, message: "Name, phone and password are required" });

    if (!validatePhone(phone))
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit Indian mobile number" });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    // Check duplicate phone
    const existing = await pool.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone.trim()]
    );
    if (existing.rows.length > 0)
      return res.status(409).json({ success: false, message: "Phone number already registered" });

    // Check duplicate email (if provided)
    if (email) {
      const emailCheck = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email.trim().toLowerCase()]
      );
      if (emailCheck.rows.length > 0)
        return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO users (name, phone, email, password_hash, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name.trim(),
        phone.trim(),
        email ? email.trim().toLowerCase() : null,
        password_hash,
        address ? address.trim() : null,
      ]
    );

    const user = rows[0];
    req.session.userId = user.id;
    req.session.role   = user.role;

    return res.status(201).json({ success: true, user: safeUser(user) });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Phone/email and password are required" });

    // Allow login by phone OR email
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE phone = $1 OR email = $1",
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    req.session.userId = user.id;
    req.session.role   = user.role;

    return res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err.message);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    return res.json({ success: true, message: "Logged out" });
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────
router.get("/me", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [req.session.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, user: safeUser(rows[0]) });
  } catch (err) {
    console.error("Me error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

module.exports = router;
