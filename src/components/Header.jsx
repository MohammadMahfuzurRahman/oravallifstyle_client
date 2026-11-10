"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { count, setOpen } = useCart();

  return (
    <header className="header">
      <div className="container header-in">
        <Link href="/" className="brand">
          <img src="/images/logo.png" alt="" />
          <span>
            Oravel <em>Lifestyle</em>
          </span>
        </Link>
        <nav className="nav">
          <Link href="/#shop">Shop</Link>
          <Link href="/orders">Orders</Link>
          <button
            className="cart-btn"
            onClick={() => setOpen(true)}
            aria-label="Open cart"
          >
            🛒{count > 0 && <b>{count}</b>}
          </button>
        </nav>
      </div>
    </header>
  );
}
