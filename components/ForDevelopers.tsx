const useCases = [
  {
    title: "Skincare & beauty apps",
    description: "Add AI skin profiling to your iOS, Android, or web app. Multi-frame /scan for stable results and 128-dim fingerprints for progress tracking.",
    tags: ["Mobile", "Progress tracking"],
    color: "text-blue-400",
  },
  {
    title: "E-commerce & retail",
    description: "Match your product catalog to each customer's skin profile. POST /match-catalog ranks items with scores and reasons — same engine as SKINIC Studio.",
    tags: ["Product matching", "BYOC catalog"],
    color: "text-emerald-400",
  },
  {
    title: "Ingredient & quiz flows",
    description: "Pair skin analysis with POST /recommend for AI ingredient guides grounded in 551+ ingredients. Free tier includes static guides; Starter+ unlocks SKINIC AI.",
    tags: ["RAG ingredients", "Quiz UX"],
    color: "text-violet-400",
  },
];

const apiFeatures = [
  "4-layer AI — skin type, 8 traits, blemish map, colour season",
  "POST /analyze + multi-frame POST /scan",
  "POST /match-catalog — rank your products with match scores",
  "POST /recommend — ingredient guide (AI on Starter+)",
  "128-dim skin fingerprint + cross-scan stability",
  "White-label via GET /brand (Pro+ removes SKINIC branding)",
];

export default function ForDevelopers() {
  return (
    <section id="for-developers" className="py-28 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">For Developers</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Same AI engine.{" "}
            <span className="gradient-text">Your product.</span>
          </h2>
          <p className="mt-4 text-white/75 text-lg max-w-2xl mx-auto">
            Integrate SKINIC&apos;s skin intelligence REST API into your app, storefront, or quiz.
            Full raw JSON — richer than the Studio UI — with product matching built in.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {useCases.map((item) => (
            <div key={item.title} className="card-glass rounded-2xl p-6 hover:border-blue-500/20 transition-colors">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2.5 py-1 rounded-full border border-white/10 ${item.color}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-glass rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-4">What your API key unlocks</h3>
            <ul className="space-y-3">
              {apiFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-white/75">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-white/45 leading-relaxed">
              Free tier: 20 analyzes/month, product matching (20 items), static ingredient guide.
              Match-catalog calls do not consume analyze quota.
            </p>
          </div>

          <div className="card-glass rounded-2xl p-8 border-blue-500/15">
            <h3 className="text-lg font-semibold mb-4">Quick integration</h3>
            <pre className="text-xs text-white/60 leading-relaxed overflow-x-auto font-mono bg-black/30 rounded-xl p-4 border border-white/5">
{`# 1. Analyze
POST /analyze  +  X-API-Key
→ skin_type, concerns, health score,
  colour season, skin fingerprint

# 2. Match your catalog
POST /match-catalog
→ ranked products + match_score

# 3. Ingredient guide (optional)
POST /recommend
→ ingredients, pH range, avoid list`}
            </pre>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="/signup?product=api"
                className="text-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
              >
                Get Free API Key
              </a>
              <a
                href="https://api.skinic.app"
                target="_blank"
                rel="noreferrer"
                className="text-center px-6 py-2.5 rounded-xl border border-white/15 hover:border-blue-500/40 text-white/80 hover:text-white font-medium text-sm transition-all"
              >
                API Docs ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
