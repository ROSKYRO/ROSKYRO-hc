import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin } from "@/components/admin/ResourceAdmin";
export const Route = createFileRoute("/admin/pages")({ component: Page });
function Page() {
  return (
    <ResourceAdmin
      table="pages"
      title="Pages"
      fields={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "body", label: "Body (markdown)", type: "markdown" },
        { key: "image_url", label: "Banner image", type: "image" },
        { key: "meta_title", label: "SEO title" },
        { key: "meta_description", label: "SEO description", type: "textarea" },
      ]}
    />
  );
}
