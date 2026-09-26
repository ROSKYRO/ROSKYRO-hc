import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  useEffect(() => {
    void getDashboard().then(setData);
  }, []);
  if (!data) return <p className="text-muted">Loading…</p>;
  const cards = [
    ["Inbox (new)", data.unread, "/admin/inbox"],
    ["Appointments", data.appointments, "/admin/inbox"],
    ["Leads", data.leads, "/admin/inbox"],
    ["Doctors", data.doctors, "/admin/doctors"],
    ["Blog posts", data.posts, "/admin/blog"],
  ] as const;
  return (
    <div>
      <h1 className="font-display text-3xl">Desk</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(([label, n, to]) => (
          <Link
            key={label}
            to={to as never}
            className="rounded-[20px] border border-line bg-paper p-5"
          >
            <p className="font-display text-3xl tabular-nums">{n}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-10 font-display text-xl">Recent activity</h2>
      <ul className="mt-3 divide-y divide-line rounded-[20px] border border-line bg-paper">
        {data.recent.map((r) => (
          <li key={r.id} className="px-4 py-3 text-sm">
            <span className="font-medium">{r.action}</span> {r.entity_type} {r.detail}
            <span className="ml-2 text-xs text-muted">{r.created_at}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
