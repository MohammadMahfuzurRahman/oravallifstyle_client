import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/mongodb';
import { money } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Order confirmation — Oravel Lifestyle' };

export default async function Order({ params }) {
  const db = await getDb();
  const o = await db.collection('orders').findOne({ orderId: params.orderId });
  if (!o) notFound();
  const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
  const at = steps.indexOf(o.status);
  return (
    <div className="container section">
      <div className="box narrow">
        <h2 className="center">🎉 Thank you, {o.customer.name.split(' ')[0]}!</h2>
        <p className="center muted">Order <strong className="gold">{o.orderId}</strong> · save this number to track your order.</p>
        {o.status === 'cancelled'
          ? <p className="center"><span className="status cancelled">cancelled</span></p>
          : <div className="steps">{steps.map((s, i) => <div key={s} className={i <= at ? 'done' : ''}><i>{i + 1}</i><span>{s}</span></div>)}</div>}
        <hr />
        {o.items.map((i) => <div className="row" key={i.id}><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
        <div className="row"><span>Shipping</span><span>{o.shipping === 0 ? 'Free' : money(o.shipping)}</span></div>
        <div className="row total"><span>Total (Cash on Delivery)</span><span>{money(o.total)}</span></div>
        <hr />
        <p className="small muted">Delivering to: {o.customer.name}, {o.customer.phone}<br />{o.customer.address}, {o.customer.city}</p>
        <Link href="/" className="btn btn-primary block">Continue shopping</Link>
      </div>
    </div>
  );
}
