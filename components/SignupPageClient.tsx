"use client";
import { useState } from "react";

const TIERS = [
  { value: "free",    label: "Free — 100 calls/month",        rpm: "5 analyze/min" },
  { value: "starter", label: "Starter — $29/mo, 2,000 calls", rpm: "20 analyze/min" },
  { value: "pro",     label: "Pro — $99/mo, 10,000 calls",    rpm: "60 analyze/min" },
];

type SignupResult = {
  api_key: string;
  tier: string;
  rate_limits: { analyze_rpm: number; recommend_rpm: number };
};

export default function SignupPageClient() {
  const [form, setForm] = useState({ name: "", email: "", company: "", tier: "free", use_case: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignupResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
        body: JSON.stringify(form),
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

  function copyKey() {
    if (!result) return;
    navigator.clipboard.writeText(result.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (result) {
    return (
      <div className="w-full max-w-lg">
        <div className="card-glass rounded-2xl p-8 border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-emerald-400 font-semibold text-sm">API key generated!</p>
          </div>

          <p className="text-white/50 text-sm mb-3">
            Save this key immediately — it will never be shown again.
          </p>

          <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-4 font-mono text-sm text-emerald-300 break-all mb-3">
            {result.api_key}
          </div>

          <button
            onClick={copyKey}
            className="w-full py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium hover:bg-violet-500/20 transition-colors mb-6"
          >
            {copied ? "Copied!" : "Copy API Key"}
          </button>

          <div className="space-y-2 text-sm text-white/40">
            <div className="flex justify-between">
              <span>Tier</span>
              <span className="text-white/70 capitalize">{result.tier}</span>
            </div>
            <div className="flex justify-between">
              <span>Analyze limit</span>
              <span className="text-white/70">{result.rate_limits.analyze_rpm} calls/min</span>
            </div>
            <div className="flex justify-between">
              <span>Recommend limit</span>
              <span className="text-white/70">{result.rate_limits.recommend_rpm} calls/min</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/3 rounded-xl border border-white/5 text-xs text-white/35 space-y-1">
            <p className="font-semibold text-white/50 mb-2">Next steps:</p>
            <p>1. Include <code className="text-violet-300">X-API-Key: your_key</code> in every request</p>
            <p>2. POST to <code className="text-violet-300">https://api.skinic.app/analyze</code></p>
            <p>3. Check your usage: GET <code className="text-violet-300">/usage</code></p>
            <p>4. Read the docs: <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="text-violet-400">api.skinic.app/docs</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <p className="text-violet-400 text-xs font-medium tracking-widest uppercase mb-3">Free to start</p>
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

          <select
            value={form.tier}
            onChange={(e) => set("tier", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm focus:outline-none focus:border-violet-500/50 transition-colors appearance-none"
          >
            {TIERS.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#0a0a0f]">
                {t.label}
              </option>
            ))}
          </select>

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
            {loading ? "Generating..." : "Generate API Key"}
          </button>

          <p className="text-center text-white/20 text-xs">
            By signing up you agree to the{" "}
            <a href="https://api.skinic.app/terms" target="_blank" rel="noreferrer" className="text-violet-400">
              SKINIC Terms of Service
            </a>
          </p>
        </form>
      </div>

      <p className="text-center text-white/25 text-xs mt-4">
        Need Enterprise?{" "}
        <a href="mailto:hello@skinic.app" className="text-violet-400 hover:text-violet-300">
          Contact us
        </a>
      </p>
    </div>
  );
}
