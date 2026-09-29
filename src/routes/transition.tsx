import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteHeader";
import { getPublicSettings, getSteps } from "@/lib/server/public";

export const Route = createFileRoute("/transition")({
  loader: async () => {
    const [settings, steps] = await Promise.all([getPublicSettings(), getSteps()]);
    return { settings, steps };
  },
  head: () => ({
    meta: [
      { title: "The transition: moving to a ROSKYRO panel in about 100 days" },
      {
        name: "description",
        content:
          "How a physician moves from volume practice to a membership panel: five stages, a realistic timeline, what stays with you and what we take on.",
      },
    ],
  }),
  component: Page,
});

/* Typical timing per stage, matched to the steps in the admin panel by order.
   EDIT to what you can honestly promise. Extra steps added in admin simply show no badge. */
const TIMING = ["Week 1", "Weeks 2–3", "Weeks 3–8", "Weeks 8–12", "About day 100"];

const STAYS_WITH_YOU = [
  "Your clinic and your name on the door",
  "Every clinical decision",
  "Patients who cannot join the panel are kept in your existing practice or referred honestly",
  "The pace: we slow down rather than skip a hard conversation",
];

const WE_TAKE_ON = [
  "Membership language and patient conversations",
  "Phones, records and the hospital list",
  "Your public profile and Google listing",
  "Reviews, WhatsApp follow-up and reminders",
  "Website and enquiry handling",
  "Billing set-up for membership fees",
];

function Page() {
  const { settings, steps } = Route.useLoaderData();

  return (
    <SiteShell settings={settings}>
      {/* INTRO */}
      <section className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="font-display text-4xl sm:text-5xl">The transition</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Plan for about a hundred days. That is the time it usually takes to move from a full
          waiting room to a panel where you know every member. Faster usually means we skipped the
          list.
        </p>
        <p className="mt-3 text-sm text-muted">
          These are typical timings. Your own timeline depends on your practice, your city and how
          many of your patients want to join.
        </p>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ol className="space-y-5">
          {steps.map((step, i) => (
            <li key={step.id} className="rounded-[24px] border border-line bg-paper p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                  Step {i + 1}
                </p>
                {TIMING[i] ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1 text-xs text-ink-soft">
                    <Clock className="size-3.5" aria-hidden />
                    {TIMING[i]}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 font-display text-2xl">{step.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WHO DOES WHAT */}
      <section className="border-y border-line bg-paper py-14 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          <div className="rounded-[24px] border border-line bg-canvas p-6 sm:p-8">
            <h2 className="font-display text-2xl">What stays with you</h2>
            <ul className="mt-5 space-y-3">
              {STAYS_WITH_YOU.map((t) => (
                <li key={t} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] bg-navy p-6 text-paper sm:p-8">
            <h2 className="font-display text-2xl">What we take on</h2>
            <ul className="mt-5 space-y-3">
              {WE_TAKE_ON.map((t) => (
                <li key={t} className="flex gap-3 text-sm leading-relaxed text-paper/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-paper/70" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AFTER LAUNCH */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="font-display text-3xl">After day one</h2>
        <p className="mt-4 leading-relaxed text-ink-soft">
          The work does not end when the panel opens. We keep looking after the parts that quietly
          decide whether a practice stays healthy: how you show up on Google, the reviews members
          leave, the enquiries that come in and how fast they get an answer.
        </p>
        <p className="mt-3 leading-relaxed text-ink-soft">
          If the panel feels too big or too small, we adjust it with you. If it is not working, we
          say so early. The terms in plain words are on the{" "}
          <Link to="/affiliate-benefits" className="underline underline-offset-4 hover:text-navy">
            affiliate benefits
          </Link>{" "}
          page.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">Start with a conversation</h2>
          <p className="mt-3 max-w-xl text-paper/75">
            Tell us about your practice. We will tell you honestly whether a panel fits, and how
            long it would take.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="inverse">
              <Link to="/become-an-affiliate">
                Partner with us <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-paper/40 text-paper hover:bg-paper/10"
            >
              <Link to="/physician-faq">Read the physician FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
