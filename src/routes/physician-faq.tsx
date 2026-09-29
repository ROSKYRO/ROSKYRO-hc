import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteHeader";
import { getFaqs, getPublicSettings } from "@/lib/server/public";

type QA = { q: string; a: string };

/* Written to be true whatever your final commercial terms are.
   Questions about fees, revenue share, non-compete and exit terms are left out on purpose:
   answer them yourself, then add them here. */
const GROUPS: { title: string; items: QA[] }[] = [
  {
    title: "About the model",
    items: [
      {
        q: "What is a membership panel?",
        a: "A small group of families who pay a membership fee for direct access to you: longer visits, quicker appointments and a doctor who knows them. The panel is deliberately limited so that you can know every member.",
      },
      {
        q: "Is this the same as opening a private clinic?",
        a: "No. You keep practising as you do today. What changes is how many people you look after and what they can expect from you. ROSKYRO provides the membership and operations layer around it.",
      },
      {
        q: "What if my patients cannot afford a membership?",
        a: "Many will not be able to, and that is expected. Patients who do not join stay in your existing practice or are referred honestly. Nobody is dropped without a plan.",
      },
      {
        q: "Who decides the membership fee?",
        a: "You do, with our input on what suits your city and your specialty. We do not publish a single price because it would not be true for every practice.",
      },
    ],
  },
  {
    title: "Your practice and patients",
    items: [
      {
        q: "Do I have to convert my whole practice?",
        a: "Not necessarily. There are different ways to make the change, from moving fully to keeping a panel alongside your existing practice. We describe them on the Why concierge medicine page, and we will talk through which one fits you.",
      },
      {
        q: "What will my staff do?",
        a: "Roles usually shift from managing volume to looking after members: scheduling, follow-up and continuity. We talk this through with you and your team before anything changes.",
      },
      {
        q: "How does this affect insurance and TPA patients?",
        a: "Membership is not insurance. It pays for your time and access. Admissions, scans and hospital bills continue through your patient's own insurance in the usual way. Whether your clinic continues to accept insurance for consultations is your decision.",
      },
      {
        q: "Will I still have time for my hospital work?",
        a: "Yes. Most of the change is in your clinic hours and how many people you look after. Ask us about your specific arrangement.",
      },
    ],
  },
  {
    title: "Rules and records",
    items: [
      {
        q: "Does this fit within NMC rules?",
        a: "You remain bound by the National Medical Commission’s rules on professional conduct and advertising. We shape your public profile and membership wording with those rules in mind, and you approve everything that carries your name. Confirm your own position with your medical council or a lawyer.",
      },
      {
        q: "Who holds patient records?",
        a: "Your patients’ care relationship is with you. Personal data is handled under our privacy policy and the Digital Personal Data Protection Act. You can read the policy on the privacy page.",
      },
    ],
  },
  {
    title: "Getting started",
    items: [
      {
        q: "How do I begin?",
        a: "Send your details through the Partner with us page. Someone from our team will call you for a first conversation about your practice, your city and what you want from the change.",
      },
      {
        q: "Does it cost anything to talk?",
        a: "A first conversation is a conversation. We would rather you understand the terms in writing before you commit to anything.",
      },
      {
        q: "Do you take every doctor who applies?",
        a: "No. Not every practice or city fits a panel, and we will tell you honestly if yours does not.",
      },
      {
        q: "How long does the transition take?",
        a: "Plan for about a hundred days. The Transition page shows the stages.",
      },
    ],
  },
];

export const Route = createFileRoute("/physician-faq")({
  loader: async () => {
    const [settings, faqs] = await Promise.all([
      getPublicSettings(),
      getFaqs({ data: { audience: "physician" } }),
    ]);
    return { settings, faqs };
  },
  head: ({ loaderData }) => {
    const all: QA[] = [
      ...(loaderData?.faqs ?? []).map((f) => ({ q: f.question, a: f.answer })),
      ...GROUPS.flatMap((g) => g.items),
    ];
    return {
      meta: [
        { title: "Physician FAQ: questions doctors ask before joining ROSKYRO" },
        {
          name: "description",
          content:
            "Straight answers for physicians: panel size, what happens to your patients, insurance, NMC rules, records and how the transition works.",
        },
      ],
      /* FAQ structured data for search and AI answers. If your build complains about
         `scripts`, delete this whole block. Nothing else depends on it. */
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: all.map((x) => ({
              "@type": "Question",
              name: x.q,
              acceptedAnswer: { "@type": "Answer", text: x.a },
            })),
          }),
        },
      ],
    };
  },
  component: Page,
});

function Item({ q, a }: QA) {
  return (
    <details className="group rounded-[20px] border border-line bg-paper px-5 py-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium">
        {q}
        <span
          aria-hidden
          className="text-xl leading-none text-muted transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
    </details>
  );
}

function Page() {
  const { settings, faqs } = Route.useLoaderData();
  const groups = [
    ...(faqs.length
      ? [{ title: "The short answers", items: faqs.map((f) => ({ q: f.question, a: f.answer })) }]
      : []),
    ...GROUPS,
  ];

  return (
    <SiteShell settings={settings}>
      <section className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="font-display text-4xl sm:text-5xl">Physician FAQ</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          The questions doctors ask us before they decide. If yours is not here, write to us and
          we will answer it plainly.
        </p>
        <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-2">
          {groups.map((g) => (
            <a
              key={g.title}
              href={`#${g.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm hover:bg-canvas"
            >
              {g.title}
            </a>
          ))}
        </nav>
      </section>

      <section className="mx-auto max-w-3xl space-y-12 px-4 py-12 sm:px-6">
        {groups.map((g) => (
          <div key={g.title} id={g.title.toLowerCase().replace(/[^a-z]+/g, "-")} className="scroll-mt-24">
            <h2 className="font-display text-2xl">{g.title}</h2>
            <div className="mt-4 space-y-3">
              {g.items.map((x) => (
                <Item key={x.q} {...x} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">Still have a question?</h2>
          <p className="mt-3 max-w-xl text-paper/75">
            Talk to us before you decide. We would rather you know the honest answer now.
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
              <Link to="/transition">See the transition</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
