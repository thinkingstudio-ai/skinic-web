"use client";

import { useState } from "react";

const USE_CASES = [
  "Beauty brand / DTC skincare",
  "E-commerce platform",
  "Aesthetic clinic or beauty centre",
  "Mobile app / consumer product",
  "In-store / kiosk deployment",
  "B2B SaaS / reseller",
  "Other",
];

const VOLUMES = [
  "< 10,000 scans/month",
  "10,000 – 50,000 scans/month",
  "50,000 – 200,000 scans/month",
  "> 200,000 scans/month",
  "Not sure yet",
];

export default function EnterprisePage() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", website: "",
    useCase: "", volume: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enterprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please email admin.thinkingstudio@gmail.com directly.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-24">

        {/* Header */}
        <div className="mb-12">
          <a href="/" className="text-violet-400 hover:text-violet-300 text-sm font-medium mb-8 inline-block">
            ← Back to SKINIC
          </a>
          <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">Enterprise</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Let&apos;s build something together
          </h1>
          <p className="text-white/55 text-base leading-relaxed">
            Tell us about your integration. We&apos;ll review your requirements and get back within 1 business day
            with a tailored setup — including white-label branding, custom limits, and a Paddle payment link.
          </p>
        </div>

        {/* What you get */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            ["White-label branding", "Your brand name in all API responses — no SKINIC mentions"],
            ["Custom rate limits", "Analyze and recommend limits tuned to your traffic pattern"],
            ["Direct engineer access", "Slack or email thread with the SKINIC team"],
            ["Contract & DPA", "MSA, Data Processing Agreement, custom SLA on request"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-xl p-4 bg-white/[0.04] border border-white/8">
              <p className="text-sm font-semibold text-white mb-1">{title}</p>
              <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {status === "success" ? (
          <div className="rounded-2xl p-8 bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold mb-2">Inquiry received</h2>
            <p className="text-white/55 text-sm">
              We&apos;ll review your requirements and reply to <span className="text-white/80">{form.email}</span> within 1 business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">Full name <span className="text-red-400">*</span></label>
                <input
                  name="name" required value={form.name} onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">Company <span className="text-red-400">*</span></label>
                <input
                  name="company" required value={form.company} onChange={handleChange}
                  placeholder="Glow Cosmetics Sdn Bhd"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Work email <span className="text-red-400">*</span></label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="jane@glowcosmetics.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Website or app URL</label>
              <input
                name="website" value={form.website} onChange={handleChange}
                placeholder="https://glowcosmetics.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">Use case <span className="text-red-400">*</span></label>
                <select
                  name="useCase" required value={form.useCase} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition appearance-none"
                >
                  <option value="" disabled className="bg-zinc-900">Select a use case</option>
                  {USE_CASES.map((u) => <option key={u} value={u} className="bg-zinc-900">{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5 font-medium">Estimated monthly scans</label>
                <select
                  name="volume" value={form.volume} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition appearance-none"
                >
                  <option value="" className="bg-zinc-900">Not sure</option>
                  {VOLUMES.map((v) => <option key={v} value={v} className="bg-zinc-900">{v}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5 font-medium">Additional requirements</label>
              <textarea
                name="message" value={form.message} onChange={handleChange} rows={4}
                placeholder="White-label brand name, custom domain needs, SLA requirements, integration timeline..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {errorMsg}
              </p>
            )}

            <button
              type="submit" disabled={status === "loading"}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow-lg shadow-violet-500/20"
            >
              {status === "loading" ? "Sending..." : "Send Enterprise Inquiry"}
            </button>

            <p className="text-center text-xs text-white/30">
              We reply within 1 business day. Or email us directly at{" "}
              <a href="mailto:admin.thinkingstudio@gmail.com" className="text-violet-400 hover:text-violet-300">admin.thinkingstudio@gmail.com</a>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
