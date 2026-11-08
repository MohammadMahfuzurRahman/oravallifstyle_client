import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/mongodb';
import { startSession } from '@/lib/auth';

export async function POST(req) {
  const { name, email, phone, password } = await req.json();
  const clean = String(email || '').trim().toLowerCase();
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(clean) || String(password || '').length < 8) {
    return NextResponse.json({ error: 'Enter your name, a valid email, and a password of 8+ characters.' }, { status: 400 });
  }
  const db = await getDb();
  if (await db.collection('users').findOne({ email: clean })) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }
  const user = { name: name.trim(), email: clean, phone: phone || '', role: 'customer',
    passwordHash: await bcrypt.hash(password, 10), createdAt: new Date() };
  const { insertedId } = await db.collection('users').insertOne(user);
  await startSession({ ...user, _id: insertedId });
  return NextResponse.json({ ok: true });
}
