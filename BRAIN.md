# skinic-web — Repo Brain
> Single source of truth for AI agents and developers. Read this file before making any changes.
> **Always read SKINIC-ecosystem/HANDOFF.md for full cross-repo context.**

**Thinking Studio LLC | June 2026**

---

## 1. What is this repo?

`skinic-web` is the **Next.js frontend** for SKINIC. It serves three purposes:
1. **Public landing page** — `skinic.app` — marketing, pricing, legal pages
2. **User dashboard** — `skinic.app/dashboard` — unified for both Studio and API users
3. **Public Studio funnel** — `skinic.app/b/{slug}` — branded scan pages for beauty businesses

---

## 2. Tech Stack

| Component | Tech |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth | Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) |
| Payment | Paddle.js (`@paddle/paddle-js`) |
| Storage | Supabase Storage (`brand-assets` bucket — logos, product images) |
| Hosting | Vercel (`skinic.app`) |
| Repo | `thinkingstudio-ai/skinic-web` |

---

## 3. Repo Structure

```
skinic-web/
├── app/
│   ├── page.tsx                        # Landing page (beauty business focus)
│   ├── layout.tsx                      # Root layout
│   ├── signup/page.tsx                 # Signup → reads ?product=studio|api → sets product_intent
│   ├── signin/page.tsx                 # Signin
│   ├── dashboard/
│   │   ├── layout.tsx                  # Dashboard layout — sidebar adapts by product_intent
│   │   ├── page.tsx                    # Dashboard overview (scans count, customers, tier)
│   │   ├── keys/page.tsx               # API Keys — visible to API intent users
│   │   ├── usage/page.tsx              # Usage stats
│   │   ├── plan/page.tsx               # Unified plan & billing (Paddle checkout)
│   │   ├── terms/page.tsx              # Terms & Policy
│   │   ├── funnel/page.tsx             # Studio: Scan Page setup (slug, reply_to_email)
│   │   │   └── FunnelSetupClient.tsx
│   │   ├── catalog/page.tsx            # Studio: Product & Service catalog
│   │   │   └── CatalogClient.tsx
│   │   ├── customers/page.tsx          # Studio: Customer database
│   │   │   └── CustomersClient.tsx
│   │   ├── analytics/page.tsx          # Studio (Pro): Analytics
│   │   └── brand/page.tsx              # Studio: Brand Setup (logo, colours, tagline)
│   ├── b/
│   │   └── [slug]/
│   │       ├── page.tsx                # Branded public scan page
│   │       ├── BrandScanClient.tsx     # Scan flow, photo capture, email capture
│   │       └── r/[id]/page.tsx         # Customer result page (tokenized, no auth)
│   ├── studio/
│   │   └── plan/page.tsx               # Redirects to /dashboard/plan
│   ├── enterprise/page.tsx
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   └── success/page.tsx
├── components/
│   ├── ApiKeysClient.tsx               # API keys CRUD
│   ├── StudioBrandSetupClient.tsx      # Brand Setup — logo upload, colours, live preview
│   ├── FeatureLock.tsx                 # Feature gating by tier
│   ├── PaddleCheckoutButton.tsx
│   ├── PlanUpgradeBanner.tsx
│   ├── SignupPageClient.tsx
│   ├── SuccessPageClient.tsx
│   ├── Pricing.tsx                     # Landing page pricing (unified tiers)
│   ├── Footer.tsx
│   └── ...
├── lib/
│   └── supabase/
│       ├── client.ts                   # Supabase browser client
│       └── server.ts                   # Supabase server client + createAdminClient()
├── .env.local                          # NOT committed
└── BRAIN.md                            # This file
```

---

## 4. Key Pages

### Landing Page (`/`)
- Hero, Features, Pricing, Footer — beauty business focused
- All pricing in `components/Pricing.tsx` — must match `TIER_LIMITS` in `main.py`

### Auth Flow
- Signup: `skinic.app/signup?product=studio` (or `=api`) → sets `product_intent` in `user_metadata`
- `useSearchParams()` in `SignupPageClient` / `AuthPageClient` — MUST be wrapped in `<Suspense>` in parent pages
- Email verification from `helloskinic@thinkingstudio.ai` via Supabase

### Dashboard (unified, `/dashboard`)
- `page.tsx` shows overview card: tier, scan count (from `brand_scans` for Studio, `api_keys.monthly_calls` for API), customer count
- `layout.tsx` reads `product_intent` from user metadata to show/hide Studio vs API sidebar items
- All server pages: `export const dynamic = "force-dynamic"; export const revalidate = 0;`

### Studio — Scan Page Setup (`/dashboard/funnel`)
- `FunnelSetupClient.tsx` — slug, reply_to_email, funnel settings (lead capture, custom CTA)
- Calls `PUT /dashboard/funnel` on backend — returns brand data

### Studio — Brand Setup (`/dashboard/brand`)
- `StudioBrandSetupClient.tsx` — logo upload, primary colour, tagline, live scan page preview
- Logo upload → Supabase Storage `brand-assets/{uid}/logo.*` (auto-resized to max 400×400px, PNG 0.88)
- Calls `GET /dashboard/studio/brand` and `PUT /dashboard/studio/brand` — backend auto-creates API key silently

### Studio — Catalog (`/dashboard/catalog`)
- `CatalogClient.tsx` — products and service packages
- **Products:** name, description, price, image URL or upload, CTA ("Shop Now" etc)
- **Service Packages:** name, description, price, duration, availability, CTA ("Book Now" etc)
- Product image upload → Supabase Storage `brand-assets/{uid}/catalog/` (auto-resized max 900×900px, JPEG 0.82)
- Calls `/dashboard/catalog` (GET/POST/PUT/DELETE)

### Studio — Customer Database (`/dashboard/customers`)
- `CustomersClient.tsx` — table of all customers who scanned
- Per-row copy link, per-row delete, bulk "Delete filtered", "Delete all" with confirm modals
- Calls `/dashboard/customers` (GET) and `/dashboard/customers/{id}` or `/dashboard/customers` (DELETE)

### Studio — Analytics (`/dashboard/analytics`)
- Scan volume chart, skin type breakdown, top concerns
- Calls `/dashboard/analytics` (GET)
- **Requires Pro tier** — gated by `FeatureLock`

### Public Scan Page (`/b/[slug]`)
- `BrandScanClient.tsx` — multi-step flow: capture → review → email form → processing → redirect
- On 422 HTTP (photo quality gate): clears photo, returns to capture step with error message
- On success: redirects to `/b/{slug}/r/{customer_id}`

### Customer Result Page (`/b/[slug]/r/[id]`)
- Server component — calls `GET /brand/{slug}/result/{customer_id}` on backend
- Renders: health score, skin type, concerns, characteristics, skin barrier, tone analysis (Fitzpatrick, season, palette), product/service recommendations
- OG metadata (OpenGraph) generated per customer
- No auth required — tokenized by `customer_id` UUID

### Plan & Billing (`/dashboard/plan`)
- Shows unified tiers (Free, Starter $39, Pro $129, Enterprise)
- Normalises legacy `starter_app`/`pro_app` → `starter`/`pro` for display
- `PaddleCheckoutButton` opens overlay checkout

### API Keys (`/dashboard/keys`)
- Visible to API-intent users
- Studio users don't need to interact with keys — managed silently by `/dashboard/studio/brand`

---

## 5. Feature Gating (`FeatureLock.tsx`)

```tsx
<FeatureLock requiredTier="starter" currentTier={tier}>
  {/* gated content */}
</FeatureLock>
```

- `requiredTier`: `"starter" | "pro" | "enterprise"`
- Handles legacy `starter_app`/`pro_app` tiers transparently (maps to `starter`/`pro`)
- Studio pages gated at `starter`: Catalog, Customers, Funnel
- Analytics page gated at `pro`

---

## 6. Paddle Integration

```typescript
// PaddleCheckoutButton.tsx
paddle.Checkout.open({
  items: [{ priceId, quantity: 1 }],
  customer: { email: userEmail },
  customData: { user_id: userId, tier },
  settings: { successUrl: "https://skinic.app/dashboard/plan?upgraded={tier}" }
})
```

**Paddle Price IDs (unified — both API + Studio, same tiers):**
- `PADDLE_PRICE_STARTER` env var → `starter` tier
- `PADDLE_PRICE_PRO` env var → `pro` tier
- `PADDLE_PRICE_STARTER_APP` env var → also maps to `starter` tier (legacy Studio product name)
- `PADDLE_PRICE_PRO_APP` env var → also maps to `pro` tier (legacy Studio product name)

**Status: Pending Paddle account approval**

---

## 7. Unified Pricing Tiers

| Tier | Price | Monthly Scans | Remove Branding | Notes |
|---|---|---|---|---|
| Free | $0 | 50 | ✗ | API + Studio limited |
| Starter | $39/mo | 2,000 | ✗ | Full Studio + API |
| Pro | $129/mo | 10,000 | ✓ | Full Studio + API |
| Enterprise | Custom | Unlimited | ✓ | Custom SLA |

> One plan covers both Studio and API. No separate product lines.

---

## 8. Image Upload (Supabase Storage)

All uploads go to the `brand-assets` bucket (public, 2MB limit).

**Logo upload (StudioBrandSetupClient):**
```typescript
// Canvas resize: max 400×400px, PNG quality 0.88
// Path: brand-assets/{uid}/logo/logo-{timestamp}.png
```

**Product image upload (CatalogClient):**
```typescript
// Canvas resize: max 900×900px, JPEG quality 0.82
// Path: brand-assets/{uid}/catalog/{timestamp}.jpg
```

The `resizeToBlob(file, maxPx, type, quality)` function uses Canvas API to resize client-side before upload. This avoids Supabase's 2MB bucket limit rejection.

---

## 9. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jwenabxcecncybnmeybr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Server-side only

# Backend
NEXT_PUBLIC_API_URL=https://api.skinic.app

# Paddle
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_2ba0c9b85d1f9f7a24d6006493e
PADDLE_PRICE_STARTER=pri_01kvxcyj7skk9we9tpbzecfhnh
PADDLE_PRICE_PRO=pri_01kvxd35mqf8eqkgrv8sw1cj5n
PADDLE_PRICE_STARTER_APP=<Studio Starter price ID>
PADDLE_PRICE_PRO_APP=<Studio Pro price ID>
```

---

## 10. Supabase Configuration

- **Project:** `jwenabxcecncybnmeybr`
- **Site URL:** `https://skinic.app`
- **Auth redirect:** `https://skinic.app/auth/callback`
- **RLS:** Enabled. Dashboard uses `createAdminClient()` (service role) to bypass.
- **Storage:** `brand-assets` bucket — public, RLS policies allow owner write + public read
  - Run `SKINIC/scripts/create_funnel_tables.sql` to create bucket + policies

---

## 11. Deployment (Vercel)

- Auto-deploys on push to `main` branch of `thinkingstudio-ai/skinic-web`
- Domain: `skinic.app`
- All env vars set in Vercel → Settings → Environment Variables

---

## 12. Important Rules

- Dashboard server pages: `export const dynamic = "force-dynamic"; export const revalidate = 0;`
- Always use `createAdminClient()` for server-side Supabase queries
- `useSearchParams()` must be in a client component wrapped in `<Suspense>` in the page
- Pricing in `Pricing.tsx` MUST match `TIER_LIMITS` in `main.py`
- Never commit `.env.local`
- Studio users do NOT manage API keys directly — `StudioBrandSetupClient` calls `/dashboard/studio/brand` which silently handles keys

---

*SKINIC — Confidential. Thinking Studio LLC © 2026*
