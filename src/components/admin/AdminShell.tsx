import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getDashboard, getStaffMe } from "@/lib/server/admin";
import { BrandMark } from "@/components/site/BrandMark";
import { useEffect, useState } from "react";
import type { Staff } from "@/lib/types";
import { cn } from "@/lib/utils";

const links: { to: string; label: string; roles?: string[] }[] = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/inbox", label: "Inbox" },
  { to: "/admin/doctors", label: "Doctors" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/pages", label: "Pages" },
  { to: "/admin/videos", label: "Videos" },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/perks", label: "Benefits" },
  { to: "/admin/care", label: "360° care" },
  { to: "/admin/plans", label: "Programs" },
  { to: "/admin/faqs", label: "FAQs" },
  { to: "/admin/steps", label: "Transition" },
  { to: "/admin/settings", label: "Settings", roles: ["super_admin", "admin"] },
  { to: "/admin/users", label: "Users", roles: ["super_admin"] },
  { to: "/admin/activity", label: "Activity" },
];

export function AdminGate() {
  const { user, isPending } = useCurrentUserState();
  const [staff, setStaff] = useState<Staff | null | "loading">("loading");

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setStaff(null);
      return;
    }
    getStaffMe()
      .then(setStaff)
      .catch(() => setStaff(null));
  }, [user, isPending]);

  if (isPending || staff === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center bg-navy-deep text-paper">
        <p className="text-sm text-paper/70">Opening the desk…</p>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (!staff) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas px-4">
        <div className="max-w-md rounded-[24px] border border-line bg-paper p-8">
          <h1 className="font-display text-2xl">No desk access</h1>
          <p className="mt-2 text-sm text-ink-soft">
            This account is signed in but has not been invited as staff. Ask a super admin to add your email.
          </p>
          <Link to="/" className="mt-4 inline-block text-navy underline">
            Back to the site
          </Link>
        </div>
      </div>
    );
  }

  return <AdminChrome staff={staff} />;
}

function AdminChrome({ staff }: { staff: Staff }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    void getDashboard()
      .then((d) => setUnread(d.unread))
      .catch(() => setUnread(0));
  }, [pathname]);
  return (
    <div className="min-h-dvh bg-canvas text-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-navy text-paper lg:min-h-dvh lg:border-b-0 lg:border-r lg:border-navy-deep">
        <div className="flex items-center gap-2 px-4 py-4">
          <BrandMark className="size-9" onPaper />
          <div>
            <p className="font-display text-lg leading-none">ROSKYRO</p>
            <p className="text-[11px] text-paper/60">Staff desk</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible">
          {links
            .filter((l) => !l.roles || l.roles.includes(staff.role))
            .map((l) => (
              <Link
                key={l.to}
                to={l.to as never}
                className={cn(
                  "flex items-center justify-between gap-2 whitespace-nowrap rounded-[10px] px-3 py-2 text-sm text-paper/80 hover:bg-navy-deep",
                  pathname === l.to && "bg-navy-deep text-paper",
                )}
              >
                <span>{l.label}</span>
                {l.to === "/admin/inbox" && unread > 0 ? (
                  <span className="rounded-full bg-copper px-1.5 py-0.5 text-[10px] font-medium text-paper">
                    {unread}
                  </span>
                ) : null}
              </Link>
            ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
          <p className="text-sm text-muted">
            {staff.name} · {staff.role.replaceAll("_", " ")}
          </p>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-navy">
              View site
            </Link>
            <UserButton />
          </div>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
