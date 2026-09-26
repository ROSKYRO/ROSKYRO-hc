import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { LeadForm } from "@/components/site/Forms";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/contact")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Contact us — ROSKYRO" },
      { name: "description", content: "Write to ROSKYRO. We save the note, then open WhatsApp to the clinic." },
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
          <h1 className="font-display text-4xl sm:text-5xl">Contact us</h1>
          <p className="mt-4 text-ink-soft">
            Not for emergencies. For membership, a physician, or a question that can wait until the next working hour.
          </p>
          <p className="mt-6 text-sm leading-relaxed">
            {settings.address}
            <br />
            {settings.phone}
            <br />
            {settings.email}
          </p>
        </div>
        <LeadForm
          type="contact"
          title="Write to the clinic"
          intro="Saved to the inbox, then WhatsApp opens with the note filled in."
          extra={[{ name: "topic", label: "Topic" }]}
        />
      </div>
    </SiteShell>
  );
}
