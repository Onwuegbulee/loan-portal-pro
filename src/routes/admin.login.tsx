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
      <div className="relative hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--gold)] text-primary font-bold">M</div>
          <span className="text-lg font-bold">Meridian Finance</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Admin Console</h2>
          <p className="mt-3 max-w-sm text-white/70">Review applications, verify documents, and manage decisions in one secure dashboard.</p>
        </div>
        <div className="text-xs text-white/50">© {new Date().getFullYear()} Meridian Finance</div>
      </div>

      <div className="grid place-items-center bg-background px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to access the admin dashboard.</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {err && <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

          <button type="submit" disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Sign in"}
          </button>

          {api.isMock && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo credentials prefilled. Connect a backend via <code className="rounded bg-muted px-1">VITE_API_BASE_URL</code>.
            </p>
          )}

          <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
        </form>
      </div>
    </div>
  );
}