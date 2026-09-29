import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteHeader";
import { DoctorCard, PerkCard, SectionHead, TestimonialCard } from "@/components/site/Cards";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { getHomeData } from "@/lib/server/public";

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.settings.brand ?? "ROSKYRO"} — ${loaderData?.settings.tagline ?? ""}`,
      },
      { name: "description", content: loaderData?.settings.meta_description ?? "" },
    ],
  }),
  component: Home,
});

/* Four promises directly under the hero (same idea as signaturemd's icon strip).
   EDIT the wording so it matches what your doctors really commit to. */
const PROMISES = [
  {
    icon: MessageCircle,
    title: "A doctor you can message",
    text: "WhatsApp or call your own physician. Replies within the hours your doctor commits to.",
  },
  {
    icon: CalendarCheck,
    title: "Same-day or next-day visits",
    text: "Book when you are unwell, not three weeks later.",
  },
  {
    icon: Clock,
    title: "Visits that are not rushed",
    text: "A long first consultation and time to ask every question.",
  },
  {
    icon: HeartHandshake,
    title: "One doctor who knows you",
    text: "Your history, your medicines and your family, in one place.",
  },
];

/* Plain, non-numeric comparison. Do not add percentages or minutes unless you can prove them. */
const COMPARE: [string, string, string][] = [
  ["Getting an appointment", "Wait for a slot, often days away", "Same-day or next-day for members"],
  ["In the consultation", "A few minutes, then the next patient", "Time to talk, examine and explain"],
  ["Who you see", "Whoever is on duty today", "Your own physician, every time"],
  ["After the visit", "Call the clinic and hope", "Message your doctor directly"],
  ["Your records", "Scattered across clinics and labs", "One running chart, kept by your doctor"],
  ["If you are admitted", "You coordinate alone", "Your doctor stays involved"],
];

function Home() {
  const { settings, perks, care, testimonials, doctors } = Route.useLoaderData();
  const stats = [
    [settings.stat_1_value, settings.stat_1_label],
    [settings.stat_2_value, settings.stat_2_label],
    [settings.stat_3_value, settings.stat_3_label],
  ];
  const cities = [...new Set(doctors.map((d) => d.city))];

  return (
    <SiteShell settings={settings}>
      {/* HERO */}
      <section className="relative min-h-[82svh] overflow-hidden">
        <img
          src={settings.hero_image_url || "/images/hero.jpg"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/25" />
        <div className="relative mx-auto flex min-h-[82svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 sm:pb-16">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-paper/70">
            {settings.tagline}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-paper">{settings.hero_h1}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/85 sm:text-lg">
            {settings.hero_sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="inverse" size="lg">
              <Link to="/find-a-doctor">Find a concierge doctor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-paper/40 text-paper hover:bg-paper/10"
            >
              <Link to="/member-benefits">See member benefits</Link>
            </Button>
            <Link
              to="/become-an-affiliate"
              className="inline-flex h-12 items-center px-2 text-sm text-paper/80 underline underline-offset-4 hover:text-paper"
            >
              Are you a doctor? Partner with us
            </Link>
          </div>
        </div>
      </section>

      {/* FOUR PROMISES */}
      <section className="bg-navy">
        <div className="mx-auto grid max-w-6xl gap-px bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p) => (
            <div key={p.title} className="bg-navy px-5 py-7 sm:px-6">
              <p.icon className="size-6 text-paper/90" aria-hidden />
              <h2 className="mt-4 font-display text-lg text-paper">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-paper/70">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY: the idea in one screen */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">
            A doctor who cares as much about your health as you do
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
            Most clinics are built for volume. Here a physician looks after a small group of
            families, so there is time to listen, to explain, and to notice what changes over the
            years. Membership pays for that time and for a doctor who is reachable when something
            worries you.
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
            Your insurance or hospital bills work as they do today. The membership fee covers the
            access and attention that a normal OPD visit cannot.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/about-concierge-care">How concierge care works</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/member-programs">Member programs</Link>
            </Button>
          </div>
        </div>
        <img
          src="/images/care.jpg"
          alt="A physician speaking with a patient"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[28px] object-cover"
        />
      </section>

      {/* COMPARISON */}
      <section className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHead
            kicker="The difference"
            title="A usual OPD visit, and a visit here"
            lede="Same medicine, same training. What changes is the time and the access around it."
          />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr>
                  <th scope="col" className="w-1/4 pb-3 pr-4 font-medium text-muted">
                    &nbsp;
                  </th>
                  <th scope="col" className="w-[37%] pb-3 pr-4 font-medium text-muted">
                    Usual OPD
                  </th>
                  <th scope="col" className="w-[38%] rounded-t-[16px] bg-navy px-5 pb-3 pt-4 font-medium text-paper">
                    {settings.brand}
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([label, usual, ours], i) => (
                  <tr key={label}>
                    <th scope="row" className="border-t border-line py-4 pr-4 font-medium align-top">
                      {label}
                    </th>
                    <td className="border-t border-line py-4 pr-4 align-top text-ink-soft">
                      <span className="flex gap-2">
                        <Minus className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
                        {usual}
                      </span>
                    </td>
                    <td
                      className={`bg-navy px-5 py-4 align-top text-paper ${
                        i === COMPARE.length - 1 ? "rounded-b-[16px]" : ""
                      }`}
                    >
                      <span className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-paper/80" aria-hidden />
                        {ours}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TRUST NUMBERS (from admin settings) */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
        {stats.map(([value, label]) => (
          <div key={label}>
            <p className="font-display text-4xl tabular-nums text-navy">{value}</p>
            <p className="mt-1 text-sm text-ink-soft">{label}</p>
          </div>
        ))}
      </section>

      {/* HOW IT STARTS */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <SectionHead
          kicker="Getting started"
          title="Three steps. Then a physician, not a ticket."
          lede="Every public form is stored first. WhatsApp opens with the note already written. The clinic sees it either way."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Stethoscope,
              title: "Name the physician",
              text: "Search by city or specialty, or write in without one. We keep a small panel on purpose.",
            },
            {
              icon: MessageCircle,
              title: "We save, then open WhatsApp",
              text: "The request lands in the staff inbox immediately. A pre-filled message opens so you can tap Send.",
            },
            {
              icon: Phone,
              title: "The doctor calls you",
              text: "Not a call centre. The physician, or the coordinator who already has the chart.",
            },
          ].map((step, i) => (
            <li key={step.title} className="rounded-[24px] border border-line bg-paper p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
                Step {i + 1}
              </p>
              <step.icon className="mt-4 size-5 text-navy" aria-hidden />
              <h3 className="mt-3 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-muted">
          This service is not for emergencies. In an emergency call 112 or go to the nearest
          hospital.
        </p>
      </section>

      {/* MEMBERSHIP */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <SectionHead
          kicker="Membership"
          title="What the retainer actually buys"
          lede="Not a shorter queue at the same factory. A smaller practice, built around a handful of families."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((item) => (
            <PerkCard key={item.id} item={item} />
          ))}
        </div>
        <Button asChild variant="outline" className="mt-8">
          <Link to="/member-benefits">
            All member benefits <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      {settings.hero_video_url ? (
        <section className="bg-navy-deep py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="font-display text-3xl text-paper sm:text-4xl">See how a visit feels</h2>
            <div className="mt-8">
              <VideoEmbed url={settings.hero_video_url} title={`${settings.brand} clinic`} />
            </div>
          </div>
        </section>
      ) : null}

      {/* FIND A DOCTOR */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            kicker="Find a doctor"
            title="A small panel, named"
            lede={`${doctors.length} physicians in ${cities.length} ${cities.length === 1 ? "city" : "cities"}: ${cities.join(", ")}.`}
          />
          <Button asChild variant="outline">
            <Link to="/find-a-doctor">
              <MapPin className="size-4" /> Search near me
            </Link>
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link
              key={city}
              to="/find-a-doctor"
              className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm hover:bg-canvas"
            >
              {city}
            </Link>
          ))}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead kicker="Members" title="Don’t take our word for it. Take theirs." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} item={t} />
            ))}
          </div>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/testimonials">Read more stories</Link>
          </Button>
        </div>
      </section>

      {/* CARE + DUAL CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead
          kicker="360° care"
          title="The year, not the episode"
          lede="Annual plans, acute visits, medicines that do not fight each other, and a doctor in the hospital when you are."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {care.map((item) => (
            <PerkCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
            <h2 className="font-display text-3xl">Ready for a physician who has time?</h2>
            <p className="mt-3 max-w-xl text-paper/75">
              Tell us who you need. We save the request, then open WhatsApp to the clinic with the
              note already written.
            </p>
            <Button asChild variant="inverse" className="mt-6">
              <Link to="/find-a-doctor">Find a concierge doctor</Link>
            </Button>
          </div>
          <div className="rounded-[28px] border border-line bg-paper px-6 py-10 sm:px-10">
            <h2 className="font-display text-3xl">Leave the volume game</h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Affiliation is operations, a smaller panel, and colleagues who already made the
              change. Not a lifestyle brand.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/become-an-affiliate">Partner with us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/why-concierge-medicine">Why concierge medicine</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
