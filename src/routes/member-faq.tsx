import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { getFaqs, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/member-faq")({
  loader: async () => {
    const [settings, faqs] = await Promise.all([
      getPublicSettings(),
      getFaqs({ data: { audience: "patient" } }),
    ]);
    return { settings, faqs };
  },
  head: () => ({
    meta: [
      { title: "Member FAQ — ROSKYRO" },
      { name: "description", content: "Questions families ask before joining ROSKYRO." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, faqs } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Member FAQ</h1>
        <div className="mt-10 space-y-4">
          {faqs.map((f) => (
            <details key={f.id} className="rounded-[20px] border border-line bg-paper px-5 py-4">
              <summary className="min-h-11 cursor-pointer list-none font-medium">{f.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
