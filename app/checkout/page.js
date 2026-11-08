'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { money, shippingFor } from '@/lib/format';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState({ name: '', phone: '', email: '', division: '', city: '', address: '', postal: '', note: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const shipping = shippingFor(subtotal);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((d) => d.user && setF((cur) => ({ ...cur, name: cur.name || d.user.name, email: cur.email || d.user.email })));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    const res = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty })), customer: f, note: f.note }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setError(data.error || 'Something went wrong.');
    clear();
    router.push(`/order/${data.orderId}`);
  }

  if (items.length === 0) return <div className="container section center"><h2>Your cart is empty</h2><Link href="/#shop" className="btn btn-primary">Continue shopping</Link></div>;

  return (
    <div className="container section two-col">
      <form onSubmit={submit} className="box">
        <h2>Delivery details</h2>
        <div className="form-grid">
          <label>Full name*<input required value={f.name} onChange={set('name')} /></label>
          <label>Phone*<input required value={f.phone} onChange={set('phone')} placeholder="01XXXXXXXXX" /></label>
          <label>Email<input type="email" value={f.email} onChange={set('email')} /></label>
          <label>Division<input value={f.division} onChange={set('division')} placeholder="Dhaka" /></label>
          <label>City / Area*<input required value={f.city} onChange={set('city')} /></label>
          <label>Postal code<input value={f.postal} onChange={set('postal')} /></label>
        </div>
        <label>Full address*<textarea required rows={3} value={f.address} onChange={set('address')} /></label>
        <label>Order note<textarea rows={2} value={f.note} onChange={set('note')} /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary block" disabled={busy}>{busy ? 'Placing order…' : `Place order · ${money(subtotal + shipping)}`}</button>
        <p className="muted small center">Payment: Cash on Delivery</p>
      </form>
      <aside className="box">
        <h2>Order summary</h2>
        {items.map((i) => <div className="row" key={i.id}><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
        <hr />
        <div className="row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : money(shipping)}</span></div>
        <div className="row total"><span>Total</span><span>{money(subtotal + shipping)}</span></div>
      </aside>
    </div>
  );
}
