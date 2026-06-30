import { effectiveTier } from "./owner";

// Scan Page + Brand Setup are open to everyone, including Free (capped at 20 scans/mo, no AI).
export const SCAN_PAGE_TIERS = ["free", "starter", "pro", "starter_app", "pro_app", "enterprise", "internal"];
// Catalog + Customers require a paid plan.
export const STUDIO_TIERS = ["starter", "pro", "starter_app", "pro_app", "enterprise", "internal"];
export const ANALYTICS_TIERS = ["pro", "pro_app", "enterprise", "internal"];

export function canAccessScanPage(tier: string, email?: string | null): boolean {
  return SCAN_PAGE_TIERS.includes(effectiveTier(tier, email));
}

export function canAccessStudio(tier: string, email?: string | null): boolean {
  return STUDIO_TIERS.includes(effectiveTier(tier, email));
}

export function canAccessAnalytics(tier: string, email?: string | null): boolean {
  return ANALYTICS_TIERS.includes(effectiveTier(tier, email));
}
