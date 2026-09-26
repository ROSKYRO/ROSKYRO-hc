import { createServerFn } from "@tanstack/react-start";
import type { SignInProvider } from "@/lib/auth/providers";

/**
 * Which sign-in buttons to show, and whether each goes through the native
 * Google/X app or the Grok broker — computed here (server-side, real
 * `process.env`) so the client never has to guess or duplicate config via
 * `VITE_` vars. See `src/lib/auth/providers.ts` for what "native" vs
 * "broker" means.
 */
export const getSignInProviders = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ providers: SignInProvider[] }> => {
    const { authConfigured, nativeGoogleConfigured, nativeTwitterConfigured } = await import(
      "@/lib/auth/server"
    );

    const providers: SignInProvider[] = [];
    if (nativeGoogleConfigured) {
      providers.push({ providerId: "google", label: "Google", mode: "native" });
    } else if (authConfigured) {
      providers.push({ providerId: "grok-google", label: "Google", mode: "broker" });
    }
    if (nativeTwitterConfigured) {
      providers.push({ providerId: "twitter", label: "X", mode: "native" });
    } else if (authConfigured) {
      providers.push({ providerId: "grok-x", label: "X", mode: "broker" });
    }
    return { providers };
  },
);
