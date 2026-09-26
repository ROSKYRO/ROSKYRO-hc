# Railway pe deploy karna — step by step

Is baar maine code me wahi cheezein fix ki hain jo **Railway pe deploy karne
ke liye zaroori thi** (pehle wala build sirf Vercel ke serverless format ke
liye tha, jo Railway pe chalta hi nahi).

## Kya badla (code)

1. **`vite.config.ts`** — Nitro (server build) ka preset ab configurable hai.
   Pehle hardcoded `"vercel"` tha (Vercel-only serverless output). Ab agar
   `NITRO_PRESET=node-server` env var set ho, to ek normal, long-running Node
   server build hota hai (`.output/server/index.mjs`) — jo Railway (ya kisi
   bhi VPS/Docker host) pe chal sakta hai. Vercel default waisa hi raha, kuch
   nahi toota.
2. **`package.json`** — naya `"start": "node .output/server/index.mjs"`
   script add kiya, jo Railway `npm run build` ke baad automatically call
   karega.
3. **`railway.toml`** — naya file, Railway ko build/start command aur
   healthcheck batata hai.
4. **Native Google/X sign-in** — `src/lib/auth/server.ts` me Better Auth ka
   built-in `socialProviders` add kiya (Grok broker ke `genericOAuth` plugin
   ko chhue bina — dono alag-alag provider ids pe hain, ek dusre se collide
   nahi karte). `src/lib/server/auth-providers.ts` (naya) server-side decide
   karta hai ki har upstream (Google/X) native mode me hai ya broker mode
   me ya bilkul nahi — `src/routes/login.tsx` aur `src/lib/auth/gates.tsx`
   ab yahi dynamic list use karte hain static `GROK_PROVIDERS` ki jagah.

**Database ke baare me ek achi khabar:** `src/lib/db.ts` aur
`src/lib/auth/server.ts` dono andar se plain `pg` (node-postgres) use karte
hain — naam me "neon" hai kyunki Grok Build normally Neon Postgres deta hai,
par driver generic hai. Matlab **Railway ka apna Postgres bhi bina kisi code
change ke chalega**, bas `DATABASE_URL` sahi set hona chahiye.

## Railway pe steps

1. **Naya Postgres add karo:** Railway project me "+ New" → "Database" →
   "PostgreSQL". Ye apne aap `DATABASE_URL` variable banata hai us Postgres
   service ke andar.
2. **Apni app ka service banao:** is repo/zip ko Railway se connect karo (ya
   "Deploy from GitHub" — pehle isse GitHub pe push karna hoga).
3. **App service ke Variables tab me ye env vars daalo:**
   - `DATABASE_URL` = Postgres service ka reference (`${{Postgres.DATABASE_URL}}`
     — Railway ka "reference variable" picker use karo, taaki dono services
     connected rahein)
   - `NITRO_PRESET` = `node-server`
   - `BETTER_AUTH_URL` = `https://<your-service>.up.railway.app` (ya jo bhi
     custom domain aap attach karo) — Railway se domain milte hi ise update
     kar dena
   - `BETTER_AUTH_SECRET` = ek lambi random string (`openssl rand -hex 32`
     se generate kar sakte ho)
   - `VITE_AUTH_ENABLED` = `true`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — contact-form email
     aur "forgot password" reset-email ke liye
   - (optional) `BLOB_READ_WRITE_TOKEN` — real image storage ke liye (Vercel
     Blob account se milta hai; ye service kahin bhi hosted ho, chalta hai —
     Vercel pe app run karne ki zaroorat nahi, sirf token chahiye)
   - (optional, real Google/X login ke liye) `GOOGLE_CLIENT_ID` /
     `GOOGLE_CLIENT_SECRET`, `X_CLIENT_ID` / `X_CLIENT_SECRET` — details neeche
4. **Google/X login ab Railway pe bhi chal sakta hai (native, broker ke bina):**
   Pehle ye sirf Grok Build ke broker se kaam karta tha. Ab agar aap apna
   khud ka Google/X OAuth app bana ke uske credentials set kar do, sign-in
   usi se hoga — broker bilkul use hi nahi hoga.

   **Google:**
   - [Google Cloud Console](https://console.cloud.google.com/) → APIs &
     Services → Credentials → "Create OAuth client ID" (type: Web
     application)
   - Authorized redirect URI: `https://<your-domain>/api/auth/callback/google`
   - Railway env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

   **X (Twitter):**
   - [X Developer Portal](https://developer.x.com/) → apna app → "User
     authentication settings" → OAuth 2.0 on, type: Web App
   - Callback URI: `https://<your-domain>/api/auth/callback/twitter`
   - Railway env vars: `X_CLIENT_ID`, `X_CLIENT_SECRET`

   Jaise hi in me se kisi ek ke dono vars (`*_CLIENT_ID` + `*_CLIENT_SECRET`)
   set ho jate hain, us upstream ka button apne aap **native** mode me chala
   jata hai (broker automatically skip ho jata hai us upstream ke liye) —
   koi aur code change nahi chahiye. Agar aap kisi ek ya dono ke credentials
   set nahi karte, wo button ya to broker try karega (fail hoga, jaisa pehle
   bataya) ya bilkul nahi dikhega (agar broker bhi configured nahi hai) —
   email/password hamesha available rahega.
5. **Deploy karo.** Railway `npm ci && npm run build` chalayega (jisme
   `db:migrate` bhi included hai, DATABASE_URL use karke), phir
   `npm run start` se server chalu hoga, jo Railway ke diye `PORT` pe khud
   sunega (Nitro node-server default behaviour).

## Verify (maine run nahi kiya — network yahan nahi hai)

```
npm install
npm run typecheck
npm run lint
npm run test
NITRO_PRESET=node-server npm run build
```

`npm run build` ke baad `.output/server/index.mjs` file honi chahiye — agar
naam/path thoda alag nikle (Nitro version-dependent), `package.json` ka
`start` script us actual path se match karke update kar dena.

Phir Railway pe deploy karke:
- Site load ho rahi hai check karo
- Ek staff account bana ke email/password se login-signup-forgot/reset sab
  try karo
- Ek image upload karke dekho (Blob configured ho to real URL, na ho to
  base64 fallback)
- Forms/contact/appointment submit karke DB + email confirm karo
