import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Sparkles, Users, Zap } from 'lucide-react';
import { authService } from '../services/authService';
import Toast from '../components/Toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      await authService.register({ name, email, password });
      setToast({ message: 'Account created! Redirecting to login...', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      // Show first validation error or general message
      const message = data?.errors?.[0]?.msg || data?.message || 'Registration failed. Please try again.';
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero" />
      <div className="pointer-events-none fixed inset-0 -z-10 grid-pattern" />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="order-2 mx-auto w-full max-w-md lg:order-1">
            <div className="rounded-3xl border border-border bg-card-glass p-8 shadow-card">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Get started</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Create your <span className="font-display italic text-gradient">TeamSync</span> account
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">Launch a workspace your team will love.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="register-name" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ali Khan"
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                  />
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
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
                  <p className="mt-2 text-xs text-muted-foreground">
                    Must be 8+ characters with at least one uppercase letter and one number.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-foreground transition-colors">
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          <div className="order-1 hidden h-full flex-col justify-between rounded-3xl border border-border bg-card-glass p-10 shadow-card lg:flex">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
                  <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                </span>
                TeamSync onboarding
              </div>
              <h1 className="mt-8 text-4xl font-semibold tracking-tight">
                Build a workspace that feels{' '}
                <span className="font-display italic text-gradient">effortless.</span>
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">
                Create your account and bring your team into a calm, focused workflow in minutes.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              {[
                { icon: Users, text: 'Invite teammates in seconds.' },
                { icon: Zap, text: 'Instant task sync across devices.' },
                { icon: ArrowRight, text: 'Launch your first project today.' },
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
        </div>
      </div>
    </div>
  );
}
