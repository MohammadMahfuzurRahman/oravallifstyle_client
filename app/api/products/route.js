import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDb();
  const products = await db.collection('products').find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
  return NextResponse.json({ products });
}
