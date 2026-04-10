import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category_id = searchParams.get('category_id');
    const seller_user_id = searchParams.get('seller_user_id');
    let dbQuery = 'SELECT p.*, c.name as category_name, s.shop_name FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN sellers s ON p.seller_id = s.id';
    let values: any[] = [];
    let conditions: string[] = [];

    if (category_id) {
      values.push(category_id);
      conditions.push(`p.category_id = $${values.length}`);
    }

    if (seller_user_id) {
      values.push(seller_user_id);
      conditions.push(`s.user_id = $${values.length}`);
    }

    const id = searchParams.get('id');
    if (id) {
      values.push(id);
      conditions.push(`p.id = $${values.length}`);
    }

    const q = searchParams.get('q');
    if (q) {
      values.push(`%${q}%`);
      conditions.push(`(p.title ILIKE $${values.length} OR p.description ILIKE $${values.length})`);
    }

    if (conditions.length > 0) {
      dbQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    dbQuery += ' ORDER BY p.created_at DESC';

    const result = await query(dbQuery, values);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || decoded.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerResult = await query('SELECT id FROM sellers WHERE user_id = $1', [decoded.id]);
    const seller = sellerResult.rows[0];
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });

    const { title, description, price, special_price, stock, category_id, images, delivery_days } = await req.json();

    if (!title || !price || !category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO products (seller_id, title, description, price, special_price, stock, category_id, images, delivery_days) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [seller.id, title, description, price, special_price || null, stock, category_id, JSON.stringify(images || []), delivery_days || 3]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Create Product Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || decoded.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerResult = await query('SELECT id FROM sellers WHERE user_id = $1', [decoded.id]);
    const seller = sellerResult.rows[0];
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });

    const { id, title, description, price, special_price, stock, category_id, images, delivery_days } = await req.json();

    if (!id || !title || !price || !category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure the product belongs to this seller
    const productCheck = await query('SELECT id FROM products WHERE id = $1 AND seller_id = $2', [id, seller.id]);
    if (productCheck.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
    }

    const result = await query(
      'UPDATE products SET title = $1, description = $2, price = $3, special_price = $4, stock = $5, category_id = $6, images = $7, delivery_days = $8 WHERE id = $9 RETURNING *',
      [title, description, price, special_price || null, stock, category_id, JSON.stringify(images || []), delivery_days || 3, id]
    );

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error: any) {
    console.error('Update Product Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || decoded.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const sellerResult = await query('SELECT id FROM sellers WHERE user_id = $1', [decoded.id]);
    const seller = sellerResult.rows[0];
    if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 });

    // Delete if it belongs to seller
    const result = await query('DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING *', [id, seller.id]);
    
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete Product Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
