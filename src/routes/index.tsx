import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Clock, Wallet, FileCheck2, Sparkles, TrendingUp, Lock, BadgeCheck, Star, Users, Home, Briefcase, Car, GraduationCap } from "lucide-react";
import heroCustomer from "@/assets/hero-customer.jpg";
import loanHome from "@/assets/loan-home.jpg";
import loanBusiness from "@/assets/loan-business.jpg";
import loanCar from "@/assets/loan-car.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian — Smart loans for the lives you're building" },
      { name: "description", content: "Apply for a personal, business, home or auto loan in 5 minutes. ₦500M+ approved. Trusted by 50,000+ customers across Africa." },
      { property: "og:title", content: "Meridian — Smart loans for the lives you're building" },
      { property: "og:description", content: "Apply in 5 minutes. Get a decision in 24 hours." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,oklch(0.95_0.06_263)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,oklch(0.95_0.06_162)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-20 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pt-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Trusted by 50,000+ customers
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Loans for the<br />
              <span className="gradient-text">life you're</span><br />
              building.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Apply in 5 minutes. Get a decision in 24 hours. Transparent rates, zero hidden fees — for homes, businesses, vehicles and everything in between.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/apply" className="group inline-flex items-center gap-2 rounded-2xl gradient-brand px-7 py-4 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02] hover:shadow-elegant">
                Start your application
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a href="#how" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-7 py-4 text-sm font-semibold text-foreground transition hover:bg-muted">
                How it works
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> 256-bit SSL</div>
              <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-accent" /> CBN regulated</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-current text-amber-500" /> 4.9 rating</div>
            </div>
          </div>

          {/* Hero illustration with floating stat cards */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-elegant">
              <div className="absolute inset-0 gradient-hero opacity-90" />
              <img src={heroCustomer} alt="Customer with approved loan" width={1280} height={1280}
                className="relative h-full w-full object-cover mix-blend-luminosity opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>

            {/* Floating cards */}
            <FloatingStat className="-left-4 top-10 animate-float" icon={TrendingUp} value="₦500M+" label="Loans approved" tone="primary" />
            <FloatingStat className="-right-2 top-32 animate-float-slow" icon={Star} value="98%" label="Satisfaction" tone="accent" />
            <FloatingStat className="-left-6 bottom-24 animate-float-slow" icon={Clock} value="5 min" label="Application" tone="secondary" />
            <FloatingStat className="-right-4 bottom-6 animate-float" icon={Users} value="50K+" label="Customers" tone="primary" />
          </div>
        </div>
      </section>

      {/* LOAN TYPES */}
      <section className="border-t border-border/60 bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">What we fund</span>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Built for every milestone</h2>
            <p className="mt-4 text-muted-foreground">From your first car to your forever home — financing that meets you where you are.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <LoanCard image={loanHome} icon={Home} title="Home loans" desc="Move into the home you've been dreaming of." amount="Up to ₦200M" />
            <LoanCard image={loanBusiness} icon={Briefcase} title="Business loans" desc="Fuel your next chapter with working capital." amount="Up to ₦50M" />
            <LoanCard image={loanCar} icon={Car} title="Auto loans" desc="Drive away today with flexible monthly plans." amount="Up to ₦30M" />
            <LoanCard icon={GraduationCap} title="Personal loans" desc="School fees, weddings, medical — whatever life throws." amount="Up to ₦10M" gradient />
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple process</span>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Four steps to funded.</h2>
              <p className="mt-4 text-muted-foreground">No paperwork mountains. No branch visits. Just a fast, secure online flow.</p>
              <Link to="/apply" className="mt-6 inline-flex items-center gap-2 rounded-2xl gradient-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.02] transition">
                Apply now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { i: FileCheck2, t: "Apply online", d: "Complete the multi-step form in 5 minutes flat." },
                { i: ShieldCheck, t: "Verify identity", d: "Upload your ID and supporting documents securely." },
                { i: Clock, t: "Fast review", d: "Most decisions returned within 24 hours." },
                { i: Wallet, t: "Receive funds", d: "Money wired directly to your bank account." },
              ].map(({ i: Icon, t, d }, idx) => (
                <div key={t} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-elegant hover:-translate-y-1">
                  <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="absolute right-5 top-5 text-3xl font-extrabold text-muted/50">0{idx + 1}</div>
                  <h3 className="mt-5 text-lg font-bold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-border/60 bg-gradient-to-br from-primary via-secondary to-secondary py-20 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Your money. Protected like it's ours.</h2>
            <p className="mt-4 max-w-lg text-white/80">Bank-grade encryption, biometric verification, and regulatory compliance you can verify in seconds.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[{i:Lock,t:"256-bit SSL"},{i:ShieldCheck,t:"PCI-DSS"},{i:BadgeCheck,t:"CBN regulated"},{i:Sparkles,t:"AI fraud scan"}].map(({i:I,t}) => (
                <div key={t} className="glass-dark rounded-2xl p-4 text-center">
                  <I className="mx-auto h-6 w-6 text-accent" />
                  <div className="mt-2 text-xs font-semibold">{t}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Testimonial name="Adaeze O." role="Small business owner" stars={5}
              quote="The whole thing took 4 minutes. Money hit my account the next morning. Unreal." />
            <Testimonial name="Tobi A." role="First-time home buyer" stars={5}
              quote="Clearest loan terms I've ever seen. No surprises, no hidden fees." className="sm:mt-12" />
          </div>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg gradient-brand text-primary-foreground font-bold text-xs">M</div>
            © {new Date().getFullYear()} Meridian Finance. All rights reserved.
          </div>
          <span />
        </div>
      </footer>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand font-extrabold text-primary-foreground shadow-glow">M</div>
          <span className="text-lg font-extrabold tracking-tight">Meridian</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#" className="hover:text-foreground">Loans</a>
          <a href="#" className="hover:text-foreground">About</a>
        </nav>
        <div className="flex items-center gap-2">
          
          <Link to="/apply" className="inline-flex items-center gap-1.5 rounded-xl gradient-brand px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-105">
            Apply <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function FloatingStat({ className = "", icon: Icon, value, label, tone }: {
  className?: string; icon: React.ComponentType<{ className?: string }>; value: string; label: string; tone: "primary"|"secondary"|"accent";
}) {
  const toneMap = { primary: "text-primary bg-primary/10", secondary: "text-secondary bg-secondary/10", accent: "text-accent bg-accent/10" };
  return (
    <div className={`absolute glass rounded-2xl p-4 shadow-elegant ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-extrabold leading-none">{value}</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  );
}

function LoanCard({ image, icon: Icon, title, desc, amount, gradient }: {
  image?: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string; amount: string; gradient?: boolean;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-elegant hover:-translate-y-1">
      <div className={`relative aspect-[4/3] overflow-hidden ${gradient ? "gradient-hero" : ""}`}>
        {image ? (
          <img src={image} alt={title} loading="lazy" width={1024} height={768}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <Icon className="h-16 w-16 text-primary-foreground/80" />
          </div>
        )}
        <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl glass text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">{amount}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
        <Link to="/apply" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all">
          Apply <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Testimonial({ name, role, quote, stars, className = "" }: { name: string; role: string; quote: string; stars: number; className?: string }) {
  return (
    <div className={`glass-dark rounded-2xl p-6 ${className}`}>
      <div className="flex gap-0.5 text-amber-400">
        {Array.from({ length: stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/90">"{quote}"</p>
      <div className="mt-4 text-xs">
        <div className="font-bold">{name}</div>
        <div className="text-white/60">{role}</div>
      </div>
    </div>
  );
}
