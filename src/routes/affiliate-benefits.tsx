import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Scale, Sprout, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHead, TestimonialCard } from "@/components/site/Cards";
import { SiteShell } from "@/components/site/SiteHeader";
import { getPublicSettings, getTestimonialsPage } from "@/lib/server/public";

export const Route = createFileRoute("/affiliate-benefits")({
  loader: async () => {
    const [settings, data] = await Promise.all([
      getPublicSettings(),
      getTestimonialsPage({ data: { audience: "physician", page: 1 } }),
    ]);
    return { settings, stories: data.items.slice(0, 3) };
  },
  head: () => ({
    meta: [
      { title: "Affiliate benefits for physicians | ROSKYRO" },
      {
        name: "description",
        content:
          "What ROSKYRO runs for affiliating physicians, what stays with you, and what we ask in return: a smaller panel with the operations handled.",
      },
    ],
  }),
  component: Page,
});

/* EDIT: keep only what ROSKYRO really commits to. */
const HEADLINE_BENEFITS = [
  {
    icon: Stethoscope,
    title: "Clinical independence",
    text: "You decide how to treat. Your patients remain your patients.",
  },
  {
    icon: Scale,
    title: "A better balance",
    text: "A smaller panel and on-call patterns planned around your life.",
  },
  {
    icon: Compass,
    title: "Time for the medicine",
    text: "Visits that last as long as the problem needs.",
  },
  {
    icon: Sprout,
    title: "A practice that can last",
    text: "A membership base that supports the practice without depending on volume.",
  },
];

const WE_RUN = [
  "Membership billing and patient communication",
  "A public profile and appointment intake",
  "Phones and coordination, so calls reach the right person",
  "On-call patterns that hold up after the first few months",
  "Hospital relationships already in motion",
  "Records set-up and the membership conversation with patients",
];

const YOU_KEEP = [
  "Every clinical decision",
  "Your admitting rights and hospital attachment",
  "The relationship with each patient on your panel",
  "The choice of who joins, and when the panel is full",
];

const WE_ASK = [
  "A panel small enough for you to know each member",
  "Honest handling of the patients you cannot take, who stay in your practice or are referred",
  "Reasonable response times, agreed with you and kept",
];

function Page() {
  const { settings, stories } = Route.useLoaderData();

  return (
    <SiteShell settings={settings}>
      {/* INTRO */}
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="font-display text-4xl sm:text-5xl">Affiliate benefits</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          You keep the practice. We take on the paperwork and the phones. That is the whole
          arrangement: you practise medicine, and {settings.brand} keeps the spreadsheet.
        </p>
      </section>

      {/* HEADLINE BENEFITS */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {HEADLINE_BENEFITS.map((b) => (
            <div key={b.title} className="bg-paper p-6">
              <b.icon className="size-6 text-navy" aria-hidden />
              <h2 className="mt-4 font-display text-lg">{b.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO DOES WHAT */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHead
          title="Who does what"
          lede="A clear line between what we run and what stays with you."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="rounded-[24px] border border-navy bg-navy p-6 text-paper">
            <h3 className="font-display text-xl">We run</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-paper/85">
              {WE_RUN.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] border border-line bg-paper p-6">
            <h3 className="font-display text-xl">You keep</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink-soft">
              {YOU_KEEP.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] border border-line bg-paper p-6">
            <h3 className="font-display text-xl">We ask of you</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink-soft">
              {WE_ASK.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* KEEPING YOUR PATIENTS */}
      <section className="bg-navy py-14 text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <h2 className="font-display text-3xl sm:text-4xl">
            Patients outside the panel are not left behind
          </h2>
          <p className="leading-relaxed text-paper/80">
            You do not have to choose between your membership panel and everyone else. Patients
            we cannot take into the panel remain in your existing practice, or are referred
            honestly to a colleague. A closed panel is part of how this stays ethical.
          </p>
        </div>
      </section>

      {/* TERMS */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">Terms, in plain words</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
            We do not publish a buy-in or fee split, because a number that fits every city and
            specialty would be misleading. We discuss it with you individually, and put it in
            writing before anything starts.
          </p>
        </div>
        {/* EDIT: add or remove commitments so they match your real contract. */}
        <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
          {[
            "Terms are agreed with you in writing, per physician.",
            "You are free to review the panel size with us at any time.",
            "Exit terms are explained before you sign, not after.",
          ].map((t) => (
            <li key={t} className="rounded-[20px] border border-line bg-paper p-4">
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* PHYSICIAN STORIES */}
      {stories.length > 0 ? (
        <section className="border-y border-line bg-paper py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead title="From physicians who made the change" />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {stories.map((t) => (
                <TestimonialCard key={t.id} item={t} />
              ))}
            </div>
            <Button asChild variant="outline" className="mt-8">
              <Link to="/success-stories">More physician stories</Link>
            </Button>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">See if a panel fits your practice</h2>
          <p className="mt-3 max-w-xl text-paper/75">
            Tell us your city and specialty. There is no obligation, and we will say plainly if it
            is not a fit.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="inverse">
              <Link to="/become-an-affiliate">Partner with us</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-paper/40 text-paper hover:bg-paper/10"
            >
              <Link to="/transition">How the transition works</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
