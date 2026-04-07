const { Pool } = require('pg');

async function simulate() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_oNk52WapSbvH@ep-dry-silence-anush4u9.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const images = ["https://res.cloudinary.com/demo/image/upload/v1544171242/sample.jpg"];
    
    const result = await pool.query(
      'INSERT INTO products (seller_id, title, description, price, stock, category_id, images) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [1, "Test Direct Insert", "Desc", 99, 10, 1, JSON.stringify(images)]
    );
    console.log("Inserted:", result.rows[0].images);
  } finally {
    pool.end();
  }
}

simulate();
