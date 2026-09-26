import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin } from "@/components/admin/ResourceAdmin";
export const Route = createFileRoute("/admin/steps")({ component: Page });
function Page() {
  return (
    <ResourceAdmin
      table="steps"
      title="Transition steps"
      fields={[
        { key: "title", label: "Title" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "ordering", label: "Order", type: "number" },
      ]}
    />
  );
}
