import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { z } from 'zod';

const messageSchema = z.object({
  receiver_id: z.number().int().positive(),
  order_id: z.number().int().positive().optional(),
  content: z.string().min(1),
});

// GET messages for the seller (grouped by user/order)
export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    // Retrieve conversation history for a specific order or generally for the seller
    if (orderId) {
      // Legacy messages + seller's tickets for this order
      const messagesRes = await query(`
        SELECT m.*, u.name as sender_name, u.role as sender_role, 'message' as type
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.order_id = $1 AND (m.sender_id = $2 OR m.receiver_id = $2)
        ORDER BY m.created_at ASC
      `, [orderId, user.id]);

      return NextResponse.json({ success: true, messages: messagesRes.rows });
    }

    // Legacy convos + tickets for seller's orders
    const convMessagesRes = await query(`
        SELECT DISTINCT ON (m.order_id) m.order_id, m.content, m.created_at, m.is_read,
          u.name as customer_name, u.id as customer_id
        FROM messages m
        JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
        JOIN order_items oi ON m.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE p.seller_id IN (SELECT id FROM sellers WHERE user_id = $1)
        ORDER BY m.order_id, m.created_at DESC
    `, [user.id]);

    return NextResponse.json({ success: true, conversations: convMessagesRes.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST blocked: Create ticket for admin mediation instead
export async function POST(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = messageSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.errors }, { status: 400 });
    }

    const { receiver_id, order_id, content } = result.data;

    // Privacy: Sellers cannot message customers directly. Create ticket for admin.
    const subject = order_id ? `Order #${order_id} - Seller response needed` : 'Customer inquiry response';
    
    const ticketRes = await query(`
      INSERT INTO tickets (user_id, subject, message, order_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at
    `, [user.id, subject, content, order_id]);

    return NextResponse.json({ 
      success: true, 
      message: 'Response sent to admin support for customer privacy. Ticket created.',
      data: ticketRes.rows[0],
      ticket_id: ticketRes.rows[0].id 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
