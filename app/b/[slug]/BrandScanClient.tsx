"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { CatalogItem } from "./page";

type BrandConfig = {
  brand_id: string;
  slug: string;
  lead_capture_enabled: boolean;
  app_name: string;
  tagline: string;
  logo_url: string | null;
  primary_color: string;
  remove_powered_by: boolean;
  catalog: CatalogItem[];
};

// welcome → capture → email → processing → (redirect to result page)
type Step = "welcome" | "capture" | "email" | "processing";

export default function BrandScanClient({ brand }: { brand: BrandConfig }) {
  const router                        = useRouter();
  const [step, setStep]               = useState<Step>("welcome");
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null);
  const [error, setError]             = useState("");
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";
  const pc = brand.primary_color;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setError("");
  }

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  // Email is collected BEFORE the scan runs (lead capture). Once the AI finishes,
  // we redirect the customer to their own report page.
  async function submitEmailAndScan() {
    if (!isValidEmail(email)) { setError("Please enter a valid email."); return; }
    if (!selectedFile) { setError("Please take your photo first."); setStep("capture"); return; }

    setStep("processing");
    setError("");
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("terms_accepted", "true");
    fd.append("customer_email", email.trim());
    if (name.trim()) fd.append("customer_name", name.trim());

    try {
      const res = await fetch(`${apiUrl}/brand/${brand.slug}/scan`, { method: "POST", body: fd });
      let data: { detail?: string; skin_type?: string; customer_id?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON */ }
      if (!res.ok || !data.customer_id) {
        setError(data.detail || `Something went wrong (${res.status}). Please try again.`);
        setStep("email");
        return;
      }
      router.push(`/b/${brand.slug}/r/${data.customer_id}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStep("email");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          {brand.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo_url} alt={brand.app_name} className="w-8 h-8 rounded-xl object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ background: pc }}>
              {brand.app_name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-white text-sm">{brand.app_name}</span>
        </div>
        {!brand.remove_powered_by && (
          <span className="text-white/20 text-[10px] tracking-wider">POWERED BY SKINIC AI</span>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10 max-w-lg mx-auto w-full">

        {/* ── WELCOME ── */}
        {step === "welcome" && (
          <div className="text-center space-y-6 w-full">
            <div
              className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center"
              style={{ background: `${pc}22`, border: `1px solid ${pc}44` }}
            >
              {brand.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logo_url} alt="" className="w-14 h-14 rounded-2xl object-contain" />
              ) : (
                <span className="text-3xl font-black text-white">{brand.app_name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{brand.app_name}</h1>
              <p className="text-white/50 text-base leading-relaxed">{brand.tagline}</p>
            </div>
            <div className="space-y-2 text-sm text-white/40">
              <p>✦ AI skin type profiling</p>
              <p>✦ Personalised product &amp; service matching</p>
              <p>✦ Instant personalised report</p>
            </div>
            <button
              onClick={() => setStep("capture")}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90"
              style={{ background: pc }}
            >
              Start My Skin Profile →
            </button>
            <p className="text-white/20 text-xs">
              Cosmetic profiling only — not a medical service.{" "}
              <a href="/terms" className="underline">Terms</a>
            </p>
          </div>
        )}

        {/* ── CAPTURE ── */}
        {step === "capture" && (
          <div className="w-full space-y-5">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-white mb-1">Take your skin photo</h2>
              <p className="text-white/40 text-sm">Use good lighting. Face forward. No filter.</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="preview" className="w-full max-h-72 object-cover" />
                <button
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="absolute top-3 right-3 bg-black/60 text-white/70 text-xs px-3 py-1.5 rounded-full hover:bg-black/80 transition"
                >
                  Retake
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-44 rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-3 hover:border-white/30 transition-colors"
              >
                <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/50 text-sm">Tap to open camera or choose photo</span>
              </button>
            )}

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              onClick={() => { if (!selectedFile) { setError("Please take your photo first."); return; } setError(""); setStep("email"); }}
              disabled={!selectedFile}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: pc }}
            >
              Continue →
            </button>
            <p className="text-white/20 text-xs text-center">
              Your photo is processed in real-time and not stored.
            </p>
          </div>
        )}

        {/* ── EMAIL (mandatory, before scan) ── */}
        {step === "email" && (
          <div className="w-full space-y-5">
            <div className="text-center mb-1">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
                style={{ background: `${pc}1a`, border: `1px solid ${pc}33` }}
              >
                <svg className="w-6 h-6" style={{ color: pc }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Almost there — enter your email</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                We&apos;ll use this to prepare your personalised skin profile &amp; product recommendations.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Your name <span className="text-white/25">(optional)</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/25"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Email address</label>
                <input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/25"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              onClick={submitEmailAndScan}
              disabled={!email.trim()}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: pc }}
            >
              See My Skin Report →
            </button>
            <p className="text-white/15 text-xs text-center">
              Your details are shared only with {brand.app_name}. Not stored by SKINIC.
            </p>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {step === "processing" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full border-2 border-white/10 border-t-violet-400 animate-spin" />
            <div>
              <p className="text-white font-semibold text-lg">Analysing your skin...</p>
              <p className="text-white/40 text-sm mt-1">Preparing your report — this takes a moment.</p>
            </div>
            <div className="space-y-1.5 text-sm text-white/30">
              <p>✦ Skin type profiling</p>
              <p>✦ Visible trait scoring</p>
              <p>✦ Matching recommendations</p>
              <p>✦ Building your report</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
