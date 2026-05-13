"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { initialTier: string };

export default function PlanUpgradeBanner({ initialTier }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const upgraded = searchParams.get("upgraded");
  const [status, setStatus] = useState<"processing" | "success" | "timeout">("processing");
  const [tier, setTier] = useState(initialTier);

  useEffect(() => {
    if (!upgraded) return;
    if (initialTier === upgraded) {
      setStatus("success");
      setTier(upgraded);
      return;
    }
    const supabase = createClient();
    let attempts = 0;
    const maxAttempts = 15; // 30s total

    const interval = setInterval(async () => {
      attempts++;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("api_keys")
        .select("tier")
        .eq("supabase_user_id", user.id)
        .limit(1);
      const newTier = data?.[0]?.tier || "free";
      if (newTier === upgraded) {
        setTier(newTier);
        setStatus("success");
        clearInterval(interval);
        setTimeout(() => router.refresh(), 1000);
      } else if (attempts >= maxAttempts) {
        setStatus("timeout");
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [upgraded, initialTier, router]);

  if (!upgraded) return null;

  if (status === "processing") {
    return (
      <div className="card-glass rounded-2xl p-5 border border-blue-500/30 bg-blue-500/5">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-300">Processing your upgrade...</p>
            <p className="text-xs text-white/40 mt-0.5">
              Payment confirmed. We&apos;re activating your <span className="capitalize text-white/60">{upgraded}</span> plan — this usually takes a few seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="card-glass rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/5">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 mt-0.5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-300">Welcome to <span className="capitalize">{tier}</span>!</p>
            <p className="text-xs text-white/40 mt-0.5">
              Your plan is now active. New rate limits and quotas have been applied to all your API keys.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass rounded-2xl p-5 border border-amber-500/30 bg-amber-500/5">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 mt-0.5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-300">Upgrade pending</p>
          <p className="text-xs text-white/40 mt-0.5">
            Your payment was received but the plan hasn&apos;t activated yet. Try refreshing in a minute, or
            <a href="mailto:skinic@thinkingstudio.ai?subject=Upgrade%20pending%20on%20dashboard" className="text-violet-400 ml-1">contact support</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
