import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Layout,
  ShieldCheck,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Plus,
  Circle,
  CheckCheck,
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-pattern" />

      <Nav scrolled={scrolled} />
      <Hero />
      <Logos />
      <Features />
      <Showcase />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav({ scrolled }) {
  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`flex items-center justify-between rounded-full border border-border px-4 py-2.5 transition-all duration-500 ${
            scrolled
              ? 'bg-card-glass shadow-card'
              : 'bg-transparent border-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold tracking-tight">TeamSync</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a className="transition hover:text-foreground" href="#features">Product</a>
            <a className="transition hover:text-foreground" href="#showcase">Solutions</a>
            <a className="transition hover:text-foreground" href="#stats">Customers</a>
            <a className="transition hover:text-foreground" href="#cta">Pricing</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-full px-4 py-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition hover:shadow-glow"
            >
              Start free
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative px-6 pb-24 pt-28 sm:pt-36">
      <div className="pointer-events-none absolute left-1/4 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-violet/30 blur-3xl animate-blob" />
      <div
        className="pointer-events-none absolute right-1/4 top-48 h-72 w-72 translate-x-1/2 rounded-full bg-primary/20 blur-3xl animate-blob"
        style={{ animationDelay: '4s' }}
      />

      <div className="mx-auto max-w-5xl text-center">
        <h1
          className="mt-5 animate-fade-up text-balance text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="block">Work,</span>
          <span className="font-display italic text-gradient">beautifully synced.</span>
        </h1>

        <p
          className="mx-auto mt-5 max-w-2xl animate-fade-up text-pretty text-lg text-muted-foreground sm:text-xl"
          style={{ animationDelay: '0.2s' }}
        >
          The modern workspace where teams organize projects, assign tasks, and ship faster without the visual clutter.
        </p>

        <div
          className="mt-7 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:shadow-glow"
          >
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card-glass px-6 py-3 text-sm font-medium text-foreground transition hover:bg-surface-elevated"
          >
            Book a demo
          </a>
        </div>

        <p
          className="mt-3 animate-fade-up text-xs text-muted-foreground"
          style={{ animationDelay: '0.4s' }}
        >
          Free 14-day trial - No credit card required
        </p>

        <div
          className="relative mx-auto mt-20 max-w-5xl animate-fade-up"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet/40 via-primary/30 to-glow/40 opacity-50 blur-2xl" />
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}

function ProductMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex items-center gap-2 border-b border-border bg-surface-elevated px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-violet/70" />
        <div className="ml-4 flex items-center gap-2 rounded-md bg-background/50 px-2.5 py-1 text-xs text-muted-foreground">
          <Circle className="h-2 w-2 fill-primary text-primary" />
          app.teamsync.io / engineering
        </div>
      </div>

      <div className="grid grid-cols-12">
        <aside className="col-span-3 hidden border-r border-border bg-background/40 p-4 md:block">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Workspaces
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {[
              { name: 'Engineering', color: 'bg-primary', active: true },
              { name: 'Marketing', color: 'bg-violet' },
              { name: 'Design', color: 'bg-glow' },
              { name: 'Operations', color: 'bg-destructive' },
            ].map((w) => (
              <li
                key={w.name}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition ${
                  w.active ? 'bg-surface-elevated text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${w.color}`} />
                {w.name}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Members
          </p>
          <div className="mt-3 flex -space-x-2">
            {['#a78bfa', '#facc15', '#34d399', '#f472b6'].map((c, i) => (
              <div
                key={String(i)}
                className="h-7 w-7 rounded-full border-2 border-background"
                style={{ background: c }}
              />
            ))}
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-surface-elevated text-[10px] text-muted-foreground">
              +8
            </div>
          </div>
        </aside>

        <main className="col-span-12 p-5 md:col-span-9">
          <div className="flex items-end justify-between">
            <div className="text-left">
              <h3 className="text-xl font-semibold">Engineering</h3>
              <p className="text-xs text-muted-foreground">4 active - 12 in backlog</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
              <Plus className="h-3 w-3" /> Task
            </button>
          </div>

          <div className="mt-5 grid gap-3 text-left">
            {[
              { title: 'Optimize API routes for sub-100ms latency', tag: 'Backend', tone: 'bg-violet/15 text-violet', status: 'In progress', progress: 70 },
              { title: 'Redesign onboarding landing page', tag: 'Frontend', tone: 'bg-primary/15 text-primary', status: 'Review', progress: 90, done: true },
              { title: 'Set up CI/CD with preview deploys', tag: 'DevOps', tone: 'bg-glow/15 text-glow', status: 'Todo', progress: 20 },
            ].map((t, i) => (
              <div
                key={String(i)}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card-glass p-3 transition hover:border-primary/40"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border">
                  {t.done ? (
                    <CheckCheck className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{t.title}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${t.tone}`}>
                      {t.tag}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{t.status}</span>
                  </div>
                </div>
                <div className="hidden w-28 sm:block">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-glow"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function Logos() {
  const logos = ['Acme', 'Northwind', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Hooli', 'Pied Piper'];
  return (
    <section className="relative overflow-hidden border-y border-border py-10">
      <p className="mb-6 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Trusted by teams shipping at speed
      </p>
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16">
          {[...logos, ...logos].map((l, i) => (
            <span key={String(i)} className="font-display text-2xl text-muted-foreground/60">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Zap,
      title: 'Lightning-fast sync',
      desc: 'Realtime updates across every device. Move a card, finish a task - your team sees it the instant it happens.',
      accent: 'from-primary/30 to-primary/0',
    },
    {
      icon: Layout,
      title: 'Workspaces, organized',
      desc: "Separate environments for every team. Marketing's visual boards stay distinct from engineering sprint boards.",
      accent: 'from-violet/30 to-violet/0',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise-grade security',
      desc: 'End-to-end encryption, SSO, audit logs, and granular role-based access. SOC 2 Type II certified.',
      accent: 'from-glow/30 to-glow/0',
    },
  ];

  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Why TeamSync</p>
          <h2 className="mt-3 text-balance text-4xl tracking-tight sm:text-5xl">
            Everything you need to <span className="font-display italic text-gradient">move faster.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            We stripped away the complexity of traditional project tools so your team can focus on actually doing the work.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <div
              key={String(i)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card-glass p-7 shadow-card transition hover:border-primary/30"
            >
              <div
                className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${it.accent} opacity-60 blur-3xl transition group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-elevated">
                  <it.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm text-primary opacity-0 transition group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const points = [
    'Filter tasks instantly by team, status, or assignee.',
    'Custom workflow tags that match how your team actually ships.',
    'Automated due-date reminders so nothing slips through.',
    'Frictionless invites - onboard contractors in seconds.',
  ];
  return (
    <section id="showcase" className="relative px-6 py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary">A workspace that works</p>
          <h2 className="mt-3 text-balance text-4xl tracking-tight sm:text-5xl">
            Organize chaos into{' '}
            <span className="font-display italic text-gradient">perfect clarity.</span>
          </h2>
          <p className="mt-5 max-w-lg text-muted-foreground">
            Stop digging through endless threads and scattered spreadsheets. Every project gets a clear home, actionable deadlines, and visible ownership.
          </p>

          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>

          <a
            href="#features"
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-card-glass px-5 py-2.5 text-sm font-medium transition hover:border-primary/40"
          >
            Explore all features
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-violet/30 via-primary/20 to-transparent blur-2xl" />
          <div className="relative animate-float">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: '12k+', l: 'Teams shipping daily' },
    { v: '99.99%', l: 'Uptime SLA' },
    { v: '40ms', l: 'Median sync latency' },
    { v: 'SOC 2', l: 'Type II certified' },
  ];
  return (
    <section id="stats" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-card-glass p-10 shadow-card">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="text-center sm:text-left">
              <div className="font-display text-5xl text-gradient">{s.v}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="relative px-6 py-32">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-surface-elevated p-12 text-center shadow-card sm:p-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-full bg-violet/20 blur-3xl" />

        <div className="relative">
          <h2 className="text-balance text-4xl tracking-tight sm:text-6xl">
            Ready to transform <br />
            <span className="font-display italic text-gradient">your workflow?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Join thousands of high-performing teams already using TeamSync to ship faster, together.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:shadow-glow"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card-glass px-6 py-3 text-sm font-medium transition hover:bg-surface"
            >
              Talk to sales
            </a>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            No credit card required - 14-day free trial on Pro plans
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
    { title: 'Resources', links: ['Documentation', 'API reference', 'Blog', 'Community'] },
    { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
  ];

  return (
    <footer className="relative border-t border-border px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold">TeamSync</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The modern operating system for collaborative teams. Organize, track, and ship beautifully.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">{c.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {c.links.map((l) => (
                <li key={l}>
                  <a className="transition hover:text-foreground" href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">Subscribe</p>
          <p className="mt-4 text-sm text-muted-foreground">Product updates, monthly.</p>
          <form
            className="mt-3 flex overflow-hidden rounded-full border border-border bg-card-glass"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@team.com"
              className="flex-1 bg-transparent px-3 py-2 text-xs outline-none placeholder:text-muted-foreground"
            />
            <button className="bg-primary px-3 text-primary-foreground" aria-label="Subscribe" type="submit">
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>(c) {new Date().getFullYear()} TeamSync Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" aria-label="GitHub" className="transition hover:text-foreground"><Github className="h-4 w-4" /></a>
          <a href="#" aria-label="Twitter" className="transition hover:text-foreground"><Twitter className="h-4 w-4" /></a>
          <a href="#" aria-label="LinkedIn" className="transition hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}
