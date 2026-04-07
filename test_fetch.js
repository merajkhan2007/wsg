const { Pool } = require('pg');

async function testFetch() {
  const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_oNk52WapSbvH@ep-dry-silence-anush4u9.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const images = ["https://res.cloudinary.com/demo/image/upload/v1544171242/sample.jpg"];
    
    // Insert
    const insertRes = await pool.query(
      'INSERT INTO products (seller_id, title, description, price, stock, category_id, images) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [1, "Fetch Test", "Desc", 99, 10, 1, JSON.stringify(images)]
    );
    const newId = insertRes.rows[0].id;
    console.log("Inserted ID:", newId);

    // Fetch via directly mimicking the API
    const res = await fetch('http://localhost:3000/api/products');
    const data = await res.json();
    const myProd = data.find(p => p.id === newId);
    console.log("Fetched via API:", myProd.images);
    console.log("Array?", Array.isArray(myProd.images));
    console.log("[0]:", myProd.images?.[0]);

  } finally {
    pool.end();
  }
}

testFetch();
