import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) || "" }),
  head: () => ({ meta: [{ title: "Application submitted — Meridian Finance" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { id } = Route.useSearch();
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color:var(--success)]/15 text-[color:var(--success)]">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Application submitted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you! We've received your loan application. Our team will review your information and respond within 24 hours.
        </p>
        {id && (
          <div className="mt-5 rounded-md border border-border bg-muted/50 px-4 py-3 text-left text-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Reference</div>
            <div className="mt-1 font-mono text-foreground">{id}</div>
          </div>
        )}
        <Link to="/" className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Back to home
        </Link>
      </div>
    </div>
  );
}