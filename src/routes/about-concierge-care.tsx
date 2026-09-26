import { createFileRoute } from "@tanstack/react-router";
import { CmsRoutePage, cmsHead, loadCms } from "@/lib/cms-page";

export const Route = createFileRoute("/about-concierge-care")({
  loader: () => loadCms("about-concierge-care"),
  head: ({ loaderData }) => cmsHead(loaderData),
  component: function Page() {
    const data = Route.useLoaderData();
    return <CmsRoutePage {...data} />;
  },
});
