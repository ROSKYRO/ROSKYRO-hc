import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin } from "@/components/admin/ResourceAdmin";
export const Route = createFileRoute("/admin/testimonials")({ component: Page });
function Page() {
  return (
    <ResourceAdmin
      table="testimonials"
      title="Testimonials"
      fields={[
        { key: "member_name", label: "Name" },
        { key: "photo_url", label: "Photo", type: "image" },
        { key: "rating", label: "Rating", type: "number" },
        { key: "text", label: "Short text", type: "textarea" },
        { key: "full_text", label: "Full text", type: "textarea" },
        { key: "source", label: "Source", type: "select", options: ["manual", "google"] },
        { key: "audience", label: "Audience", type: "select", options: ["patient", "physician"] },
        { key: "status", label: "Status", type: "select", options: ["published", "hidden"] },
      ]}
    />
  );
}
