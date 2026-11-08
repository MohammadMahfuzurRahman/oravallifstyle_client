# Oravel Lifestyle — Next.js + MongoDB store

React + Next.js 14 (App Router) storefront with MongoDB, login, Cash on Delivery checkout, order tracking and an admin dashboard.

## Launch (3 steps)

1. Install Node.js 20.6 or newer, and start MongoDB (local) — or create a free MongoDB Atlas cluster and paste its connection string into `MONGODB_URI` in `.env.local`.
2. `npm install`
3. `npm run launch`  → loads products + admin account, then opens http://localhost:3000

Admin login (change in `.env.local` BEFORE the first `npm run launch`):
`admin@oravel.com` / `ChangeMe12345`  → then open /admin

## Deploy (Vercel + MongoDB Atlas)

1. Create a free MongoDB Atlas cluster, allow access from anywhere (0.0.0.0/0), copy the connection string.
2. Run `npm run seed` once on your computer with that string in `.env.local` (this loads products + admin).
3. Push the project to a PRIVATE GitHub repo, import it in Vercel, and add the same variables from `.env.local` in Project Settings → Environment Variables (use a new long random `AUTH_SECRET`).
4. Deploy.

## Files

- `app/` pages and API routes (`app/api/...`)
- `components/` header, cart, product grid
- `lib/` MongoDB connection, login sessions, formatting
- `data/products.json` product catalog (edit, then `npm run seed` adds NEW products; existing ones are never overwritten)
- `public/images/` product photos
