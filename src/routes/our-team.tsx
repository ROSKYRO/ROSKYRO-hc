import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { Portrait } from "@/components/site/Portrait";
import { renderMarkdown } from "@/lib/markdown";
import { getPublicSettings, getTeam } from "@/lib/server/public";

export const Route = createFileRoute("/our-team")({
  loader: async () => {
    const [settings, team] = await Promise.all([getPublicSettings(), getTeam()]);
    return { settings, team };
  },
  head: () => ({
    meta: [
      { title: "Meet the team | ROSKYRO" },
      {
        name: "description",
        content:
          "The people who run ROSKYRO behind the physicians: operations, care coordination and the team that answers your messages.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, team } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Meet the team</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          The people who run ROSKYRO besides the physicians.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <article
              key={m.id}
              className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-paper"
            >
              <Portrait
                src={m.photo_url}
                alt={m.name}
                name={m.name}
                className="aspect-[4/5] w-full"
              />
              <div className="p-6">
                <h2 className="font-display text-2xl">{m.name}</h2>
                <p className="text-sm text-copper">{m.role}</p>
                {/* Bio accepts markdown: paragraphs, **bold** and [LinkedIn](https://…) links. */}
                <div
                  className="prose-site mt-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(m.bio) }}
                />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-12 text-sm text-ink-soft">
          Want to work with us?{" "}
          <Link to="/careers" className="underline underline-offset-4 hover:text-navy">
            See careers
          </Link>
          .
        </p>
      </div>
    </SiteShell>
  );
}
