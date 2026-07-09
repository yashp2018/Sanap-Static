require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool   = require("../db");

// ── Change these to your preferred admin credentials ──────────
const ADMIN = {
  name:     "Sanap Admin",
  email:    "admin@sanapnursery.com",
  phone:    "7447770803",
  password: "Sanap@Admin2024",   // used only for normal /login fallback
};

async function seedAdmin() {
  const client = await pool.connect();
  try {
    console.log("⏳ Creating admin user...");

    const password_hash = await bcrypt.hash(ADMIN.password, 10);

    const { rows } = await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'admin')
       ON CONFLICT (email) DO UPDATE
         SET name          = EXCLUDED.name,
             phone         = EXCLUDED.phone,
             password_hash = EXCLUDED.password_hash,
             role          = 'admin'
       RETURNING id, name, email, phone, role`,
      [ADMIN.name, ADMIN.email, ADMIN.phone, password_hash]
    );

    const admin = rows[0];
    console.log("\n✅ Admin user ready:");
    console.log(`   ID    : ${admin.id}`);
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Phone : ${admin.phone}`);
    console.log(`   Role  : ${admin.role}`);
    console.log("\n🔑 Login at: /admin-login");
    console.log(`   Email : ${ADMIN.email}`);
    console.log("   (No password needed — email-only admin login)\n");

  } catch (err) {
    console.error("❌ Admin seed failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();
