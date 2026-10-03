import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { LeadForm } from "@/components/site/Forms";
import { getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/sell-your-practice")({
  loader: () => getPublicSettings(),
  head: () => ({
    meta: [
      { title: "Sell or hand over your practice | ROSKYRO" },
      {
        name: "description",
        content:
          "Retiring, relocating or cutting down? Start a confidential conversation about handing over your panel, with your patients’ continuity first.",
      },
    ],
  }),
  component: Page,
});

/* EDIT: these four are written as promises about the conversation, not about price or payment.
   Add price or payment promises only if you can keep them. */
const POINTS = [
  {
    title: "Confidential from the first call",
    text: "Your enquiry is saved privately. Your colleagues and your patients are not told.",
  },
  {
    title: "A conversation, not a listing",
    text: "There is no marketplace and no public advert for your practice.",
  },
  {
    title: "Your patients come first",
    text: "We talk about how members hear the news and who looks after them next, before we talk about anything else.",
  },
  {
    title: "You set the pace",
    text: "Ask your questions. Take time to think. Nothing moves until you decide.",
  },
];

const STEPS = [
  { t: "You write to us", d: "A few details about you and your panel. Nothing about patients." },
  { t: "Someone calls you privately", d: "We listen to your reasons and your timeline." },
  {
    t: "We look at the options together",
    d: "That may be a handover to a successor, a longer transition, or another route that suits your patients.",
  },
];

function Page() {
  const settings = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Sell or hand over your practice</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Retirement, a move, a panel that needs a successor. You have spent years knowing these
            families. The next step should protect that.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {POINTS.map((p) => (
              <div key={p.title} className="rounded-[20px] border border-line bg-paper p-5">
                <h2 className="font-display text-lg">{p.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.text}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 font-display text-2xl">How it works</h2>
          <ol className="mt-4 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4 rounded-[20px] border border-line bg-paper p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-medium text-paper">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm leading-relaxed text-ink-soft">
            We do not quote a price before we understand your panel. A sale or transfer of a
            practice also involves legal, tax and professional-council matters, so please take your
            own advice alongside ours.
          </p>
          <p className="mt-3 text-sm text-muted">
            Want to keep practising with a smaller panel instead? Read about the{" "}
            <Link to="/transition" className="underline underline-offset-4 hover:text-navy">
              transition
            </Link>{" "}
            or the{" "}
            <Link to="/physician-faq" className="underline underline-offset-4 hover:text-navy">
              physician FAQ
            </Link>
            .
          </p>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <LeadForm
            type="sell_practice"
            title="Confidential enquiry"
            intro="Saved privately. WhatsApp opens to the director with your note."
            extra={[
              { name: "nmc_registration", label: "Medical council registration number", required: true },
              { name: "specialty", label: "Specialty", required: true },
              { name: "city", label: "City", required: true },
              { name: "years", label: "Years in practice" },
              { name: "panel_size", label: "Approximate panel size" },
              {
                name: "reason",
                label: "What is prompting this?",
                options: ["Retirement", "Moving to another city", "Cutting down my work", "Other"],
              },
            ]}
            messageLabel="Anything you want us to know (optional)"
            messageRequired={false}
          />
        </div>
      </div>
    </SiteShell>
  );
}
