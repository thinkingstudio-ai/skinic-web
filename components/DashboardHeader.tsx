"use client";
import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/keys": "API Keys",
  "/dashboard/usage": "Usage & Stats",
  "/dashboard/funnel": "Scan Page",
  "/dashboard/catalog": "Catalog",
  "/dashboard/customers": "Customers",
  "/dashboard/analytics": "Analytics",
  "/dashboard/mobile": "Brand Setup",
  "/dashboard/plan": "Plan & Billing",
  "/dashboard/terms": "Terms & Policy",
  "/studio": "Studio Overview",
  "/studio/scanpage": "Scan Page",
  "/studio/catalog": "Catalog",
  "/studio/customers": "Customers",
  "/studio/analytics": "Analytics",
  "/studio/brand": "Brand Setup",
  "/studio/plan": "Plan & Billing",
};

export default function DashboardHeader({ user }: { user: User }) {
  const pathname = usePathname();
  const title = titles[pathname] || "Dashboard";
  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5 bg-white/[0.01]">
      <h1 className="text-base font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white/80">{name}</p>
          <p className="text-xs text-white/30">{user.email}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initials}
        </div>
      </div>
    </header>
  );
}
