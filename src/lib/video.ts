export function toEmbedUrl(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;
  const yt =
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i.exec(
      raw,
    );
  if (yt?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  }
  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/i.exec(raw);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (raw.includes("youtube.com/embed/") || raw.includes("player.vimeo.com/")) return raw;
  return null;
}
