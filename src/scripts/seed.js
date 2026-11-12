// Loads the product catalog into MongoDB. Safe to run many times.
const { MongoClient } = require("mongodb");
const products = require("../data/products.json");

async function main() {
  const client = await new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  }).connect();
  const db = client.db(process.env.MONGODB_DB || "oravel");

  for (const p of products) {
    await db
      .collection("products")
      .updateOne({ id: p.id }, { $setOnInsert: p }, { upsert: true });
  }
  await db.collection("orders").createIndex({ orderId: 1 }, { unique: true });

  console.log(`Seed done: ${products.length} products`);
  await client.close();
}
main().catch((e) => {
  console.error(
    "\nSeed failed:",
    e.message,
    "\nIs MongoDB running? Check MONGODB_URI in .env.local\n",
  );
  process.exit(1);
});
