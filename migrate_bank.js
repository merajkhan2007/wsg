const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE sellers
      ADD COLUMN IF NOT EXISTS bank_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(255),
      ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(50);
    `);
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

migrate();
