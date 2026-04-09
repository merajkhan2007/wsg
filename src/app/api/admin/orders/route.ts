import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    // Return detailed order breakdown for a specific order
    if (orderId) {
       const res = await query(`
         SELECT oi.id as order_item_id, oi.quantity, oi.price, NULL as customization_data,
                p.id as product_id, p.title as product_name, p.images,
                o.id as order_id, o.status as order_status, o.created_at, o.address as shipping_address, o.user_id as buyer_id,
                s.shop_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN sellers s ON p.seller_id = s.id
         JOIN orders o ON oi.order_id = o.id
         WHERE o.id = $1
       `, [orderId]);
       
       if (res.rowCount === 0) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
       
       const items = res.rows.map(row => {
          let img = '';
          if (Array.isArray(row.images) && row.images.length > 0) img = row.images[0];
          else if (typeof row.images === 'string') {
             try {
                let parsed = JSON.parse(row.images);
                img = Array.isArray(parsed) ? parsed[0] : parsed;
             } catch(e) { img = row.images; }
          }
          else if (row.images && typeof row.images === 'object' && row.images[0]) img = row.images[0];
          
          return { ...row, image_url: img, images: undefined };
       });

       return NextResponse.json({ success: true, items });
    }

    // Return list of all global orders
    const res = await query(`
       SELECT o.id, o.status, o.created_at, o.total_amount, o.address, o.phone, o.payment_method, u.name as customer_name,
              COUNT(oi.id) as item_count,
              STRING_AGG(p.title, ', ') as product_names
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id, u.name, o.status, o.created_at, o.total_amount, o.address, o.phone, o.payment_method
       ORDER BY o.created_at DESC
    `);
    
    return NextResponse.json({ success: true, orders: res.rows });
  } catch (error) {
    console.error('Fetch Admin Orders Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Update order status generically 
export async function PATCH(req: NextRequest) {
   try {
     const user = getUser(req);
     if (!user || user.role !== 'admin') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     const body = await req.json();
     const { order_id, status } = body;
     
     if (!order_id || !status) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

     const updateRes = await query(`
        UPDATE orders SET status = $1 WHERE id = $2 RETURNING id
     `, [status, order_id]);

     if (updateRes.rowCount === 0) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
     }

     return NextResponse.json({ success: true, message: 'Status updated successfully' });
   } catch(error) {
     console.error('Update Admin Order Error:', error);
     return NextResponse.json({ error: String(error) }, { status: 500 });
   }
}
