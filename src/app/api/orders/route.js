import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";
import { shippingFor } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const orders = await db
    .collection("orders")
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
  return NextResponse.json({ orders });
}

// Place a Cash on Delivery order. Prices always come from the database, never from the browser.
export async function POST(req) {
  const { items, customer, note } = await req.json();
  const c = customer || {};
  if (!Array.isArray(items) || !items.length)
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  if (
    !c.name?.trim() ||
    !/^[0-9+\-\s]{7,16}$/.test(c.phone || "") ||
    !c.address?.trim() ||
    !c.city?.trim()
  ) {
    return NextResponse.json(
      { error: "Please fill in name, phone, city and address." },
      { status: 400 },
    );
  }
  const db = await getDb();
  const lines = [];
  for (const it of items) {
    const qty = Math.min(Math.max(parseInt(it.qty, 10) || 0, 1), 20);
    const p = await db.collection("products").findOne({ id: Number(it.id) });
    if (!p || !p.inStock)
      return NextResponse.json(
        { error: `"${p?.name || "An item"}" is not available.` },
        { status: 400 },
      );
    lines.push({ id: p.id, name: p.name, image: p.image, price: p.price, qty });
  }
  const subtotal = lines.reduce((t, l) => t + l.price * l.qty, 0);
  const shipping = shippingFor(subtotal);
  const orderId = "ORV-" + crypto.randomBytes(5).toString("hex").toUpperCase();
  await db.collection("orders").insertOne({
    orderId,
    items: lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
    payment: "Cash on Delivery",
    status: "pending",
    note: String(note || "").slice(0, 500),
    customer: {
      name: c.name.trim(),
      phone: c.phone,
      email: c.email || "",
      division: c.division || "",
      city: c.city.trim(),
      address: c.address.trim(),
      postal: c.postal || "",
    },
    createdAt: new Date(),
  });
  return NextResponse.json({ orderId });
}
