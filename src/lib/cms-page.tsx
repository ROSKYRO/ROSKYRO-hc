import { getPageBySlug, getPublicSettings } from "@/lib/server/public";
import { CmsPageView } from "@/components/site/CmsPageView";
import { SiteShell } from "@/components/site/SiteHeader";
import type { CmsPage } from "@/lib/types";

export async function loadCms(slug: string) {
  const [settings, page] = await Promise.all([
    getPublicSettings(),
    getPageBySlug({ data: { slug } }),
  ]);
  return { settings, page };
}

export function cmsHead(loaderData: { page: CmsPage | null } | undefined) {
  return {
    meta: [
      { title: loaderData?.page?.meta_title || loaderData?.page?.title || "ROSKYRO" },
      { name: "description", content: loaderData?.page?.meta_description || "" },
    ],
  };
}

export function CmsRoutePage({
  settings,
  page,
}: Awaited<ReturnType<typeof loadCms>>) {
  if (!page) {
    return (
      <SiteShell settings={settings}>
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h1 className="font-display text-4xl">Page not found</h1>
        </div>
      </SiteShell>
    );
  }
  return <CmsPageView settings={settings} page={page} />;
}
