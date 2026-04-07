const { Pool } = require('pg');
require('dotenv').config({path: '.env.local'});
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query("ALTER TABLE tickets ADD COLUMN order_id integer, ADD COLUMN seller_id integer;")
  .then(() => {
    console.log('Columns added successfully');
    pool.end();
  })
  .catch(err => {
    console.error(err);
    pool.end();
  });
