"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type Mode = "signup" | "signin";
type Intent = "studio" | "api";

export default function AuthPageClient({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const isSignup = mode === "signup";

  const defaultIntent: Intent = searchParams.get("product") === "studio" ? "studio" : "api";
  const [intent, setIntent] = useState<Intent>(defaultIntent);
  const [form, setForm] = useState({ email: "", password: "", name: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, company: form.company, product_intent: intent },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email and click the verification link to activate your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-xl font-bold tracking-tight">
              SKINIC <span className="text-violet-400">Studio</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-white/40 text-sm">
            {isSignup ? "Get started — it's free" : "Sign in to access your dashboard"}
          </p>
        </div>

        <div className="card-glass rounded-2xl p-8">
          {success ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Check your email</h2>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{success}</p>
              <Link href="/signin" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
                Back to sign in →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Intent selector — signup only */}
              {isSignup && (
                <div className="mb-2">
                  <p className="text-white/50 text-xs font-medium mb-2">I am a...</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIntent("studio")}
                      className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border text-left transition-all ${
                        intent === "studio"
                          ? "border-violet-500/60 bg-violet-500/10 text-white"
                          : "border-white/10 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/60"
                      }`}
                    >
                      <span className="text-base">🏪</span>
                      <span className="text-xs font-semibold">Beauty Business</span>
                      <span className="text-[10px] text-white/35 leading-tight">Salon, brand, studio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntent("api")}
                      className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border text-left transition-all ${
                        intent === "api"
                          ? "border-violet-500/60 bg-violet-500/10 text-white"
                          : "border-white/10 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/60"
                      }`}
                    >
                      <span className="text-base">⚡</span>
                      <span className="text-xs font-semibold">Developer</span>
                      <span className="text-[10px] text-white/35 leading-tight">Building an app or API</span>
                    </button>
                  </div>
                </div>
              )}

              {isSignup && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    type="text"
                    placeholder="Full name"
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
              )}

              <input
                required
                type="email"
                placeholder="Work email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />

              <input
                required
                type="password"
                placeholder="Password (min. 8 characters)"
                minLength={8}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
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
                {loading
                  ? (isSignup ? "Creating account..." : "Signing in...")
                  : (isSignup ? "Create Account" : "Sign In")}
              </button>

              {isSignup && (
                <p className="text-center text-white/20 text-xs">
                  By signing up you agree to the{" "}
                  <Link href="/terms" className="text-violet-400">Terms of Service</Link>
                </p>
              )}
            </form>
          )}
        </div>

        <p className="text-center text-white/30 text-sm mt-5">
          {isSignup ? (
            <>Already have an account? <Link href="/signin" className="text-violet-400 hover:text-violet-300">Sign in</Link></>
          ) : (
            <>Don&apos;t have an account? <Link href="/signup" className="text-violet-400 hover:text-violet-300">Sign up free</Link></>
          )}
        </p>
      </div>
    </main>
  );
}
