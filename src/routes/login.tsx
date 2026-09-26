import { createFileRoute, Link, useNavigate, getRouteApi } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { authClient, authEnabled, signIn, useSignInProviders } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

const rootRoute = getRouteApi("__root__");

function Login() {
  const { settings } = rootRoute.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const { providers } = useSignInProviders();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: "/admin" });
    }
  }, [user, isPending, navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "Staff");
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "forgot") {
        const res = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
        if (res.error) throw new Error(res.error.message);
        setInfo(
          "If that email has a staff account, a reset link is on its way — check your inbox (and spam). " +
            "No email after a few minutes? Sign in with Google / X instead, or ask a super admin to reset your access.",
        );
        return;
      }
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name });
        if (res.error) throw new Error(res.error.message);
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message);
      }
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  const heading =
    mode === "in" ? "Staff sign-in" : mode === "up" ? "Create your staff account" : "Reset password";

  if (isPending || user) {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas px-4">
        <p className="text-sm text-muted">Checking your session…</p>
      </main>
    );
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-line bg-paper p-8 shadow-soft">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="ROSKYRO" className="size-12 object-contain" />
          <div>
            <p className="font-display text-xl">{settings.brand}</p>
            <p className="text-sm text-muted">Practice desk</p>
          </div>
        </Link>
        <h1 className="mt-8 font-display text-3xl">{heading}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {mode === "up"
            ? "Use the email a super admin invited. The first account on an empty desk becomes the founding administrator."
            : mode === "forgot"
              ? "Enter the email on your staff invite."
              : "Google, X, or the email you were invited with."}
        </p>

        {authEnabled && mode !== "forgot" && providers.length > 0 ? (
          <div className="mt-6 space-y-2">
            {providers.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/admin", mode: p.mode })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        ) : null}

        {mode !== "forgot" ? (
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
            <span className="h-px flex-1 bg-line" />
            or email
            <span className="h-px flex-1 bg-line" />
          </div>
        ) : (
          <div className="mt-6" />
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "up" ? (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required autoComplete="name" />
            </div>
          ) : null}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          {mode !== "forgot" ? (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
              />
            </div>
          ) : null}
          {error ? (
            <p role="status" aria-live="polite" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          {info ? (
            <p role="status" aria-live="polite" className="text-sm text-forest">
              {info}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy
              ? "Please wait…"
              : mode === "in"
                ? "Sign in"
                : mode === "up"
                  ? "Create account"
                  : "Send reset link"}
          </Button>
        </form>
        <div className="mt-4 flex flex-col gap-2 text-sm">
          {mode === "in" ? (
            <>
              <button
                type="button"
                className="min-h-11 text-left text-navy underline-offset-4 hover:underline"
                onClick={() => setMode("forgot")}
              >
                Forgot password
              </button>
              <button
                type="button"
                className="min-h-11 text-left text-navy underline-offset-4 hover:underline"
                onClick={() => setMode("up")}
              >
                Invited? Create your account
              </button>
            </>
          ) : (
            <button
              type="button"
              className="min-h-11 text-left text-navy underline-offset-4 hover:underline"
              onClick={() => setMode("in")}
            >
              Back to sign-in
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
