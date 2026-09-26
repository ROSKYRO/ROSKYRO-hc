import { toEmbedUrl } from "@/lib/video";

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url);
  if (!embed) return null;
  return (
    <div className="aspect-video overflow-hidden rounded-[20px] bg-navy-deep">
      <iframe
        src={embed}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
