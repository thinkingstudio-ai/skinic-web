import Link from "next/link";

const TIER_LABELS: Record<string, string> = {
  free:        "Free",
  starter:     "Starter",
  pro:         "Pro",
  starter_app: "Starter Studio",
  pro_app:     "Pro Studio",
  enterprise:  "Enterprise",
};

const UPGRADE_TARGETS: Record<string, { label: string; href: string }> = {
  starter_app: { label: "Upgrade to Starter Studio — $39/mo", href: "/dashboard/plan" },
  pro_app:     { label: "Upgrade to Pro Studio — $129/mo",   href: "/dashboard/plan" },
  enterprise:  { label: "Contact Sales",                      href: "/enterprise"      },
};

interface FeatureLockProps {
  feature: string;
  description: string;
  requiredTier: "starter_app" | "pro_app" | "enterprise";
  currentTier: string;
}

export default function FeatureLock({ feature, description, requiredTier, currentTier }: FeatureLockProps) {
  const upgrade = UPGRADE_TARGETS[requiredTier];
  const currentLabel = TIER_LABELS[currentTier] || currentTier;

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center">
        {/* Lock icon */}
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">{feature}</h2>
        <p className="text-white/45 text-sm leading-relaxed mb-2">{description}</p>

        <p className="text-white/25 text-xs mb-8">
          Your current plan: <span className="text-white/50 font-medium">{currentLabel}</span>
        </p>

        <Link
          href={upgrade.href}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/25"
        >
          {upgrade.label}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        <p className="mt-4 text-white/20 text-xs">
          Already upgraded?{" "}
          <button onClick={() => window.location.reload()} className="text-violet-400 hover:text-violet-300 transition-colors">
            Refresh page
          </button>
        </p>
      </div>
    </div>
  );
}
