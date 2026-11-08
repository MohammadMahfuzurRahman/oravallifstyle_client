'use client';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { money, CATEGORIES } from '@/lib/format';

function Card({ p }) {
  const { add } = useCart();
  const off = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  return (
    <article className="card">
      <div className="card-img">
        <img src={p.image} alt={p.name} loading="lazy" />
        {p.badge && <span className="badge">{p.badge}</span>}
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="muted small clamp">{p.description}</p>
        {p.reviews > 0 && <div className="small stars">★ {p.rating} <span className="muted">({p.reviews})</span></div>}
        <div className="price">
          <strong>{money(p.price)}</strong>
          {p.originalPrice && <><s className="muted">{money(p.originalPrice)}</s><span className="off">-{off}%</span></>}
        </div>
        <button className="btn btn-primary block" disabled={!p.inStock} onClick={() => add(p)}>{p.inStock ? 'Add to Cart' : 'Out of stock'}</button>
      </div>
    </article>
  );
}

export default function ProductGrid({ products }) {
  const [cat, setCat] = useState(null);
  const best = [...products].filter((p) => p.rating >= 4.8).slice(0, 8);
  const shown = cat ? products.filter((p) => p.category === cat) : best;
  const label = CATEGORIES.find((c) => c.key === cat)?.label;

  return (
    <section id="shop" className="container section">
      <h2 className="title">Shop by <span className="gold">Category</span></h2>
      <div className="cats">
        {CATEGORIES.map((c) => (
          <button key={c.key} className={`cat ${cat === c.key ? 'active' : ''}`} onClick={() => setCat(cat === c.key ? null : c.key)}>
            <img src={c.image} alt="" /><span>{c.label}</span>
          </button>
        ))}
      </div>
      <div className="panel-head">
        <h3>{cat ? label : 'Best Selling'}</h3>
        {cat && <button className="link-btn" onClick={() => setCat(null)}>Close ✕</button>}
      </div>
      {shown.length === 0 ? <p className="muted center">{label} is coming soon. Stay tuned!</p> : <div className="grid">{shown.map((p) => <Card key={p.id} p={p} />)}</div>}
    </section>
  );
}
