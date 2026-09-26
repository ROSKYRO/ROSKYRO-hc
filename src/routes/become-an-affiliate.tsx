import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { LeadForm } from "@/components/site/Forms";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/become-an-affiliate")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Become an affiliate — ROSKYRO" },
      { name: "description", content: "Affiliate with ROSKYRO and practise with a smaller panel." },
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
          <h1 className="font-display text-4xl sm:text-5xl">Become an affiliate</h1>
          <p className="mt-4 text-ink-soft">
            For physicians who still like the work and hate the queue. Tell us your city and specialty. We will not send a brochure.
          </p>
        </div>
        <LeadForm
          type="become_affiliate"
          title="Physician enquiry"
          intro="We save this, then open WhatsApp to the practice director."
          extra={[
            { name: "specialty", label: "Specialty", required: true },
            { name: "city", label: "City", required: true },
            { name: "clinic_name", label: "Current clinic / hospital" },
          ]}
        />
      </div>
    </SiteShell>
  );
}
