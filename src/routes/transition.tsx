import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { getPublicSettings, getSteps } from "@/lib/server/public";

export const Route = createFileRoute("/transition")({
  loader: async () => {
    const [settings, steps] = await Promise.all([getPublicSettings(), getSteps()]);
    return { settings, steps };
  },
  head: () => ({
    meta: [
      { title: "Transition — ROSKYRO" },
      { name: "description", content: "How a physician moves from volume practice into a ROSKYRO panel." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, steps } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">The transition</h1>
        <p className="mt-3 text-ink-soft">
          Plan for a hundred days. Faster usually means we skipped the list.
        </p>
        <ol className="mt-10 space-y-6">
          {steps.map((step, i) => (
            <li key={step.id} className="rounded-[24px] border border-line bg-paper p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                Step {i + 1}
              </p>
              <h2 className="mt-2 font-display text-2xl">{step.title}</h2>
              <p className="mt-2 text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
        <Button asChild className="mt-10">
          <Link to="/become-an-affiliate">Start a conversation</Link>
        </Button>
      </div>
    </SiteShell>
  );
}
