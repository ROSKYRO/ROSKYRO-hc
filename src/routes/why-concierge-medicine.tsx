import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/site/Cards";
import { SiteShell } from "@/components/site/SiteHeader";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/why-concierge-medicine")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Why physicians move to concierge medicine | ROSKYRO" },
      {
        name: "description",
        content:
          "Why doctors leave volume practice for a membership panel, the three ways to make the change, and what to ask any company before you sign.",
      },
    ],
  }),
  component: Page,
});

/* What the change is meant to fix. Written without figures on purpose. */
const REASONS = [
  {
    title: "Time to think",
    text: "A visit long enough to examine, explain and decide, instead of working out what can wait until next time.",
  },
  {
    title: "Continuity",
    text: "You remember the last visit because there were fewer of them, and because you kept the chart.",
  },
  {
    title: "A working life you can sustain",
    text: "Fewer patients a day and after-hours calls you can plan for, rather than a queue that never ends.",
  },
  {
    title: "The relationship back",
    text: "Patients who chose you, and who tell you when something changes.",
  },
];

/* EDIT: confirm which of these ROSKYRO actually offers, and adjust the last card. */
const MODELS = [
  {
    name: "Full conversion",
    how: "Everyone in your practice becomes a member, or leaves.",
    good: "The biggest change in how you work.",
    risk: "Patients who decline have to go elsewhere, and you need enough members to keep the practice running from the first day.",
  },
  {
    name: "Two tiers in one practice",
    how: "Members and non-members are seen by you, at different levels of service.",
    good: "Nobody is turned away.",
    risk: "Your workload can grow rather than shrink, because you are running two kinds of practice at once.",
  },
  {
    name: "A separate panel",
    how: "A small panel of members gets your time. Other patients stay in your existing practice, or are referred honestly.",
    good: "You do not abandon anyone, and the change is gradual.",
    risk: "It needs clear boundaries, and someone reliable to look after the patients outside the panel.",
    ours: true,
  },
];

const QUESTIONS = [
  {
    q: "Who does the work of setting up?",
    a: "Records, phones, patient communication and staff training should be part of the offer, not left to you.",
  },
  {
    q: "What happens after the launch?",
    a: "Ask who handles billing, patient queries and support in month six, not just in week one.",
  },
  {
    q: "Do you get on with the people?",
    a: "You will be in touch for years. Meet the team who will actually answer your calls.",
  },
  {
    q: "How long have they done this?",
    a: "Ask how many practices they have supported, and whether you can speak to a few of those doctors.",
  },
  {
    q: "What happens to the practice over time?",
    a: "Ask what became of panels a year or two on. A good partner will show you honest examples, including the ones that shrank.",
  },
  {
    q: "What does the contract say about leaving?",
    a: "Read the exit terms. Be careful of clauses that stop you from practising nearby, or that keep your patient records.",
  },
];

function Page() {
  const settings = Route.useLoaderData();

  return (
    <SiteShell settings={settings}>
      {/* INTRO */}
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="font-display text-4xl sm:text-5xl">Why concierge medicine</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Patients pretend a short visit was enough. Doctors pretend they remember the last one.
          Hospitals pretend a duty doctor is continuity. Membership practice is for physicians who
          want to stop pretending and get the medical relationship back.
        </p>
      </section>

      {/* WHAT CHANGES */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => (
            <div key={r.title} className="bg-paper p-6">
              <h2 className="font-display text-lg">{r.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="bg-navy py-14 text-paper">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-display text-2xl leading-snug sm:text-3xl">
            The work is still medicine. It is just allowed to take the time it takes.
          </p>
        </div>
      </section>

      {/* HONEST TRADE */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">What you give up, and what you get</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
            A smaller panel usually means a different income, not necessarily a bigger one, and it
            takes time to build. In return you get a working life that is still a profession. We
            would rather say this now than have you find out in month three.
          </p>
        </div>
        <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
          {[
            "You will see fewer patients and know each of them better.",
            "Your income depends on the size of the panel and the fee, so plan it with us early.",
            "The first months are operational: records, phones and conversations with patients.",
            "It works best for physicians who want to keep the work, not leave it.",
          ].map((t) => (
            <li key={t} className="flex gap-3 rounded-[20px] border border-line bg-paper p-4">
              <Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* MODELS */}
      <section className="border-y border-line bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            title="Three ways to make the change"
            lede="Companies build their offer around one of these. Know which one you are being sold."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {MODELS.map((m) => (
              <article
                key={m.name}
                className={`flex flex-col rounded-[24px] border p-6 ${
                  m.ours ? "border-navy bg-navy text-paper" : "border-line bg-canvas"
                }`}
              >
                <h3 className="font-display text-xl">{m.name}</h3>
                <p className={`mt-2 text-sm ${m.ours ? "text-paper/80" : "text-ink-soft"}`}>
                  {m.how}
                </p>
                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="font-medium">What works</dt>
                    <dd className={m.ours ? "text-paper/80" : "text-ink-soft"}>{m.good}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">What to watch</dt>
                    <dd className={m.ours ? "text-paper/80" : "text-ink-soft"}>{m.risk}</dd>
                  </div>
                </dl>
                {m.ours ? (
                  <p className="mt-5 border-t border-paper/20 pt-4 text-sm text-paper">
                    This is how {settings.brand} works.
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* QUESTIONS TO ASK */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <SectionHead
          title="Six questions to ask any company, including us"
          lede="Whoever you choose, get these answered in writing before you commit."
        />
        <ol className="mt-8 space-y-3">
          {QUESTIONS.map((item, i) => (
            <li key={item.q} className="flex gap-4 rounded-[20px] border border-line bg-paper p-5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-medium text-paper">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg">{item.q}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.a}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">Start with a conversation</h2>
          <p className="mt-3 max-w-xl text-paper/75">
            Tell us your city and specialty. We will answer these six questions for your case, and
            say plainly if a panel is not right for you.
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
              <Link to="/affiliate-benefits">Affiliate benefits</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-paper/40 text-paper hover:bg-paper/10"
            >
              <Link to="/physician-faq">Physician FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
