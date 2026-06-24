const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try SKINIC for personal projects and prototypes.",
    limits: [
      { label: "Monthly calls", value: "100 calls", tooltip: "Total API calls allowed per month across all endpoints" },
      { label: "Skin analysis", value: "5 req/min", tooltip: "Max /analyze requests per minute — each call processes one skin image" },
      { label: "AI recommendations", value: "—", tooltip: "Not included in Free tier. Upgrade to Starter for full AI-powered ingredient recommendations." },
    ],
    features: [
      "Full 3-layer AI skin analysis",
      "Static ingredient list (no AI)",
      "Docs & self-service only",
    ],
    disabledFeatures: [
      "AI-powered recommendations",
    ],
    cta: "Get Started",
    ctaHref: "/signup",
    popular: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For indie apps and small-scale integrations.",
    limits: [
      { label: "Monthly calls", value: "2,000 calls", tooltip: "Total API calls allowed per month — resets on the 1st of each month" },
      { label: "Skin analysis", value: "20 req/min", tooltip: "Max /analyze requests per minute — suitable for up to ~20 concurrent users" },
      { label: "AI recommendations", value: "30 req/min", tooltip: "Max /recommend requests per minute — full DeepSeek AI-powered responses" },
    ],
    features: [
      "Everything in Free",
      "Full AI ingredient recommendations",
      "Higher rate limits",
      "Email support",
      "Usage dashboard",
    ],
    cta: "Get Starter",
    ctaHref: "/signup?upgrade=starter",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For growing platforms and clinic management systems.",
    limits: [
      { label: "Monthly calls", value: "10,000 calls", tooltip: "Total API calls allowed per month — resets on the 1st of each month" },
      { label: "Skin analysis", value: "60 req/min", tooltip: "Max /analyze requests per minute — suitable for up to ~60 concurrent users" },
      { label: "AI recommendations", value: "100 req/min", tooltip: "Max /recommend requests per minute — suitable for high-traffic platforms" },
    ],
    features: [
      "Everything in Starter",
      "Postman collection",
      "Priority email support",
    ],
    cta: "Get Pro",
    ctaHref: "/signup?upgrade=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/month",
    description: "For hospital networks, large beauty platforms, and insurers.",
    limits: [
      { label: "Monthly calls", value: "Unlimited", tooltip: "No monthly call cap" },
      { label: "Skin analysis", value: "200 req/min", tooltip: "Custom limits available on request" },
      { label: "AI recommendations", value: "500 req/min", tooltip: "Custom limits available on request" },
    ],
    features: [
      "Everything in Pro",
      "Custom rate limits",
      "White-label option",
      "HIPAA/PDPA advisory",
      "Direct engineer access",
      "Custom contract",
    ],
    cta: "Contact Sales",
    ctaHref: "#contact",
    hidden: true,
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-white/40 text-lg">
            Start free, scale as you grow. All tiers include the full AI stack.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tiers.filter((t) => !("hidden" in t && t.hidden)).map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-6 flex flex-col relative ${
                tier.popular ? "tier-popular" : "card-glass"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <p className="text-white/50 text-sm font-medium mb-1">{tier.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-white/40 text-sm">{tier.period}</span>
                </div>
                <p className="text-white/40 text-xs mt-2 leading-relaxed">{tier.description}</p>
              </div>

              <div className="mb-5 space-y-1.5">
                {tier.limits.map((limit) => {
                  const isDisabled = limit.value === "—";
                  return (
                    <div key={limit.label} className={`flex items-center justify-between rounded-lg px-3 py-2 group relative ${isDisabled ? "bg-white/2 opacity-40" : "bg-white/5"}`}>
                      <span className={`text-xs ${isDisabled ? "text-white/30 line-through" : "text-white/40"}`}>{limit.label}</span>
                      <span className={`text-xs font-mono font-medium ${isDisabled ? "text-white/25" : "text-white/60"}`}>{limit.value}</span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                        {limit.tooltip}
                      </div>
                    </div>
                  );
                })}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
                {"disabledFeatures" in tier && tier.disabledFeatures?.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/25 line-through">
                    <svg className="w-3.5 h-3.5 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={tier.ctaHref}
                target={tier.ctaHref.startsWith("http") ? "_blank" : undefined}
                rel={tier.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-all ${
                  tier.popular
                    ? "bg-violet-600 hover:bg-violet-500 text-white"
                    : "border border-white/10 hover:border-white/20 text-white/70 hover:text-white"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-white/25 text-sm mt-8">
          All prices in USD. &nbsp;·&nbsp; Need higher volume or custom SLA?{" "}
          <a href="/enterprise" className="text-violet-400 hover:text-violet-300">Contact us for Enterprise</a>.
        </p>
      </div>
    </section>
  );
}
