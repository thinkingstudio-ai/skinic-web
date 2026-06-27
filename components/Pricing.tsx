"use client";

type Limit = { label: string; value: string; tooltip: string };
type Tier = {
  name: string;
  price: string;
  period: string;
  description: string;
  limits: Limit[];
  features: string[];
  disabledFeatures?: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
  badge?: string;
};

const STUDIO_TIERS: Tier[] = [
  {
    name: "Free Preview",
    price: "$0",
    period: "/month",
    description: "Try your branded scan page — no credit card, no code required.",
    limits: [
      { label: "Monthly scans", value: "50 scans", tooltip: "50 free AI skin profiles to evaluate the experience." },
      { label: "Catalog items", value: "5 items", tooltip: "Add up to 5 products or services to your catalog." },
      { label: "Lead capture", value: "—", tooltip: "Email lead capture is available on Starter and above." },
    ],
    features: [
      "Branded scan page (your slug)",
      "AI skin type + trait profiling",
      "Product & service matching",
      "Customer database (read-only)",
    ],
    disabledFeatures: ["Lead capture form", "Remove 'Powered by SKINIC'"],
    cta: "Get Started Free",
    ctaHref: "/signup?product=studio",
  },
  {
    name: "Starter Studio",
    price: "$39",
    period: "/month",
    description: "Everything you need to launch, capture leads, and grow your customer list.",
    limits: [
      { label: "Monthly scans", value: "2,000 scans", tooltip: "Shared across all your branded page visitors." },
      { label: "Catalog items", value: "Unlimited", tooltip: "Add as many products and services as you like." },
      { label: "Lead capture", value: "Included", tooltip: "Collect name + email before the scan — every scan grows your list." },
    ],
    features: [
      "Everything in Free Preview",
      "Lead capture form",
      "CSV export (customers)",
      "AI ingredient guide",
      "Email support",
    ],
    disabledFeatures: ["Remove 'Powered by SKINIC'"],
    cta: "Get Starter Studio",
    ctaHref: "/signup?product=studio&upgrade=starter_app",
    badge: "Best for salons & brands",
  },
  {
    name: "Pro Studio",
    price: "$129",
    period: "/month",
    description: "Fully white-labelled. Remove SKINIC branding and own the experience end to end.",
    limits: [
      { label: "Monthly scans", value: "10,000 scans", tooltip: "Suitable for active beauty chains and high-volume campaigns." },
      { label: "Analytics", value: "Full dashboard", tooltip: "Scan volume, skin type distribution, top traits, CTA clicks." },
      { label: "Branding", value: "SKINIC hidden", tooltip: "Remove 'Powered by SKINIC' — your brand only." },
    ],
    features: [
      "Everything in Starter Studio",
      "Remove 'Powered by SKINIC'",
      "Analytics dashboard",
      "Website embed code",
      "Priority email support",
    ],
    cta: "Get Pro Studio",
    ctaHref: "/signup?product=studio&upgrade=pro_app",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For beauty chains, large brands, and multi-location businesses. Custom contract & SLA.",
    limits: [
      { label: "Monthly scans", value: "Unlimited", tooltip: "No monthly cap — custom limits available." },
      { label: "Custom domain", value: "Available", tooltip: "Host your scan page on your own domain." },
      { label: "Dedicated support", value: "Engineer access", tooltip: "Direct line to our team for onboarding and integrations." },
    ],
    features: [
      "Everything in Pro Studio",
      "Custom domain",
      "Unlimited scans",
      "SOC 2 / PDPA / GDPR advisory",
      "Custom contract & SLA",
      "Dedicated onboarding",
    ],
    cta: "Contact Sales",
    ctaHref: "/enterprise",
  },
];

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col relative ${
        tier.popular ? "tier-popular" : "card-glass"
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold whitespace-nowrap">
          Most Popular
        </div>
      )}
      {tier.badge && !tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold whitespace-nowrap">
          {tier.badge}
        </div>
      )}

      <div className="mb-5">
        <p className="text-white/70 text-sm font-semibold mb-1 tracking-wide uppercase">{tier.name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{tier.price}</span>
          {tier.period && <span className="text-white/50 text-sm">{tier.period}</span>}
        </div>
        <p className="text-white/65 text-xs mt-2 leading-relaxed">{tier.description}</p>
      </div>

      <div className="mb-5 space-y-1.5">
        {tier.limits.map((limit) => {
          const isDisabled = limit.value === "—";
          return (
            <div
              key={limit.label}
              className={`flex items-center justify-between rounded-lg px-3 py-2 group relative ${
                isDisabled ? "bg-white/2 opacity-40" : "bg-white/5"
              }`}
            >
              <span className={`text-xs ${isDisabled ? "text-white/35 line-through" : "text-white/70"}`}>
                {limit.label}
              </span>
              <span className={`text-xs font-mono font-semibold ${isDisabled ? "text-white/25" : "text-white/80"}`}>
                {limit.value}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                {limit.tooltip}
              </div>
            </div>
          );
        })}
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/75">
            <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
        {tier.disabledFeatures?.map((f) => (
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
        className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-all ${
          tier.popular
            ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20"
            : "border border-white/15 hover:border-violet-500/50 text-white/80 hover:text-white hover:bg-white/5"
        }`}
      >
        {tier.cta}
      </a>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold">Simple, scalable plans</h2>
          <p className="mt-4 text-white/60 text-lg max-w-2xl mx-auto">
            Start free. Upgrade when you grow. No code needed to launch your branded skin profiling page.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STUDIO_TIERS.map((tier) => <TierCard key={tier.name} tier={tier} />)}
        </div>

        <p className="text-center text-white/60 text-sm mt-8">
          All prices in USD. &nbsp;·&nbsp; Building a custom integration or app?{" "}
          <a href="https://api.skinic.app" target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-2">
            See the Developer API →
          </a>
        </p>
      </div>
    </section>
  );
}
