import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { PerkCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { getPlans, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/member-programs")({
  loader: async () => {
    const [settings, plans] = await Promise.all([getPublicSettings(), getPlans()]);
    return { settings, plans };
  },
  head: () => ({
    meta: [
      { title: "Member programs — ROSKYRO" },
      { name: "description", content: "Individual, couple, and household membership at ROSKYRO." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, plans } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Member programs</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Fees are quoted after a conversation with the physician. The structure is the same; the number depends on the panel.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map((item) => (
            <PerkCard key={item.id} item={item} />
          ))}
        </div>
        <Button asChild className="mt-10">
          <Link to="/contact">Ask about membership</Link>
        </Button>
      </div>
    </SiteShell>
  );
}
