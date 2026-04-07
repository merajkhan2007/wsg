import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    // Accept admin for all sellers, or seller fetching their own profile
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // specific seller id
    const action = searchParams.get('action'); // approve / reject

    if (decoded.role === 'admin' && action && id) {
        if (action === 'approve') {
             await query("UPDATE sellers SET approval_status = 'approved' WHERE id = $1", [id]);
             return NextResponse.json({ message: 'Seller approved' }, { status: 200 });
        }
        if (action === 'reject') {
             await query("UPDATE sellers SET approval_status = 'rejected' WHERE id = $1", [id]);
             return NextResponse.json({ message: 'Seller rejected' }, { status: 200 });
        }
    }

    let dbQuery = `
       SELECT 
          s.*, 
          u.name, 
          u.email,
          GREATEST(0, (
              SELECT COALESCE(SUM(oi.price * oi.quantity), 0)
              FROM order_items oi
              JOIN products p ON oi.product_id = p.id
              JOIN orders o ON oi.order_id = o.id
              WHERE p.seller_id = s.id AND o.status != 'cancelled'
          ) - (
              SELECT COALESCE(SUM(amount), 0)
              FROM payouts
              WHERE seller_id = s.id AND status IN ('paid', 'completed', 'pending')
          )) as available_balance
       FROM sellers s 
       JOIN users u ON s.user_id = u.id
    `;
    let values: any[] = [];
    
    if (decoded.role === 'seller') {
         dbQuery += ' WHERE s.user_id = $1';
         values.push(decoded.id);
    }

    dbQuery += ' ORDER BY s.created_at DESC';

    const result = await query(dbQuery, values);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error('Admin Sellers Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
