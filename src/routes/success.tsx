import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Clock, Mail, Sparkles } from "lucide-react";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) || "" }),
  head: () => ({ meta: [{ title: "Application submitted — Meridian Finance" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { id } = Route.useSearch();
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-elegant sm:p-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-brand text-primary-foreground shadow-glow animate-pulse-glow">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles className="h-3 w-3" /> You're all set
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Application received!</h1>
          <p className="mt-3 text-muted-foreground">
            Your loan application is now in our queue. A specialist will review it and reach out within 24 hours.
          </p>

          {id && (
            <div className="mt-6 rounded-2xl border border-border bg-muted/40 px-5 py-4 text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reference number</div>
              <div className="mt-1 font-mono text-sm font-bold text-foreground">{id}</div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <NextStep icon={Mail} title="Check your inbox" desc="We've sent a confirmation email." />
            <NextStep icon={Clock} title="24-hour decision" desc="A decision lands shortly." />
          </div>

          <Link to="/" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02]">
            Back to home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function NextStep({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-sm font-bold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}