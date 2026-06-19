import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Upload, X } from "lucide-react";
import { api } from "@/lib/api";
import type { LoanApplicationDraft } from "@/lib/loan-types";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a Loan — Meridian Finance" },
      { name: "description", content: "Complete your loan application in a few simple steps." },
    ],
  }),
  component: ApplyPage,
});

const STEPS = [
  { id: 1, title: "Personal Information", short: "Personal" },
  { id: 2, title: "Employment Information", short: "Employment" },
  { id: 3, title: "Loan Information", short: "Loan" },
  { id: 4, title: "Next of Kin Information", short: "Next of Kin" },
  { id: 5, title: "Bank Details", short: "Bank" },
  { id: 6, title: "Documents", short: "Documents" },
] as const;

const emptyDraft: LoanApplicationDraft = {
  firstName: "", lastName: "", middleName: "", email: "", phone: "",
  dateOfBirth: "", gender: "", maritalStatus: "", address: "", city: "",
  state: "", nationality: "",
  employmentStatus: "", employerName: "", jobTitle: "", monthlyIncome: "",
  workAddress: "", yearsEmployed: "",
  loanAmount: "", loanPurpose: "", loanTerm: "", repaymentSource: "",
  kinFullName: "", kinRelationship: "", kinPhone: "", kinAddress: "",
  bankName: "", accountNumber: "", accountName: "", bvn: "",
};

type FileSlot = "passportPhoto" | "idDocument" | "proofOfIncome" | "proofOfAddress";

function ApplyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<LoanApplicationDraft>(emptyDraft);
  const [files, setFiles] = useState<Record<FileSlot, File | null>>({
    passportPhoto: null, idDocument: null, proofOfIncome: null, proofOfAddress: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof LoanApplicationDraft) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    const req = (k: keyof LoanApplicationDraft, msg = "Required") => {
      if (!String(form[k] ?? "").trim()) e[k] = msg;
    };
    if (s === 1) {
      req("firstName"); req("lastName"); req("email"); req("phone");
      req("dateOfBirth"); req("gender"); req("address"); req("city");
      req("state"); req("nationality");
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
      if (form.phone && form.phone.replace(/\D/g, "").length < 7) e.phone = "Invalid phone";
    }
    if (s === 2) {
      req("employmentStatus"); req("monthlyIncome");
      if (form.employmentStatus === "employed" || form.employmentStatus === "self-employed") {
        req("employerName"); req("jobTitle");
      }
    }
    if (s === 3) {
      req("loanAmount"); req("loanPurpose"); req("loanTerm"); req("repaymentSource");
      if (form.loanAmount && Number(form.loanAmount) <= 0) e.loanAmount = "Enter a valid amount";
    }
    if (s === 4) {
      req("kinFullName"); req("kinRelationship"); req("kinPhone"); req("kinAddress");
    }
    if (s === 5) {
      req("bankName"); req("accountNumber"); req("accountName");
    }
    if (s === 6) {
      if (!files.passportPhoto) e.passportPhoto = "Passport photograph is required";
      if (!files.idDocument) e.idDocument = "Government ID is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep(6)) return;
    setServerError(null);
    setSubmitting(true);
    try {
      const { id } = await api.submitApplication({ fields: form, files });
      navigate({ to: "/success", search: { id } });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(6, s + 1));
  }
  function prev() { setStep((s) => Math.max(1, s - 1)); }

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">M</div>
            <span className="text-lg font-bold tracking-tight">Meridian Finance</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Cancel</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar steps */}
          <aside>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Loan Application</h2>
              <p className="mt-1 text-sm text-foreground">Step {step} of {STEPS.length}</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-[color:var(--gold)] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <ol className="mt-6 space-y-3">
                {STEPS.map((s) => {
                  const done = s.id < step;
                  const active = s.id === step;
                  return (
                    <li key={s.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                        done ? "bg-[color:var(--success)] text-white"
                          : active ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* Form panel */}
          <main>
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{STEPS[step - 1].title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">All fields marked * are required.</p>

              <div className="mt-8 space-y-5">
                {step === 1 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First name *" error={errors.firstName}><Input value={form.firstName} onChange={set("firstName")} /></Field>
                    <Field label="Last name *" error={errors.lastName}><Input value={form.lastName} onChange={set("lastName")} /></Field>
                    <Field label="Middle name" error={errors.middleName}><Input value={form.middleName ?? ""} onChange={set("middleName")} /></Field>
                    <Field label="Email *" error={errors.email}><Input type="email" value={form.email} onChange={set("email")} /></Field>
                    <Field label="Phone *" error={errors.phone}><Input value={form.phone} onChange={set("phone")} /></Field>
                    <Field label="Date of birth *" error={errors.dateOfBirth}><Input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} /></Field>
                    <Field label="Gender *" error={errors.gender}>
                      <Select value={form.gender} onChange={set("gender")} options={["Male","Female","Other","Prefer not to say"]} />
                    </Field>
                    <Field label="Marital status" error={errors.maritalStatus}>
                      <Select value={form.maritalStatus} onChange={set("maritalStatus")} options={["Single","Married","Divorced","Widowed"]} />
                    </Field>
                    <Field label="Residential address *" error={errors.address} full><Input value={form.address} onChange={set("address")} /></Field>
                    <Field label="City *" error={errors.city}><Input value={form.city} onChange={set("city")} /></Field>
                    <Field label="State / Region *" error={errors.state}><Input value={form.state} onChange={set("state")} /></Field>
                    <Field label="Nationality *" error={errors.nationality}><Input value={form.nationality} onChange={set("nationality")} /></Field>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Employment status *" error={errors.employmentStatus}>
                      <Select value={form.employmentStatus} onChange={set("employmentStatus")}
                        options={["employed","self-employed","unemployed","student","retired"]} />
                    </Field>
                    <Field label="Monthly income *" error={errors.monthlyIncome}><Input type="number" value={form.monthlyIncome} onChange={set("monthlyIncome")} prefix="$" /></Field>
                    <Field label="Employer name" error={errors.employerName}><Input value={form.employerName} onChange={set("employerName")} /></Field>
                    <Field label="Job title" error={errors.jobTitle}><Input value={form.jobTitle} onChange={set("jobTitle")} /></Field>
                    <Field label="Years employed" error={errors.yearsEmployed}><Input type="number" value={form.yearsEmployed} onChange={set("yearsEmployed")} /></Field>
                    <Field label="Work address" error={errors.workAddress} full><Input value={form.workAddress} onChange={set("workAddress")} /></Field>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Loan amount *" error={errors.loanAmount}><Input type="number" value={form.loanAmount} onChange={set("loanAmount")} prefix="$" /></Field>
                    <Field label="Loan term (months) *" error={errors.loanTerm}>
                      <Select value={form.loanTerm} onChange={set("loanTerm")} options={["6","12","18","24","36","48","60"]} />
                    </Field>
                    <Field label="Loan purpose *" error={errors.loanPurpose} full>
                      <Select value={form.loanPurpose} onChange={set("loanPurpose")}
                        options={["Personal","Business","Education","Medical","Home Improvement","Debt Consolidation","Other"]} />
                    </Field>
                    <Field label="Source of repayment *" error={errors.repaymentSource} full>
                      <Textarea value={form.repaymentSource} onChange={set("repaymentSource")} placeholder="e.g. Monthly salary from XYZ Ltd" />
                    </Field>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name *" error={errors.kinFullName}><Input value={form.kinFullName} onChange={set("kinFullName")} /></Field>
                    <Field label="Relationship *" error={errors.kinRelationship}>
                      <Select value={form.kinRelationship} onChange={set("kinRelationship")} options={["Spouse","Parent","Sibling","Child","Friend","Other"]} />
                    </Field>
                    <Field label="Phone *" error={errors.kinPhone}><Input value={form.kinPhone} onChange={set("kinPhone")} /></Field>
                    <Field label="Address *" error={errors.kinAddress} full><Input value={form.kinAddress} onChange={set("kinAddress")} /></Field>
                  </div>
                )}

                {step === 5 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Bank name *" error={errors.bankName}><Input value={form.bankName} onChange={set("bankName")} /></Field>
                    <Field label="Account number *" error={errors.accountNumber}><Input value={form.accountNumber} onChange={set("accountNumber")} /></Field>
                    <Field label="Account name *" error={errors.accountName} full><Input value={form.accountName} onChange={set("accountName")} /></Field>
                    <Field label="BVN / Tax ID" error={errors.bvn} full><Input value={form.bvn} onChange={set("bvn")} /></Field>
                  </div>
                )}

                {step === 6 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FileField label="Passport photograph *" accept="image/*"
                      file={files.passportPhoto} error={errors.passportPhoto}
                      onChange={(f) => setFiles((p) => ({ ...p, passportPhoto: f }))} />
                    <FileField label="Government-issued ID *"
                      file={files.idDocument} error={errors.idDocument}
                      onChange={(f) => setFiles((p) => ({ ...p, idDocument: f }))} />
                    <FileField label="Proof of income"
                      file={files.proofOfIncome} error={errors.proofOfIncome}
                      onChange={(f) => setFiles((p) => ({ ...p, proofOfIncome: f }))} />
                    <FileField label="Proof of address"
                      file={files.proofOfAddress} error={errors.proofOfAddress}
                      onChange={(f) => setFiles((p) => ({ ...p, proofOfAddress: f }))} />
                  </div>
                )}
              </div>

              {serverError && (
                <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={prev} disabled={step === 1 || submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-40">
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                {step < 6 ? (
                  <button onClick={next}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--gold)] px-6 py-2.5 text-sm font-semibold text-primary transition hover:brightness-110 disabled:opacity-60">
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit application <Check className="h-4 w-4" /></>}
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ---- Field primitives ----
function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Input({ value, onChange, type = "text", prefix }: {
  value: string; onChange: (v: string) => void; type?: string; prefix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-sm text-muted-foreground">{prefix}</span>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border border-input bg-background py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${prefix ? "pl-7 pr-3" : "px-3"}`} />
    </div>
  );
}

function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
      <option value="">Select…</option>
      {options.map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
    </select>
  );
}

function FileField({ label, file, onChange, error, accept }: {
  label: string; file: File | null; onChange: (f: File | null) => void; error?: string; accept?: string;
}) {
  const isImage = file && file.type.startsWith("image/");
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {!file ? (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input bg-background px-4 py-8 text-center transition hover:border-primary/50 hover:bg-muted/50">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Click to upload</span>
          <span className="text-xs text-muted-foreground">PNG, JPG or PDF up to 10MB</span>
          <input type="file" accept={accept ?? "image/*,application/pdf"} className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-md border border-input bg-background p-3">
          {isImage ? (
            <img src={URL.createObjectURL(file)} alt="preview" className="h-14 w-14 rounded object-cover" />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded bg-muted text-xs font-semibold text-muted-foreground">PDF</div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{file.name}</div>
            <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
          </div>
          <button type="button" onClick={() => onChange(null)}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}