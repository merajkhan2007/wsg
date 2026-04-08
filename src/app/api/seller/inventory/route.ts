import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { inventoryUpdateSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerRes = await query(`SELECT id FROM sellers WHERE user_id = $1`, [user.id]);
    if (sellerRes.rowCount === 0) {
      return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
    }
    const seller_id = sellerRes.rows[0].id;

    const res = await query(`
      SELECT id, title, price, stock, gift_customization, is_featured, created_at, images
      FROM products
      WHERE seller_id = $1
      ORDER BY created_at DESC
    `, [seller_id]);
    
    return NextResponse.json({ success: true, products: res.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = inventoryUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Validation Error', details: result.error.errors }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const sellerRes = await query(`SELECT id FROM sellers WHERE user_id = $1`, [user.id]);
    if (sellerRes.rowCount === 0) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    const seller_id = sellerRes.rows[0].id;

    const { stock, price, gift_customization } = result.data;

    await query(`
      UPDATE products 
      SET stock = COALESCE($1, stock),
          price = COALESCE($2, price),
          gift_customization = COALESCE($3, gift_customization)
      WHERE id = $4 AND seller_id = $5
    `, [stock, price, gift_customization, productId, seller_id]);

    return NextResponse.json({ success: true, message: 'Inventory updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
