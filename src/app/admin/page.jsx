"use client";
import { useEffect, useState } from "react";
import { money } from "@/lib/format";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function Admin() {
  const [orders, setOrders] = useState(null);

  async function load() {
    const res = await fetch("/api/orders");
    setOrders((await res.json()).orders || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(orderId, status) {
    setOrders((cur) =>
      cur.map((o) => (o.orderId === orderId ? { ...o, status } : o)),
    );
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (!orders)
    return <div className="container section center muted">Loading…</div>;
  const live = orders.filter((o) => o.status !== "cancelled");
  const revenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((t, o) => t + o.total, 0);

  return (
    <div className="container section">
      <h2 className="title">
        Admin <span className="gold">Dashboard</span>
      </h2>
      <div className="stats">
        <div className="box">
          <span className="muted small">Total orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="box">
          <span className="muted small">Pending</span>
          <strong>{orders.filter((o) => o.status === "pending").length}</strong>
        </div>
        <div className="box">
          <span className="muted small">Active value</span>
          <strong>{money(live.reduce((t, o) => t + o.total, 0))}</strong>
        </div>
        <div className="box">
          <span className="muted small">Delivered revenue</span>
          <strong>{money(revenue)}</strong>
        </div>
      </div>
      <div className="table-wrap box">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td>
                  <strong>{o.orderId}</strong>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString("en-GB")}</td>
                <td>
                  {o.customer.name}
                  <div className="muted small">
                    {o.customer.phone} · {o.customer.city}
                  </div>
                  <div className="muted small">{o.customer.address}</div>
                </td>
                <td className="small">
                  {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                </td>
                <td>{money(o.total)}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.orderId, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="center muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
