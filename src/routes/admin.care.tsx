import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin } from "@/components/admin/ResourceAdmin";
export const Route = createFileRoute("/admin/care")({ component: Page });
function Page() {
  return (
    <ResourceAdmin
      table="care_items"
      title="360° care"
      fields={[
        { key: "title", label: "Title" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "image_url", label: "Image", type: "image" },
        { key: "ordering", label: "Order", type: "number" },
        { key: "active", label: "Active", type: "checkbox" },
      ]}
    />
  );
}
