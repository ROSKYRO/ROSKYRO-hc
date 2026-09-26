import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getInbox, getInboxDetail, listAssignees, patchInbox } from "@/lib/server/admin";
import type { InboxItem, InboxStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/inbox")({ component: Inbox });

function Inbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("all");
  const [open, setOpen] = useState<InboxItem | null>(null);

  async function reload() {
    const rows = await getInbox({ data: { status: status || undefined, type } });
    setItems(rows);
  }
  useEffect(() => {
    void reload();
  }, [status, type]);

  const unread = items.filter((i) => i.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Leads & appointments</h1>
          <p className="mt-1 text-sm text-muted">{unread} new</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <select
          className="h-11 rounded-[10px] border border-line bg-paper px-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {["new", "contacted", "confirmed", "cancelled", "completed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="h-11 rounded-[10px] border border-line bg-paper px-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          <option value="appointment">appointment</option>
          <option value="contact">contact</option>
          <option value="become_affiliate">become_affiliate</option>
          <option value="sell_practice">sell_practice</option>
          <option value="do_not_sell">do_not_sell</option>
        </select>
      </div>
      <ul className="mt-6 divide-y divide-line rounded-[20px] border border-line bg-paper">
        {items.map((item) => (
          <li key={`${item.kind}-${item.id}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setOpen(item)}>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted">{item.subtitle}</p>
            </button>
            {item.status === "new" ? (
              <span className="rounded-full bg-copper/15 px-2 py-0.5 text-xs text-copper">new</span>
            ) : (
              <span className="text-xs text-muted">{item.status}</span>
            )}
            {item.whatsapp_opened ? <span className="text-xs text-forest">WhatsApp</span> : null}
            {item.notified ? <span className="text-xs text-navy">email</span> : null}
            <select
              className="h-10 rounded-[10px] border border-line bg-paper px-2 text-sm"
              value={item.status}
              aria-label={`Status for ${item.title}`}
              onChange={async (e) => {
                await patchInbox({
                  data: {
                    kind: item.kind,
                    id: item.id,
                    status: e.target.value as InboxStatus,
                  },
                });
                await reload();
              }}
            >
              {["new", "contacted", "confirmed", "cancelled", "completed"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      {items.length === 0 ? <p className="mt-6 text-sm text-muted">Inbox is empty.</p> : null}
      {open ? <Detail item={open} onClose={() => setOpen(null)} onSaved={reload} /> : null}
    </div>
  );
}

function Detail({
  item,
  onClose,
  onSaved,
}: {
  item: InboxItem;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [notes, setNotes] = useState("");
  const [assigned, setAssigned] = useState("");
  const [staff, setStaff] = useState<{ id: string; name: string }[]>([]);
  const [fields, setFields] = useState<[string, string][]>([]);

  useEffect(() => {
    void Promise.all([
      getInboxDetail({ data: { kind: item.kind, id: item.id } }),
      listAssignees(),
    ]).then(([d, people]) => {
      setStaff(people);
      const row = ((d?.row ?? {}) as Record<string, unknown>);
      setNotes(String(row.notes ?? ""));
      setAssigned(String(row.assigned_to ?? ""));
      const skip = new Set(["id", "notes", "payload", "assigned_to"]);
      const pairs: [string, string][] = Object.entries(row)
        .filter(([k]) => !skip.has(k))
        .map(([k, v]) => [k.replaceAll("_", " "), v == null ? "" : String(v)]);
      if (row.payload && typeof row.payload === "object") {
        for (const [k, v] of Object.entries(row.payload as Record<string, unknown>)) {
          pairs.push([k.replaceAll("_", " "), String(v ?? "")]);
        }
      }
      setFields(pairs);
    });
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-[24px] bg-paper p-6">
        <h2 className="font-display text-2xl">{item.title}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          {fields.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8rem_1fr] gap-2">
              <dt className="text-muted">{k}</dt>
              <dd className="break-words">{v || "—"}</dd>
            </div>
          ))}
        </dl>
        <label className="mt-4 block text-sm font-medium" htmlFor="assign">
          Assign to
        </label>
        <select
          id="assign"
          className="mt-1 h-11 w-full rounded-[10px] border border-line bg-paper px-3"
          value={assigned}
          onChange={(e) => setAssigned(e.target.value)}
        >
          <option value="">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <label className="mt-4 block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          className="mt-1 min-h-24 w-full rounded-[12px] border border-line p-3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            onClick={async () => {
              await patchInbox({
                data: {
                  kind: item.kind,
                  id: item.id,
                  notes,
                  assigned_to: assigned || null,
                },
              });
              await onSaved();
              onClose();
            }}
          >
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
