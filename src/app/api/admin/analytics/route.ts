import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Revenue over time (monthly focus for simple MVP)
    const revenueRes = await query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM-DD') as date,
        SUM(total_amount) as revenue
      FROM orders
      WHERE status != 'cancelled' AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date ASC
    `);

    // Top selling products
    const topProductsRes = await query(`
      SELECT p.title, SUM(oi.quantity) as sold
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status != 'cancelled'
      GROUP BY p.id
      ORDER BY sold DESC
      LIMIT 5
    `);

    // Stats
    const statsRes = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM sellers) as total_sellers,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled') as total_revenue
    `);

    return NextResponse.json({
      success: true,
      revenueOverTime: revenueRes.rows,
      topProducts: topProductsRes.rows,
      stats: statsRes.rows[0]
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
