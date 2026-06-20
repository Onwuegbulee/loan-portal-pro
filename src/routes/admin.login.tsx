import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Meridian Finance" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@loan.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await api.adminLogin(email, password);
      nav({ to: "/admin/applications" });
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
          <div className="mt-10 grid grid-cols-3 gap-3 text-left">
            {[{k:"500M+",v:"Approved"},{k:"50K+",v:"Customers"},{k:"24h",v:"Avg decision"}].map(s => (
              <div key={s.k} className="glass-dark rounded-2xl p-3">
                <div className="text-2xl font-extrabold">{s.k}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-white/50">© {new Date().getFullYear()} Meridian Finance</div>
      </div>

      <div className="grid place-items-center bg-background px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access the admin dashboard.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
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
              Demo credentials prefilled. Connect a backend via <code className="rounded bg-card px-1 font-mono">VITE_API_BASE_URL</code>.
            </div>
          )}

          <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
        </form>
      </div>
    </div>
  );
}