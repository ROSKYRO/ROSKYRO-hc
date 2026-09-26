import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { TestimonialCard } from "@/components/site/Cards";
import { getPublicSettings, getTestimonialsPage } from "@/lib/server/public";

export const Route = createFileRoute("/success-stories")({
  loader: async () => {
    const [settings, data] = await Promise.all([
      getPublicSettings(),
      getTestimonialsPage({ data: { audience: "physician", page: 1 } }),
    ]);
    return { settings, data };
  },
  head: () => ({
    meta: [
      { title: "Success stories — ROSKYRO" },
      { name: "description", content: "Physicians who moved to a smaller panel with ROSKYRO." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, data } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Success stories</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {data.items.map((t) => (
            <TestimonialCard key={t.id} item={t} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
