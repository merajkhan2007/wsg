const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  // 1. Get sellers and their revenue
  const sellers = await client.query('SELECT * FROM sellers');
  console.log('Sellers:', sellers.rows);

  // 2. Orders and Order items
  const orders = await client.query('SELECT id, status, total_amount FROM orders');
  console.log('Orders:', orders.rows);
  
  const orderItems = await client.query(`
    SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, p.seller_id 
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
  `);
  console.log('Order Items:', orderItems.rows);

  // 3. Payouts
  const payouts = await client.query('SELECT * FROM payouts');
  console.log('Payouts:', payouts.rows);

  await client.end();
}

check().catch(console.error);
