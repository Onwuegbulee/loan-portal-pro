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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of all loan applications</p>
        </div>
        <Link to="/admin/applications" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div className="mt-3 text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Recent applications</h2>
          <Link to="/admin/applications" className="text-sm text-primary hover:underline">See all</Link>
        </div>
        <div className="divide-y divide-border">
          {apps.slice(0, 5).map((a) => (
            <Link key={a.id} to="/admin/applications/$id" params={{ id: a.id }}
              className="flex items-center justify-between px-5 py-4 hover:bg-muted/40">
              <div className="min-w-0">
                <div className="truncate font-medium">{a.firstName} {a.lastName}</div>
                <div className="truncate text-xs text-muted-foreground">{a.email} · ${Number(a.loanAmount || 0).toLocaleString()}</div>
              </div>
              <StatusBadge status={a.status} />
            </Link>
          ))}
          {apps.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">No applications yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LoanApplication["status"] }) {
  const map: Record<LoanApplication["status"], string> = {
    pending: "bg-[color:var(--gold)]/15 text-[color:var(--gold)]",
    approved: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    rejected: "bg-destructive/15 text-destructive",
    review: "bg-primary/10 text-primary",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${map[status]}`}>{status}</span>;
}