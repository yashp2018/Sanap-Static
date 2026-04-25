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

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",       require("./routes/auth"));
app.use("/api",            require("./routes/catalog"));
app.use("/api/cart",       require("./routes/cart"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/admin",      require("./routes/admin"));

// ── Serve frontend in production ──────────────────────────────
if (isProd) {
  const distPath = path.join(__dirname, "../../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

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
