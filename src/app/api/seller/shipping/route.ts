import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { shippingZoneSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerRes = await query(`SELECT id FROM sellers WHERE user_id = $1`, [user.id]);
    if (sellerRes.rowCount === 0) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    const seller_id = sellerRes.rows[0].id;

    // Check if table exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name   = 'shipping_zones'
      );
    `);

    if (!tableExists.rows[0].exists) {
       await query(`
        CREATE TABLE IF NOT EXISTS shipping_zones (
          id SERIAL PRIMARY KEY,
          seller_id INTEGER REFERENCES sellers(id) ON DELETE CASCADE,
          zone_name VARCHAR(255) NOT NULL,
          charge DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
       `);
    }

    const res = await query(`
      SELECT id, zone_name, charge, created_at
      FROM shipping_zones
      WHERE seller_id = $1
      ORDER BY created_at DESC
    `, [seller_id]);
    
    return NextResponse.json({ success: true, zones: res.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = shippingZoneSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.errors }, { status: 400 });
    }

    const sellerRes = await query(`SELECT id FROM sellers WHERE user_id = $1`, [user.id]);
    if (sellerRes.rowCount === 0) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    const seller_id = sellerRes.rows[0].id;

    const { zone_name, charge } = result.data;

    await query(`
      INSERT INTO shipping_zones (seller_id, zone_name, charge)
      VALUES ($1, $2, $3)
    `, [seller_id, zone_name, charge]);

    return NextResponse.json({ success: true, message: 'Shipping zone added successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
