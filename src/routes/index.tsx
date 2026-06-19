import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Clock, Wallet, FileCheck2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian Finance — Fast, Fair Personal Loans" },
      { name: "description", content: "Apply online for a personal loan in minutes. Transparent rates, quick decisions, and a secure application process." },
      { property: "og:title", content: "Meridian Finance — Fast, Fair Personal Loans" },
      { property: "og:description", content: "Apply online for a personal loan in minutes." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">M</div>
            <span className="text-lg font-bold tracking-tight">Meridian Finance</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link to="/admin/login" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">Admin</Link>
            <Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Apply now <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--gold)]" /> Bank-grade encryption
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Loans built around <span className="text-[color:var(--gold)]">your life.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/80 sm:text-lg">
              Apply in under 10 minutes. Get a decision the same day. No hidden fees, no jargon — just transparent personal financing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/apply" className="inline-flex items-center gap-2 rounded-md bg-[color:var(--gold)] px-6 py-3 text-sm font-semibold text-primary transition hover:brightness-110">
                Start application <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how" className="inline-flex items-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">How it works</a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-left">
              {[
                { k: "$2M+", v: "Funded monthly" },
                { k: "4.9★", v: "Customer rating" },
                { k: "24h", v: "Avg decision time" },
              ].map((s) => (
                <div key={s.k}>
                  <div className="text-2xl font-bold text-[color:var(--gold)]">{s.k}</div>
                  <div className="text-xs text-white/60">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="rounded-2xl bg-card p-6 shadow-2xl ring-1 ring-black/5 sm:p-8">
              <div className="text-sm font-medium text-muted-foreground">Estimated payment</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold">$412</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <Row label="Loan amount" value="$15,000" />
                <Row label="Term" value="48 months" />
                <Row label="APR (from)" value="7.9%" />
              </div>
              <Link to="/apply" className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Apply for this rate <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">Pre-qualification will not affect your credit score.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">A simple, four-step process</h2>
            <p className="mt-3 text-muted-foreground">From application to funds in your account.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: FileCheck2, t: "1. Apply online", d: "Complete the multi-step application form." },
              { i: ShieldCheck, t: "2. Verify identity", d: "Upload your ID and supporting documents." },
              { i: Clock, t: "3. Fast review", d: "Most decisions returned within 24 hours." },
              { i: Wallet, t: "4. Receive funds", d: "Money is wired directly to your bank." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="rounded-xl border border-border bg-background p-6">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Meridian Finance. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
