import AnalyticsClient from "@/app/dashboard/analytics/AnalyticsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StudioAnalyticsPage() {
  return <AnalyticsClient />;
}
