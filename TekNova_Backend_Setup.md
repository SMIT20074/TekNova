# TekNova (Campus Resource Exchange) — Backend Setup for Frontend Team

## 1. Supabase Connection (put these in a .env file in the frontend project)

```
NEXT_PUBLIC_SUPABASE_URL=https://gczvfrtquwtyclpwombu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste anon key here>
```

> Get the anon key from: Supabase → Settings → API → "anon public" key.
> Never share the "service_role" key — that one's secret, backend-only.

## 2. Install Supabase client (frontend)

```bash
npm install @supabase/supabase-js
```

Create `lib/supabaseClient.js`:

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 3. Tables Available

| Table | What it stores |
|---|---|
| profiles | Student info (name, email, verified, rating) |
| listings | Items posted (buy/sell/rent/donate) |
| messages | Chat between buyer & seller |
| transactions | Completed deals |
| ratings | Reviews after a deal |
| offers | "Make an Offer" submissions |

## 4. Ready-made Views (for Impact Dashboard)

- `impact_stats` → items reused, total savings, CO2 prevented
- `exchange_leaders` → top 5 sellers leaderboard

## 5. Example: Fetch all active listings (Marketplace page)

```js
const { data, error } = await supabase
  .from('listings')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false })
```

## 6. Example: Fetch Impact Dashboard stats

```js
const { data, error } = await supabase
  .from('impact_stats')
  .select('*')
  .single()
```

## 7. Example: Post a new listing

```js
const { data, error } = await supabase
  .from('listings')
  .insert({
    seller_id: userId,
    title: 'Digital Multimeter & Lab Kit',
    category: 'electronics',
    listing_type: 'sell',
    price: 45,
    condition: 'like_new',
    pickup_zone: 'Science & Engineering Library'
  })
```

## 8. Auth (SSO / Sign In)

Use Supabase Auth with email (college email only). Frontend calls:

```js
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'student@college.edu'
})
```
