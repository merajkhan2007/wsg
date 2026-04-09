import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    let dbQuery = `
      SELECT o.*, STRING_AGG(p.title, ', ') as product_names 
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
    `;
    const values: any[] = [];

    if (user_id) {
      dbQuery += ' WHERE o.user_id = $1';
      values.push(user_id);
    }
    
    dbQuery += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const result = await query(dbQuery, values);
    
    // In a real app we'd fetch order_items and nest them, but this is a simplified version
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user_id, items, address, phone, payment_method, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    // items should be [{ product_id, quantity, price }]

    if (!user_id || !items || items.length === 0 || !address || !phone || !payment_method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (payment_method === 'Razorpay') {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
         return NextResponse.json({ error: 'Missing Razorpay details' }, { status: 400 });
      }
      
      const crypto = require('crypto');
      const secret = (process.env.RAZORPAY_KEY_SECRET || '').replace(/['"]/g, '').trim();
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
      }
    }

    const total_amount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const payment_status = payment_method === 'Razorpay' ? 'paid' : 'pending';
    const initial_status = payment_method === 'COD' ? 'pending_verification' : 'pending';

    // Insert order
    const orderResult = await query(
      'INSERT INTO orders (user_id, total_amount, address, phone, payment_method, payment_status, razorpay_order_id, razorpay_payment_id, razorpay_signature, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [user_id, total_amount, address, phone, payment_method, payment_status, razorpay_order_id || null, razorpay_payment_id || null, razorpay_signature || null, initial_status]
    );
    const order = orderResult.rows[0];

    // Insert order items
    for (const item of items) {
      await query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { order_id, action } = await req.json();

    if (action === 'cancel' && order_id) {
       const check = await query('SELECT status FROM orders WHERE id = $1 AND user_id = $2', [order_id, user.id]);
       if (check.rowCount === 0) return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 });
       
       const status = check.rows[0].status;
       // Only allow cancellation if it hasn't shipped
       if (['pending', 'pending_verification', 'processing'].includes(status)) {
           await query("UPDATE orders SET status = 'cancelled' WHERE id = $1", [order_id]);
           return NextResponse.json({ success: true, message: 'Order successfully cancelled' });
       } else {
           return NextResponse.json({ error: 'Order cannot be cancelled at this stage' }, { status: 400 });
       }
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
  } catch (error: any) {
    console.error('Update Order Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
