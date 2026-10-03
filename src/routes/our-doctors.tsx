import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { DoctorCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { citySlug } from "@/lib/city";
import { getDoctors, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/our-doctors")({
  loader: async () => {
    const [settings, doctors] = await Promise.all([getPublicSettings(), getDoctors({ data: {} })]);
    return { settings, doctors };
  },
  head: () => ({
    meta: [
      { title: "Our doctors | ROSKYRO" },
      {
        name: "description",
        content:
          "Meet the ROSKYRO physician panel: small panels, physicians who know every member, across Indian cities. Find the right doctor for you.",
      },
    ],
  }),
  component: Page,
});

/* EDIT: keep the panel-size line only if it matches how your physicians actually work. */
const POINTS = [
  {
    title: "A small panel",
    text: "A physician here often looks after 50–150 families, depending on specialty. That is what leaves room to know every member by name.",
  },
  {
    title: "Not driven by volume",
    text: "Visits are not squeezed between a queue and a target. Your physician decides how long a conversation needs.",
  },
  {
    title: "Chosen, not just listed",
    text: "We talk to every physician before they join, and we do not take everyone.",
  },
];

function Page() {
  const { settings, doctors } = Route.useLoaderData();
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");

  const cities = [...new Set(doctors.map((d) => d.city))].sort();
  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();
  const shown = doctors.filter(
    (d) => (!city || d.city === city) && (!specialty || d.specialty === specialty),
  );

  const chip = (active: boolean) =>
    `inline-flex h-11 items-center rounded-full border px-4 text-sm ${
      active ? "border-navy bg-navy text-paper" : "border-line bg-paper hover:bg-canvas"
    }`;

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Our doctors</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          A closed panel on purpose. If the city you need is full, we will say so.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} className="rounded-[24px] border border-line bg-paper p-6">
              <h2 className="font-display text-xl">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm">
          <Link
            to="/blog/$slug"
            params={{ slug: "how-a-panel-is-chosen" }}
            className="underline underline-offset-4 hover:text-navy"
          >
            Read how a panel is chosen
          </Link>
        </p>

        <section className="mt-14" aria-label="Filter physicians">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCity("")} className={chip(city === "")}>
              All cities
            </button>
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={chip(city === c)}
                aria-pressed={city === c}
              >
                {c}
              </button>
            ))}
          </div>
          {specialties.length > 1 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSpecialty("")}
                className={chip(specialty === "")}
              >
                All specialties
              </button>
              {specialties.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecialty(s)}
                  className={chip(specialty === s)}
                  aria-pressed={specialty === s}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
          {shown.length === 0 ? (
            <p className="mt-8 text-muted">No physicians match that combination.</p>
          ) : null}
          {city ? (
            <p className="mt-6 text-sm">
              <Link
                to="/doctors-in/$city"
                params={{ city: citySlug(city) }}
                className="underline underline-offset-4 hover:text-navy"
              >
                See everything about care in {city}
              </Link>
            </p>
          ) : null}
        </section>

        <section className="mt-16 rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">Not sure who fits?</h2>
          <p className="mt-3 max-w-xl text-paper/75">
            Search by location, or tell us what you need and we will point you to a physician.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="inverse">
              <Link to="/find-a-doctor">Find a doctor near me</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-paper/40 text-paper hover:bg-paper/10"
            >
              <Link to="/become-an-affiliate">Are you a physician?</Link>
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
