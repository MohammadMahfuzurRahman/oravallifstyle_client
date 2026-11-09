import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// Admin only: change an order's status.
export async function PATCH(req, { params }) {
  const s = await getSession();
  if (s?.role !== 'admin') return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  const { status } = await req.json();
  if (!STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  const db = await getDb();
  await db.collection('orders').updateOne({ orderId: params.orderId }, { $set: { status, updatedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
