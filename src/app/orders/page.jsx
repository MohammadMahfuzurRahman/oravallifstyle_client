import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Orders() {
  const db = await getDb();
  const orders = await db
    .collection("orders")
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
  return (
    <div className="container section">
      <h2 className="title">
        Recent <span className="gold">Orders</span>
      </h2>
      {orders.length === 0 && (
        <p className="muted center">
          No orders yet.{" "}
          <Link href="/#shop" className="gold">
            Start shopping
          </Link>
        </p>
      )}
      <div className="stack">
        {orders.map((o) => (
          <Link
            key={o.orderId}
            href={`/order/${o.orderId}`}
            className="box order-row"
          >
            <div>
              <strong>{o.orderId}</strong>
              <div className="muted small">
                {new Date(o.createdAt).toLocaleDateString("en-GB")} ·{" "}
                {o.items.length} item(s)
              </div>
            </div>
            <span className={`status ${o.status}`}>{o.status}</span>
            <strong>{money(o.total)}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
