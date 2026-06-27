"use client";
import { useState } from "react";

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

const API_TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try the full skin analysis engine — no credit card required.",
    limits: [
      { label: "Trial scans", value: "10 scans", tooltip: "10 free scans to evaluate the data quality — upgrade to unlock monthly volume." },
      { label: "Skin analysis", value: "5 req/min", tooltip: "Max /analyze requests per minute." },
      { label: "AI ingredient guide", value: "—", tooltip: "Not available on Free. Upgrade to Starter to unlock AI-powered ingredient guide." },
    ],
    features: [
      "Full multi-layer AI skin analysis",
      "Skin tone + Fitzpatrick scale",
      "Static ingredient matching",
      "Interactive API docs",
    ],
    disabledFeatures: ["AI-powered ingredient guide"],
    cta: "Get Started",
    ctaHref: "/signup",
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Ship real products with a full AI ingredient guide and priority support.",
    limits: [
      { label: "Monthly scans", value: "2,000 calls", tooltip: "Total API calls allowed per month — resets on the 1st." },
      { label: "Skin analysis", value: "20 req/min", tooltip: "Suitable for up to ~20 concurrent users." },
      { label: "AI ingredient guide", value: "30 req/min · 500/mo", tooltip: "500 AI ingredient guide calls per month." },
    ],
    features: [
      "Everything in Free",
      "Full AI ingredient guide",
      "4× higher throughput",
      "Email support",
      "Real-time usage dashboard",
    ],
    cta: "Get Starter",
    ctaHref: "/signup?upgrade=starter",
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "Built for production-scale apps, beauty brands, and multi-brand platforms.",
    limits: [
      { label: "Monthly scans", value: "10,000 calls", tooltip: "Total API calls allowed per month." },
      { label: "Skin analysis", value: "60 req/min", tooltip: "Suitable for ~60 concurrent users." },
      { label: "AI ingredient guide", value: "100 req/min · 2,000/mo", tooltip: "2,000 AI ingredient calls per month." },
    ],
    features: [
      "Everything in Starter",
      "Postman collection included",
      "Priority email support",
    ],
    cta: "Get Pro",
    ctaHref: "/signup?upgrade=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large beauty platforms, retailers, and enterprise integrations.",
    limits: [
      { label: "Monthly scans", value: "Unlimited", tooltip: "No monthly cap." },
      { label: "Skin analysis", value: "200 req/min", tooltip: "Custom limits available." },
      { label: "AI ingredient guide", value: "500 req/min · 10k/mo", tooltip: "Custom limits available on request." },
    ],
    features: [
      "Everything in Pro",
      "Custom rate limits",
      "SOC 2 / PDPA / GDPR advisory",
      "Direct engineer access",
      "Custom contract & SLA",
    ],
    cta: "Contact Sales",
    ctaHref: "/enterprise",
  },
];

const APP_TIERS: Tier[] = [
  {
    name: "Free Preview",
    price: "$0",
    period: "/month",
    description: "Preview the white-label app experience — configure branding, no QR distribution.",
    limits: [
      { label: "Trial scans", value: "10 scans", tooltip: "10 scans to evaluate the app experience." },
      { label: "QR distribution", value: "—", tooltip: "QR code generation is gated to paid App tiers." },
      { label: "Custom branding", value: "Preview only", tooltip: "You can configure branding but cannot distribute QR codes to clients." },
    ],
    features: [
      "Live branding preview in dashboard",
      "App name, logo, colour config",
      "SKINIC skin analysis engine",
    ],
    disabledFeatures: ["QR code distribution", "Remove 'Powered by SKINIC'"],
    cta: "Get Started",
    ctaHref: "/signup",
  },
  {
    name: "Starter App",
    price: "$39",
    period: "/month",
    description: "Launch your branded skin analysis app and distribute it to clients via QR code.",
    limits: [
      { label: "Monthly scans", value: "2,000 scans", tooltip: "Shared across all your app users." },
      { label: "QR distribution", value: "Unlimited clients", tooltip: "Generate and share QR codes to onboard any number of clients." },
      { label: "Custom branding", value: "Full", tooltip: "App name, logo, tagline, primary colour." },
    ],
    features: [
      "Everything in Free Preview",
      "QR code client distribution",
      "Full custom branding",
      "AI ingredient guide",
      "Email support",
    ],
    disabledFeatures: ["Remove 'Powered by SKINIC'"],
    cta: "Get Starter App",
    ctaHref: "/signup?upgrade=starter_app",
    badge: "Best for salons & brands",
  },
  {
    name: "Pro App",
    price: "$129",
    period: "/month",
    description: "Fully white-labelled — remove all SKINIC branding and own the experience end to end.",
    limits: [
      { label: "Monthly scans", value: "10,000 scans", tooltip: "Suitable for medium-scale clinic chains and brands." },
      { label: "QR distribution", value: "Unlimited clients", tooltip: "No cap on QR code generation or client onboarding." },
      { label: "Custom branding", value: "Full + no SKINIC", tooltip: "Remove 'Powered by SKINIC' — your brand only." },
    ],
    features: [
      "Everything in Starter App",
      "Remove 'Powered by SKINIC'",
      "10,000 scans/month",
      "Priority email support",
    ],
    cta: "Get Pro App",
    ctaHref: "/signup?upgrade=pro_app",
    popular: true,
  },
  {
    name: "Enterprise App",
    price: "Custom",
    period: "",
    description: "Managed App Store listing, custom contract, dedicated engineer — your app, your terms.",
    limits: [
      { label: "Monthly scans", value: "Unlimited", tooltip: "No monthly cap." },
      { label: "QR distribution", value: "Unlimited", tooltip: "Unlimited client onboarding." },
      { label: "Custom branding", value: "Full + App Store", tooltip: "We manage the App Store listing under your brand." },
    ],
    features: [
      "Everything in Pro App",
      "Managed App Store listing",
      "Custom rate limits",
      "SOC 2 / PDPA / GDPR advisory",
      "Custom contract & SLA",
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
        <p className="text-white/55 text-xs mt-2 leading-relaxed">{tier.description}</p>
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
              <span className={`text-xs ${isDisabled ? "text-white/30 line-through" : "text-white/55"}`}>
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
  const [tab, setTab] = useState<"api" | "app">("api");

  return (
    <section id="pricing" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-sm font-medium tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold">Two products, one platform</h2>
          <p className="mt-4 text-white/60 text-lg max-w-2xl mx-auto">
            Build your own skin app with the API, or launch a fully branded experience with no code required.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setTab("api")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === "api"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              API — for Developers
            </button>
            <button
              onClick={() => setTab("app")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === "app"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              App — for Businesses
            </button>
          </div>
        </div>

        {tab === "api" && (
          <>
            <p className="text-center text-white/45 text-sm mb-8">
              Raw API access — integrate skin intelligence into any platform using your own UI.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {API_TIERS.map((tier) => <TierCard key={tier.name} tier={tier} />)}
            </div>
          </>
        )}

        {tab === "app" && (
          <>
            <p className="text-center text-white/45 text-sm mb-8">
              White-label mobile app — scan &amp; distribute your branded skin analysis experience. No code needed.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {APP_TIERS.map((tier) => <TierCard key={tier.name} tier={tier} />)}
            </div>
          </>
        )}

        <p className="text-center text-white/45 text-sm mt-8">
          All prices in USD. &nbsp;·&nbsp; Need higher volume or a custom App Store listing?{" "}
          <a href="/enterprise" className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-2">
            Talk to us about Enterprise
          </a>.
        </p>
      </div>
    </section>
  );
}
