import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { payoutUpdateSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    const payoutsQuery = `
      SELECT p.id, p.amount, p.status, p.payment_method, p.transaction_id, p.created_at,
             s.shop_name, s.id as seller_id
      FROM payouts p
      JOIN sellers s ON s.id = p.seller_id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const countQuery = `SELECT COUNT(*) FROM payouts`;

    const [payoutsRes, countRes] = await Promise.all([
      query(payoutsQuery, [limit, offset]),
      query(countQuery)
    ]);

    return NextResponse.json({ 
      success: true, 
      payouts: payoutsRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
      page,
      totalPages: Math.ceil(parseInt(countRes.rows[0].count, 10) / limit)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = payoutUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.errors }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const payoutId = searchParams.get('id');

    if (!payoutId) {
      return NextResponse.json({ error: 'Payout ID required' }, { status: 400 });
    }

    const { status, transaction_id } = result.data;

    await query(`
      UPDATE payouts 
      SET status = $1, transaction_id = $2
      WHERE id = $3
    `, [status, transaction_id, payoutId]);

    return NextResponse.json({ success: true, message: 'Payout status updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
