const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function testSql() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const sellerId = 1;
  const metricsRes = await client.query(`
       SELECT 
          COALESCE(SUM(amount) FILTER (WHERE status = 'paid' OR status = 'completed'), 0) as total_paid,
          COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as total_pending
       FROM payouts
       WHERE seller_id = $1
    `, [sellerId]);

  const revenueRes = await client.query(`
      SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE p.seller_id = $1 AND o.status != 'cancelled'
    `, [sellerId]);
    
  console.log('Metrics:', metricsRes.rows);
  console.log('Revenue:', revenueRes.rows);

  const totalPaid = parseFloat(metricsRes.rows[0].total_paid);
    const totalPending = parseFloat(metricsRes.rows[0].total_pending);
    const totalRevenue = parseFloat(revenueRes.rows[0].total_revenue);
    const availableBalance = totalRevenue - totalPaid - totalPending;
  console.log("Calculated:", { totalPaid, totalPending, totalRevenue, availableBalance });
  await client.end();
}
testSql().catch(console.error);
