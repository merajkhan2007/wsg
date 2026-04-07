const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  let out = "";
  // 1. Get sellers and their revenue
  const sellers = await client.query('SELECT * FROM sellers');
  out += 'Sellers: ' + JSON.stringify(sellers.rows, null, 2) + '\n';

  // 2. Orders and Order items
  const orders = await client.query('SELECT id, status, total_amount FROM orders');
  out += 'Orders: ' + JSON.stringify(orders.rows, null, 2) + '\n';
  
  const orderItems = await client.query(`
    SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, p.seller_id 
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
  `);
  out += 'Order Items: ' + JSON.stringify(orderItems.rows, null, 2) + '\n';

  // 3. Payouts
  const payouts = await client.query('SELECT * FROM payouts');
  out += 'Payouts: ' + JSON.stringify(payouts.rows, null, 2) + '\n';

  fs.writeFileSync('db_dump.txt', out, 'utf8');

  await client.end();
}

check().catch(console.error);
