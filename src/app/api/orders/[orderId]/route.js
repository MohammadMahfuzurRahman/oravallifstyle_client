import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function PATCH(req, { params }) {
  const { status } = await req.json();
  if (!STATUSES.includes(status))
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const db = await getDb();
  await db
    .collection("orders")
    .updateOne(
      { orderId: params.orderId },
      { $set: { status, updatedAt: new Date() } },
    );
  return NextResponse.json({ ok: true });
}
