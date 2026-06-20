import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import type { LoanApplication } from "@/lib/loan-types";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  useEffect(() => { api.listApplications().then(setApps).catch(() => {}); }, []);

  const stats = [
    { label: "Total applications", value: apps.length, icon: FileText, color: "text-primary" },
    { label: "Pending review", value: apps.filter(a => a.status === "pending").length, icon: Clock, color: "text-[color:var(--gold)]" },
    { label: "Approved", value: apps.filter(a => a.status === "approved").length, icon: CheckCircle2, color: "text-[color:var(--success)]" },
    { label: "Rejected", value: apps.filter(a => a.status === "rejected").length, icon: XCircle, color: "text-destructive" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Greeting */}
      <div className="overflow-hidden rounded-3xl gradient-hero p-8 text-primary-foreground shadow-elegant sm:p-10">
        <div className="grid gap-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Live overview
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome back, Admin</h1>
            <p className="mt-2 text-white/80">{apps.length} application{apps.length === 1 ? "" : "s"} in your pipeline today.</p>
          </div>
          <Link to="/admin/applications" className="inline-flex items-center gap-2 self-start rounded-2xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-glow transition hover:scale-[1.02]">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-elegant">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-primary/5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-4xl font-extrabold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-bold">Recent applications</h2>
          <Link to="/admin/applications" className="text-sm font-semibold text-primary hover:underline">See all →</Link>
        </div>
        <div className="divide-y divide-border">
          {apps.slice(0, 5).map((a) => (
            <Link key={a.id} to="/admin/applications/$id" params={{ id: a.id }}
              className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-muted/40">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground font-bold text-sm">
                  {a.firstName?.[0]}{a.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{a.firstName} {a.lastName}</div>
                  <div className="truncate text-xs text-muted-foreground">{a.email} · ${Number(a.loanAmount || 0).toLocaleString()}</div>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </Link>
          ))}
          {apps.length === 0 && (
            <div className="px-6 py-16 text-center text-sm text-muted-foreground">No applications yet. Once customers apply, they'll show up here.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LoanApplication["status"] }) {
  const map: Record<LoanApplication["status"], string> = {
    pending: "bg-amber-500/15 text-amber-600",
    approved: "bg-accent/15 text-accent",
    rejected: "bg-destructive/15 text-destructive",
    review: "bg-primary/10 text-primary",
  };
  return <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${map[status]}`}>{status}</span>;
}