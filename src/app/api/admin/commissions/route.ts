import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { commissionSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await query(`
      SELECT c.id, c.percentage, s.shop_name, s.id as seller_id
      FROM commissions c
      JOIN sellers s ON s.id = c.seller_id
    `);
    
    return NextResponse.json({ success: true, commissions: res.rows });
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
    const result = commissionSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.errors }, { status: 400 });
    }

    const { seller_id, percentage } = result.data;

    await query(`
      INSERT INTO commissions (seller_id, percentage)
      VALUES ($1, $2)
      ON CONFLICT (seller_id) DO UPDATE
      SET percentage = EXCLUDED.percentage, created_at = NOW()
    `, [seller_id, percentage]);

    return NextResponse.json({ success: true, message: 'Commission updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
