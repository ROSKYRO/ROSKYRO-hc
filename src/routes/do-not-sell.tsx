import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { LeadForm } from "@/components/site/Forms";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/do-not-sell")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Do not sell request — ROSKYRO" },
      { name: "description", content: "Ask ROSKYRO not to sell or share your personal information." },
    ],
  }),
  component: Page,
});

function Page() {
  const settings = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="mb-6 font-display text-4xl">Do not sell request</h1>
        <LeadForm
          type="do_not_sell"
          title="Do not sell my information"
          intro="We do not sell personal data. This request is logged so we can confirm it in writing."
        />
      </div>
    </SiteShell>
  );
}
