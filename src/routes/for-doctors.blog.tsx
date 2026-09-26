import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { getBlogList, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/for-doctors/blog")({
  loader: async () => {
    const [settings, data] = await Promise.all([
      getPublicSettings(),
      getBlogList({ data: { audience: "physician", page: 1 } }),
    ]);
    return { settings, data };
  },
  head: () => ({
    meta: [
      { title: "Physician blog — ROSKYRO" },
      { name: "description", content: "Notes for physicians considering concierge practice." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, data } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Physician blog</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {data.items.map((post) => (
            <Link
              key={post.id}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="rounded-[28px] border border-line bg-paper p-6"
            >
              <h2 className="font-display text-2xl">{post.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
