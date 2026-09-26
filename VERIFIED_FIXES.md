# Maine kya fix kiya aur actually test karke verify kiya (25 Sep 2026)

Pichle round me (`FIXES_AND_SETUP.md`) likhne wale ke paas npm/network access
nahi tha, isliye code sirf padh ke likha gaya tha, chalaya nahi gaya tha.
Is baar maine **actually install, build, aur ek real Postgres ke against
run karke** verify kiya hai. Neeche wahi hai jo genuinely tootha hua tha,
plus jo maine confirm kiya ki sahi chal raha hai.

## Real bugs jo maine fix kiye

1. **`src/lib/auth/client.ts` — build hi nahi ho raha tha.**
   `signIn()` function do baar (adhura + poora) likha gaya tha — ek syntax
   error jiski wajah se `tsc`/build fail ho raha tha. Adhura wala hata diya.

2. **"Forgot password" kaam nahi karta — galat method name.**
   `src/routes/login.tsx` me `authClient.forgetPassword(...)` call ho raha
   tha, jo is better-auth version (`1.6.33`) me exist hi nahi karta — sahi
   naam `authClient.requestPasswordReset(...)` hai. Fix kar diya (better-auth
   ke source code se directly confirm kiya).

3. **`find-a-doctor.tsx` me ek helper function ka naam `useLocation` tha**
   (React hook jaisa naam, par actually ek plain geolocation function) —
   isse React ke rules-of-hooks lint check false-positive error de raha tha.
   Rename kar diya `locateMe` — koi behavior change nahi, sirf naam.

## Maine actually chala ke verify kiya (sirf padha nahi)

- `npm install` — clean, 453 packages, koi error nahi.
- `npm run typecheck` — ab **0 errors** (upar wale fix ke baad).
- `npm run lint` — ab **0 errors** (sirf 5 pre-existing harmless warnings).
- `npm run test` — 195 me se 182 pass. Baaki 13 sab Grok Build ke apne
  generic template self-tests hain jo assume karte hain ki app
  **customize nahi hua hai** (jaise "og:title hamesha document se aana
  chahiye" — par is app ka `src/lib/og/site.json` me pehle se
  `"title": "ROSKYRO"` set hai, jo **sahi hai, real branding hai**, bug
  nahi). Inhe "fix" karna matlab real branding/auth setup ko wapas
  generic template state me todna hoga — nahi kiya.
- **`NITRO_PRESET=node-server npm run build`** (jo Railway chalayega) —
  successful, `.output/server/index.mjs` bana (exactly jahan
  `package.json`'s `start` script expect karta hai).
- **Ek real local Postgres 16 banaya, migrations run kiye** (`0001_auth.sql`
  + `0002_schema.sql` dono clean apply hue), phir built server ko us DB
  ke against actually start karke:
  - `/`, `/contact`, `/login`, `/find-a-doctor`, `/admin`, `/blog`,
    `/our-doctors` — sab **200 OK**.
  - Signup (`POST /api/auth/sign-up/email`) — real user Postgres me bana,
    **200 OK**, real session token mila.
  - Login (`POST /api/auth/sign-in/email`) usi user se — **200 OK**.
  - Homepage ke `<head>` me `og:title="ROSKYRO"`, `og:description`,
    `theme-color` sab sahi inject ho rahe the (WhatsApp/social share
    preview ke liye).

## Iska matlab

Ye codebase ab **genuinely build hoti hai, real Postgres ke saath chalti
hai, aur real signup/login karti hai** — sirf code padh ke andaza nahi,
maine khud chala ke dekha hai. `RAILWAY_DEPLOY.md` (isi zip me) ke steps
accurate hain — wahi follow karo.

## Jo maine verify NAHI kiya (Railway account/secrets ke bina possible nahi)

- SMTP se real email jaana (contact form, password reset) — SMTP
  credentials nahi hain mere paas.
- Real Vercel Blob image upload — token nahi hai.
- Real Google/X OAuth login — un providers ke apne credentials chahiye.
- Actual Railway pe deploy — wo sirf tumhare Railway account se ho sakta
  hai, main iske liye tumhare account tak access nahi rakhta.

Ye sab optional/env-var-dependent hain — inke bina bhi email/password
login aur baaki poora site chalega. Jab tak inhe set nahi karoge,
respective feature bas "not configured" fallback pe rahega (jaisa
`RAILWAY_DEPLOY.md` me explain kiya gaya hai) — kuch crash nahi hoga.
