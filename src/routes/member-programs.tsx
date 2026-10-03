import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { PerkCard, SectionHead } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { getPlans, getPublicSettings } from "@/lib/server/public";

type Program = { title: string; text: string; live: boolean };
type Category = { id: string; title: string; lede: string; items: Program[] };

/* PROGRAMS: only items with `live: true` are shown. A category with no live item is hidden.
   Flip `live` to true ONLY when the service is really available to members (your own service
   or a partner you have an actual arrangement with). Edit the text to match what you offer. */
const CATEGORIES: Category[] = [
  {
    id: "mind",
    title: "Mind",
    lede: "Support for stress, sleep and mood.",
    items: [
      {
        title: "Counselling sessions",
        text: "Sessions with a mental health professional, for you or for a family member.",
        live: false,
      },
      {
        title: "Sleep and stress check-in",
        text: "A structured conversation about sleep, workload and stress, with a plan to follow.",
        live: false,
      },
    ],
  },
  {
    id: "body",
    title: "Body",
    lede: "Prevention, screening and follow-up.",
    items: [
      {
        title: "Yearly health plan",
        text: "Goals, screening and follow-ups for the year, written down and reviewed with your physician.",
        live: true,
      },
      {
        title: "Medicines review",
        text: "Your physician goes through everything you take, so that nothing overlaps or clashes.",
        live: true,
      },
      {
        title: "Screening at partner labs",
        text: "Member pricing on routine tests at a partner laboratory.",
        live: false,
      },
      {
        title: "Second opinion on reports and scans",
        text: "A specialist reviews your scans and reports when your physician advises it.",
        live: false,
      },
      {
        title: "Home monitoring of blood pressure and sugar",
        text: "Readings shared with your physician between visits.",
        live: false,
      },
    ],
  },
  {
    id: "nutrition",
    title: "Nutrition",
    lede: "Food advice from a qualified dietitian.",
    items: [
      {
        title: "Dietitian consultation",
        text: "One-to-one advice on weight, diabetes, heart or kidney health.",
        live: false,
      },
    ],
  },
  {
    id: "perks",
    title: "Member perks",
    lede: "Extras for members and their families.",
    items: [
      {
        title: "Health talks for members",
        text: "Live sessions with physicians on everyday health topics.",
        live: false,
      },
      {
        title: "Pharmacy discount",
        text: "Member pricing at a partner pharmacy.",
        live: false,
      },
    ],
  },
];

export const Route = createFileRoute("/member-programs")({
  loader: async () => {
    const [settings, plans] = await Promise.all([getPublicSettings(), getPlans()]);
    return { settings, plans };
  },
  head: () => ({
    meta: [
      { title: "Member programs | ROSKYRO" },
      {
        name: "description",
        content:
          "Individual, couple and household membership at ROSKYRO. See what each program covers and ask your physician about fees for your family.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, plans } = Route.useLoaderData();
  const cats = CATEGORIES.map((c) => ({ ...c, items: c.items.filter((i) => i.live) })).filter(
    (c) => c.items.length > 0,
  );

  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Member programs</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Membership options for you and your family, and the programs that come with them. Fees
          are quoted after a conversation with the physician. The structure is the same; the
          number depends on the panel.
        </p>

        {/* MEMBERSHIP OPTIONS (admin: Programs) */}
        <section className="mt-12">
          <h2 className="font-display text-3xl">Membership options</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {plans.map((item) => (
              <PerkCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* PROGRAMS BY CATEGORY */}
        {cats.length > 0 ? (
          <section className="mt-16">
            <SectionHead
              kicker="Included with membership"
              title="Programs for your health"
              lede="Availability depends on your city and your physician."
            />
            <nav aria-label="Program categories" className="mt-6 flex flex-wrap gap-2">
              {cats.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm hover:bg-canvas"
                >
                  {c.title}
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-14">
              {cats.map((c) => (
                <div key={c.id} id={c.id} className="scroll-mt-24">
                  <h3 className="font-display text-2xl">{c.title}</h3>
                  <p className="mt-1 text-ink-soft">{c.lede}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {c.items.map((p) => (
                      <div key={p.title} className="rounded-[24px] border border-line bg-paper p-6">
                        <h4 className="font-display text-xl">{p.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
                        <Link
                          to="/contact"
                          className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4 hover:text-navy"
                        >
                          Ask about this
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* MEMBERS */}
        <section className="mt-16 rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">Already a member?</h2>
          <p className="mt-3 max-w-xl text-paper/75">
            Ask your physician which programs are open to you. Not a member yet? Tell us where you
            are and we will point you to a physician.
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
              <Link to="/contact">Ask about membership</Link>
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
