import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/mongodb';
import { startSession } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();
  const db = await getDb();
  const user = await db.collection('users').findOne({ email: String(email || '').trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash))) {
    return NextResponse.json({ error: 'Wrong email or password.' }, { status: 401 });
  }
  await startSession(user);
  return NextResponse.json({ ok: true });
}
