import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getStaffMe, listStaff, saveStaff } from "@/lib/server/admin";
import type { Staff, StaffRole } from "@/lib/types";

export const Route = createFileRoute("/admin/users")({ component: Page });

function Page() {
  const [rows, setRows] = useState<Staff[]>([]);
  const [me, setMe] = useState<Staff | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("editor");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  async function reload() {
    const [staffRows, myself] = await Promise.all([listStaff(), getStaffMe()]);
    setRows(staffRows);
    setMe(myself);
  }
  useEffect(() => {
    void reload();
  }, []);

  function startEdit(u: Staff) {
    setEditingId(u.id);
    setEditName(u.name);
    setEditEmail(u.email);
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Users</h1>
      <p className="mt-2 text-sm text-muted">
        Invite by email. They sign in with that address (Google, X, or email) and inherit this role.
      </p>
      <form
        className="mt-6 grid gap-3 rounded-[20px] border border-line bg-paper p-5 sm:grid-cols-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await saveStaff({ data: { name, email, role, active: true } });
          setName("");
          setEmail("");
          await reload();
        }}
      >
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Role</Label>
          <select
            className="h-11 w-full rounded-[10px] border border-line bg-paper px-3"
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
          >
            <option value="editor">editor</option>
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit">Invite</Button>
        </div>
      </form>
      <ul className="mt-6 divide-y divide-line rounded-[20px] border border-line bg-paper">
        {rows.map((u) => {
          const isSuperAdmin = u.role === "super_admin";
          const isSelf = me?.id === u.id;

          if (isSuperAdmin && isSelf && editingId === u.id) {
            return (
              <li key={u.id} className="flex flex-wrap items-end gap-3 px-4 py-3">
                <div>
                  <Label>Name</Label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={async () => {
                    // Role/active are sent unchanged — the server also
                    // enforces this, but we mirror it here so this can
                    // never accidentally submit a role/status change.
                    await saveStaff({
                      data: { id: u.id, name: editName, email: editEmail, role: u.role, active: u.active },
                    });
                    setEditingId(null);
                    await reload();
                  }}
                >
                  Save
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </li>
            );
          }

          return (
            <li key={u.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-muted">
                  {u.email} · {u.role} · {u.active ? "active" : "inactive"}
                </p>
              </div>
              {isSuperAdmin ? (
                isSelf ? (
                  <Button type="button" size="sm" variant="outline" onClick={() => startEdit(u)}>
                    Edit my name/email
                  </Button>
                ) : (
                  <span
                    className="text-xs text-muted"
                    title="Super admins are locked — their role and status can't be changed from this panel."
                  >
                    🔒 locked
                  </span>
                )
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await saveStaff({
                      data: { id: u.id, name: u.name, email: u.email, role: u.role, active: !u.active },
                    });
                    await reload();
                  }}
                >
                  {u.active ? "Deactivate" : "Activate"}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
