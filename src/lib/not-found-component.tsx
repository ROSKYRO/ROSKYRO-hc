import { Link } from "@tanstack/react-router";

export function AppNotFoundComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-ink">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="font-display text-3xl sm:text-4xl">We couldn't find that page.</h1>
      <p className="max-w-md text-sm text-ink-soft">
        The page you're looking for may have moved or no longer exists.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}
