import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import { clearAdminToken, getAdminToken } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!getAdminToken()) nav({ to: "/admin/login" });
  }, [nav]);

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/applications", label: "Applications", icon: FileText },
  ] as const;

  function logout() {
    clearAdminToken();
    nav({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-[color:var(--gold)] text-primary font-bold">M</div>
            <span className="font-semibold">Meridian Admin</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((l) => {
              const active = loc.pathname === l.to || (l.to !== "/admin" && loc.pathname.startsWith(l.to));
              return (
                <Link key={l.to} to={l.to}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}>
                  <l.icon className="h-4 w-4" /> {l.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}