import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);
    
    if (!result.success) {
      const errorMessage = result.error.issues.map((err: any) => err.message).join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { name, email, subject, message } = result.data;

    // We store the contact message as a ticket with user_id = null (since it's an anonymous/general contact)
    // The name and email are prepended to the message body.
    const formattedMessage = `Contact Form Submission\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    await query(`
      INSERT INTO tickets (user_id, subject, message, status)
      VALUES ($1, $2, $3, $4)
    `, [null, subject, formattedMessage, 'open']);

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
