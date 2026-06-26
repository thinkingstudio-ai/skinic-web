# skinic-web — Repo Brain
> Single source of truth for AI agents and developers. Read this file before making any changes.
> **Always read SKINIC-ecosystem/HANDOFF.md for full cross-repo context.**

**Thinking Studio LLC | June 2026**

---

## 1. What is this repo?

`skinic-web` is the **Next.js frontend** for SKINIC. It serves two purposes:
1. **Public landing page** — `skinic.app` — marketing, pricing, legal pages
2. **User dashboard** — `skinic.app/dashboard` — API key management, billing, usage stats

---

## 2. Tech Stack

| Component | Tech |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth | Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) |
| Payment | Paddle.js (`@paddle/paddle-js`) |
| Hosting | Vercel (`skinic.app`) |
| Repo | `thinkingstudio-ai/skinic-web` |

---

## 3. Repo Structure

```
skinic-web/
├── app/
│   ├── page.tsx                    # Landing page (home)
│   ├── layout.tsx                  # Root layout
│   ├── signup/page.tsx             # Signup page → Supabase Auth
│   ├── signin/page.tsx             # Signin page → Supabase Auth
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   ├── page.tsx                # Dashboard home → redirects to /keys
│   │   ├── keys/page.tsx           # API Keys management
│   │   ├── usage/page.tsx          # Usage & stats
│   │   ├── plan/page.tsx           # Plan & Billing (Paddle checkout)
│   │   └── terms/page.tsx          # Terms & Policy (in-dashboard)
│   ├── enterprise/page.tsx         # Enterprise inquiry form
│   ├── terms/page.tsx              # Public Terms of Service
│   ├── privacy/page.tsx            # Public Privacy Policy
│   └── success/page.tsx            # Post-payment success redirect
├── components/
│   ├── ApiKeysClient.tsx           # API keys CRUD (client component)
│   ├── PaddleCheckoutButton.tsx    # Paddle.js checkout overlay button
│   ├── PlanUpgradeBanner.tsx       # Post-payment upgrade status banner
│   ├── SignupPageClient.tsx        # Signup form client component
│   ├── SuccessPageClient.tsx       # Success page client component
│   ├── Pricing.tsx                 # Pricing tiers component (landing page)
│   ├── Footer.tsx                  # Footer with legal links
│   └── ...                        # Other landing page components
├── lib/
│   └── supabase/
│       ├── client.ts               # Supabase browser client
│       └── server.ts               # Supabase server client + createAdminClient()
├── .env.local                      # Local env vars (NOT committed)
└── BRAIN.md                        # This file
```

---

## 4. Key Pages

### Landing Page (`/`)
- Hero, Features, Pricing, Footer sections
- All pricing data in `components/Pricing.tsx` — must match `TIER_LIMITS` in `main.py`

### Auth Flow
- Signup: `skinic.app/signup` → Supabase creates user → email verification → dashboard
- Signin: `skinic.app/signin` → Supabase session → dashboard
- **Only signup flow is via `skinic.app/signup`** — no other signup paths
- Email verification sent from `helloskinic@thinkingstudio.ai` via Supabase SMTP

### Dashboard
- Protected by Supabase Auth middleware (`middleware.ts`)
- Server components use `createAdminClient()` (service role) to bypass RLS
- Client components use bearer token → backend `/dashboard/*` endpoints

### API Keys (`/dashboard/keys`)
- Calls backend `/dashboard/keys` (GET/POST/DELETE) with `Authorization: Bearer <jwt>`
- Keys displayed masked: `sk-••••••••••••••••••••xxxx` with show/hide toggle
- Multiple keys per user supported
- `ApiKeysClient.tsx` is the main client component

### Plan & Billing (`/dashboard/plan`)
- Shows current tier (fetched server-side via admin client)
- Upgrade buttons use `PaddleCheckoutButton` component
- After payment: redirect to `?upgraded=starter|pro` → `PlanUpgradeBanner` polls for tier change

---

## 5. Paddle Integration

```typescript
// PaddleCheckoutButton.tsx
// Initializes Paddle.js with NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
// Opens overlay checkout with:
paddle.Checkout.open({
  items: [{ priceId, quantity: 1 }],
  customer: { email: userEmail },
  customData: { user_id: userId, tier },
  settings: { successUrl: "https://skinic.app/dashboard/plan?upgraded={tier}" }
})
```

**Paddle Price IDs:**
- Starter (API $29): `pri_01kvxcyj7skk9we9tpbzecfhnh`
- Pro (API $99): `pri_01kvxd35mqf8eqkgrv8sw1cj5n`
- Starter App ($39): set `PADDLE_PRICE_STARTER_APP` env var (create product in Paddle dashboard)
- Pro App ($129): set `PADDLE_PRICE_PRO_APP` env var (create product in Paddle dashboard)

**Status: Pending Paddle account approval**

---

## 6. Pricing Tier Data

`components/Pricing.tsx` — must stay aligned with `TIER_LIMITS` in `main.py`.

SKINIC has **two product lines**: API (developer-facing) and App (white-label mobile, B2B).

### API — for Developers

| Tier | Price | Monthly Scans | Analyze/min | Recommend/min | App Included |
|---|---|---|---|---|---|
| Free | $0 | 10 (trial) | 5 | — | ✗ |
| Starter | $29/mo | 2,000 | 20 | 30 · 500/mo | ✗ |
| Pro | $99/mo | 10,000 | 60 | 100 · 2,000/mo | ✗ |
| Enterprise | Custom | Unlimited | 200 | 500 · 10k/mo | ✓ |

### App — for Businesses (white-label mobile)

| Tier | Price | Monthly Scans | QR Distribution | Remove SKINIC Branding |
|---|---|---|---|---|
| Free Preview | $0 | 10 (trial) | ✗ | ✗ |
| Starter App | $39/mo | 2,000 | ✓ | ✗ |
| Pro App | $129/mo | 10,000 | ✓ | ✓ |
| Enterprise App | Custom | Unlimited | ✓ | ✓ + App Store |

---

## 7. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jwenabxcecncybnmeybr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Server-side only, for createAdminClient()

# Backend
NEXT_PUBLIC_API_URL=https://api.skinic.app

# Paddle
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_2ba0c9b85d1f9f7a24d6006493e
PADDLE_PRICE_STARTER=pri_01kvxcyj7skk9we9tpbzecfhnh
PADDLE_PRICE_PRO=pri_01kvxd35mqf8eqkgrv8sw1cj5n
```

---

## 8. Supabase Configuration

- **Project:** `jwenabxcecncybnmeybr`
- **Site URL:** `https://skinic.app`
- **Email sender:** `helloskinic@thinkingstudio.ai` (configured via Supabase SMTP)
- **Auth redirect:** `https://skinic.app/auth/callback`
- **RLS:** Enabled on `api_keys`. Dashboard uses service role key to bypass.

---

## 9. Deployment (Vercel)

- Auto-deploys on push to `main` branch of `thinkingstudio-ai/skinic-web`
- Project: `skinic-web` under `Thinking Studio` team
- Domain: `skinic.app`
- All env vars set in Vercel → Settings → Environment Variables

---

## 10. Important Rules

- Dashboard server pages must have `export const dynamic = "force-dynamic"; export const revalidate = 0;` to prevent caching
- Always use `createAdminClient()` for server-side Supabase queries in dashboard (bypasses RLS)
- Never commit `.env.local`
- Pricing in `Pricing.tsx` MUST match `TIER_LIMITS` in `main.py` — always verify both when changing tiers

---

*SKINIC — Confidential. Thinking Studio LLC © 2026*
