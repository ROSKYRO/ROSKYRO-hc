import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type Search = { token?: string };

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    token: typeof s.token === "string" ? s.token : undefined,
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    if (!token) {
      setError("This reset link is missing a token. Request a new one from sign-in.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await authClient.resetPassword({ newPassword: password, token });
      if (res.error) throw new Error(res.error.message);
      await navigate({ to: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset the password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-line bg-paper p-8 shadow-soft">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="ROSKYRO" className="size-12 object-contain" />
          <p className="font-display text-xl">ROSKYRO</p>
        </Link>
        <h1 className="mt-8 font-display text-3xl">Set a new password</h1>
        <p className="mt-2 text-sm text-ink-soft">Choose a password of at least eight characters.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          {error ? (
            <p role="status" aria-live="polite" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Saving…" : "Update password"}
          </Button>
        </form>
        <Link to="/login" className="mt-4 inline-block text-sm text-navy underline-offset-4 hover:underline">
          Back to sign-in
        </Link>
      </div>
    </main>
  );
}
