const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_oNk52WapSbvH@ep-dry-silence-anush4u9.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Schema executed successfully.');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await pool.end();
  }
}
run();
