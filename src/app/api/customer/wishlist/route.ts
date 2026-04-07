import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product_id');

    if (productId) {
      // Check if a specific product is in wishlist
      const checkResult = await query(
        'SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2',
        [decoded.id, productId]
      );
      return NextResponse.json({ inWishlist: (checkResult.rowCount ?? 0) > 0 }, { status: 200 });
    }

    // Otherwise, fetch all wishlist items
    const dbQuery = `
      SELECT w.id as wishlist_id, p.*, c.name as category_name, s.shop_name 
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
      WHERE w.user_id = $1
      ORDER BY w.id DESC
    `;
    
    const result = await query(dbQuery, [decoded.id]);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Wishlist Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product_id } = await req.json();

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Insert ignoring duplicates (due to unique constraint in schema)
    const result = await query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING RETURNING *',
      [decoded.id, product_id]
    );

    return NextResponse.json({ message: 'Added to wishlist', item: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Add to Wishlist Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [decoded.id, productId]);

    return NextResponse.json({ message: 'Removed from wishlist' }, { status: 200 });
  } catch (error: any) {
    console.error('Remove from Wishlist Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
