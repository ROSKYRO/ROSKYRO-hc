import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Stethoscope, Phone } from "lucide-react";
import { SiteShell } from "@/components/site/SiteHeader";
import { DoctorCard } from "@/components/site/Cards";
import { AppointmentForm } from "@/components/site/Forms";
import { getDoctors, getPublicSettings } from "@/lib/server/public";
import { citySlug } from "@/lib/city";

/* OPTIONAL: a short, genuinely local paragraph per city (what neighbourhoods you cover,
   languages spoken, anything true and useful). Key = city slug. This is what stops the
   city pages from looking identical to Google. Example:
   "ambikapur": "ROSKYRO physicians in Ambikapur see members at ... " */
const CITY_NOTES: Record<string, string> = {};

type QA = { q: string; a: string };

function faqFor(city: string): QA[] {
  return [
    {
      q: `How do I see a concierge doctor in ${city}?`,
      a: `Pick a physician on this page or send a request below. We save your request, then open WhatsApp with the note already written. Your physician or their coordinator will contact you.`,
    },
    {
      q: "Is membership the same as health insurance?",
      a: "No. Membership pays for your physician's time and access. Hospital bills, scans and tests continue through your own insurance in the usual way.",
    },
    {
      q: "What should I do in an emergency?",
      a: "Call 112 or go to the nearest hospital straight away. Tell your physician afterwards.",
    },
  ];
}

export const Route = createFileRoute("/doctors-in/$city")({
  loader: async ({ params }) => {
    const [settings, all] = await Promise.all([getPublicSettings(), getDoctors({ data: {} })]);
    const doctors = all.filter((d) => citySlug(d.city) === params.city);
    if (doctors.length === 0) throw notFound();
    const cities = [...new Set(all.map((d) => d.city))].sort();
    return { settings, doctors, city: doctors[0].city, cities, slug: params.city };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { city, doctors } = loaderData;
    const specs = [...new Set(doctors.map((d) => d.specialty))];
    const description = `${doctors.length} ROSKYRO ${
      doctors.length === 1 ? "physician" : "physicians"
    } in ${city}: ${specs.join(", ")}. Request a visit with a concierge doctor.`;
    return {
      meta: [
        { title: `Concierge doctors in ${city} | ROSKYRO` },
        { name: "description", content: description.slice(0, 158) },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              ...doctors.map((d) => ({
                "@type": "Physician",
                name: d.name,
                description: d.specialty,
                telephone: d.phone || undefined,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: d.city,
                  addressCountry: "IN",
                },
              })),
              {
                "@type": "FAQPage",
                mainEntity: faqFor(city).map((x) => ({
                  "@type": "Question",
                  name: x.q,
                  acceptedAnswer: { "@type": "Answer", text: x.a },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { settings, doctors, city, cities, slug } = Route.useLoaderData();
  const specs = [...new Set(doctors.map((d) => d.specialty))];
  const others = cities.filter((c) => citySlug(c) !== slug);
  const note = CITY_NOTES[slug];

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link to="/find-a-doctor" className="underline underline-offset-4 hover:text-navy">
            Find a doctor
          </Link>{" "}
          / {city}
        </nav>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Concierge doctors in {city}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          {doctors.length} {doctors.length === 1 ? "physician" : "physicians"} in {city}:{" "}
          {specs.join(", ")}. Each looks after a small panel, so there is time to listen and a way
          to reach them between visits.
        </p>
        {note ? <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{note}</p> : null}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>

        <section className="mt-16">
          <h2 className="font-display text-3xl">How it works in {city}</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { icon: Stethoscope, t: "Choose a physician", d: "Read their profile and pick the one who fits." },
              { icon: MessageCircle, t: "Send a request", d: "We save it, then open WhatsApp with your note filled in." },
              { icon: Phone, t: "They call you", d: "A first conversation before you decide anything." },
            ].map((s, i) => (
              <li key={s.t} className="rounded-[24px] border border-line bg-paper p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                  Step {i + 1}
                </p>
                <s.icon className="mt-4 size-5 text-navy" aria-hidden />
                <h3 className="mt-3 font-display text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="font-display text-3xl">Questions about care in {city}</h2>
          <div className="mt-6 space-y-3">
            {faqFor(city).map((x) => (
              <details key={x.q} className="group rounded-[20px] border border-line bg-paper px-5 py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {x.q}
                  <span aria-hidden className="text-xl text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{x.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <Link to="/member-faq" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-navy">
              More in the member FAQ <ArrowRight className="size-4" />
            </Link>
          </p>
        </section>

        {others.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-2xl">Other cities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {others.map((c) => (
                <Link
                  key={c}
                  to="/doctors-in/$city"
                  params={{ city: citySlug(c) }}
                  className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm hover:bg-canvas"
                >
                  {c}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-16 max-w-xl">
          <AppointmentForm />
        </div>
      </div>
    </SiteShell>
  );
}
