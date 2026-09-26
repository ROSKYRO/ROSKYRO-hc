import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { PerkCard, SectionHead } from "@/components/site/Cards";
import { getPerksAndCare, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/member-benefits")({
  loader: async () => {
    const [settings, data] = await Promise.all([getPublicSettings(), getPerksAndCare()]);
    return { settings, ...data };
  },
  head: () => ({
    meta: [
      { title: "Member benefits — ROSKYRO" },
      { name: "description", content: "What ROSKYRO membership includes: access, time, and hospital advocacy." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, perks, care } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Member benefits</h1>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((item) => (
            <PerkCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-16">
          <SectionHead kicker="Care" title="360° through the year" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {care.map((item) => (
              <PerkCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
