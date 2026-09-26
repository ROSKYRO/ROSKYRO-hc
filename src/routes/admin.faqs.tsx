import { createFileRoute } from "@tanstack/react-router";
import { ResourceAdmin } from "@/components/admin/ResourceAdmin";
export const Route = createFileRoute("/admin/faqs")({ component: Page });
function Page() {
  return (
    <ResourceAdmin
      table="faqs"
      title="FAQs"
      fields={[
        { key: "question", label: "Question" },
        { key: "answer", label: "Answer", type: "textarea" },
        { key: "audience", label: "Audience", type: "select", options: ["patient", "physician"] },
        { key: "ordering", label: "Order", type: "number" },
      ]}
    />
  );
}
