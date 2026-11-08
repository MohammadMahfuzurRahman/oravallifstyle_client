// Loads the product catalog and admin account into MongoDB. Safe to run many times.
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const products = require('../data/products.json');

async function main() {
  const client = await new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).connect();
  const db = client.db(process.env.MONGODB_DB || 'oravel');

  for (const p of products) {
    await db.collection('products').updateOne({ id: p.id }, { $setOnInsert: p }, { upsert: true });
  }
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('orders').createIndex({ orderId: 1 }, { unique: true });

  const email = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (email && process.env.ADMIN_PASSWORD) {
    await db.collection('users').updateOne(
      { email },
      { $setOnInsert: { name: 'Admin', email, phone: '', role: 'admin',
          passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10), createdAt: new Date() } },
      { upsert: true }
    );
  }
  console.log(`Seed done: ${products.length} products, admin ${email}`);
  await client.close();
}
main().catch((e) => {
  console.error('\nSeed failed:', e.message, '\nIs MongoDB running? Check MONGODB_URI in .env.local\n');
  process.exit(1);
});
