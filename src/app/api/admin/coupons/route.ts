import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { couponSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await query(`
      SELECT c.*, s.shop_name
      FROM coupons c
      LEFT JOIN sellers s ON s.id = c.seller_id
      ORDER BY c.created_at DESC
    `);
    
    return NextResponse.json({ success: true, coupons: res.rows });
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
    const result = couponSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.errors }, { status: 400 });
    }

    const { code, discount_type, value, expiry_date, is_active } = result.data;

    // Platform-wide coupon (seller_id = NULL)
    await query(`
      INSERT INTO coupons (code, discount_type, value, expiry_date, is_active)
      VALUES ($1, $2, $3, $4, $5)
    `, [code, discount_type, value, expiry_date, is_active ?? true]);

    return NextResponse.json({ success: true, message: 'Coupon created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
