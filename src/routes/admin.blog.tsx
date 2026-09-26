import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin } from "@/components/admin/ResourceAdmin";
export const Route = createFileRoute("/admin/blog")({ component: Page });
function Page() {
  return (
    <ResourceAdmin
      table="blog_posts"
      title="Blog"
      fields={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "audience", label: "Audience", type: "select", options: ["patient", "physician"] },
        { key: "excerpt", label: "Excerpt", type: "textarea" },
        { key: "body", label: "Body (markdown)", type: "markdown" },
        { key: "cover_image_url", label: "Cover image", type: "image" },
        { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
        { key: "meta_title", label: "SEO title" },
        { key: "meta_description", label: "SEO description", type: "textarea" },
      ]}
    />
  );
}
