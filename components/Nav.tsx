"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const initials = user
    ? (user.user_metadata?.name || user.email || "U")
        .split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold gradient-text tracking-tight">SKINIC</span>
          <span className="text-xs text-white/30 font-mono mt-0.5">API</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#ai-stack" className="hover:text-white transition-colors">AI Stack</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a>
          <Link href="/ar" className="hover:text-white transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            AR Try-On
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://api.skinic.app/docs"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            API Explorer
          </a>
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm text-white/70 hover:text-white transition-colors">Dashboard</span>
            </Link>
          ) : (
            <>
              <Link href="/signin" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
              >
                Get API Key
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0f] px-6 py-4 flex flex-col gap-4 text-sm text-white/60">
          <a href="#how-it-works" onClick={() => setOpen(false)} className="hover:text-white">How It Works</a>
          <a href="#ai-stack" onClick={() => setOpen(false)} className="hover:text-white">AI Stack</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="hover:text-white">Pricing</a>
          <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="hover:text-white">Docs</a>
          <Link href="/ar" onClick={() => setOpen(false)} className="hover:text-white flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            AR Try-On
          </Link>
          {user ? (
            <Link href="/dashboard" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-white/10 text-white text-center font-medium">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/signin" onClick={() => setOpen(false)} className="hover:text-white">Sign In</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-violet-600 text-white text-center font-medium">Get API Key</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
