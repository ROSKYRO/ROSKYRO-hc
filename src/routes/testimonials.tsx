import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { TestimonialCard } from "@/components/site/Cards";
import { getPublicSettings, getTestimonialsPage } from "@/lib/server/public";

type Search = { page?: string };

export const Route = createFileRoute("/testimonials")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    page: typeof s.page === "string" ? s.page : undefined,
  }),
  loaderDeps: ({ search }) => ({ page: Number(search.page ?? 1) || 1 }),
  loader: async ({ deps }) => {
    const [settings, data] = await Promise.all([
      getPublicSettings(),
      getTestimonialsPage({ data: { audience: "patient", page: deps.page } }),
    ]);
    return { settings, data };
  },
  head: () => ({
    meta: [
      { title: "Testimonials — ROSKYRO" },
      { name: "description", content: "What ROSKYRO members say about membership medicine." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, data } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Testimonials</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {data.items.map((t) => (
            <TestimonialCard key={t.id} item={t} />
          ))}
        </div>
        {data.totalPages > 1 ? (
          <div className="mt-10 flex gap-2">
            {Array.from({ length: data.totalPages }, (_, i) => (
              <Link
                key={i}
                to="/testimonials"
                search={{ page: String(i + 1) }}
                className="inline-flex size-11 items-center justify-center rounded-[10px] border border-line"
              >
                {i + 1}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </SiteShell>
  );
}
