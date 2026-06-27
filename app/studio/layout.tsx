import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StudioSidebar from "@/components/StudioSidebar";
import DashboardHeader from "@/components/DashboardHeader";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?product=studio");

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">
      <StudioSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
