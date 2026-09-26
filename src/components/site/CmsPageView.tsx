import { renderMarkdown } from "@/lib/markdown";
import type { CmsPage, SiteSettings } from "@/lib/types";
import { SiteShell } from "./SiteHeader";

export function CmsPageView({
  settings,
  page,
}: {
  settings: SiteSettings;
  page: CmsPage;
}) {
  return (
    <SiteShell settings={settings}>
      <article>
        {page.image_url ? (
          <div className="relative h-56 overflow-hidden sm:h-80">
            <img src={page.image_url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-navy-deep/35" />
          </div>
        ) : null}
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="font-display text-4xl sm:text-5xl">{page.title}</h1>
          <div
            className="prose-site mt-8"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }}
          />
        </div>
      </article>
    </SiteShell>
  );
}
