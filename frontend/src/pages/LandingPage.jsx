import { useEffect, useState, useRef } from 'react';
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
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TeamCard from '../components/TeamCard';

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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'
        }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`flex items-center justify-between rounded-full border border-border px-4 py-2.5 transition-all duration-500 ${scrolled
              ? 'bg-card-glass shadow-card'
              : 'bg-transparent border-transparent'
            }`}
        >
          <Link to="/" reloadDocument className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold tracking-tight">TeamSync</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a className="transition hover:text-foreground" href="#features">Features</a>
            <a className="transition hover:text-foreground" href="#showcase">Overview</a>
            <a className="transition hover:text-foreground" href="#stats">Impact</a>
            <a className="transition hover:text-foreground" href="#cta">Get Started</a>
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
          <div className="relative transform-gpu scale-90 origin-center rounded-2xl overflow-hidden p-[1px]">
            <div className="absolute inset-[-200%] animate-spin [background:conic-gradient(from_0deg,transparent_75%,oklch(0.68_0.22_295)_90%,transparent_100%)] pointer-events-none" style={{ animationDuration: '4s' }} />
            <div className="relative z-10">
              <ProductMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductMockup() {
  const previewUser = { name: 'Ava Johnson', email: 'ava@teamsync.io' };
  const previewTeams = [
    { id: 1, name: 'Engineering', role: 'admin', created_at: '2026-05-12' },
    { id: 2, name: 'Design', role: 'member', created_at: '2026-05-14' },
    { id: 3, name: 'Marketing', role: 'member', created_at: '2026-05-18' },
    { id: 4, name: 'Operations', role: 'member', created_at: '2026-05-21' },
  ];
  const previewFilters = { teamId: '', assignedTo: '', createdBy: '', status: '' };
  const previewOwnership = 'all';
  const previewTasks = [
    {
      id: 101,
      title: 'Finalize onboarding flow',
      description: 'Update email triggers and task progression.',
      status: 'in_progress',
      priority: 'high',
      due_date: '2026-06-20',
      assignees: [{ id: 1, name: 'Ava Johnson' }, { id: 2, name: 'Zeeshan Ali' }],
      subtask_total: 6,
      subtask_completed: 4,
      team_id: 1,
    },
    {
      id: 102,
      title: 'Refresh brand guidelines',
      description: 'New typography and color tokens for campaigns.',
      status: 'todo',
      priority: 'medium',
      due_date: '2026-06-28',
      assignees: [{ id: 3, name: 'Noor Ahmed' }],
      subtask_total: 4,
      subtask_completed: 1,
      team_id: 2,
    },
    {
      id: 103,
      title: 'Launch performance dashboard',
      description: 'Ship analytics for leadership reporting.',
      status: 'done',
      priority: 'low',
      due_date: '2026-06-12',
      assignees: [{ id: 4, name: 'Maya Chen' }],
      subtask_total: 3,
      subtask_completed: 3,
      team_id: 1,
    },
  ];

  const [mockTab, setMockTab] = useState('tasks');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-card">
      <div className="relative p-6 text-left">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="text-left">
            <Sidebar
              teams={previewTeams}
              activeSection="my"
              activeTeamId={null}
              hasUnreadNotifications={true}
              onSelectMyDashboard={() => { }}
              onSelectNotifications={() => { }}
              onSelectTeam={() => { }}
              onSelectAccountSettings={() => { }}
              user={previewUser}
              onLogout={() => { }}
            />
          </div>

          <section className="flex flex-col gap-6">
            <header className="rounded-3xl border border-border bg-card-glass p-6 shadow-card text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">Workspace</p>
                  <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                    Welcome back,{' '}
                    <span className="font-display italic text-gradient">Ava Johnson</span>
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Focus on the work that moves your team forward today.
                  </p>
                </div>
                <div className="flex w-full sm:w-auto items-center gap-3 shrink-0">
                  <button className="flex-1 sm:flex-none rounded-full bg-primary px-3 py-2.5 sm:px-4 sm:py-1.5 text-xs font-semibold text-primary-foreground transition hover:shadow-glow cursor-pointer flex justify-center">
                    {mockTab === 'teams' ? '+ New Team' : '+ New Task'}
                  </button>
                  <button className="flex-1 sm:flex-none rounded-full border border-border bg-surface px-3 py-2.5 sm:px-4 sm:py-1.5 text-xs text-foreground transition hover:border-primary/50 hover:text-primary cursor-pointer flex justify-center">
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card-glass p-1">
                <button
                  onClick={() => setMockTab('tasks')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${mockTab === 'tasks'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setMockTab('teams')}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${mockTab === 'teams'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Teams
                </button>
              </div>
              <div className="rounded-full border border-border bg-card-glass px-4 py-2 text-xs text-muted-foreground">
                Keep tasks aligned with realtime context.
              </div>
            </div>

            {mockTab === 'tasks' ? (
              <>
                <div
                  onMouseDownCapture={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClickCapture={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <FilterBar
                    teams={previewTeams}
                    filters={previewFilters}
                    onTeamChange={() => { }}
                    onStatusChange={() => { }}
                    onOwnershipChange={() => { }}
                    ownership={previewOwnership}
                    assignees={[]}
                    assigneeFilter=""
                    onAssigneeFilterChange={() => { }}
                    isTeamAdmin={false}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {previewTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => { }}
                      onDelete={() => { }}
                      onOpen={() => { }}
                      canEdit={true}
                      statusOnly={false}
                      canDelete={false}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div
                onMouseDownCapture={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClickCapture={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {previewTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
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
      title: 'Secure Authentication & RBAC',
      desc: 'Robust session management via PassportJS, secure HTTP-only cookies, and absolute data isolation with PostgreSQL database constraints.',
      accent: 'from-glow/30 to-glow/0',
    },
  ];

  return (
    <section className="relative px-6 py-32">
      <div id="features" className="absolute top-[40px]" />
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

  const mockupRef = useRef(null);

  useEffect(() => {
    if (mockupRef.current) {
      if (window.innerWidth >= 768) {
        mockupRef.current.scrollLeft = 300; // Scroll past the sidebar and a bit more
      }
    }
  }, []);

  return (
    <section className="relative px-6 py-32">
      <div id="showcase" className="absolute top-[40px]" />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-primary">A workspace that works</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Organize chaos into{' '}
              <span className="font-display italic text-gradient">perfect clarity.</span>
            </h2>
            <p className="mt-5 text-muted-foreground max-w-lg">
              Stop digging through endless threads and scattered spreadsheets. Every project gets a clear home, actionable deadlines, and visible ownership.
            </p>

            <ul className="mt-8 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-foreground/90">{p}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-card-glass px-5 py-2.5 text-sm font-medium transition hover:border-primary/40"
            >
              Explore all features
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative h-[450px] w-full rounded-3xl overflow-hidden p-[1px] animate-float">
            <div className="absolute inset-[-200%] animate-spin [background:conic-gradient(from_0deg,transparent_75%,oklch(0.68_0.22_295)_90%,transparent_100%)] pointer-events-none" style={{ animationDuration: '4s' }} />
            <div
              ref={mockupRef}
              className="relative z-10 w-full h-full overflow-auto no-scrollbar bg-card-glass rounded-[inherit]"
            >
              <div className="relative w-[900px] transform-gpu">
                <ProductMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: '12k+', l: 'Teams shipping daily' },
    { v: '99.99%', l: 'Real-time State Sync' },
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
    <section className="relative px-6 py-32">
      <div id="cta" className="absolute top-[40px]" />
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
            The modern command center for collaborative engineering. Organize teams, delegate tasks, and track development progress smoothly.
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
