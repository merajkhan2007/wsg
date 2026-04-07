import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
    const { user_id, items, address, phone } = await req.json();
    // items should be [{ product_id, quantity, price }]

    if (!user_id || !items || items.length === 0 || !address || !phone) {
      return NextResponse.json({ error: 'Missing user_id, items, address, or phone' }, { status: 400 });
    }

    const total_amount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Insert order
    const orderResult = await query(
      'INSERT INTO orders (user_id, total_amount, address, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, total_amount, address, phone]
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
