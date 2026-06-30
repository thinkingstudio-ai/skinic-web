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

// Catalog is open to Free (capped) so they can sample product matching.
const FREE_CATALOG_LIMIT = 2;

/** Max catalog items allowed. Returns a number for capped tiers, or null for unlimited. */
export function catalogItemLimit(tier: string, email?: string | null): number | null {
  return canAccessStudio(tier, email) ? null : FREE_CATALOG_LIMIT;
}
