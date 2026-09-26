import { useState } from "react";
import { cn } from "@/lib/utils";

export function Portrait({
  src,
  alt,
  className,
  name,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  name?: string;
}) {
  const [failed, setFailed] = useState(!src);
  const initials = (name ?? alt)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-navy text-paper font-display text-2xl",
          className,
        )}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src ?? ""}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
