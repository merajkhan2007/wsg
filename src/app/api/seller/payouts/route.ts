import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerRes = await query(`SELECT id FROM sellers WHERE user_id = $1`, [user.id]);
    if (sellerRes.rowCount === 0) return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
    const sellerId = sellerRes.rows[0].id;

    // Retrieve payouts for the authenticated seller
    const res = await query(`
      SELECT p.id, p.amount, p.status, p.created_at
      FROM payouts p
      WHERE p.seller_id = $1
      ORDER BY p.created_at DESC
    `, [sellerId]);
    
    // Retrieve financial summary metrics
    const metricsRes = await query(`
       SELECT 
          COALESCE(SUM(amount) FILTER (WHERE status = 'paid' OR status = 'completed'), 0) as total_paid,
          COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as total_pending
       FROM payouts
       WHERE seller_id = $1
    `, [sellerId]);

    const revenueRes = await query(`
      SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE p.seller_id = $1 AND o.status != 'cancelled'
    `, [sellerId]);

    const totalPaid = parseFloat(metricsRes.rows[0].total_paid);
    const totalPending = parseFloat(metricsRes.rows[0].total_pending);
    const totalRevenue = parseFloat(revenueRes.rows[0].total_revenue);
    const availableBalance = totalRevenue - totalPaid - totalPending;

    return NextResponse.json({ 
       success: true, 
       payouts: res.rows,
       metrics: {
          total_paid: totalPaid,
          total_pending: totalPending,
          available_balance: availableBalance > 0 ? availableBalance : 0
       }
    });
  } catch (error) {
    console.error('Fetch Seller Payouts Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
   try {
     const user = getUser(req);
     if (!user || user.role !== 'seller') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     const body = await req.json();
     const { amount } = body;
     
     if (!amount || amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

     const sellerRes = await query(`SELECT id FROM sellers WHERE user_id = $1`, [user.id]);
     if (sellerRes.rowCount === 0) return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
     const sellerId = sellerRes.rows[0].id;

     // Calculate available balance to enforce restrictions
    const metricsRes = await query(`
       SELECT 
          COALESCE(SUM(amount) FILTER (WHERE status = 'paid' OR status = 'completed'), 0) as total_paid,
          COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as total_pending
       FROM payouts
       WHERE seller_id = $1
    `, [sellerId]);

    const revenueRes = await query(`
      SELECT COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE p.seller_id = $1 AND o.status != 'cancelled'
    `, [sellerId]);

    const totalPaid = parseFloat(metricsRes.rows[0].total_paid);
    const totalPending = parseFloat(metricsRes.rows[0].total_pending);
    const totalRevenue = parseFloat(revenueRes.rows[0].total_revenue);
    const availableBalance = totalRevenue - totalPaid - totalPending;

    if (amount > availableBalance) {
       return NextResponse.json({ error: 'Requested amount exceeds available balance' }, { status: 400 });
    }

     const insertRes = await query(`
       INSERT INTO payouts (seller_id, amount, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, amount, status, created_at
     `, [sellerId, amount]);

     return NextResponse.json({ success: true, message: 'Payout requested successfully', payout: insertRes.rows[0] });
   } catch(error) {
     console.error('Request Seller Payout Error:', error);
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
   }
}
