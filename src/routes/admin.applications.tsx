import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import { api } from "@/lib/api";
import type { LoanApplication } from "@/lib/loan-types";

export const Route = createFileRoute("/admin/applications")({
  component: ApplicationsList,
});

function ApplicationsList() {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => { api.listApplications().then(setApps).catch(() => {}); }, []);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      const t = q.toLowerCase();
      return [a.firstName, a.lastName, a.email, a.phone, a.id, a.loanPurpose]
        .some((v) => (v ?? "").toLowerCase().includes(t));
    });
  }, [apps, q, statusFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {apps.length} shown</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, phone, ID…"
            className="w-full rounded-md border border-input bg-card py-2.5 pl-10 pr-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-card px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="review">Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">Applicant</th>
                <th className="px-6 py-4 font-bold">Loan</th>
                <th className="px-6 py-4 font-bold">Purpose</th>
                <th className="px-6 py-4 font-bold">Submitted</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => (
                <tr key={a.id} className="transition hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-xs font-bold text-primary-foreground">
                        {a.firstName?.[0]}{a.lastName?.[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold">{a.firstName} {a.lastName}</div>
                        <div className="truncate text-xs text-muted-foreground">{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">${Number(a.loanAmount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{a.loanPurpose || "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link to="/admin/applications/$id" params={{ id: a.id }}
                      className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:scale-105 hover:shadow-glow">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">No applications match your filters.</td></tr>
              )}
            </tbody>
          </table>
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
  return <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${map[status]}`}>{status}</span>;
}