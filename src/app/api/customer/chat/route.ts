import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { z } from 'zod';

const messageSchema = z.object({
  order_id: z.number().int().positive(),
  content: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (orderId) {
      // Show legacy messages + user's tickets for this order
      const messagesRes = await query(`
        SELECT m.*, u.name as sender_name, u.role as sender_role, 'message' as type
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.order_id = $1 AND (m.sender_id = $2 OR m.receiver_id = $2)
        ORDER BY m.created_at ASC
      `, [orderId, user.id]);

      const ticketsRes = await query(`
        SELECT t.id as ticket_id, t.subject, t.message as content, t.created_at, t.status, t.user_id as sender_id,
        'You' as sender_name, 'admin' as sender_role, 'ticket' as type
        FROM tickets t
        WHERE t.user_id = $2 AND t.order_id = $1
        ORDER BY t.created_at ASC
      `, [orderId, user.id]);

      const all = [...messagesRes.rows, ...ticketsRes.rows].sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      return NextResponse.json({ success: true, messages: all });
    }

    // Default: Get list of active conversations (legacy messages + tickets)
      const convMessagesRes = await query(`
        SELECT DISTINCT ON (m.order_id) m.order_id, m.content, m.created_at, m.is_read,
          u.name as seller_name, u.id as seller_id, 'open' as status
        FROM messages m
        JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
        WHERE m.sender_id = $1 OR m.receiver_id = $1
        ORDER BY m.order_id, m.created_at DESC
    `, [user.id]);

    const convTicketsRes = await query(`
      SELECT DISTINCT ON (t.order_id) t.order_id, t.subject as content, t.created_at, false as is_read,
        '' as seller_name, null as seller_id, t.status
      FROM tickets t
      WHERE t.user_id = $1 AND t.order_id IS NOT NULL
      ORDER BY t.order_id, t.created_at DESC
    `, [user.id]);

    return NextResponse.json({ success: true, conversations: [...convMessagesRes.rows, ...convTicketsRes.rows] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = messageSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.flatten() }, { status: 400 });
    }

    const { order_id, content } = result.data;

    // Find seller context for ticket
    const sellerRes = await query(`
      SELECT s.id as seller_id, s.shop_name, u.name as seller_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN sellers s ON p.seller_id = s.id
      JOIN users u ON s.user_id = u.id
      WHERE oi.order_id = $1
      LIMIT 1
    `, [order_id]);

    if (sellerRes.rows.length === 0) {
      return NextResponse.json({ error: 'Could not find seller for this order' }, { status: 404 });
    }

    const seller = sellerRes.rows[0];
    const subject = `Order #${order_id} - Message for ${seller.seller_name} (${seller.shop_name})`;

    const ticketRes = await query(`
      INSERT INTO tickets (user_id, subject, message, order_id, seller_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
    `, [user.id, subject, content, order_id, seller.seller_id]);

    return NextResponse.json({ success: true, message: 'Inquiry sent to admin support (for privacy)', data: ticketRes.rows[0], ticket_id: ticketRes.rows[0].id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
