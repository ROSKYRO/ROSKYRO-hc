import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin } from "@/components/admin/ResourceAdmin";
export const Route = createFileRoute("/admin/videos")({ component: Page });
function Page() {
  return (
    <ResourceAdmin
      table="videos"
      title="Video library"
      fields={[
        { key: "title", label: "Title" },
        { key: "embed_url", label: "YouTube / Vimeo URL" },
        { key: "thumbnail_url", label: "Thumbnail", type: "image" },
        { key: "ordering", label: "Order", type: "number" },
        { key: "active", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
