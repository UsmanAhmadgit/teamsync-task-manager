import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Layout, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Toast from '../components/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wakingUp, setWakingUp] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setWakingUp(false);

    // Show waking message if server takes > 5 seconds (Render free tier cold start)
    const timer = setTimeout(() => {
      setWakingUp(true);
    }, 5000);

    try {
      const res = await authService.login({ email, password });
      login(res.data.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      clearTimeout(timer);
      setWakingUp(false);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-pattern" />


      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden h-full flex-col justify-between rounded-3xl border border-border bg-card-glass p-10 shadow-card lg:flex">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
                  <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                </span>
                TeamSync workspace
              </div>
              <h1 className="mt-8 text-4xl font-semibold tracking-tight">
                Welcome back to{' '}
                <span className="font-display italic text-gradient">beautiful focus.</span>
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">
                Sign in to pick up where your team left off. Every task, update, and decision is already in sync.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              {[
                { icon: Zap, text: 'Real-time updates across every workspace.' },
                { icon: Layout, text: 'Project views tailored to every team.' },
                { icon: ShieldCheck, text: 'Role-based access baked in.' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-elevated text-primary">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-border bg-card-glass p-8 shadow-card">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Welcome back</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Sign in to <span className="font-display italic text-gradient">TeamSync</span>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">Your next milestone is waiting.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg text-center animate-fade-up">
                    {error}
                  </div>
                )}
                {wakingUp && !error && (
                  <div className="text-sm text-amber-500 bg-amber-500/10 p-3 rounded-lg text-center animate-fade-up">
                    The server is waking up from sleep (Render free tier). This may take up to 60 seconds. Please wait...
                  </div>
                )}
                <div>
                  <label htmlFor="login-email" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center translate-y-0.5 text-muted-foreground transition hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-primary hover:text-foreground transition-colors">
                  Create one
                </Link>
              </div>
              <div className="mt-4 text-center text-xs text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition-colors">Return to homepage</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
