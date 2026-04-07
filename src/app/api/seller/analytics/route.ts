import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    // user.id here maps to potential seller. 
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerRes = await query(`SELECT id FROM sellers WHERE user_id = $1`, [user.id]);
    if (sellerRes.rowCount === 0) {
      return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
    }
    const seller_id = sellerRes.rows[0].id;

    const statsRes = await query(`
        SELECT 
            (SELECT COUNT(*) FROM products WHERE seller_id = $1) as total_products,
            (SELECT COUNT(DISTINCT oi.order_id) 
             FROM order_items oi 
             JOIN products p ON p.id = oi.product_id 
             WHERE p.seller_id = $1) as total_orders,
            (SELECT COALESCE(SUM(oi.price * oi.quantity), 0) 
             FROM order_items oi 
             JOIN products p ON p.id = oi.product_id 
             JOIN orders o ON o.id = oi.order_id 
             WHERE p.seller_id = $1 AND o.status != 'cancelled') as total_revenue
    `, [seller_id]);

    const trendsRes = await query(`
        SELECT 
            (SELECT COALESCE(SUM(oi.price * oi.quantity), 0) 
             FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id 
             WHERE p.seller_id = $1 AND o.status != 'cancelled' AND o.created_at >= NOW() - INTERVAL '30 days') as current_revenue,
             
            (SELECT COALESCE(SUM(oi.price * oi.quantity), 0) 
             FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id 
             WHERE p.seller_id = $1 AND o.status != 'cancelled' AND o.created_at >= NOW() - INTERVAL '60 days' AND o.created_at < NOW() - INTERVAL '30 days') as previous_revenue,
             
            (SELECT COUNT(DISTINCT oi.order_id) 
             FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id 
             WHERE p.seller_id = $1 AND o.status != 'cancelled' AND o.created_at >= NOW() - INTERVAL '30 days') as current_orders,
             
            (SELECT COUNT(DISTINCT oi.order_id) 
             FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id 
             WHERE p.seller_id = $1 AND o.status != 'cancelled' AND o.created_at >= NOW() - INTERVAL '60 days' AND o.created_at < NOW() - INTERVAL '30 days') as previous_orders,
             
            (SELECT COUNT(*) FROM products WHERE seller_id = $1 AND created_at >= NOW() - INTERVAL '30 days') as current_products,
            (SELECT COUNT(*) FROM products WHERE seller_id = $1 AND created_at >= NOW() - INTERVAL '60 days' AND created_at < NOW() - INTERVAL '30 days') as previous_products
    `, [seller_id]);

    const calcGrowth = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    const t = trendsRes.rows[0];
    const growth = {
      revenue: calcGrowth(Number(t.current_revenue), Number(t.previous_revenue)),
      orders: calcGrowth(Number(t.current_orders), Number(t.previous_orders)),
      products: calcGrowth(Number(t.current_products), Number(t.previous_products)),
    };

    const revenueRes = await query(`
      SELECT 
        TO_CHAR(o.created_at, 'YYYY-MM-DD') as date,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE p.seller_id = $1 AND o.status != 'cancelled' AND o.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date ASC
    `, [seller_id]);

    const topProductsRes = await query(`
      SELECT p.title, SUM(oi.quantity) as sold
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE p.seller_id = $1 AND o.status != 'cancelled'
      GROUP BY p.id
      ORDER BY sold DESC
      LIMIT 5
    `, [seller_id]);

    return NextResponse.json({
      success: true,
      stats: statsRes.rows[0],
      growth,
      revenueOverTime: revenueRes.rows,
      topProducts: topProductsRes.rows
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
