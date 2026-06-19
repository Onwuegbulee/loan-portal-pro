import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { api } from "@/lib/api";
import type { LoanApplication } from "@/lib/loan-types";

export const Route = createFileRoute("/admin/applications/$id")({
  component: ApplicationDetail,
});

function ApplicationDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [app, setApp] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getApplication(id).then((a) => { setApp(a); setLoading(false); });
  }, [id]);

  if (loading) return <div className="mx-auto max-w-5xl px-6 py-16 text-center text-muted-foreground">Loading…</div>;
  if (!app) return (
    <div className="mx-auto max-w-5xl px-6 py-16 text-center">
      <p className="text-muted-foreground">Application not found.</p>
      <Link to="/admin/applications" className="mt-4 inline-block text-primary hover:underline">Back to list</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <button onClick={() => nav({ to: "/admin/applications" })}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to applications
      </button>

      {/* Header card */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="bg-primary px-6 py-6 text-primary-foreground sm:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {app.passportPhoto ? (
                <img src={app.passportPhoto} alt="Passport"
                  className="h-20 w-20 shrink-0 rounded-lg object-cover ring-2 ring-white/30" />
              ) : (
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-white/10 text-2xl font-bold">
                  {app.firstName?.[0]}{app.lastName?.[0]}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold">{app.firstName} {app.middleName} {app.lastName}</h1>
                <div className="mt-1 text-sm text-white/70">{app.email} · {app.phone}</div>
                <div className="mt-2 font-mono text-xs text-white/50">{app.id}</div>
              </div>
            </div>
            <StatusBadge status={app.status} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-border bg-muted/30 px-6 py-5 sm:grid-cols-4 sm:px-8">
          <Stat label="Loan amount" value={`$${Number(app.loanAmount || 0).toLocaleString()}`} />
          <Stat label="Term" value={`${app.loanTerm || "—"} months`} />
          <Stat label="Purpose" value={app.loanPurpose || "—"} />
          <Stat label="Submitted" value={new Date(app.createdAt).toLocaleDateString()} />
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <Section title="Personal Information">
            <DL items={[
              ["First name", app.firstName],
              ["Last name", app.lastName],
              ["Middle name", app.middleName],
              ["Date of birth", app.dateOfBirth],
              ["Gender", app.gender],
              ["Marital status", app.maritalStatus],
              ["Nationality", app.nationality],
              ["Phone", app.phone],
              ["Email", app.email],
              ["Address", app.address],
              ["City", app.city],
              ["State", app.state],
            ]} />
          </Section>

          <Section title="Employment Information">
            <DL items={[
              ["Employment status", app.employmentStatus],
              ["Monthly income", app.monthlyIncome ? `$${Number(app.monthlyIncome).toLocaleString()}` : ""],
              ["Employer", app.employerName],
              ["Job title", app.jobTitle],
              ["Years employed", app.yearsEmployed],
              ["Work address", app.workAddress],
            ]} />
          </Section>

          <Section title="Loan Information">
            <DL items={[
              ["Loan amount", `$${Number(app.loanAmount || 0).toLocaleString()}`],
              ["Term (months)", app.loanTerm],
              ["Purpose", app.loanPurpose],
              ["Source of repayment", app.repaymentSource],
            ]} />
          </Section>

          <Section title="Next of Kin">
            <DL items={[
              ["Full name", app.kinFullName],
              ["Relationship", app.kinRelationship],
              ["Phone", app.kinPhone],
              ["Address", app.kinAddress],
            ]} />
          </Section>

          <Section title="Bank Details">
            <DL items={[
              ["Bank", app.bankName],
              ["Account number", app.accountNumber],
              ["Account name", app.accountName],
              ["BVN / Tax ID", app.bvn],
            ]} />
          </Section>

          <Section title="Documents">
            <div className="grid gap-4 sm:grid-cols-2">
              <DocumentTile label="Passport photograph" url={app.passportPhoto} name={app.passportPhotoName} />
              <DocumentTile label="Government-issued ID" url={app.idDocument} name={app.idDocumentName} />
              <DocumentTile label="Proof of income" url={app.proofOfIncome} name={app.proofOfIncomeName} />
              <DocumentTile label="Proof of address" url={app.proofOfAddress} name={app.proofOfAddressName} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="border-l-4 border-[color:var(--gold)] pl-3 text-lg font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DL({ items }: { items: Array<[string, string | undefined]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-foreground">{v || <span className="text-muted-foreground">—</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

function DocumentTile({ label, url, name }: { label: string; url?: string; name?: string }) {
  if (!url) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <div className="font-medium">{label}</div>
        <div className="mt-1 text-xs">Not provided</div>
      </div>
    );
  }
  const isImg = url.startsWith("data:image") || /\.(png|jpe?g|webp|gif)$/i.test(url);
  const isPdf = url.startsWith("data:application/pdf") || /\.pdf$/i.test(url);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{label}</div>
          {name && <div className="truncate text-xs text-muted-foreground">{name}</div>}
        </div>
        <a href={url} download={name || label} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-muted">
          <Download className="h-3.5 w-3.5" /> Save
        </a>
      </div>
      <div className="grid place-items-center bg-muted/30 p-3">
        {isImg ? (
          <img src={url} alt={label} className="max-h-72 w-auto rounded object-contain" />
        ) : isPdf ? (
          <iframe src={url} title={label} className="h-72 w-full rounded bg-white" />
        ) : (
          <div className="flex h-32 w-full items-center justify-center gap-2 text-muted-foreground">
            <FileText className="h-5 w-5" /> File attached
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LoanApplication["status"] }) {
  const map: Record<LoanApplication["status"], string> = {
    pending: "bg-[color:var(--gold)]/20 text-[color:var(--gold)]",
    approved: "bg-[color:var(--success)]/20 text-[color:var(--success)]",
    rejected: "bg-destructive/20 text-destructive-foreground",
    review: "bg-white/20 text-white",
  };
  return <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${map[status]}`}>{status}</span>;
}