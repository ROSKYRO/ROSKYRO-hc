/**
 * The upstream identity providers this app offers for sign-in.
 *
 * Two independent paths can serve the same upstream (Google / X):
 *
 * - **broker**: federates through the shared Grok auth broker
 *   (`GROK_AUTH_ISSUER`) — only works when the deployer is Grok Build's own
 *   pipeline (it injects the per-app broker client id/secret). This is the
 *   original, unmodified path (`server.ts`'s `genericOAuth` plugin).
 * - **native**: this app's OWN Google / X OAuth app, configured directly with
 *   Better Auth's built-in `socialProviders` (no broker involved) — works on
 *   ANY host (Railway, a VPS, Docker, …), as long as the deployer sets
 *   `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and/or
 *   `X_CLIENT_ID`/`X_CLIENT_SECRET`. See `RAILWAY_DEPLOY.md`.
 *
 * The server decides, per upstream, which mode (if any) is actually
 * available (native creds win when both are present) and hands that decision
 * to the client via `getSignInProviders()`
 * (`src/lib/server/auth-providers.ts`) — the client never guesses.
 *
 * `idp` / Better Auth's social provider id for X is `twitter` (kept from the
 * upstream's old name for compatibility).
 */
export type GrokProvider = {
  /** This app's local provider id; also the callback path segment. */
  providerId: string;
  /** Upstream hint the broker forwards to (Better Auth social id). */
  idp: string;
  /** Human label for the sign-in button. */
  label: string;
};

export const GROK_PROVIDERS: readonly GrokProvider[] = [
  { providerId: "grok-google", idp: "google", label: "Google" },
  { providerId: "grok-x", idp: "twitter", label: "X" },
];

/** A sign-in button as the client should render and wire it up. */
export type SignInProvider = {
  /** Passed to `signIn()` in `client.ts`. */
  providerId: string;
  label: string;
  /** Which flow `signIn()` should use for this button. */
  mode: "native" | "broker";
};

