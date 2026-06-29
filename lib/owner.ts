const OWNER_EMAILS = new Set(
  (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

export function isOwnerEmail(email?: string | null): boolean {
  return Boolean(email && OWNER_EMAILS.has(email.trim().toLowerCase()));
}

/** Treat owner accounts as `internal` tier for gating and limits. */
export function effectiveTier(tier: string, email?: string | null): string {
  return isOwnerEmail(email) ? "internal" : tier;
}
