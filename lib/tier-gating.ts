import { effectiveTier } from "./owner";

export const STUDIO_TIERS = ["starter", "pro", "starter_app", "pro_app", "enterprise", "internal"];
export const ANALYTICS_TIERS = ["pro", "pro_app", "enterprise", "internal"];

export function canAccessStudio(tier: string, email?: string | null): boolean {
  return STUDIO_TIERS.includes(effectiveTier(tier, email));
}

export function canAccessAnalytics(tier: string, email?: string | null): boolean {
  return ANALYTICS_TIERS.includes(effectiveTier(tier, email));
}
