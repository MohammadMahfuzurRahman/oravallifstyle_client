"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("oravel-cart") || "[]"));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("oravel-cart", JSON.stringify(items));
  }, [items, ready]);

  const add = (p) => {
    setItems((cur) => {
      const found = cur.find((i) => i.id === p.id);
      if (found)
        return cur.map((i) =>
          i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, 20) } : i,
        );
      return [
        ...cur,
        { id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 },
      ];
    });
    setOpen(true);
  };
  const setQty = (id, qty) =>
    setItems((cur) =>
      qty < 1
        ? cur.filter((i) => i.id !== id)
        : cur.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 20) } : i)),
    );
  const clear = () => setItems([]);
  const count = items.reduce((t, i) => t + i.qty, 0);
  const subtotal = items.reduce((t, i) => t + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, add, setQty, clear, count, subtotal, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}
