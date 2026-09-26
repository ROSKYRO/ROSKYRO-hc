# ROSKYRO — Production-Ready Site (Deep Audit Complete)

**Status: READY FOR REAL PATIENTS & STAFF**  
Last deep check: 2026-09-26

This zip is the cleaned, audited, and fixed production build of the ROSKYRO
concierge medicine platform.

## Deep audit summary

| Area                    | Status | Notes |
|-------------------------|--------|-------|
| Public pages & SEO      | OK     | Sitemap, robots, OG tags, meta |
| Find-a-doctor + map     | OK     | Filters, geo sort, appointment form |
| All patient forms       | OK     | WhatsApp-first (wa.me) + DB save |
| Doctor-specific WA      | OK     | Uses doctor number when set |
| Floating WhatsApp CTA   | OK     | Bottom-right on every public page |
| Footer WhatsApp link    | OK     | |
| Staff auth              | OK     | Email/password + optional Google/X |
| Password reset          | OK     | SMTP when configured |
| First admin bootstrap   | OK     | First signed-in user → super_admin |
| Admin CMS               | OK     | Doctors, blog, pages, inbox, users… |
| Inbox (leads + appts)   | OK     | Status workflow |
| Image uploads           | OK     | Blob if token set, else base64 fallback |
| DB migrations + seed    | OK     | Auto-runs on build |
| Rate limiting           | OK     | In-memory (fine for single instance) |
| Markdown XSS safety     | OK     | Escaped |
| Error / 404 pages       | OK     | |
| Railway / Node deploy   | OK     | NITRO_PRESET=node-server |

## Required env vars (Railway or any Node host)

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
NITRO_PRESET=node-server
BETTER_AUTH_URL=https://your-domain
BETTER_AUTH_SECRET=<openssl rand -hex 32>
VITE_AUTH_ENABLED=true
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

Optional:
```
BLOB_READ_WRITE_TOKEN=...
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
X_CLIENT_ID / X_CLIENT_SECRET
```

## First 10 minutes after deploy

1. Open the live URL → seed content appears.
2. Go to `/login` → create the first staff account (becomes super_admin).
3. Open `/admin` → Settings:
   - Set real phone, **WhatsApp number** (digits only, e.g. 919876543210),
     email, address, hero copy, stats.
4. Add/edit doctors (set each doctor’s WhatsApp if desired).
5. Submit a test form → WhatsApp should open with pre-filled message;
   request also appears in Admin → Inbox.

## WhatsApp patient experience (latest)

- Submit buttons say **“Send on WhatsApp”**.
- On success, `wa.me` opens automatically (reliable mobile open).
- Green **“Open WhatsApp & Send”** backup button appears.
- Appointment for a specific doctor prefers that doctor’s WhatsApp.
- Floating green WhatsApp button on every public page.
- Footer “Chat on WhatsApp” button.

## What is intentionally demo data

Seed uses placeholder phone numbers and example emails. Replace them in
Admin → Settings and Admin → Doctors before inviting real patients.

## Deploy command reference

Railway (recommended): connect repo / upload this folder, set env vars above,
deploy. Build runs migrations automatically.

```bash
npm ci
NITRO_PRESET=node-server npm run build
npm run start
```

---
ROSKYRO Healthcare Concierge — audited and ready for real patients and staff.
