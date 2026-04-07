const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';`)
.then(res => {
  console.log("users table columns:", res.rows);
  return pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sellers';`);
})
.then(res => {
  console.log("sellers table columns:", res.rows);
  pool.end();
})
.catch(console.error);
