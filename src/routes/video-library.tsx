import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteHeader";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { getPublicSettings, getVideos } from "@/lib/server/public";

export const Route = createFileRoute("/video-library")({
  loader: async () => {
    const [settings, videos] = await Promise.all([getPublicSettings(), getVideos()]);
    return { settings, videos };
  },
  head: () => ({
    meta: [
      { title: "Video library — ROSKYRO" },
      { name: "description", content: "Films from the ROSKYRO practice and concierge medicine." },
    ],
  }),
  component: Page,
});

function Page() {
  const { settings, videos } = Route.useLoaderData();
  return (
    <SiteShell settings={settings}>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl sm:text-5xl">Video library</h1>
        <div className="mt-10 space-y-10">
          {videos.map((v) => (
            <figure key={v.id}>
              <VideoEmbed url={v.embed_url} title={v.title} />
              <figcaption className="mt-3 font-medium">{v.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
