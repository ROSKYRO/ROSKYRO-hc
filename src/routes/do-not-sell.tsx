import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { LeadForm } from "@/components/site/Forms";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/do-not-sell")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Data and consent request | ROSKYRO" },
      {
        name: "description",
        content:
          "Ask ROSKYRO to show, correct or erase your personal data, to withdraw consent, or to stop sharing your information.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const settings = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl">Data and consent request</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          We do not sell personal data. If you want to see, correct or erase what we hold, withdraw
          your consent or ask us to stop sharing your information, tell us here. We log every
          request so that we can answer it in writing.
        </p>
        <p className="mt-3 text-sm text-muted">
          Read the{" "}
          <Link to="/privacy" className="underline underline-offset-4 hover:text-navy">
            privacy policy
          </Link>{" "}
          for how your information is handled and for the limits that apply to medical records.
        </p>
        <div className="mt-8">
          <LeadForm
            type="do_not_sell"
            title="Your request"
            intro="Saved, then sent to our team. We will reply in writing."
            extra={[
              {
                name: "request_type",
                label: "What would you like us to do?",
                required: true,
                options: [
                  "Show me what data you hold about me",
                  "Correct my data",
                  "Erase my data",
                  "Withdraw my consent",
                  "Stop sharing my information",
                ],
              },
            ]}
            messageLabel="Details"
            messageRequired
          />
        </div>
      </div>
    </SiteShell>
  );
}
