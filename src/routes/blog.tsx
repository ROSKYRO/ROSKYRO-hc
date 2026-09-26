import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { getBlogList, getPublicSettings } from "@/lib/server/public";

type Search = { page?: string };

export const Route = createFileRoute("/blog")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    page: typeof s.page === "string" ? s.page : undefined,
  }),
  loaderDeps: ({ search }) => ({ page: Number(search.page ?? 1) || 1 }),
  loader: async ({ deps }) => {
    const [settings, data] = await Promise.all([
      getPublicSettings(),
      getBlogList({ data: { audience: "patient", page: deps.page } }),
    ]);
    return { settings, data };
  },
  head: () => ({
    meta: [
      { title: "Member blog — ROSKYRO" },
      { name: "description", content: "Notes on membership medicine for patients and families." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, data } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Member blog</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {data.items.map((post) => (
            <Link
              key={post.id}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="overflow-hidden rounded-[28px] border border-line bg-paper"
            >
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt="" className="h-48 w-full object-cover" />
              ) : null}
              <div className="p-6">
                <h2 className="font-display text-2xl">{post.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        {data.totalPages > 1 ? (
          <div className="mt-10 flex gap-2">
            {Array.from({ length: data.totalPages }, (_, i) => (
              <Link
                key={i}
                to="/blog"
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
