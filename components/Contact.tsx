export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-3">Get Started</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Pick your path</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Beauty business or app builder — same platform, same AI. Free to start, no credit card.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="card-glass rounded-2xl p-8 flex flex-col">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-2">SKINIC Studio</p>
            <h3 className="text-xl font-bold mb-2">For beauty businesses</h3>
            <p className="text-white/65 text-sm leading-relaxed mb-6 flex-1">
              Branded scan page, product matching, lead capture, and customer database. No code, no app store — live in minutes.
            </p>
            <a
              href="/signup?product=studio"
              className="text-center px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all"
            >
              Start Studio Free →
            </a>
          </div>

          <div className="card-glass rounded-2xl p-8 flex flex-col border-blue-500/15">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">SKINIC API</p>
            <h3 className="text-xl font-bold mb-2">For developers</h3>
            <p className="text-white/65 text-sm leading-relaxed mb-6 flex-1">
              REST API with full skin profiles, product matching, and ingredient guides. 20 free analyzes/month to evaluate.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/signup?product=api"
                className="text-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
              >
                Get API Key →
              </a>
              <a
                href="https://api.skinic.app"
                target="_blank"
                rel="noreferrer"
                className="text-center px-6 py-3 rounded-xl border border-white/15 hover:border-blue-500/40 text-white/75 hover:text-white font-medium text-sm transition-all"
              >
                Docs ↗
              </a>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-white/35">
          Enterprise or custom SLA?{" "}
          <a href="/enterprise" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
            Contact sales
          </a>
        </p>
      </div>
    </section>
  );
}
