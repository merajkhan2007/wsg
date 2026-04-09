import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    // Return detailed order breakdown for a specific order (only items belonging to this seller)
    if (orderId) {
       const res = await query(`
         SELECT oi.id as order_item_id, oi.quantity, oi.price, NULL as customization_data,
                p.id as product_id, p.title as product_name, p.images,
                o.id as order_id, o.status as order_status, o.created_at, o.address as shipping_address, o.user_id as buyer_id
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN sellers s ON p.seller_id = s.id
         JOIN orders o ON oi.order_id = o.id
         WHERE s.user_id = $1 AND o.id = $2 AND o.status != 'pending_verification'
       `, [user.id, orderId]);
       
       if (res.rowCount === 0) return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
       
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

    // Return list of all orders containing items from this seller
    const res = await query(`
       SELECT o.id, o.status, o.created_at, o.total_amount, o.address, u.name as customer_name,
              COUNT(oi.id) as seller_item_count,
              SUM(oi.price * oi.quantity) as seller_revenue,
              STRING_AGG(p.title, ', ') as product_names
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN sellers s ON p.seller_id = s.id
       JOIN users u ON o.user_id = u.id
       WHERE s.user_id = $1 AND o.status != 'pending_verification'
       GROUP BY o.id, u.name, o.status, o.created_at, o.total_amount, o.address
       ORDER BY o.created_at DESC
    `, [user.id]);
    
    return NextResponse.json({ success: true, orders: res.rows });
  } catch (error) {
    console.error('Fetch Seller Orders Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Update order item status (e.g., mark as shipped)
export async function PATCH(req: NextRequest) {
   try {
     const user = getUser(req);
     if (!user || user.role !== 'seller') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     const body = await req.json();
     const { order_id, status } = body;
     
     if (!order_id || !status) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

     // Verify order contains items belonging to seller
     const verifyRes = await query(`
        SELECT p.seller_id FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN sellers s ON p.seller_id = s.id
        WHERE oi.order_id = $1 AND s.user_id = $2
        LIMIT 1
     `, [order_id, user.id]);

     if (verifyRes.rowCount === 0) {
        return NextResponse.json({ error: 'Unauthorized or not found' }, { status: 403 });
     }

     await query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, order_id]);

     return NextResponse.json({ success: true, message: 'Status updated successfully' });
   } catch(error) {
     console.error('Update Order Error:', error);
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
   }
}
