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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand font-extrabold text-primary-foreground shadow-glow">M</div>
            <div>
              <div className="text-sm font-extrabold leading-none">Meridian</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Admin</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((l) => {
              const active = loc.pathname === l.to || (l.to !== "/admin" && loc.pathname.startsWith(l.to));
              return (
                <Link key={l.to} to={l.to}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                    active ? "gradient-brand text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  <l.icon className="h-4 w-4" /> {l.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}