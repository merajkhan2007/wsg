import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { z } from 'zod';

const ticketReplySchema = z.object({
  message: z.string().min(2),
  status: z.enum(['open', 'pending', 'resolved']).optional()
});

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const orderId = searchParams.get('orderId');
    const sellerId = searchParams.get('sellerId');

    // Filters for list
    let whereClause = 'WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    if (orderId) {
      whereClause += ` AND t.order_id = $${paramIndex}`;
      params.push(orderId);
      paramIndex++;
    }
    if (sellerId) {
      whereClause += ` AND t.seller_id = $${paramIndex}`;
      params.push(sellerId);
      paramIndex++;
    }

    // Fetch individual ticket and its replies
    if (id) {
        const ticketRes = await query(`
          SELECT t.*, u.name as user_name, u.email as user_email,
            s.shop_name, s.id as seller_id, o.total_amount
          FROM tickets t
          JOIN users u ON u.id = t.user_id
          LEFT JOIN sellers s ON t.seller_id = s.id
          LEFT JOIN orders o ON t.order_id = o.id
          WHERE t.id = $${paramIndex}
        `, [id]);

        if (ticketRes.rows.length === 0) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

        const repliesRes = await query(`
          SELECT r.*, u.name as sender_name, u.role as sender_role
          FROM ticket_replies r
          JOIN users u ON u.id = r.sender_id
          WHERE r.ticket_id = $1
          ORDER BY r.created_at ASC
        `, [id]);

        return NextResponse.json({ success: true, ticket: ticketRes.rows[0], replies: repliesRes.rows });
    }

    // Fetch list of tickets with filters
    const ticketsRes = await query(`
      SELECT t.*, u.name as user_name, u.role as user_role,
        s.shop_name, o.id as order_id
      FROM tickets t
      JOIN users u ON u.id = t.user_id
      LEFT JOIN sellers s ON t.seller_id = s.id
      LEFT JOIN orders o ON t.order_id = o.id
      ${whereClause}
      ORDER BY 
        CASE t.status WHEN 'open' THEN 1 WHEN 'pending' THEN 2 ELSE 3 END,
        t.created_at DESC
    `, params);
    
    return NextResponse.json({ success: true, tickets: ticketsRes.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = ticketReplySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.errors }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });

    const { message, status } = result.data;

    await query(`
      INSERT INTO ticket_replies (ticket_id, sender_id, message)
      VALUES ($1, $2, $3)
    `, [id, user.id, message]);

    if (status) {
       await query(`UPDATE tickets SET status = $1 WHERE id = $2`, [status, id]);
    }

    return NextResponse.json({ success: true, message: 'Reply sent' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
