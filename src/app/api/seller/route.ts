import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || decoded.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get seller profile
    const sellerResult = await query('SELECT * FROM sellers WHERE user_id = $1', [decoded.id]);
    const seller = sellerResult.rows[0];

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Get Analytics
    // Total Revenue (Only completed or non-cancelled orders containing this seller's products)
    const revenueResult = await query(`
      SELECT COALESCE(SUM(oi.price * oi.quantity), 0) AS revenue 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      JOIN orders o ON oi.order_id = o.id
      WHERE p.seller_id = $1 AND o.status != 'cancelled'
    `, [seller.id]);

    // Total Products
    const productsResult = await query('SELECT COUNT(*) as count FROM products WHERE seller_id = $1', [seller.id]);

    return NextResponse.json({
      seller,
      analytics: {
        revenue: parseFloat(revenueResult.rows[0].revenue),
        active_products: parseInt(productsResult.rows[0].count),
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Seller Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || decoded.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shop_name } = await req.json();

    if (!shop_name) {
      return NextResponse.json({ error: 'Shop name is required' }, { status: 400 });
    }

    const updateResult = await query(
      'UPDATE sellers SET shop_name = $1 WHERE user_id = $2 RETURNING *',
      [shop_name, decoded.id]
    );

    return NextResponse.json(updateResult.rows[0], { status: 200 });

  } catch (error: any) {
    console.error('Seller Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
