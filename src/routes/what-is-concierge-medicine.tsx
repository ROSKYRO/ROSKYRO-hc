import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Handshake, Stethoscope, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/site/Cards";
import { SiteShell } from "@/components/site/SiteHeader";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/what-is-concierge-medicine")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "What is concierge medicine? A guide for physicians | ROSKYRO" },
      {
        name: "description",
        content:
          "Concierge (membership) medicine explained for doctors: how the membership works, what changes in your day, and how a smaller panel is set up.",
      },
    ],
  }),
  component: Page,
});

/* EDIT: keep only what ROSKYRO really offers physicians. */
const FIT_CARDS = [
  {
    icon: ClipboardList,
    title: "We run the operations",
    text: "Membership billing, patient communication, your public profile and appointment intake.",
  },
  {
    icon: Stethoscope,
    title: "You keep clinical independence",
    text: "Your patients, your decisions. You remain the owner of the relationship.",
  },
  {
    icon: UsersRound,
    title: "The panel stays small",
    text: "We will not let it grow past the number of people you can actually know.",
  },
  {
    icon: Handshake,
    title: "Colleagues who have done it",
    text: "Talk to physicians who already made the change, before you decide anything.",
  },
];

/* Plain, non-numeric comparison. Add figures only if you can source them. */
const COMPARE: [string, string, string][] = [
  ["Patients you look after", "A large, changing OPD list", "A small panel you know by name"],
  ["Time in a visit", "Set by the queue outside", "Set by what the patient needs"],
  ["After-hours questions", "Covering doctor or the clinic desk", "You, or a coordinator who has the chart"],
  ["Hospital admissions", "Handed over to whoever is on duty", "You stay involved"],
  ["Patient records", "Spread across clinics and labs", "One running chart that you keep"],
  ["How the practice is funded", "Per consultation", "Membership fee, plus your existing billing"],
];

const STEPS = [
  "A conversation about your practice, your city and your goals",
  "Choosing a first panel you can stand behind",
  "Setting up phones, records, membership language and your profile",
  "Reducing volume and finding the right visit length",
  "Reviewing the panel with us until it feels right",
];

function Page() {
  const settings = Route.useLoaderData();

  return (
    <SiteShell settings={settings}>
      {/* INTRO */}
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="font-display text-4xl sm:text-5xl">What is concierge medicine?</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Concierge medicine, also called membership or retainer medicine, is a way of practising
          in which patients pay a membership fee and the doctor keeps a smaller panel. The result
          is more time in each visit and a doctor who is easier to reach. This guide is written
          for physicians thinking about the change.
        </p>
      </section>

      {/* HOW THE MEMBERSHIP WORKS */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">The membership pays for your time</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
            The fee is not insurance and it does not replace insurance. Members keep using their
            existing cover for admissions, scans and hospital bills. What the membership covers is
            access to you: longer visits, quicker appointments, a phone that gets answered and
            follow-up that actually happens.
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
            Practices differ in what they include and what they charge, so each physician sets the
            fee and the service level with us, based on their city and their panel.
          </p>
        </div>
        <img
          src="/images/care.jpg"
          alt="A physician speaking with a patient"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[28px] object-cover"
        />
      </section>

      {/* SAME MEDICINE */}
      <section className="bg-navy py-14 text-paper">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-display text-2xl leading-snug sm:text-3xl">
            The medicine is the same. The panel is smaller, so you have time to practise it well.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-paper/75">
            A concierge physician does what any primary physician does: examinations, screening,
            investigations and long-term follow-up, with the same training and registration. What
            changes is how many people you carry, and so how well you can know each of them.
          </p>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <SectionHead
          title="A usual OPD practice and a membership panel"
          lede="What changes in the working day when the panel is small."
        />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th scope="col" className="w-1/4 pb-3 pr-4 font-medium text-muted">
                  <span className="sr-only">Topic</span>
                </th>
                <th scope="col" className="w-[37%] pb-3 pr-4 font-medium text-muted">
                  Usual OPD practice
                </th>
                <th
                  scope="col"
                  className="w-[38%] rounded-t-[16px] bg-navy px-5 pb-3 pt-4 font-medium text-paper"
                >
                  Membership panel
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([topic, usual, member], i) => (
                <tr key={topic}>
                  <th
                    scope="row"
                    className="border-t border-line py-4 pr-4 align-top font-medium"
                  >
                    {topic}
                  </th>
                  <td className="border-t border-line py-4 pr-4 align-top text-ink-soft">
                    {usual}
                  </td>
                  <td
                    className={`bg-navy px-5 py-4 align-top text-paper ${
                      i === COMPARE.length - 1 ? "rounded-b-[16px]" : ""
                    } border-t border-paper/10`}
                  >
                    {member}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* HOW ROSKYRO FITS */}
      <section className="border-y border-line bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            title={`Where ${settings.brand} fits in`}
            lede="We are the operations and membership layer. The practice remains yours."
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {FIT_CARDS.map((c) => (
              <div key={c.title} className="bg-paper p-6">
                <c.icon className="size-6 text-navy" aria-hidden />
                <h3 className="mt-4 font-display text-lg">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOVING OVER */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">Moving over, step by step</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
            You do not need to leave your patients behind. Those we cannot take into the panel stay
            in your existing practice or are referred honestly. Plan for about a hundred days, and
            expect us to slow down rather than skip the hard conversations.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/transition">See the full transition</Link>
          </Button>
        </div>
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s} className="flex gap-4 rounded-[20px] border border-line bg-paper p-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-medium text-paper">
                {i + 1}
              </span>
              <span className="pt-1 text-sm leading-relaxed text-ink-soft">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* WHO IT IS FOR */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl">Is it right for you?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[20px] border border-line bg-paper p-5">
            <h3 className="font-display text-lg">It may suit you if</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
              <li>You still like the medicine but not the queue.</li>
              <li>You want to know each patient and their family well.</li>
              <li>You are comfortable with a smaller income in return for a better working life.</li>
              <li>You want to keep clinical independence and admitting rights.</li>
            </ul>
          </div>
          <div className="rounded-[20px] border border-line bg-paper p-5">
            <h3 className="font-display text-lg">It is probably not for you if</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
              <li>You are mainly looking for a quick route to a bigger income.</li>
              <li>You would rather grow the panel than know it.</li>
              <li>You want a lifestyle brand, not a practice.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY NOW */}
      <section className="border-y border-line bg-paper py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-3xl">Why more physicians are looking at this</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Crowded clinics, burnout and long-term conditions that need regular follow-up are
            pushing more doctors to think about a smaller panel. Membership practice is one way to
            keep the work and change how it is organised.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-[28px] bg-navy px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-3xl">Talk to us before you decide</h2>
          <p className="mt-3 max-w-xl text-paper/75">
            Tell us your city and specialty. We will say plainly whether a panel makes sense and
            what it would involve.
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
              <Link to="/physician-faq">Physician FAQ</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-paper/40 text-paper hover:bg-paper/10"
            >
              <Link to="/member-benefits">Looking for care? Member benefits</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
