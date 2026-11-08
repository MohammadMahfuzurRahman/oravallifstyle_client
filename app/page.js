import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import ProductGrid from '@/components/ProductGrid';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = await getDb();
  const products = await db.collection('products').find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <span className="pill">Premium Collection {new Date().getFullYear()}</span>
          <h1>Discover the <span className="gold">Art of Luxury</span></h1>
          <p className="muted">Curated accessories, elegant lamps and statement mirrors — delivered to your door, pay when you receive.</p>
          <div className="hero-cta">
            <Link href="/#shop" className="btn btn-primary">Shop Now</Link>
            <Link href="/login" className="btn btn-ghost">Create Account</Link>
          </div>
          <ul className="trust"><li>🚚 Free shipping over ৳5,000</li><li>💵 Cash on Delivery</li><li>✨ Premium quality</li></ul>
        </div>
      </section>
      <ProductGrid products={products} />
    </>
  );
}
