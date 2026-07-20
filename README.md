_Last updated: July 20, 2026_
# TekNova Backend — API Routes (Vercel Serverless)

## Setup (2 steps)

**1. Copy this whole `api` folder into the root of your Vercel project.**
(Vercel auto-detects any file inside `/api` as a live endpoint — no extra config needed.)

**2. Add these Environment Variables in Vercel:**
Go to your project → Settings → Environment Variables → add:

```
SUPABASE_URL=https://gczvfrtquwtyclpwombu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<get this from Supabase Settings → API → service_role key>
```

⚠️ The service_role key is SECRET — only ever put it here in Vercel env vars, never in frontend code or GitHub.

Also run: `npm install @supabase/supabase-js` in your project.

## Endpoints Created

| Endpoint | Method | What it does |
|---|---|---|
| `/api/listings` | GET | Browse marketplace (supports ?category=&min_price=&max_price=&condition=) |
| `/api/listings` | POST | Post a new item |
| `/api/listings/:id` | GET | Item details page (auto counts views) |
| `/api/listings/:id` | PATCH | Update status (e.g. mark sold) |
| `/api/offers` | POST | Make an offer on an item |
| `/api/offers?listing_id=` | GET | Seller views offers on their item |
| `/api/messages?listing_id=&user_id=` | GET | Load chat thread |
| `/api/messages` | POST | Send chat message |
| `/api/transactions` | POST | Start a deal (QR scan step) |
| `/api/transactions` | PATCH | Mark deal completed (auto marks listing sold) |
| `/api/ratings` | POST | Leave a review (auto updates user's average rating) |
| `/api/impact` | GET | Impact Dashboard stats + leaderboard |

## Example: calling from frontend

```js
const res = await fetch('/api/listings?category=electronics');
const listings = await res.json();
```

```js
await fetch('/api/listings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seller_id: userId,
    title: 'Digital Multimeter',
    category: 'electronics',
    listing_type: 'sell',
    price: 45,
    condition: 'like_new'
  })
});
```

That's it — frontend team just calls these endpoints, no need to touch Supabase directly for writes.
