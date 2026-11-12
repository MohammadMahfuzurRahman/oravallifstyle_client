"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { money, shippingFor, FREE_SHIPPING_AT } from "@/lib/format";

export default function CartDrawer() {
  const { items, setQty, subtotal, open, setOpen } = useCart();
  const shipping = shippingFor(subtotal);
  return (
    <>
      <div
        className={`overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`drawer ${open ? "open" : ""}`}
        aria-label="Shopping cart"
      >
        <div className="drawer-head">
          <h3>Your Cart</h3>
          <button
            className="icon-btn"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>
        <div className="drawer-body">
          {items.length === 0 && <p className="muted">Your cart is empty.</p>}
          {items.map((i) => (
            <div className="cart-line" key={i.id}>
              <img src={i.image} alt={i.name} />
              <div>
                <strong>{i.name}</strong>
                <div className="muted">{money(i.price)}</div>
                <div className="qty">
                  <button onClick={() => setQty(i.id, i.qty - 1)}>−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                </div>
              </div>
              <strong>{money(i.price * i.qty)}</strong>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="row">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : money(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="muted small">
                Free shipping on orders over {money(FREE_SHIPPING_AT)}
              </p>
            )}
            <div className="row total">
              <span>Total</span>
              <span>{money(subtotal + shipping)}</span>
            </div>
            <Link
              href="/checkout"
              className="btn btn-primary block"
              onClick={() => setOpen(false)}
            >
              Checkout · Cash on Delivery
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
