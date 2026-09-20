
# Birari Unisex Salon — QR Pre-Booking & Offer Platforms


A ₹0-cost, full-stack demo/MVP that takes a customer from **QR scan → premium
landing page → ₹100 pre-booking → registration → confirmation → locked offer
→ WhatsApp** — all without any paid third-party service.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma +
SQLite**. WhatsApp uses the free `wa.me` click-to-chat link (no Business
API). QR codes are generated locally with the `qrcode` package. Payments are
handled via manual UPI instructions with an honest, staff-verified status
flow — nothing claims to be "auto-verified."

---

## 1. Project Overview

**Customer flow**

```
QR Scan → Landing Page → ₹100 Pre-Booking (UPI instructions)
   → Registration Form → Submit → Confirmation Page
   → Locked Offer (QR) → Secret Key (given in-store) → Scratch Card
   → WhatsApp button (pre-filled message, attach screenshot, send)
```

**Admin flow**

```
/admin/login → Overview dashboard → Customers / Payments / Services /
Offers / Secret Keys management
```

---

## 2. Installation

Requires Node.js 18.17+.

```bash
cd birari-unisex-salon
npm install
cp .env.example .env
```

Edit `.env` with your real values (see section 3).

---

## 3. Environment Variables

All configuration lives in `.env` (see `.env.example` for the full list).
Key ones:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite file path (default `file:./dev.db`) |
| `NEXT_PUBLIC_SITE_URL` | Public URL used to build QR code links |
| `OWNER_WHATSAPP_NUMBER` | Salon owner's WhatsApp number (digits only, with country code) |
| `UPI_ID`, `PHONEPE_NUMBER`, `GOOGLEPAY_NUMBER`, `PAYTM_NUMBER` | Payment instructions shown to customers |
| `PREBOOKING_AMOUNT` | Pre-booking charge in ₹ (default 100) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Used once by the seed script to create the admin login |
| `ADMIN_SESSION_SECRET` | Long random string (reserved for future session hardening) |

Never commit your real `.env` file.

---

## 4. Database Setup

This project ships with a hand-written initial migration
(`prisma/migrations/000001_init`) that matches `prisma/schema.prisma`
exactly, so you can get a working database without needing network access
to Prisma's engine-fetch step at migration-generation time.

```bash
npx prisma generate
npx prisma migrate deploy   # applies the shipped migration
npm run db:seed             # creates default services, offers, admin user, demo secret key
```

If you'd rather generate migrations fresh yourself:

```bash
rm -rf prisma/migrations
npx prisma migrate dev --name init
npm run db:seed
```

The seed script creates:
- Default services: Haircut, Hair Spa, Hair Color, Facial, Styling, Other
- Default offers: 10% OFF, 20% OFF, ₹100 OFF, Free Add-on
- One admin user from `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- One demo secret key: `BIRARI25`

---

## 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the customer flow and
`http://localhost:3000/admin/login` for the admin dashboard.

---

## 6. How to Change the Salon Logo

Replace the file at:

```
public/assets/birari-unisex-salon-logo.png
```

with your new PNG, **keeping the same filename**. Every page (`Logo`
component, watermark background, favicon) references this single path, so
no other code changes are needed. If you use a different filename, update
`SALON_LOGO_PATH` in `.env` and `src/components/Logo.tsx`.

---

## 7. How to Change the Owner WhatsApp Number

Update `OWNER_WHATSAPP_NUMBER` in `.env` (digits only, with country code,
e.g. `919876543210`), then restart the app or re-run the seed script if you
want the database `Settings` row updated too:

```bash
npm run db:seed
```

Or update it live from the database directly — the `Settings` table has a
single row (`id = 1`) with an `ownerWhatsappNumber` column.

---

## 8. How to Change UPI / Payment Details

Update `UPI_ID`, `PHONEPE_NUMBER`, `GOOGLEPAY_NUMBER`, `PAYTM_NUMBER` in
`.env`, then re-run `npm run db:seed` (safe — it upserts, it won't
duplicate data), or edit the `Settings` row directly.

---

## 9. How to Change the ₹100 Pre-Booking Amount

Update `PREBOOKING_AMOUNT` in `.env` and re-run the seed script, or edit
`Settings.prebookingAmount` directly in the database. The landing page,
registration summary, success page, and WhatsApp message all read this one
value — no other code changes needed.

---

## 10. How to Add Services

Go to `/admin/services` while logged in as admin. Add a new service name —
it becomes available on the public registration form immediately (only
services marked "Active" show up for customers). You can rename or
disable/enable any service from the same screen.

---

## 11. How to Add Offers

Go to `/admin/offers`. Add a title (e.g. "15% OFF") and optional
description. Every new customer registration is randomly assigned one
active offer for their locked scratch card. Disable an offer to stop it
being assigned to new customers (existing assignments are unaffected).

---

## 12. How to Create an Admin

The first admin is created by the seed script from `ADMIN_USERNAME` /
`ADMIN_PASSWORD` in `.env`. To add another admin, either:

- Change `ADMIN_USERNAME` in `.env` to a new value and re-run
  `npm run db:seed` (creates an additional admin, doesn't remove the old
  one), or
- Insert a row into the `AdminUser` table directly with a bcrypt-hashed
  password (see `prisma/seed.js` for the exact hashing call).

Admin sessions are stored server-side (`AdminSession` table) and referenced
by an httpOnly cookie — there's nothing sensitive in the browser to leak.

---

## 13. How to Deploy (Netlify + Supabase — as configured in this project)

This project is pre-configured for **Netlify** (hosting) + **Supabase**
(Postgres database), both zero-cost on their free tiers.

**Database (Supabase):**
1. Create a project at [supabase.com](https://supabase.com) (or use an
   existing one).
2. Run the SQL in `database/schema/schema.sql` against it once (Supabase
   Dashboard → SQL Editor), or apply `prisma/migrations/000001_init` via
   your own tooling. This creates every table the app needs.
3. Grab the connection string: **Project Settings → Database → Connection
   string**. Build your `DATABASE_URL` as:
   ```
   postgresql://postgres:<url-encoded-password>@db.<project-ref>.supabase.co:5432/postgres
   ```
   Percent-encode any special characters in your password (e.g. `*` → `%2A`).

**Hosting (Netlify):**
1. Create a new site (via the Netlify dashboard, or `netlify sites:create`).
2. In **Site settings → Environment variables**, add every variable from
   `.env.example`, especially: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL` (your
   real `https://<your-site>.netlify.app` or custom domain — QR codes point
   here), `OWNER_WHATSAPP_NUMBER`, `UPI_ID`, `ADMIN_USERNAME`/`ADMIN_PASSWORD`,
   `ADMIN_SESSION_SECRET`.
3. This repo's `netlify.toml` already sets the build command and the
   official `@netlify/plugin-nextjs` runtime — no further config needed.
4. `package.json`'s `build` script runs `prisma generate && node
   prisma/seed.js && next build`, so every deploy automatically ensures the
   Prisma client is generated and default services/offers/admin
   user/demo secret key exist (the seed script safely upserts — it never
   duplicates data on repeat deploys).
5. Deploy — either connect this repo for continuous deployment, or push
   via the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify link   # or: netlify sites:create
   netlify deploy --prod
   ```

**Important — Visitor access:** if your Netlify team has "Require SSO team
login" enabled for all projects, your customers won't be able to reach the
public pages. Turn it off for this site specifically under **Team settings
→ Visitor access**, or ask whoever administers the team to do so.

**Other hosts:** the app is a standard Next.js app, so Vercel, Railway,
Render, or a VPS with PM2 also work — just point `DATABASE_URL` at any
Postgres instance and set the same environment variables.

---

## 14. How to Connect a Real Payment Gateway Later

The codebase is structured so this is additive, not a rebuild:

1. The `Payment` model already has `paymentStatus`, `paymentReference`, and
   `paymentMethod` fields ready for gateway data (order ID, transaction ID,
   signature, etc.).
2. Add your gateway's SDK/env vars (placeholders are already reserved in
   `.env.example` under "future real payment gateway placeholders").
3. Replace the manual "Pay via UPI App" button and screenshot-confirmation
   step in `src/components/LandingFlow.tsx` with your gateway's checkout
   call, and redirect to `/register` only after the gateway confirms
   payment.
4. In `src/app/api/register/route.ts`, set the initial `paymentStatus` to
   `"Payment Verified"` directly (instead of `"Payment Submitted"`) once a
   real gateway has confirmed the charge server-side (verify the gateway's
   webhook signature before trusting it).
5. The admin **Payment Verification** screen (`/admin/payments`) can stay
   as a manual fallback/audit view even after adding a gateway.

---

## Project Structure

```
birari-unisex-salon/
├── public/assets/birari-unisex-salon-logo.png   # original logo, untouched
├── src/
│   ├── app/                     # Next.js App Router pages & API routes
│   │   ├── page.tsx             # "/" landing + pre-booking
│   │   ├── register/            # "/register"
│   │   ├── success/[registrationId]/  # "/success/:id"
│   │   ├── admin/                # admin login + dashboard pages
│   │   └── api/                  # register, unlock, scratch/reveal
│   ├── components/               # Logo, forms, cards, scratch card, admin shell
│   ├── lib/                      # db, settings, auth, whatsapp, qr, validators, ids
│   └── styles/globals.css
├── prisma/
│   ├── schema.prisma
│   ├── migrations/000001_init/migration.sql
│   └── seed.js
├── database/                     # plain-SQL mirror of the Prisma schema/migration
├── .env.example
└── package.json
```

---

## Notes on the Zero-Cost Design

- **WhatsApp**: uses `https://wa.me/<number>?text=<message>` — a standard
  browser link, not the paid WhatsApp Business API. The site cannot attach
  the customer's payment screenshot automatically (no browser API allows
  that); the UI clearly asks the customer to attach it themselves before
  sending.
- **Payments**: no payment gateway is called. Customers see clear UPI
  instructions and self-confirm they've paid; the record is created as
  `"Payment Submitted"` and only becomes `"Payment Verified"` when a staff
  member manually confirms it in `/admin/payments` after checking the
  WhatsApp screenshot.
- **QR codes**: generated locally with the `qrcode` npm package (no
  external API calls) and encode only a public, non-sensitive lookup URL —
  never mobile number, DOB, or payment details.
