import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { ImageField } from "./ImageField";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { renderMarkdown } from "@/lib/markdown";
import { adminDelete, adminList, adminSave } from "@/lib/server/admin";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "image" | "checkbox" | "markdown";
  options?: string[];
};

export function ResourceAdmin({
  table,
  title,
  fields,
}: {
  table:
    | "testimonials"
    | "blog_posts"
    | "videos"
    | "pages"
    | "team_members"
    | "perks"
    | "care_items"
    | "plans"
    | "faqs"
    | "steps";
  title: string;
  fields: Field[];
}) {
  const [rows, setRows] = useState<Record<string, string | number | boolean | null>[]>([]);
  const [editing, setEditing] = useState<Record<string, string | number | boolean | null> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const list = await adminList({ data: { table } });
    setRows(list);
  }

  useEffect(() => {
    void reload();
  }, [table]);

  function blank() {
    const row: Record<string, string | number | boolean | null> = {};
    for (const f of fields) {
      row[f.key] = f.type === "checkbox" ? true : f.type === "number" ? 0 : f.options?.[0] ?? "";
    }
    setEditing(row);
  }

  async function save() {
    if (!editing) return;
    setError(null);
    try {
      const { id, ...rest } = editing;
      await adminSave({
        data: {
          table,
          id: typeof id === "string" ? id : undefined,
          row: rest,
        },
      });
      setEditing(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await adminDelete({ data: { table, id } });
    await reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">{title}</h1>
        <Button type="button" onClick={blank}>
          Add
        </Button>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-danger" role="status">
          {error}
        </p>
      ) : null}

      {editing ? (
        <form
          className="mt-6 space-y-3 rounded-[24px] border border-line bg-paper p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          {fields.map((f) => (
            <div key={f.key}>
              {f.type === "image" ? (
                <ImageField
                  label={f.label}
                  value={String(editing[f.key] ?? "")}
                  onChange={(url) => setEditing({ ...editing, [f.key]: url })}
                />
              ) : f.type === "markdown" ? (
                <>
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <div className="grid gap-3 lg:grid-cols-2">
                    <Textarea
                      id={f.key}
                      value={String(editing[f.key] ?? "")}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                      rows={12}
                    />
                    <div
                      className="prose-site min-h-40 rounded-[12px] border border-line bg-canvas p-3"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(String(editing[f.key] ?? "")) || "<p class='text-muted'>Preview</p>",
                      }}
                    />
                  </div>
                </>
              ) : f.type === "textarea" ? (
                <>
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Textarea
                    id={f.key}
                    value={String(editing[f.key] ?? "")}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    rows={4}
                  />
                </>
              ) : f.type === "checkbox" ? (
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(editing[f.key])}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })}
                  />
                  {f.label}
                </label>
              ) : f.type === "select" ? (
                <>
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <select
                    id={f.key}
                    className="h-11 w-full rounded-[10px] border border-line bg-paper px-3"
                    value={String(editing[f.key] ?? "")}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                  >
                    {(f.options ?? []).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Input
                    id={f.key}
                    type={f.type === "number" ? "number" : "text"}
                    value={String(editing[f.key] ?? "")}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                  />
                </>
              )}
              {f.key === "embed_url" && String(editing[f.key] ?? "").trim() ? (
                <div className="mt-3">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Embed preview</p>
                  <VideoEmbed url={String(editing[f.key])} title="Video preview" />
                </div>
              ) : null}
            </div>
          ))}
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <ul className="mt-6 divide-y divide-line rounded-[24px] border border-line bg-paper">
        {rows.map((row) => (
          <li key={String(row.id)} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium">
                {String(row.title || row.question || row.member_name || row.name || row.slug || row.id)}
              </p>
              <p className="truncate text-xs text-muted">
                {String(row.status || row.audience || row.role || "")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setEditing(row)}>
                Edit
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => void remove(String(row.id))}>
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
