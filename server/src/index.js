require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const pool       = require("./db");
const sessionMW  = require("./middleware/session");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_ORIGIN || "http://localhost:8080",
  credentials: true,
}));

app.use(express.json());
app.use(sessionMW);

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ success: true, message: "Server and DB are running" });
  } catch (err) {
    res.status(500).json({ success: false, message: "DB connection failed", error: err.message });
  }
});

// ── Routes (added step by step) ───────────────────────────────
app.use("/api/auth",       require("./routes/auth"));
app.use("/api",            require("./routes/catalog"));
app.use("/api/cart",       require("./routes/cart"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/admin",      require("./routes/admin"));

// ── 404 fallback ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   NODE_ENV : ${process.env.NODE_ENV}`);
  console.log(`   DB       : ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
});
