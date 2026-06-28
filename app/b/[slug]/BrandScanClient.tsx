"use client";
import { useState, useRef } from "react";
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

type ScanResult = {
  skin_type: { type: string; confidence: number; description: string };
  concerns: { name: string; score: number; level: string }[];
  measurements: { skin_score: number; skin_label: string } | null;
  skin_tone: { undertone: string; season: string; hex_avg: string; fitzpatrick: number } | null;
};

type ScanResponse = {
  scan_id: string | null;
  result: ScanResult;
  matched: CatalogItem[];
};

// welcome → capture → processing → teaser → result
type Step = "welcome" | "capture" | "processing" | "teaser" | "result";

export default function BrandScanClient({ brand }: { brand: BrandConfig }) {
  const [step, setStep]               = useState<Step>("welcome");
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null);
  const [scanData, setScanData]       = useState<ScanResponse | null>(null);
  const [saving, setSaving]           = useState(false);
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

  async function runScan() {
    if (!selectedFile) { setError("Please select a photo first."); return; }
    setStep("processing");
    setError("");
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("terms_accepted", "true");
    try {
      const res = await fetch(`${apiUrl}/brand/${brand.slug}/scan`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Scan failed. Please try again.");
        setStep("capture");
        return;
      }
      setScanData(data);
      setStep("teaser");
    } catch {
      setError("Network error. Please check your connection.");
      setStep("capture");
    }
  }

  async function saveLead(skip = false) {
    if (!scanData?.scan_id) { setStep("result"); return; }
    if (skip) { setStep("result"); return; }

    const trimName  = name.trim();
    const trimEmail = email.trim();
    if (!trimName && !trimEmail) {
      setError("Please enter your name or email.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await fetch(`${apiUrl}/brand/${brand.slug}/save-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scan_id: scanData.scan_id, name: trimName, email: trimEmail }),
      });
    } catch {
      // non-blocking — proceed regardless
    }
    setSaving(false);
    setStep("result");
  }

  function rescan() {
    setStep("welcome");
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanData(null);
    setName("");
    setEmail("");
    setError("");
  }

  const scoreColor = (s: number) => s >= 65 ? pc : s >= 45 ? "#f59e0b" : "#ef4444";

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
              <p>✦ Takes less than 30 seconds</p>
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
              onClick={runScan}
              disabled={!selectedFile}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: pc }}
            >
              Analyse My Skin →
            </button>
            <p className="text-white/20 text-xs text-center">
              Your photo is processed in real-time and not stored.
            </p>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {step === "processing" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full border-2 border-white/10 border-t-violet-400 animate-spin" />
            <div>
              <p className="text-white font-semibold text-lg">Analysing your skin...</p>
              <p className="text-white/40 text-sm mt-1">4-layer AI profiling in progress</p>
            </div>
            <div className="space-y-1.5 text-sm text-white/30">
              <p>✦ Skin type profiling</p>
              <p>✦ Visible trait scoring</p>
              <p>✦ Deep texture embeddings</p>
              <p>✦ Matching recommendations</p>
            </div>
          </div>
        )}

        {/* ── TEASER + GATE ── */}
        {step === "teaser" && scanData && (
          <div className="w-full space-y-5">
            {/* Teaser — partial result */}
            <div className="text-center mb-1">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Your Skin Profile</p>
              <div
                className="rounded-2xl p-5 border mb-4"
                style={{ background: `${pc}10`, borderColor: `${pc}30` }}
              >
                <div className="flex items-center justify-center gap-4">
                  {scanData.result.measurements && (
                    <div
                      className="w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center shrink-0"
                      style={{ borderColor: scoreColor(scanData.result.measurements.skin_score) + "88" }}
                    >
                      <span className="text-2xl font-black text-white leading-none">
                        {Math.round(scanData.result.measurements.skin_score)}
                      </span>
                      <span className="text-[9px] text-white/30">/100</span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-white font-bold text-xl">{scanData.result.skin_type.type} Skin</p>
                    <p className="text-white/40 text-xs mt-0.5">{scanData.result.skin_type.description?.split(".")[0]}.</p>
                  </div>
                </div>
              </div>

              {/* Locked content preview */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4 relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 flex flex-col items-center justify-center z-10 rounded-2xl">
                  <svg className="w-5 h-5 text-white/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-white/70 text-sm font-semibold">
                    {scanData.matched.length > 0
                      ? `${scanData.matched.length} personalised pick${scanData.matched.length > 1 ? "s" : ""} waiting`
                      : `${scanData.result.concerns.length} skin traits analysed`}
                  </p>
                  <p className="text-white/35 text-xs mt-0.5">Enter your details to unlock</p>
                </div>
                {/* Blurred content beneath */}
                <div className="space-y-2 pointer-events-none select-none">
                  {(scanData.matched.length > 0 ? scanData.matched : scanData.result.concerns).slice(0, 3).map((item, i) => (
                    <div key={i} className="h-10 rounded-xl bg-white/5 blur-[2px]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Lead capture form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Your name</label>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/25"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              onClick={() => saveLead(false)}
              disabled={saving}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: pc }}
            >
              {saving ? "Saving..." : "Unlock My Full Report →"}
            </button>

            {!brand.lead_capture_enabled && (
              <button
                onClick={() => saveLead(true)}
                className="w-full text-white/25 text-xs hover:text-white/40 transition-colors py-1"
              >
                Skip — view without saving
              </button>
            )}

            <p className="text-white/15 text-xs text-center">
              Your details are only shared with {brand.app_name}. Not stored by SKINIC.
            </p>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && scanData && (
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Your Skin Profile</h2>
              <p className="text-white/40 text-sm mt-1">Powered by {brand.app_name}</p>
            </div>

            {/* Score card */}
            <div
              className="rounded-2xl p-5 border"
              style={{ background: `${pc}10`, borderColor: `${pc}30` }}
            >
              <div className="flex items-center gap-4">
                {scanData.result.measurements && (
                  <div
                    className="w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center shrink-0"
                    style={{ borderColor: scoreColor(scanData.result.measurements.skin_score) + "66" }}
                  >
                    <span className="text-xl font-black text-white leading-none">
                      {Math.round(scanData.result.measurements.skin_score)}
                    </span>
                    <span className="text-[9px] text-white/30">/100</span>
                  </div>
                )}
                <div>
                  <p className="text-white font-bold text-lg">{scanData.result.skin_type.type} Skin</p>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed line-clamp-2">
                    {scanData.result.skin_type.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {scanData.result.concerns.slice(0, 5).map((c) => (
                  <span
                    key={c.name}
                    className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/60"
                  >
                    {c.name} · {c.level}
                  </span>
                ))}
              </div>
            </div>

            {/* Matched catalog */}
            {scanData.matched.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                  Recommended for your skin
                </p>
                <div className="space-y-3">
                  {scanData.matched.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/8 bg-white/3 p-4 flex items-start gap-4"
                    >
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/8 text-white/40 uppercase font-semibold tracking-wider">
                            {item.type}
                          </span>
                          {item.price && <span className="text-[10px] text-white/40">{item.price}</span>}
                        </div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-white/40 mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      {item.cta_url && (
                        <a
                          href={item.cta_url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-xs font-semibold px-3 py-2 rounded-xl text-white transition-all hover:opacity-80"
                          style={{ background: pc }}
                        >
                          {item.cta_label}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rescan */}
            <button
              onClick={rescan}
              className="w-full py-3 rounded-2xl border border-white/10 text-white/50 text-sm font-medium hover:border-white/20 hover:text-white/70 transition-all"
            >
              Scan Again
            </button>

            {!brand.remove_powered_by && (
              <p className="text-center text-white/15 text-[10px] tracking-wider">POWERED BY SKINIC AI</p>
            )}
            <p className="text-center text-white/20 text-xs">
              Cosmetic profiling only — not medical advice.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
