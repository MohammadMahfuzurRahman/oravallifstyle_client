import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { money } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function MyOrders() {
  const s = await getSession();
  if (!s) redirect('/login');
  const db = await getDb();
  const orders = await db.collection('orders').find({ userId: s.id }).sort({ createdAt: -1 }).toArray();
  return (
    <div className="container section">
      <h2 className="title">My <span className="gold">Orders</span></h2>
      {orders.length === 0 && <p className="muted center">No orders yet. <Link href="/#shop" className="gold">Start shopping</Link></p>}
      <div className="stack">
        {orders.map((o) => (
          <Link key={o.orderId} href={`/order/${o.orderId}`} className="box order-row">
            <div><strong>{o.orderId}</strong><div className="muted small">{new Date(o.createdAt).toLocaleDateString('en-GB')} · {o.items.length} item(s)</div></div>
            <span className={`status ${o.status}`}>{o.status}</span>
            <strong>{money(o.total)}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
