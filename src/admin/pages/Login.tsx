import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAdminAuth } from "@/admin/lib/auth";
import { useAdminLang } from "@/admin/lib/adminI18n";
import { ApiError } from "@/admin/lib/api";

export default function AdminLogin() {
  const { status, login } = useAdminAuth();
  const { t } = useAdminLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") {
    const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.login.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 text-ink">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-lg font-semibold">{t.login.title}</span>
          <p className="mt-1 text-sm text-ink/50">{t.login.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-7"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
            {t.login.email}
          </label>
          <div className="relative mb-5">
            <Mail size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-ink/10 bg-ink/[0.02] py-3 pe-4 ps-11 text-sm text-ink placeholder:text-ink/35 focus:border-[var(--color-accent)] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-ink/45">
            {t.login.password}
          </label>
          <div className="relative mb-6">
            <Lock size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-ink/10 bg-ink/[0.02] py-3 pe-4 ps-11 text-sm text-ink placeholder:text-ink/35 focus:border-[var(--color-accent)] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3.5 font-display text-sm font-semibold text-[#1a0f10] transition-opacity disabled:opacity-60"
          >
            {loading ? t.login.signingIn : t.login.signIn}
          </button>
        </form>
      </div>
    </div>
  );
}
