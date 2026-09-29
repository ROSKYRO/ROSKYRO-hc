import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  Clock,
  ClipboardList,
  HeartHandshake,
  MessageCircle,
  Repeat,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteHeader";
import { PerkCard, SectionHead, TestimonialCard } from "@/components/site/Cards";
import { getHomeData } from "@/lib/server/public";

export const Route = createFileRoute("/member-benefits")({
  loader: () => getHomeData(),
  head: () => ({
    meta: [
      { title: "Member benefits — what concierge care includes | ROSKYRO" },
      {
        name: "description",
        content:
          "Reach your own physician, get same-day or next-day visits, unhurried consultations and a health plan built around you. See everything membership includes.",
      },
    ],
  }),
  component: Page,
});

/* EDIT: keep only what your doctors really deliver. */
const BENEFITS = [
  { icon: MessageCircle, title: "Doctor on WhatsApp", text: "Message or call your physician directly." },
  { icon: CalendarCheck, title: "Same-day or next-day visits", text: "Seen when you are unwell." },
  { icon: Clock, title: "Longer visits", text: "Time to talk, examine and understand." },
  { icon: HeartHandshake, title: "Personal attention", text: "A doctor who knows your history and goals." },
  { icon: Users, title: "Family and visiting relatives", text: "Ask about visits for parents or family who are in town." },
  { icon: ClipboardList, title: "A plan for your year", text: "Screening, follow-ups and goals written down." },
  { icon: Repeat, title: "Follow-up that happens", text: "Results and questions do not fall through." },
  { icon: ShieldCheck, title: "Prevention first", text: "Catch problems early rather than treat them late." },
];

/* Long-term conditions that need regular consults and follow-up.
   EDIT: keep only what your panel can actually manage or co-manage with a specialist. */
const TOPIC_GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Heart and blood pressure",
    items: [
      "High blood pressure",
      "Coronary artery disease",
      "Heart failure",
      "High cholesterol",
      "Heart rhythm problems",
      "Follow-up after heart attack, stent or bypass",
    ],
  },
  {
    title: "Diabetes and hormones",
    items: [
      "Type 2 diabetes",
      "Type 1 diabetes",
      "Prediabetes",
      "Thyroid disorders",
      "PCOS",
      "Obesity and weight management",
    ],
  },
  {
    title: "Kidney and liver",
    items: [
      "Chronic kidney disease",
      "Fatty liver",
      "Chronic hepatitis B and C",
      "Kidney stones (recurrent)",
    ],
  },
  {
    title: "Lungs and breathing",
    items: [
      "Asthma",
      "COPD",
      "Bronchiectasis",
      "Sleep apnoea",
      "Follow-up during and after TB treatment",
    ],
  },
  {
    title: "Bones, joints and muscles",
    items: [
      "Osteoarthritis",
      "Rheumatoid arthritis",
      "Gout",
      "Osteoporosis",
      "Chronic back and neck pain",
      "Lupus and other autoimmune conditions",
    ],
  },
  {
    title: "Brain and nerves",
    items: [
      "Migraine",
      "Epilepsy",
      "Parkinson’s disease",
      "Recovery after stroke",
      "Memory loss and dementia",
      "Neuropathy",
    ],
  },
  {
    title: "Digestive health",
    items: [
      "Acidity and GERD",
      "Irritable bowel syndrome",
      "Crohn’s disease and ulcerative colitis",
      "Chronic constipation",
      "Peptic ulcer",
    ],
  },
  {
    title: "Mind and sleep",
    items: ["Depression", "Anxiety", "Insomnia and sleep problems"],
  },
  {
    title: "Skin and allergy",
    items: ["Psoriasis", "Eczema", "Chronic allergy and rhinitis", "Chronic hives"],
  },
  {
    title: "Blood",
    items: ["Anaemia", "Sickle cell disease", "Thalassaemia"],
  },
  {
    title: "Women’s and men’s health",
    items: ["Menopause", "Endometriosis", "Prostate enlargement"],
  },
  {
    title: "Eyes and ears",
    items: ["Glaucoma", "Diabetic eye checks", "Chronic sinusitis", "Hearing loss"],
  },
  {
    title: "Older adults and long-term follow-up",
    items: [
      "Managing many medicines together",
      "Fall prevention",
      "Long-term follow-up after cancer treatment",
    ],
  },
];

function Page() {
  const { settings, perks, care, testimonials } = Route.useLoaderData();

  return (
    <SiteShell settings={settings}>
      {/* INTRO */}
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="font-display text-4xl sm:text-5xl">What membership includes</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          You get a physician who is easy to reach and has time for you. Their approach is to
          prevent problems where possible, not only treat them after they start.
        </p>
      </section>

      {/* 8 BENEFITS */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-paper p-6">
              <b.icon className="size-6 text-navy" aria-hidden />
              <h2 className="mt-4 font-display text-lg">{b.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 1: TIME */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
        <img
          src="/images/care.jpg"
          alt="A physician listening to a patient"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[28px] object-cover"
        />
        <div>
          <h2 className="font-display text-3xl">A doctor with more time for you</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            A longer consultation changes what a visit can do. Your doctor can go through your
            reports with you, explain what they mean, listen to your worries, and agree on what to
            do next. You leave knowing why, not only what.
          </p>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Because the panel is small, you can also see your doctor more often for check-ins, not
            only when something goes wrong.
          </p>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="bg-navy py-14 text-paper">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-display text-2xl leading-snug sm:text-3xl">
            The point is simple: you are a person to your doctor, not a token number.
          </p>
        </div>
      </section>

      {/* SECTION 2: PLAN */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl">A health plan built around you</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Together you set goals and a schedule for tests, follow-ups and lifestyle changes. Your
            doctor keeps track of your numbers and acts early when something moves the wrong way.
          </p>
          <p className="mt-3 leading-relaxed text-ink-soft">
            If you live with a long-term condition, regular consults are the point of membership.
            Here are the conditions we can help you keep under control:
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPIC_GROUPS.map((g) => (
            <div key={g.title} className="rounded-[20px] border border-line bg-paper p-5">
              <h3 className="font-display text-lg">{g.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {g.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-copper" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-sm text-muted">
          Which conditions are managed depends on your doctor’s specialty. Some are co-managed with
          a specialist. Ask your doctor before joining if your condition is not listed.
        </p>
      </section>

      {/* SECTION 3: ACCESS */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="lg:order-1">
          <h2 className="font-display text-3xl">Reachable, not just available on appointment</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Care does not stop when you walk out of the clinic. If you have a question while
            following your plan, you can message or call your doctor. When you need to be seen, you
            can book a same-day or next-day visit, even for something that is not an emergency.
          </p>
          <p className="mt-3 text-sm text-muted">
            For emergencies, call 112 or go to the nearest hospital.
          </p>
        </div>
        <img
          src="/images/mission.jpg"
          alt=""
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[28px] object-cover lg:order-2"
        />
      </section>

      {/* DATA-DRIVEN: what the retainer buys + care */}
      <section className="border-y border-line bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead kicker="Membership" title="What the retainer buys" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((item) => (
              <PerkCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-16">
            <SectionHead kicker="Care" title="360° through the year" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {care.map((item) => (
                <PerkCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead kicker="Members" title="Don’t take our word for it. Take theirs." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} item={t} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">Find your concierge doctor</h2>
          <p className="mt-3 max-w-xl text-paper/75">
            Search by city or specialty, or write in and we will match you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="inverse">
              <Link to="/find-a-doctor">Find a doctor</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-paper/40 text-paper hover:bg-paper/10"
            >
              <Link to="/member-faq">Read the member FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
