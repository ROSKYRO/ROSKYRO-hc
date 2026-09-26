import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { ImageField } from "@/components/admin/ImageField";
import { deleteDoctor, listDoctorsAdmin, saveDoctor } from "@/lib/server/admin";
import type { Doctor } from "@/lib/types";

export const Route = createFileRoute("/admin/doctors")({ component: Page });

function Page() {
  const [rows, setRows] = useState<Doctor[]>([]);
  const [edit, setEdit] = useState<Partial<Doctor> & { autolocate?: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setRows(await listDoctorsAdmin());
  }
  useEffect(() => {
    void reload();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Doctors</h1>
        <Button
          type="button"
          onClick={() =>
            setEdit({
              name: "",
              specialty: "",
              city: "",
              address_line: "",
              status: "active",
              autolocate: true,
            })
          }
        >
          Add doctor
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      {edit ? (
        <form
          className="mt-6 grid gap-3 rounded-[24px] border border-line bg-paper p-5 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            const result = await saveDoctor({
              data: {
                id: edit.id,
                name: edit.name ?? "",
                specialty: edit.specialty ?? "",
                city: edit.city ?? "",
                address_line: edit.address_line ?? "",
                latitude: edit.latitude ?? null,
                longitude: edit.longitude ?? null,
                phone: edit.phone ?? "",
                whatsapp_number: edit.whatsapp_number ?? "",
                photo_url: edit.photo_url ?? "",
                bio: edit.bio ?? "",
                years_experience: edit.years_experience ?? null,
                languages_spoken: edit.languages_spoken ?? "",
                education: edit.education ?? "",
                status: (edit.status as Doctor["status"]) ?? "active",
                autolocate: Boolean(edit.autolocate),
              },
            });
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setEdit(null);
            await reload();
          }}
        >
          <Field label="Name" value={edit.name} onChange={(v) => setEdit({ ...edit, name: v })} />
          <Field label="Specialty" value={edit.specialty} onChange={(v) => setEdit({ ...edit, specialty: v })} />
          <Field label="City" value={edit.city} onChange={(v) => setEdit({ ...edit, city: v })} />
          <Field
            label="Address"
            value={edit.address_line}
            onChange={(v) => setEdit({ ...edit, address_line: v })}
          />
          <Field label="Phone" value={edit.phone} onChange={(v) => setEdit({ ...edit, phone: v })} />
          <Field
            label="WhatsApp"
            value={edit.whatsapp_number}
            onChange={(v) => setEdit({ ...edit, whatsapp_number: v })}
          />
          <Field
            label="Latitude"
            value={edit.latitude != null ? String(edit.latitude) : ""}
            onChange={(v) => setEdit({ ...edit, latitude: v ? Number(v) : null })}
          />
          <Field
            label="Longitude"
            value={edit.longitude != null ? String(edit.longitude) : ""}
            onChange={(v) => setEdit({ ...edit, longitude: v ? Number(v) : null })}
          />
          <div className="md:col-span-2">
            <ImageField
              label="Photo"
              value={edit.photo_url ?? ""}
              onChange={(u) => setEdit({ ...edit, photo_url: u })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Bio (markdown)</Label>
            <Textarea value={edit.bio ?? ""} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} rows={6} />
          </div>
          <Field
            label="Years"
            value={edit.years_experience != null ? String(edit.years_experience) : ""}
            onChange={(v) => setEdit({ ...edit, years_experience: v ? Number(v) : null })}
          />
          <Field
            label="Languages"
            value={edit.languages_spoken}
            onChange={(v) => setEdit({ ...edit, languages_spoken: v })}
          />
          <div className="md:col-span-2">
            <Field label="Education" value={edit.education} onChange={(v) => setEdit({ ...edit, education: v })} />
          </div>
          <div>
            <Label>Status</Label>
            <select
              className="h-11 w-full rounded-[10px] border border-line bg-paper px-3"
              value={edit.status ?? "active"}
              onChange={(e) => setEdit({ ...edit, status: e.target.value as Doctor["status"] })}
            >
              <option value="active">active</option>
              <option value="on_leave">on_leave</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(edit.autolocate)}
              onChange={(e) => setEdit({ ...edit, autolocate: e.target.checked })}
            />
            Autolocate from address on save
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                setError(null);
                const result = await saveDoctor({
                  data: {
                    id: edit.id,
                    name: edit.name ?? "",
                    specialty: edit.specialty ?? "",
                    city: edit.city ?? "",
                    address_line: edit.address_line ?? "",
                    latitude: null,
                    longitude: null,
                    phone: edit.phone ?? "",
                    whatsapp_number: edit.whatsapp_number ?? "",
                    photo_url: edit.photo_url ?? "",
                    bio: edit.bio ?? "",
                    years_experience: edit.years_experience ?? null,
                    languages_spoken: edit.languages_spoken ?? "",
                    education: edit.education ?? "",
                    status: (edit.status as Doctor["status"]) ?? "active",
                    autolocate: true,
                  },
                });
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                setEdit({
                  ...edit,
                  id: result.id,
                  latitude: result.latitude,
                  longitude: result.longitude,
                  autolocate: false,
                });
                await reload();
              }}
            >
              Autolocate from address
            </Button>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
      <ul className="mt-6 divide-y divide-line rounded-[20px] border border-line bg-paper">
        {rows.map((d) => (
          <li key={d.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-xs text-muted">
                {d.specialty} · {d.city} · {d.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setEdit({ ...d, autolocate: false })}>
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={async () => {
                  await deleteDoctor({ data: { id: d.id } });
                  await reload();
                }}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
