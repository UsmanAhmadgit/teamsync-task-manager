import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-pattern" />

      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
        <div className="rounded-3xl border border-border bg-card-glass p-10 text-center shadow-card">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Not Found</p>
          <h1 className="mt-4 text-7xl font-semibold text-gradient">404</h1>
          <p className="mt-4 text-xl">This page slipped away.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="rounded-full border border-border bg-card-glass px-6 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50"
            >
              Back to Home
            </Link>
            <Link
              to="/dashboard"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:shadow-glow"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
