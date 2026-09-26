import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  component: AdminGate,
});
