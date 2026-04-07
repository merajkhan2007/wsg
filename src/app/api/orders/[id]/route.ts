import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Fetch order details
    const orderResult = await query(
      'SELECT id, total_amount, status, address, created_at, user_id FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderResult.rows[0];

    // Fetch order items with product details
    const itemsResult = await query(
      `SELECT oi.id, oi.quantity, oi.price, p.title as product_name, p.images->>0 as product_image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    order.items = itemsResult.rows;

    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Order Detail Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
