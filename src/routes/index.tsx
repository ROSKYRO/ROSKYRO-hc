import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Phone, Stethoscope } from "lucide-react";
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
      <section className="relative min-h-[88svh] overflow-hidden">
        <img
          src={settings.hero_image_url || "/images/hero.jpg"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-navy-deep/25" />
        <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-paper/70">
            {settings.tagline}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-paper">{settings.hero_h1}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/85 sm:text-lg">
            {settings.hero_sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="inverse" size="lg">
              <Link to="/find-a-doctor">Find a concierge doctor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-paper/40 text-paper hover:bg-paper/10"
            >
              <Link to="/about-concierge-care">How membership works</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-navy">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-4xl text-paper tabular-nums">{value}</p>
              <p className="mt-1 text-sm text-paper/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHead
          kicker="The request"
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
                0{i + 1}
              </p>
              <step.icon className="mt-4 size-5 text-navy" aria-hidden />
              <h3 className="mt-3 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

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
      </section>

      {settings.hero_video_url ? (
        <section className="bg-navy-deep py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-paper/50">
              From the practice
            </p>
            <h2 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
              A slower hour
            </h2>
            <div className="mt-8">
              <VideoEmbed url={settings.hero_video_url} title="ROSKYRO clinic" />
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            kicker="Find a doctor"
            title="A small panel, named"
            lede={`Internal medicine, cardiology, endocrinology, geriatrics, family medicine, women’s health. ${cities.join(", ")}.`}
          />
          <Button asChild variant="outline">
            <Link to="/find-a-doctor">
              Search the directory <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link
              key={city}
              to="/find-a-doctor"
              className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm"
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

      <section className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead kicker="Members" title="What they actually say" />
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
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-copper">
              For physicians
            </p>
            <h2 className="mt-2 font-display text-3xl">Leave the volume game</h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Affiliation is operations, a smaller panel, and colleagues who already made the
              change. Not a lifestyle brand.
            </p>
            <Button asChild className="mt-6">
              <Link to="/become-an-affiliate">Partner with us</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
