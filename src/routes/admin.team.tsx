import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin } from "@/components/admin/ResourceAdmin";
export const Route = createFileRoute("/admin/team")({ component: Page });
function Page() {
  return (
    <ResourceAdmin
      table="team_members"
      title="Team"
      fields={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "photo_url", label: "Photo", type: "image" },
        { key: "bio", label: "Bio", type: "textarea" },
        { key: "ordering", label: "Order", type: "number" },
      ]}
    />
  );
}
