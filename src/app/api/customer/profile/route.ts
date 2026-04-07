import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await query(`
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1
    `, [user.id]);
    
    if (res.rowCount === 0) {
       return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: res.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
   try {
     const user = getUser(req);
     if (!user) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     const body = await req.json();
     const { name, password, newPassword } = body;
     
     let updates = [];
     let params: any[] = [];
     let paramIndex = 1;

     if (name) { 
        updates.push(`name = $${paramIndex++}`); 
        params.push(name); 
     }

     if (newPassword && password) {
        // Verify current password first
        const userRes = await query(`SELECT password FROM users WHERE id = $1`, [user.id]);
        if ((userRes?.rowCount ?? 0) > 0) {
           const isMatch = await bcrypt.compare(password, userRes.rows[0].password);
           if (!isMatch) {
              return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
           }
           const hashedPw = await bcrypt.hash(newPassword, 10);
           updates.push(`password = $${paramIndex++}`); 
           params.push(hashedPw);
        }
     } else if (newPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
     }

     if (updates.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

     params.push(user.id);

     const updateRes = await query(`
       UPDATE users
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, name, email
     `, params);

     return NextResponse.json({ success: true, message: 'Profile updated successfully', profile: updateRes.rows[0] });
   } catch(error) {
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
   }
}
