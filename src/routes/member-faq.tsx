import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/SiteHeader";
import { getFaqs, getPublicSettings } from "@/lib/server/public";

type QA = { q: string; a: string };

/* Written to stay true whatever your final pricing and payment policies are.
   Questions about payment methods, GST invoices, grace periods and refunds are left out on purpose:
   answer them yourself, then add them to the right group. */
const GROUPS: { title: string; items: QA[] }[] = [
  {
    title: "In an emergency",
    items: [
      {
        q: "What should I do in an emergency?",
        a: "Call 112 or go to the nearest hospital straight away. Do not wait for a message reply. Tell your physician afterwards so they can follow up and coordinate with the hospital.",
      },
      {
        q: "What if I feel unwell late at night?",
        a: "If it feels serious or sudden, treat it as an emergency and call 112. For urgent but not life-threatening concerns, contact your physician the way they have agreed with you. They will tell you what to expect when you join.",
      },
    ],
  },
  {
    title: "Membership and fees",
    items: [
      {
        q: "What does the membership fee cover?",
        a: "Your physician’s time and access: longer visits, quicker appointments, a way to reach them between visits and a plan for your year. It does not replace insurance, and hospital bills, scans and tests are separate unless your physician tells you otherwise.",
      },
      {
        q: "How much does it cost?",
        a: "It depends on your physician and your city. You will see the fee before you join, and your physician will explain what it includes.",
      },
      {
        q: "Can my family join?",
        a: "Yes. See the Member programs page for individual, couple and household options.",
      },
      {
        q: "Can I claim the fee for tax?",
        a: "That depends on your own situation. Please ask your chartered accountant.",
      },
    ],
  },
  {
    title: "Using your membership",
    items: [
      {
        q: "How do I reach my doctor?",
        a: "You will use the channels your physician agrees with you, such as WhatsApp or phone. Ask your physician about expected response times when you join.",
      },
      {
        q: "What if my doctor is away?",
        a: "Ask your physician how cover works when they are unavailable. It is part of the first conversation.",
      },
      {
        q: "Where are my medical records kept?",
        a: "Your physician keeps a running record of your care. You can ask for a copy at any time.",
      },
    ],
  },
  {
    title: "Billing questions",
    items: [
      {
        q: "Who do I contact about billing?",
        a: "Use the Contact page and choose “Billing or my membership”. Include your doctor’s name and, if you have it, your invoice or receipt number so we can find your account quickly.",
      },
    ],
  },
  {
    title: "Your information",
    items: [
      {
        q: "How is my information handled?",
        a: "Your details are used to run your care and membership. They are handled under our privacy policy and the Digital Personal Data Protection Act, 2023. You can read the full policy on the privacy page.",
      },
    ],
  },
  {
    title: "Getting started",
    items: [
      {
        q: "How do I join?",
        a: "Find your physician, send a request and they will call you for a first conversation. You decide after that.",
      },
    ],
  },
];

const slug = (t: string) => t.toLowerCase().replace(/[^a-z]+/g, "-");

export const Route = createFileRoute("/member-faq")({
  loader: async () => {
    const [settings, faqs] = await Promise.all([
      getPublicSettings(),
      getFaqs({ data: { audience: "patient" } }),
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
        { title: "Member FAQ: fees, billing, emergencies and how membership works" },
        {
          name: "description",
          content:
            "Answers on membership fees, billing, emergencies and records. Read the ROSKYRO member FAQ before you join.",
        },
      ],
      /* FAQ structured data. If your build complains about `scripts`, delete this block. */
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
  const [emergency, ...rest] = GROUPS;
  const groups = [
    emergency,
    ...(faqs.length
      ? [{ title: "The short answers", items: faqs.map((f) => ({ q: f.question, a: f.answer })) }]
      : []),
    ...rest,
  ];

  return (
    <SiteShell settings={settings}>
      <section className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="font-display text-4xl sm:text-5xl">Member FAQ</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          What families ask before they join, and what they ask once they have.
        </p>
        <p className="mt-5 rounded-[16px] border border-line bg-paper p-4 text-sm text-ink-soft">
          In an emergency, call 112 or go to the nearest hospital. Do not use this site.
        </p>
        <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-2">
          {groups.map((g) => (
            <a
              key={g.title}
              href={`#${slug(g.title)}`}
              className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 text-sm hover:bg-canvas"
            >
              {g.title}
            </a>
          ))}
        </nav>
      </section>

      <section className="mx-auto max-w-3xl space-y-12 px-4 py-12 sm:px-6">
        {groups.map((g) => (
          <div key={g.title} id={slug(g.title)} className="scroll-mt-24">
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
            Write to us, or find a physician and ask them directly.
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
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
