"use client";
import { useState, useEffect } from "react";

const PAID_TIERS = [
  {
    value: "starter",
    label: "Starter — $29/mo",
    href: "/dashboard/plan?upgrade=starter",
  },
  {
    value: "pro",
    label: "Pro — $99/mo",
    href: "/dashboard/plan?upgrade=pro",
  },
];

type SignupResult = {
  pending_verification: boolean;
  email_sent: boolean;
  message: string;
};

export default function SignupPageClient() {
  const [form, setForm] = useState({ name: "", email: "", company: "", use_case: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignupResult | null>(null);
  const [error, setError] = useState("");
  const [upgradeTier, setUpgradeTier] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const upgrade = params.get("upgrade") || "";
    if (upgrade) setUpgradeTier(upgrade);
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("https://api.skinic.app/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tier: "free" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Signup failed. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    }
    setLoading(false);
  }


  if (result) {
    return (
      <div className="w-full max-w-lg">
        <div className="card-glass rounded-2xl p-8 border border-violet-500/20 bg-violet-500/5 text-center">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-white/50 text-sm mb-5 leading-relaxed">
            We sent a verification link to <span className="text-white/80 font-medium">{form.email}</span>.<br />
            Click the link to confirm and get your API key.
          </p>

          <div className="bg-white/5 rounded-xl p-4 text-left space-y-2 text-xs text-white/40 mb-5">
            <p>✓ Check your inbox and spam folder</p>
            <p>✓ Link expires in 24 hours</p>
            <p>✓ Your API key will be shown after verification</p>
          </div>

          <p className="text-white/25 text-xs">
            Didn't receive it?{" "}
            <button onClick={() => setResult(null)} className="text-violet-400 hover:text-violet-300 transition-colors">
              Try again
            </button>
            {" "}·{" "}
            <a href="mailto:admin.thinkingstudio@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors">
              Contact support
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg space-y-6">

      {/* Free tier signup */}
      <div>
        <div className="text-center mb-6">
          <p className="text-violet-400 text-xs font-medium tracking-widest uppercase mb-3">Free — 10 trial scans</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Get your API key</h1>
          <p className="text-white/40 text-sm">
            Your unique key will be shown once — save it immediately.
          </p>
        </div>

        <div className="card-glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            <input
              required
              type="email"
              placeholder="Work email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />

            <textarea
              rows={2}
              placeholder="Briefly describe your use case (optional)"
              value={form.use_case}
              onChange={(e) => set("use_case", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              {loading ? "Generating..." : "Generate Free API Key"}
            </button>

            <p className="text-center text-white/20 text-xs">
              By signing up you agree to the{" "}
              <a href="https://api.skinic.app/terms" target="_blank" rel="noreferrer" className="text-violet-400">
                SKINIC Terms of Service
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Paid tier cards */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-white/5" />
          <p className="text-white/25 text-xs uppercase tracking-widest whitespace-nowrap">
            {upgradeTier ? `Step 2 — Upgrade to ${upgradeTier.charAt(0).toUpperCase() + upgradeTier.slice(1)}` : "Need more calls?"}
          </p>
          <div className="flex-1 h-px bg-white/5" />
        </div>
        {upgradeTier && (
          <p className="text-center text-amber-400/70 text-xs mb-3">
            Sign up free above first — then upgrade to {upgradeTier.charAt(0).toUpperCase() + upgradeTier.slice(1)} from your dashboard.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {PAID_TIERS.map((t) => {
            const isHighlighted = upgradeTier === t.value;
            return (
              <a
                key={t.value}
                href={t.href}
                className={`rounded-xl p-4 text-center border transition-all group ${
                  isHighlighted
                    ? "border-violet-500/50 bg-violet-500/10 shadow-lg shadow-violet-500/10"
                    : "card-glass border-white/5 hover:border-violet-500/30"
                }`}
              >
                <p className={`text-sm font-semibold capitalize transition-colors ${isHighlighted ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                  {t.value}
                </p>
                <p className="text-violet-400 text-xs mt-1">{t.label}</p>
                <p className={`text-xs mt-2 ${isHighlighted ? "text-violet-300" : "text-white/25"}`}>
                  Upgrade in dashboard →
                </p>
              </a>
            );
          })}
        </div>
      </div>

      <p className="text-center text-white/25 text-xs">
        Need Enterprise?{" "}
        <a href="/enterprise" className="text-violet-400 hover:text-violet-300">
          Contact us
        </a>
      </p>
    </div>
  );
}
