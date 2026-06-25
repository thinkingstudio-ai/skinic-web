export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-3">Get Access</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-5">
          Ready to integrate?
        </h2>
        <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
          Get a free API key instantly. No credit card required for Free tier.
          Enterprise clients — contact us for custom onboarding.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="/signup"
            className="px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-500/25"
          >
            Get Free API Key →
          </a>
          <a
            href="/enterprise"
            className="px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium text-base transition-all"
          >
            Contact for Enterprise
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Free tier — no credit card
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Key generated instantly
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Full multi-layer AI access
          </span>
        </div>
      </div>
    </section>
  );
}
