import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listActivity } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/activity")({ component: Page });

function Page() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listActivity>>>([]);
  useEffect(() => {
    void listActivity().then(setRows);
  }, []);
  return (
    <div>
      <h1 className="font-display text-3xl">Activity log</h1>
      <ul className="mt-6 divide-y divide-line rounded-[20px] border border-line bg-paper">
        {rows.map((r) => (
          <li key={r.id} className="px-4 py-3 text-sm">
            <span className="font-medium">{r.action}</span> {r.entity_type} {r.entity_id} {r.detail}
            <span className="ml-2 text-xs text-muted">{r.created_at}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
