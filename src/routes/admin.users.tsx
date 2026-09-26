import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { listStaff, saveStaff } from "@/lib/server/admin";
import type { Staff, StaffRole } from "@/lib/types";

export const Route = createFileRoute("/admin/users")({ component: Page });

function Page() {
  const [rows, setRows] = useState<Staff[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("editor");

  async function reload() {
    setRows(await listStaff());
  }
  useEffect(() => {
    void reload();
  }, []);

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
        {rows.map((u) => (
          <li key={u.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-muted">
                {u.email} · {u.role} · {u.active ? "active" : "inactive"}
              </p>
            </div>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
