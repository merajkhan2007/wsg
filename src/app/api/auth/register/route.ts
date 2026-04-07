import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password, role = 'customer' } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check existing user
    const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, status',
      [name, email, hashedPassword, role]
    );

    const user = result.rows[0];

    // If role is seller, insert into sellers table
    if (role === 'seller') {
      const shopName = `${name}'s Shop`; // Default shop name
      await query('INSERT INTO sellers (user_id, shop_name) VALUES ($1, $2)', [user.id, shopName]);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
