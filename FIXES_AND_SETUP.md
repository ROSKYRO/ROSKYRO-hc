# Is round me kya fix hua, aur launch se pehle kya karna hai

Is file me sirf wahi likha hai jo **is review me actually badla** — plus wo
cheezein jo main verify nahi kar saka kyunki mere paas is environment me
internet/npm access nahi tha.

## 1) Jo maine fix kiya (code changes)

### a) Forgot password ab real email bhejta hai
- `src/lib/auth/server.ts` me `emailAndPassword.sendResetPassword` add kiya —
  ye wahi raw-SMTP sender (`src/lib/smtp.ts`) reuse karta hai jo contact-form
  notifications me pehle se use ho raha hai.
- `src/routes/login.tsx` ka "Forgot password" ab `authClient.forgetPassword()`
  ko actually call karta hai (pehle sirf ek static message dikhata tha, kuch
  bhejta nahi tha).
- **Kaam karne ke liye zaroori:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
  `SMTP_PASS` env vars set hone chahiye (production deploy me). Agar ye set
  nahi hain, form abhi bhi generic "check your inbox" dikhayega (taaki koi
  attacker email exists/nahi guess na kar sake), par email jayega nahi — sirf
  server logs me ek warning aayega. Agar aapke paas SMTP nahi hai, staff
  Google/X se login kare ya super admin unhe Users page se reset kare.
- `server.ts` "frozen" hai sirf baseURL/OAuth-broker wiring ke liye — ye
  addition us wiring ko touch nahi karta, sirf ek naya optional callback hai.

### b) Images ab real file storage me ja sakti hain (Vercel Blob)
- Naya file: `src/lib/server/uploads.ts` — agar `BLOB_READ_WRITE_TOKEN` env
  var set hai, images **Vercel Blob** me upload hoti hain (real file storage,
  5MB tak), aur DB me sirf uska URL store hota hai.
- `src/components/admin/ImageField.tsx` update kiya: pehle Blob upload try
  karta hai; agar Blob configure nahi hai (token missing) ya upload fail ho
  jaye, **automatically** purane base64-in-DB tarike pe fallback karta hai
  (900KB cap, jaisa pehle tha) — kuch bhi break nahi hota.
- `package.json` me `@vercel/blob` dependency add ki (version `"latest"` —
  maine isse install/pin nahi kiya kyunki mere paas npm/network nahi tha;
  `npm install` ke baad `package-lock.json` me jo version lock hua use hi
  rakhna, aur chaho to `package.json` me exact version pin kar dena).
- **Kaam karne ke liye zaroori:** Vercel project me *Storage → Blob → Create/
  Connect* karo — `BLOB_READ_WRITE_TOKEN` automatically inject ho jayega. Kuch
  aur code change nahi chahiye.

## 2) BETTER_AUTH_URL — ye bug nahi hai, ek deployment setting hai

`src/lib/auth/server.ts` already sahi se likha hai: agar `BETTER_AUTH_URL` set
hai to use as-is use karta hai, warna preview/local ke liye dynamic
fallback karta hai. **Isme koi code bug nahi mila.**

Par ek badi cheez jo aapko pata honi chahiye pehle real customers ko dena:

> Google/X ("Continue with Google/X") login **Grok Build ke apne shared auth
> broker** (`GROK_AUTH_ISSUER`) ke through kaam karta hai, jiske credentials
> (`GROK_AUTH_CLIENT_ID` / `GROK_AUTH_CLIENT_SECRET`) normally **Grok Build ka
> deploy pipeline hi inject karta hai**. Agar ye site Grok Build ke "Deploy"
> button se publish ho rahi hai, sab kuch (BETTER_AUTH_URL, GROK_AUTH_*,
> DATABASE_URL) automatically set ho jayega — kuch karna nahi padega.
>
> Par agar aap ise **khud manually Vercel pe push kar rahe ho** (`vercel.json`
> hai isliye ye possible hai) **bina Grok Build ke deploy pipeline ke**, to
> Google/X buttons kaam nahi karenge jab tak aapke paas khud
> `GROK_AUTH_CLIENT_ID`/`SECRET` na ho (jo xAI/Grok ka proprietary broker
> credential hai, aam taur par sirf Grok Build hi deta hai). Us case me
> email/password login (jo ab forgot-password ke saath bhi complete hai) hi
> aapka reliable staff login path hoga — ya aapko Grok Build se hi deploy
> karna hoga.

## 3) Maine kya verify NAHI kiya (honest limitation)

Mere is review-environment me **network access disabled** hai — isliye main
yahan `npm install`, `npm run typecheck`, `npm run lint`, `npm run test`, ya
`npm run dev` chala hi nahi saka. Maine sirf code padhkar, cross-referencing
karke fixes likhe hain — inko run karke dekha nahi.

**Deploy/preview se pehle zaroor karo (jaisa pehle bhi bataya gaya tha):**

```
npm install
npm run typecheck
npm run lint
npm run test
npm run dev
```

Phir manually check karo:
- 5 forms submit karke Postgres + WhatsApp + email confirm karo
- Doctor add karke geocode test karo
- Blog publish karke SEO tags dekho
- **Naya:** Ek admin image upload karo (Blob configured ho to real URL aana
  chahiye; na ho to base64 fallback se chalna chahiye)
- **Naya:** "Forgot password" try karo (SMTP configured environment me) —
  email aana chahiye, link se naya password set ho jana chahiye

Agar `npm run typecheck` ya `npm run lint` in naye files pe koi error de
(khaaskar `uploads.ts` ke `sendResetPassword` callback ke type ke around),
wo sabse pehle dekhna — maine types ko better-auth ke apne inferred types pe
chhoda hai taaki mismatch na ho, par bina compiler chalaye 100% guarantee
nahi de sakta.
