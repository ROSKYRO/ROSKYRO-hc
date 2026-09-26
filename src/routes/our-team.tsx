import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { Portrait } from "@/components/site/Portrait";
import { getPublicSettings, getTeam } from "@/lib/server/public";

export const Route = createFileRoute("/our-team")({
  loader: async () => {
    const [settings, team] = await Promise.all([getPublicSettings(), getTeam()]);
    return { settings, team };
  },
  head: () => ({
    meta: [
      { title: "Meet the team — ROSKYRO" },
      { name: "description", content: "The people who run ROSKYRO besides the physicians." },
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
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {team.map((m) => (
            <article key={m.id} className="overflow-hidden rounded-[28px] border border-line bg-paper">
              <Portrait src={m.photo_url} alt={m.name} name={m.name} className="aspect-[4/5] w-full" />
              <div className="p-5">
                <h2 className="font-display text-2xl">{m.name}</h2>
                <p className="text-sm text-copper">{m.role}</p>
                <p className="mt-3 text-sm text-ink-soft">{m.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
