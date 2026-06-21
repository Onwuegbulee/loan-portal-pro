import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, Check, Loader2, Upload, X,
  User, Briefcase, Wallet, Users, Building2, FileText, Camera, Image as ImageIcon, RefreshCw,
  ShieldCheck, Sparkles, TrendingUp, Lock,
} from "lucide-react";
import { api } from "@/lib/api";
import type { LoanApplicationDraft } from "@/lib/loan-types";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a Loan — Meridian" },
      { name: "description", content: "Complete your loan application in 5 minutes." },
    ],
  }),
  component: ApplyPage,
});

const STEPS = [
  { id: 1, title: "Passport Photograph", icon: Camera, subtitle: "Take or upload your photo" },
  { id: 2, title: "Personal Information", icon: User, subtitle: "Let's get to know you" },
  { id: 3, title: "Employment Details", icon: Briefcase, subtitle: "Where you work" },
  { id: 4, title: "Loan Information", icon: Wallet, subtitle: "Tell us what you need" },
  { id: 5, title: "Next of Kin", icon: Users, subtitle: "Emergency contact" },
  { id: 6, title: "Bank Details", icon: Building2, subtitle: "Where to send funds" },
  { id: 7, title: "Supporting Documents", icon: FileText, subtitle: "Verify your identity" },
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
      if (!files.passportPhoto) e.passportPhoto = "Passport photograph is required to continue";
    }
    if (s === 2) {
      req("firstName"); req("lastName"); req("email"); req("phone");
      req("dateOfBirth"); req("gender"); req("address"); req("city");
      req("state"); req("nationality");
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
      if (form.phone && form.phone.replace(/\D/g, "").length < 7) e.phone = "Invalid phone";
    }
    if (s === 3) {
      req("employmentStatus"); req("monthlyIncome");
      if (form.employmentStatus === "employed" || form.employmentStatus === "self-employed") {
        req("employerName"); req("jobTitle");
      }
    }
    if (s === 4) {
      req("loanAmount"); req("loanPurpose"); req("loanTerm"); req("repaymentSource");
      if (form.loanAmount && Number(form.loanAmount) <= 0) e.loanAmount = "Enter a valid amount";
    }
    if (s === 5) { req("kinFullName"); req("kinRelationship"); req("kinPhone"); req("kinAddress"); }
    if (s === 6) { req("bankName"); req("accountNumber"); req("accountName"); }
    if (s === 7) {
      if (!files.idDocument) e.idDocument = "Government ID is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep(7)) return;
    if (!files.passportPhoto) { setStep(1); setErrors({ passportPhoto: "Passport photograph is required" }); return; }
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

  function next() { if (validateStep(step)) setStep((s) => Math.min(STEPS.length, s + 1)); }
  function prev() { setStep((s) => Math.max(1, s - 1)); }

  const progress = (step / STEPS.length) * 100;
  const eligibility = useMemo(() => computeEligibility(form), [form]);
  const monthly = useMemo(() => estimateMonthly(form.loanAmount, form.loanTerm), [form.loanAmount, form.loanTerm]);
  const CurrentIcon = STEPS[step - 1].icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="pointer-events-none fixed -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none fixed top-1/2 -left-32 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand font-extrabold text-primary-foreground shadow-glow">M</div>
            <div>
              <div className="text-sm font-extrabold leading-none">Meridian</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Application</div>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden items-center gap-1.5 sm:inline-flex"><Lock className="h-3.5 w-3.5 text-accent" /> Secure session</span>
            <Link to="/" className="rounded-xl border border-border bg-card px-3 py-1.5 font-semibold text-foreground hover:bg-muted">Cancel</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)_280px]">
          {/* Sidebar timeline */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-3xl p-6 shadow-elegant">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Progress</div>
                  <div className="mt-1 text-sm font-bold">Step {step} of {STEPS.length}</div>
                </div>
                <ProgressRing percent={progress} />
              </div>

              <ol className="relative mt-8 space-y-1">
                <div className="pointer-events-none absolute left-[19px] top-2 bottom-2 w-px bg-border" aria-hidden />
                {STEPS.map((s) => {
                  const done = s.id < step;
                  const active = s.id === step;
                  const Icon = s.icon;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => done && setStep(s.id)}
                        disabled={!done && !active}
                        className={`group relative flex w-full items-start gap-3 rounded-2xl p-2 text-left transition ${
                          active ? "bg-primary/5" : done ? "hover:bg-muted/60 cursor-pointer" : ""
                        }`}
                      >
                        <div className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 transition ${
                          done ? "border-accent bg-accent text-white"
                            : active ? "border-primary gradient-brand text-primary-foreground shadow-glow"
                            : "border-border bg-card text-muted-foreground"
                        }`}>
                          {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 pt-1">
                          <div className={`text-sm font-bold ${active || done ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {done ? "Completed" : active ? s.subtitle : `Step ${s.id}`}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-accent" /> Auto-saved
              </div>
              <p className="mt-1.5 text-muted-foreground">Your progress is saved as you type.</p>
            </div>
          </aside>

          {/* Form panel */}
          <main>
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-elegant backdrop-blur-xl sm:p-10">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-glow">
                  <CurrentIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{STEPS[step - 1].subtitle}</div>
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{STEPS[step - 1].title}</h1>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                {step === 1 && (
                  <PassportStep
                    file={files.passportPhoto}
                    error={errors.passportPhoto}
                    onChange={(f) => setFiles((p) => ({ ...p, passportPhoto: f }))}
                  />
                )}

                {step === 2 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First name *" error={errors.firstName}><Input value={form.firstName} onChange={set("firstName")} /></Field>
                    <Field label="Last name *" error={errors.lastName}><Input value={form.lastName} onChange={set("lastName")} /></Field>
                    <Field label="Middle name"><Input value={form.middleName ?? ""} onChange={set("middleName")} /></Field>
                    <Field label="Email *" error={errors.email}><Input type="email" value={form.email} onChange={set("email")} /></Field>
                    <Field label="Phone *" error={errors.phone}><Input value={form.phone} onChange={set("phone")} /></Field>
                    <Field label="Date of birth *" error={errors.dateOfBirth}><Input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} /></Field>
                    <Field label="Gender *" error={errors.gender}>
                      <Select value={form.gender} onChange={set("gender")} options={["Male","Female","Other","Prefer not to say"]} />
                    </Field>
                    <Field label="Marital status">
                      <Select value={form.maritalStatus} onChange={set("maritalStatus")} options={["Single","Married","Divorced","Widowed"]} />
                    </Field>
                    <Field label="Residential address *" error={errors.address} full><Input value={form.address} onChange={set("address")} /></Field>
                    <Field label="City *" error={errors.city}><Input value={form.city} onChange={set("city")} /></Field>
                    <Field label="State / Region *" error={errors.state}><Input value={form.state} onChange={set("state")} /></Field>
                    <Field label="Nationality *" error={errors.nationality}><Input value={form.nationality} onChange={set("nationality")} /></Field>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Employment status *" error={errors.employmentStatus}>
                      <Select value={form.employmentStatus} onChange={set("employmentStatus")}
                        options={["employed","self-employed","unemployed","student","retired"]} />
                    </Field>
                    <Field label="Monthly income *" error={errors.monthlyIncome}><Input type="number" value={form.monthlyIncome} onChange={set("monthlyIncome")} prefix="$" /></Field>
                    <Field label="Employer name" error={errors.employerName}><Input value={form.employerName} onChange={set("employerName")} /></Field>
                    <Field label="Job title" error={errors.jobTitle}><Input value={form.jobTitle} onChange={set("jobTitle")} /></Field>
                    <Field label="Years employed"><Input type="number" value={form.yearsEmployed} onChange={set("yearsEmployed")} /></Field>
                    <Field label="Work address" full><Input value={form.workAddress} onChange={set("workAddress")} /></Field>
                  </div>
                )}

                {step === 4 && (
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

                {step === 5 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name *" error={errors.kinFullName}><Input value={form.kinFullName} onChange={set("kinFullName")} /></Field>
                    <Field label="Relationship *" error={errors.kinRelationship}>
                      <Select value={form.kinRelationship} onChange={set("kinRelationship")} options={["Spouse","Parent","Sibling","Child","Friend","Other"]} />
                    </Field>
                    <Field label="Phone *" error={errors.kinPhone}><Input value={form.kinPhone} onChange={set("kinPhone")} /></Field>
                    <Field label="Address *" error={errors.kinAddress} full><Input value={form.kinAddress} onChange={set("kinAddress")} /></Field>
                  </div>
                )}

                {step === 6 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Bank name *" error={errors.bankName}><Input value={form.bankName} onChange={set("bankName")} /></Field>
                    <Field label="Account number *" error={errors.accountNumber}><Input value={form.accountNumber} onChange={set("accountNumber")} /></Field>
                    <Field label="Account name *" error={errors.accountName} full><Input value={form.accountName} onChange={set("accountName")} /></Field>
                    <Field label="BVN / Tax ID" full><Input value={form.bvn} onChange={set("bvn")} /></Field>
                  </div>
                )}

                {step === 7 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FileField label="Government-issued ID *"
                      file={files.idDocument} error={errors.idDocument}
                      onChange={(f) => setFiles((p) => ({ ...p, idDocument: f }))} />
                    <FileField label="Proof of income"
                      file={files.proofOfIncome}
                      onChange={(f) => setFiles((p) => ({ ...p, proofOfIncome: f }))} />
                    <FileField label="Proof of address" 
                      file={files.proofOfAddress}
                      onChange={(f) => setFiles((p) => ({ ...p, proofOfAddress: f }))} />
                  </div>
                )}
              </div>

              {serverError && (
                <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{serverError}</div>
              )}

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={prev} disabled={step === 1 || submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition hover:bg-muted disabled:opacity-40">
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                {step < STEPS.length ? (
                  <button onClick={next}
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl gradient-brand px-7 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02]">
                    Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-7 py-3 text-sm font-bold text-accent-foreground shadow-glow transition hover:scale-[1.02] disabled:opacity-60">
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit application <Check className="h-4 w-4" /></>}
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* Dashboard right rail */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl gradient-hero p-5 text-primary-foreground shadow-elegant">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Eligibility</span>
                <Sparkles className="h-4 w-4 text-white/80" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{eligibility.score}</span>
                <span className="text-sm text-white/70">/ 100</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${eligibility.score}%` }} />
              </div>
              <p className="mt-3 text-xs text-white/80">{eligibility.label}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Est. monthly</span>
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold gradient-text">${monthly.payment.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">/ mo</span>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <KV label="Loan amount" value={form.loanAmount ? `$${Number(form.loanAmount).toLocaleString()}` : "—"} />
                <KV label="Term" value={form.loanTerm ? `${form.loanTerm} mo` : "—"} />
                <KV label="APR (est.)" value={`${monthly.apr}%`} />
                <KV label="Total payable" value={form.loanAmount && form.loanTerm ? `$${(monthly.payment * Number(form.loanTerm)).toLocaleString()}` : "—"} last />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="h-4 w-4 text-accent" /> Trust & safety
              </div>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> 256-bit bank-grade SSL</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> CBN regulated lender</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> Never sold to third parties</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Primitives ----------------- */

function ProgressRing({ percent }: { percent: number }) {
  const r = 22, c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative h-14 w-14">
      <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
        <circle cx="28" cy="28" r={r} stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
        <circle cx="28" cy="28" r={r} stroke="url(#ringGrad)" strokeWidth="4" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[11px] font-extrabold">{Math.round(percent)}%</div>
    </div>
  );
}

function KV({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${last ? "" : "border-b border-border pb-2"}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}

function computeEligibility(f: LoanApplicationDraft) {
  let score = 35;
  if (f.firstName && f.lastName) score += 8;
  if (f.email && /^\S+@\S+\.\S+$/.test(f.email)) score += 5;
  if (f.phone && f.phone.length > 7) score += 5;
  if (f.address && f.city) score += 7;
  if (f.employmentStatus === "employed" || f.employmentStatus === "self-employed") score += 12;
  if (Number(f.monthlyIncome) > 0) score += 10;
  if (f.bankName && f.accountNumber) score += 10;
  if (f.kinFullName) score += 4;
  if (Number(f.loanAmount) > 0 && Number(f.monthlyIncome) > 0) {
    const ratio = Number(f.loanAmount) / (Number(f.monthlyIncome) * 12);
    if (ratio < 1) score += 4;
  }
  score = Math.min(98, score);
  const label = score >= 80 ? "Excellent — high approval likelihood"
    : score >= 60 ? "Good — likely to qualify"
    : score >= 40 ? "Fair — keep going to improve"
    : "Just getting started";
  return { score, label };
}

function estimateMonthly(amount: string, term: string) {
  const P = Number(amount) || 0;
  const n = Number(term) || 12;
  const apr = 12.5;
  const r = apr / 100 / 12;
  const payment = P > 0 && n > 0 ? Math.round((P * r) / (1 - Math.pow(1 + r, -n))) : 0;
  return { payment, apr };
}

function Field({ label, error, full, children }: { label: string; error?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}

function Input({ value, onChange, type = "text", prefix }: {
  value: string; onChange: (v: string) => void; type?: string; prefix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="pointer-events-none absolute left-3.5 text-sm font-bold text-muted-foreground">{prefix}</span>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-input bg-background py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 ${prefix ? "pl-8 pr-3.5" : "px-3.5"}`} />
    </div>
  );
}

function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
      className="w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15" />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15">
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
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      {!file ? (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-gradient-to-b from-background to-muted/40 px-4 py-10 text-center transition hover:border-primary hover:bg-primary/5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-glow">
            <Upload className="h-5 w-5" />
          </div>
          <span className="mt-2 text-sm font-bold">Drop file or click to upload</span>
          <span className="text-xs text-muted-foreground">PNG, JPG or PDF up to 10MB</span>
          <input type="file" accept={accept ?? "image/*,application/pdf"} className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-3">
          {isImage ? (
            <img src={URL.createObjectURL(file)} alt="preview" className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-xl gradient-brand text-xs font-bold text-primary-foreground">PDF</div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">{file.name}</div>
            <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · Uploaded</div>
          </div>
          <button type="button" onClick={() => onChange(null)}
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}