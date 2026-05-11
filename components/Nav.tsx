"use client";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="text-lg font-bold gradient-text tracking-tight">SKINIC</span>
          <span className="text-xs text-white/30 font-mono mt-0.5">API</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#ai-stack" className="hover:text-white transition-colors">AI Stack</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a>
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
          <a
            href="/signup"
            className="text-sm px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            Get API Key
          </a>
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
          <a href="/signup" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-violet-600 text-white text-center font-medium">Get API Key</a>
        </div>
      )}
    </nav>
  );
}
