const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await pool.query(`
      ALTER TABLE sellers ADD COLUMN IF NOT EXISTS shop_description TEXT;
      ALTER TABLE sellers ADD COLUMN IF NOT EXISTS shop_logo VARCHAR(255);
    `);
    console.log("Successfully altered sellers table.");
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
