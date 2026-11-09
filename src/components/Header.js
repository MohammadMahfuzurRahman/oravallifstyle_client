'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';

export default function Header() {
  const { count, setOpen } = useCart();
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/auth/me').then((r) => r.json()).then((d) => setUser(d.user)).catch(() => {}); }, []);
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/'; };

  return (
    <header className="header">
      <div className="container header-in">
        <Link href="/" className="brand"><img src="/images/logo.png" alt="" /><span>Oravel <em>Lifestyle</em></span></Link>
        <nav className="nav">
          <Link href="/#shop">Shop</Link>
          {user && <Link href="/orders">My Orders</Link>}
          {user?.role === 'admin' && <Link href="/admin">Admin</Link>}
          {user ? <button className="link-btn" onClick={logout}>Log out ({user.name.split(' ')[0]})</button> : <Link href="/login">Log in</Link>}
          <button className="cart-btn" onClick={() => setOpen(true)} aria-label="Open cart">🛒{count > 0 && <b>{count}</b>}</button>
        </nav>
      </div>
    </header>
  );
}
