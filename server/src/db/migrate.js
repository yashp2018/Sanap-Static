require("dotenv").config();

const fs   = require("fs");
const path = require("path");
const pool = require("../db");

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

  const client = await pool.connect();
  try {
    console.log("⏳ Running migration...");
    await client.query(sql);
    console.log("✅ Schema applied successfully.");

    // Verify tables created
    const { rows } = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    console.log("📋 Tables in database:");
    rows.forEach((r) => console.log("   •", r.tablename));
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
