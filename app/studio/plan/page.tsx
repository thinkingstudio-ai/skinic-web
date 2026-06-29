import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Studio plan is now the same as the unified dashboard plan.
export default function StudioPlanPage() {
  redirect("/dashboard/plan");
}
