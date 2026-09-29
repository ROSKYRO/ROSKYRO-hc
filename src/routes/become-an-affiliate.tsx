import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteShell } from "@/components/site/SiteHeader";
import { LeadForm } from "@/components/site/Forms";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/become-an-affiliate")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Become an affiliate physician | ROSKYRO" },
      {
        name: "description",
        content:
          "Join ROSKYRO as a physician. Keep a smaller panel, spend real time with patients and get operations support. Send your details and we will reply.",
      },
    ],
  }),
  component: Page,
});

const WHAT_HAPPENS = [
  {
    title: "You send your details",
    text: "Two minutes. We ask for your registration number so we can talk to a verified physician.",
  },
  {
    title: "Someone from our team calls you",
    text: "A person, not a sales script. We ask about your practice, your city and what you want to change.",
  },
  {
    title: "We talk about fit, honestly",
    text: "If a panel suits you, we explain how it would work. If it does not, we say so.",
  },
];

const KEEP_READY = [
  "Your medical council registration number",
  "Your specialty and city",
  "Where you practise today (clinic or hospital)",
];

function Page() {
  const settings = Route.useLoaderData();

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Partner with ROSKYRO</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            For physicians who still like the work and dislike the queue. Tell us your city and
            specialty. We will not send a brochure.
          </p>
          {/* EDIT: add the line below ONLY if it is true for you.
              <p className="mt-3 font-medium">There is no fee and no obligation to have this first conversation.</p> */}

          <h2 className="mt-10 font-display text-2xl">What happens next</h2>
          <ol className="mt-5 space-y-3">
            {WHAT_HAPPENS.map((s, i) => (
              <li key={s.title} className="flex gap-4 rounded-[20px] border border-line bg-paper p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-medium text-paper">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="mt-10 font-display text-2xl">Keep these ready</h2>
          <ul className="mt-4 space-y-2">
            {KEEP_READY.map((t) => (
              <li key={t} className="flex gap-3 text-sm text-ink-soft">
                <Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
                {t}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm leading-relaxed text-ink-soft">
            Not every practice or city fits a panel, and we do not accept everyone. Before you send
            anything you can read{" "}
            <Link to="/why-concierge-medicine" className="underline underline-offset-4 hover:text-navy">
              why physicians make the change
            </Link>
            , the{" "}
            <Link to="/affiliate-benefits" className="underline underline-offset-4 hover:text-navy">
              benefits and terms
            </Link>
            , how the{" "}
            <Link to="/transition" className="underline underline-offset-4 hover:text-navy">
              transition
            </Link>{" "}
            works and the{" "}
            <Link to="/physician-faq" className="underline underline-offset-4 hover:text-navy">
              physician FAQ
            </Link>
            .
          </p>
          <p className="mt-3 text-xs text-muted">
            Your details are used only to respond to this enquiry. See our{" "}
            <Link to="/privacy" className="underline underline-offset-4">
              privacy policy
            </Link>
            .
          </p>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <LeadForm
            type="become_affiliate"
            title="Physician enquiry"
            intro="We save this, then open WhatsApp to the practice director."
            extra={[
              { name: "nmc_registration", label: "Medical council registration number", required: true },
              { name: "specialty", label: "Specialty", required: true },
              { name: "city", label: "City", required: true },
              { name: "clinic_name", label: "Current clinic / hospital" },
              { name: "heard_from", label: "How did you hear about us?" },
            ]}
            messageLabel="Anything you want us to know (optional)"
            messageRequired={false}
          />
        </div>
      </div>
    </SiteShell>
  );
}
