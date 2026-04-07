import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await query(`
      SELECT id, name, email, role, status, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json({ success: true, users: res.rows });
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

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const body = await req.json();
    const { status, role } = body;

    // Build dynamic update
    let updates = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (status) {
        updates.push(`status = $${paramIndex++}`);
        params.push(status);
    }
    if (role) {
        updates.push(`role = $${paramIndex++}`);
        params.push(role);
    }

    if (updates.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    params.push(userId);
    
    await query(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
    `, params);

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
