import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LogOut, Loader2, Lock, ShieldCheck } from "lucide-react";
import { api, clearAdminToken, getAdminToken } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Meridian Finance" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    setAuthed(!!getAdminToken());
    setReady(true);
  }, []);

  // If user lands deep without auth, send to /admin (login)
  useEffect(() => {
    if (ready && !authed && loc.pathname !== "/admin") {
      nav({ to: "/admin", replace: true });
    }
  }, [ready, authed, loc.pathname, nav]);

  function logout() {
    clearAdminToken();
    setAuthed(false);
    nav({ to: "/admin", replace: true });
  }

  if (!ready) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-brand font-extrabold text-primary-foreground shadow-glow">M</div>
            <div>
              <div className="text-sm font-extrabold leading-none">Meridian</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Admin Console</div>
            </div>
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("admin@loan.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await api.adminLogin(username, password);
      onSuccess();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden gradient-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur font-extrabold">M</div>
          <span className="text-lg font-extrabold">Meridian</span>
        </Link>
        <div className="relative">
          <h2 className="text-5xl font-extrabold leading-[1.05] tracking-tight">Admin Console</h2>
          <p className="mt-4 max-w-sm text-white/80">Review applications, verify documents, and decide — all in one beautifully secure dashboard.</p>
          <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" /> Restricted access · authorized personnel only
          </div>
        </div>
        <div className="relative text-xs text-white/50">© {new Date().getFullYear()} Meridian Finance</div>
      </div>

      <div className="grid place-items-center bg-background px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <Lock className="h-3 w-3" /> Admin login
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access the admin dashboard.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15" />
            </div>
          </div>

          {err && <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

          <button type="submit" disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.01] disabled:opacity-60">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Sign in"}
          </button>

          {api.isMock && (
            <div className="mt-5 rounded-xl border border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
              Demo credentials: <code className="font-mono">admin@loan.com</code> / <code className="font-mono">admin123</code>
            </div>
          )}

          <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
        </form>
      </div>
    </div>
  );
}
