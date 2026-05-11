const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try SKINIC for personal projects and prototypes.",
    calls: "100 calls/month",
    analyze_rpm: "5 analyze/min",
    recommend_rpm: "10 recommend/min",
    features: [
      "Full 3-layer AI analysis",
      "Ingredient recommendations",
      "JSON response",
      "Community support",
    ],
    cta: "Get Started",
    ctaHref: "#contact",
    popular: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For indie apps and small-scale integrations.",
    calls: "2,000 calls/month",
    analyze_rpm: "20 analyze/min",
    recommend_rpm: "30 recommend/min",
    features: [
      "Everything in Free",
      "Higher rate limits",
      "Email support",
      "Usage dashboard",
    ],
    cta: "Request Access",
    ctaHref: "#contact",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For growing platforms and clinic management systems.",
    calls: "10,000 calls/month",
    analyze_rpm: "60 analyze/min",
    recommend_rpm: "100 recommend/min",
    features: [
      "Everything in Starter",
      "Priority support",
      "SLA guarantee",
      "Postman collection",
      "Dedicated onboarding",
    ],
    cta: "Request Access",
    ctaHref: "#contact",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/month",
    description: "For hospital networks, large beauty platforms, and insurers.",
    calls: "Unlimited",
    analyze_rpm: "200 analyze/min",
    recommend_rpm: "500 recommend/min",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier) => (
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
                <div className="text-xs font-mono text-white/30 bg-white/5 rounded-lg px-3 py-2">{tier.calls}</div>
                <div className="text-xs font-mono text-white/30 bg-white/5 rounded-lg px-3 py-2">{tier.analyze_rpm}</div>
                <div className="text-xs font-mono text-white/30 bg-white/5 rounded-lg px-3 py-2">{tier.recommend_rpm}</div>
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
              </ul>

              <a
                href={tier.ctaHref}
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
          All prices in USD. Need a custom plan?{" "}
          <a href="#contact" className="text-violet-400 hover:text-violet-300">Contact us</a>.
        </p>
      </div>
    </section>
  );
}
