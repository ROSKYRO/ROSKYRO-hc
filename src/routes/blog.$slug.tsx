import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { renderMarkdown } from "@/lib/markdown";
import { getBlogPost, getPublicSettings } from "@/lib/server/public";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const [settings, data] = await Promise.all([
      getPublicSettings(),
      getBlogPost({ data: { slug: params.slug } }),
    ]);
    return { settings, data };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.data?.post.meta_title || loaderData?.data?.post.title || "Blog — ROSKYRO",
      },
      {
        name: "description",
        content: loaderData?.data?.post.meta_description || loaderData?.data?.post.excerpt || "",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, data } = Route.useLoaderData();
  if (!data?.post) {
    return (
      <SiteShell settings={settings}>
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h1 className="font-display text-4xl">Story not found</h1>
        </div>
      </SiteShell>
    );
  }
  const { post, prev, next } = data;
  return (
    <SiteShell settings={settings}>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {post.cover_image_url ? (
          <img src={post.cover_image_url} alt="" className="mb-8 h-64 w-full rounded-[28px] object-cover" />
        ) : null}
        <h1 className="font-display text-4xl sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{post.excerpt}</p>
        <div
          className="prose-site mt-8"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
        />
        <nav className="mt-12 flex justify-between gap-4 border-t border-line pt-6 text-sm">
          {prev ? (
            <Link to="/blog/$slug" params={{ slug: prev.slug }} className="text-navy">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to="/blog/$slug" params={{ slug: next.slug }} className="text-navy">
              {next.title} →
            </Link>
          ) : null}
        </nav>
      </article>
    </SiteShell>
  );
}
