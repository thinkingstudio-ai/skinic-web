import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export const metadata = {
  title: "SKINIC-AR — AI Makeup Try-On API",
  description:
    "AR makeup try-on that understands your skin. Pass skin data from SKINIC, get personalised look renders in seconds.",
};

// ---------------------------------------------------------------------------
// Section: Hero
// ---------------------------------------------------------------------------
function ARHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-rose-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-pink-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          SKINIC-AR v1.0 — Now Live
        </div>

        <h1 className="fade-up-delay-1 text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
          AR Try-On That{" "}
          <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
            Knows Your Skin
          </span>
        </h1>

        <p className="fade-up-delay-2 text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Pass a face photo + skin profile → get 3 personalised makeup looks rendered in seconds.
          Colours chosen for your undertone, adjusted for your skin concerns.
        </p>

        <div className="fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/enterprise"
            className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-base transition-all hover:shadow-lg hover:shadow-rose-500/25"
          >
            Request API Access
          </a>
          <a
            href="https://ar.skinic.app/docs"
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
            ar.skinic.app
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            45 Personalised Looks
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            Skin-Intelligent Colours
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            B2B Embeddable
          </span>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: How It Works
// ---------------------------------------------------------------------------
function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Capture Face Photo",
      description:
        "User takes or uploads a front-facing photo. SKINIC-AR detects 468 facial landmarks using Google MediaPipe.",
      color: "text-rose-400",
      border: "border-rose-500/20",
      bg: "bg-rose-500/5",
    },
    {
      number: "02",
      title: "Pass Skin Profile",
      description:
        "Send skin_tone, undertone, concerns, and occasion from your SKINIC /analyze response — or from your own skin engine.",
      color: "text-violet-400",
      border: "border-violet-500/20",
      bg: "bg-violet-500/5",
    },
    {
      number: "03",
      title: "Get 3 Personalised Looks",
      description:
        "SKINIC-AR selects colours from a 45-look palette matrix, applies them via PIL compositing, and returns rendered images + AI tips.",
      color: "text-pink-400",
      border: "border-pink-500/20",
      bg: "bg-pink-500/5",
    },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose-400 text-sm font-medium tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold">Three steps to personalised AR</h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            From photo to rendered look in under 500ms. No ML expertise required on your end.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`rounded-2xl border ${step.border} ${step.bg} p-8`}
            >
              <div className={`text-4xl font-bold ${step.color} mb-4 font-mono`}>{step.number}</div>
              <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: API Request/Response Demo
// ---------------------------------------------------------------------------
function CodeDemo() {
  const request = `POST https://ar.skinic.app/v1/tryon
X-API-Key: sk-ar-your_key_here

{
  "file": <face_image>,
  "skin_tone": "medium",
  "undertone": "warm",
  "occasion": "dinner",
  "concerns": "acne,dry_skin",
  "look_count": 3
}`;

  const response = `{
  "looks": [
    {
      "id": "look_001",
      "name": "Berry Warm",
      "image_b64": "<JPEG base64>",
      "palette": {
        "lip": "#8C2846",
        "blush": "#C86E5A",
        "eye": "#78420A",
        "lip_finish": "satin",
        "blush_finish": "cream"
      },
      "tip": "Berry tones complement your warm undertone...",
      "description": "Rich berry drama"
    }
  ],
  "occasion": "dinner",
  "undertone": "warm",
  "processing_ms": 420
}`;

  return (
    <section className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose-400 text-sm font-medium tracking-widest uppercase mb-3">API</p>
          <h2 className="text-3xl md:text-5xl font-bold">One endpoint. Full look output.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Request</p>
            <div className="rounded-2xl bg-white/5 border border-white/8 p-6 font-mono text-sm text-white/70 leading-relaxed whitespace-pre overflow-x-auto">
              {request}
            </div>
          </div>
          <div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Response</p>
            <div className="rounded-2xl bg-white/5 border border-white/8 p-6 font-mono text-sm text-white/70 leading-relaxed whitespace-pre overflow-x-auto">
              {response}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: Occasions × Undertone
// ---------------------------------------------------------------------------
function PaletteMatrix() {
  const occasions = ["Casual", "Office", "Dinner", "Wedding", "Date Night"];
  const undertones = [
    { name: "Warm", dot: "bg-amber-400", examples: ["Peach nude", "Berry lip", "Coral bride"] },
    { name: "Cool", dot: "bg-blue-400", examples: ["Rose nude", "Plum drama", "Pink bride"] },
    { name: "Neutral", dot: "bg-emerald-400", examples: ["MLBB nude", "Berry rose", "Rose bride"] },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose-400 text-sm font-medium tracking-widest uppercase mb-3">Palette Intelligence</p>
          <h2 className="text-3xl md:text-5xl font-bold">45 looks. Every skin. Every occasion.</h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            3 undertones × 5 occasions × 3 variations — all adjusted in real-time for skin concerns.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {undertones.map((ut) => (
            <div key={ut.name} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${ut.dot}`} />
                <span className="font-semibold">{ut.name} Undertone</span>
              </div>
              <ul className="space-y-2">
                {ut.examples.map((ex) => (
                  <li key={ex} className="text-sm text-white/40 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    {ex}
                  </li>
                ))}
                <li className="text-sm text-white/20 italic">+ 12 more looks</li>
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {occasions.map((occ) => (
            <span
              key={occ}
              className="px-4 py-2 rounded-full border border-white/10 text-white/50 text-sm"
            >
              {occ}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: Skin Concern Adjustments
// ---------------------------------------------------------------------------
function ConcernAdjustments() {
  const concerns = [
    { label: "Acne", tip: "Buildable coverage formula. Avoid heavy powder that emphasises texture." },
    { label: "Dry Skin", tip: "Satin & dewy finishes only. Cream blush. No setting powder." },
    { label: "Oily Skin", tip: "Powder T-zone only. Long-wear formulas. Cream blush on cheeks." },
    { label: "Dark Spots", tip: "Higher coverage base. Brightening highlighter on high points." },
    { label: "Wrinkles", tip: "Avoid matte finish. Cream formulas move naturally with skin." },
  ];

  return (
    <section className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose-400 text-sm font-medium tracking-widest uppercase mb-3">Skin-Aware</p>
          <h2 className="text-3xl md:text-5xl font-bold">Looks adjusted for skin concerns</h2>
          <p className="text-white/40 mt-4 max-w-xl mx-auto">
            Pass concern flags from SKINIC — SKINIC-AR automatically adjusts formula recommendations and finish types.
          </p>
        </div>

        <div className="space-y-3">
          {concerns.map((c) => (
            <div key={c.label} className="flex items-start gap-4 rounded-xl border border-white/8 bg-white/[0.02] px-6 py-4">
              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 text-xs font-medium shrink-0 mt-0.5">
                {c.label}
              </span>
              <p className="text-white/50 text-sm leading-relaxed">{c.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: Pricing
// ---------------------------------------------------------------------------
function ARPricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      looks: "100 looks/mo",
      rpm: "5 req/min",
      cta: "Request Access",
      href: "/enterprise",
      highlight: false,
    },
    {
      name: "Starter",
      price: "$29",
      looks: "2,000 looks/mo",
      rpm: "20 req/min",
      cta: "Request Access",
      href: "/enterprise",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$99",
      looks: "10,000 looks/mo",
      rpm: "60 req/min",
      cta: "Request Access",
      href: "/enterprise",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      looks: "Unlimited",
      rpm: "Custom",
      cta: "Contact Sales",
      href: "/enterprise",
      highlight: false,
    },
  ];

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-rose-400 text-sm font-medium tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold">Pay per look generation</h2>
          <p className="text-white/40 mt-4">Usage-based. Scale as your app grows.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-6 flex flex-col gap-4 ${
                tier.highlight
                  ? "border-rose-500/40 bg-rose-500/5"
                  : "border-white/8 bg-white/[0.02]"
              }`}
            >
              {tier.highlight && (
                <span className="text-xs font-medium text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-full w-fit">
                  Most Popular
                </span>
              )}
              <div>
                <p className="text-white/50 text-sm mb-1">{tier.name}</p>
                <p className="text-3xl font-bold">
                  {tier.price}
                  {tier.price !== "Custom" && <span className="text-base font-normal text-white/30">/mo</span>}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-white/50 flex-1">
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {tier.looks}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {tier.rpm}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  AI styling tips
                </li>
              </ul>
              <a
                href={tier.href}
                className={`w-full text-center py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tier.highlight
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "border border-white/10 hover:border-white/20 text-white/70 hover:text-white"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section: CTA
// ---------------------------------------------------------------------------
function ARCTA() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-5">
          Ready to add AR try-on to your app?
        </h2>
        <p className="text-white/40 text-lg mb-10">
          One API call. Personalised looks. Skin-intelligent colours. Built for beauty brands and developers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/enterprise"
            className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-base transition-all hover:shadow-lg hover:shadow-rose-500/25"
          >
            Request API Access →
          </a>
          <a
            href="https://ar.skinic.app/docs"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium text-base transition-all"
          >
            Read the Docs
          </a>
        </div>
        <p className="text-white/20 text-sm mt-8">
          Pairs seamlessly with{" "}
          <a href="/" className="text-violet-400 hover:text-violet-300">SKINIC skin analysis API</a>
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ARPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Nav />
      <ARHero />
      <HowItWorks />
      <CodeDemo />
      <PaletteMatrix />
      <ConcernAdjustments />
      <ARPricing />
      <ARCTA />
      <Footer />
    </main>
  );
}
