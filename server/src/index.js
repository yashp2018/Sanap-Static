require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const path       = require("path");
const pool       = require("./db");
const sessionMW  = require("./middleware/session");

const app  = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// ── Middleware ────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  "https://sanap-frontend.onrender.com",
  "http://localhost:8080",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
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

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",       require("./routes/auth"));
app.use("/api",            require("./routes/catalog"));
app.use("/api/cart",       require("./routes/cart"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/admin",      require("./routes/admin"));

// ── Serve frontend in production ──────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Sanap Backend API Running 🚀"
  });
});

// ── 404 fallback (dev only) ───────────────────────────────────
if (!isProd) {
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });
}

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   NODE_ENV : ${process.env.NODE_ENV}`);
});
