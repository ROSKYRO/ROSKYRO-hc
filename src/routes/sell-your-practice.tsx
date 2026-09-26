import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { LeadForm } from "@/components/site/Forms";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/sell-your-practice")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Sell your concierge practice — ROSKYRO" },
      { name: "description", content: "A confidential conversation about selling or handing over a concierge panel." },
    ],
  }),
  component: Page,
});

function Page() {
  const settings = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Sell your practice</h1>
          <p className="mt-4 text-ink-soft">
            Retirement, a move, a panel that needs a successor. Confidential. No marketplace listing.
          </p>
        </div>
        <LeadForm
          type="sell_practice"
          title="Confidential enquiry"
          intro="Saved privately. WhatsApp opens to the director with your note."
          extra={[
            { name: "city", label: "City", required: true },
            { name: "years", label: "Years in practice" },
            { name: "panel_size", label: "Approximate panel size" },
          ]}
        />
      </div>
    </SiteShell>
  );
}
