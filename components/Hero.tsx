export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-emerald-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          API v1.9 — Production Ready
        </div>

        <h1 className="fade-up-delay-1 text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
          AI Skin Intelligence{" "}
          <span className="gradient-text">for Every Platform</span>
        </h1>

        <p className="fade-up-delay-2 text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Enterprise-grade skin analysis API. Integrate multi-layer AI — skin-type analysis,
          aesthetic concern detection, and deep skin embeddings — into your app in minutes.
        </p>

        <div className="fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/signup"
            className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-500/25"
          >
            Get Free API Key
          </a>
          <a
            href="https://api.skinic.app/docs"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium text-base transition-all"
          >
            View API Docs →
          </a>
        </div>

        <div className="fade-up-delay-3 mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/30">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            HTTPS / api.skinic.app
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            500+ Ingredient Knowledge Base
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            Deep Skin Embeddings
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            PDPA + GDPR Ready
          </span>
        </div>
      </div>
    </section>
  );
}
