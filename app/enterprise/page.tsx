"use client";
import { useState } from "react";
import Link from "next/link";

const USE_CASES = [
  "Beauty & Skincare App",
  "Cosmetics / Skincare Brand",
  "E-commerce / Retail",
  "Beauty & Wellness Platform",
  "Research / Academia",
  "Other",
];

const VOLUMES = [
  "10,000 – 50,000 calls/month",
  "50,000 – 200,000 calls/month",
  "200,000 – 1M calls/month",
  "1M+ calls/month",
  "Not sure yet",
];

export default function EnterprisePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    useCase: "",
    volume: "",
    details: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const body = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Company: ${form.company}`,
        `Use Case: ${form.useCase}`,
        `Monthly Volume: ${form.volume}`,
        `Details: ${form.details}`,
      ].join("\n");

      const mailto = `mailto:skinic@thinkingstudio.ai?subject=${encodeURIComponent("Enterprise Inquiry — " + form.company)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to skinic.app
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-4">
            Enterprise
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Let's talk about your use case</h1>
          <p className="text-white/40 text-base leading-relaxed">
            Tell us about your project and we'll put together a custom plan — dedicated limits, SLA, white-label options, and priority support.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { icon: "⚡", label: "Custom rate limits", desc: "No hard caps — scale to your volume" },
            { icon: "🛡️", label: "SLA guarantee", desc: "99.9% uptime commitment" },
            { icon: "🏷️", label: "White-label option", desc: "Brand the API as your own" },
            { icon: "🤝", label: "Priority support", desc: "Dedicated Slack channel" },
          ].map((b) => (
            <div key={b.label} className="card-glass rounded-xl p-4 border border-white/5">
              <div className="text-xl mb-2">{b.icon}</div>
              <div className="text-sm font-semibold text-white">{b.label}</div>
              <div className="text-xs text-white/40 mt-0.5">{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card-glass rounded-2xl p-8 border border-white/5">
          {status === "sent" ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-white mb-2">Inquiry sent!</h2>
              <p className="text-white/40 text-sm">We'll get back to you within 1 business day.</p>
              <Link href="/" className="inline-block mt-6 text-violet-400 hover:text-violet-300 text-sm">← Back to home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 font-medium">Full Name *</label>
                  <input
                    required name="name" value={form.name} onChange={handleChange}
                    placeholder="Ahmad Razif"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 font-medium">Work Email *</label>
                  <input
                    required type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="ahmad@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">Company / Organisation *</label>
                <input
                  required name="company" value={form.company} onChange={handleChange}
                  placeholder="Acme Skincare Sdn Bhd"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 font-medium">Use Case *</label>
                  <select
                    required name="useCase" value={form.useCase} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-zinc-900">Select one…</option>
                    {USE_CASES.map((u) => <option key={u} value={u} className="bg-zinc-900">{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 font-medium">Expected Monthly Volume *</label>
                  <select
                    required name="volume" value={form.volume} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-zinc-900">Select range…</option>
                    {VOLUMES.map((v) => <option key={v} value={v} className="bg-zinc-900">{v}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-medium">Tell us more about your project</label>
                <textarea
                  name="details" value={form.details} onChange={handleChange}
                  rows={4}
                  placeholder="Describe your product, integration needs, timeline, or any specific requirements…"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-violet-500/25"
              >
                {status === "sending" ? "Opening email…" : "Send Inquiry →"}
              </button>

              <p className="text-center text-white/20 text-xs">
                We respond within 1 business day. Or email us directly at{" "}
                <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400/70 hover:text-violet-400">skinic@thinkingstudio.ai</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
