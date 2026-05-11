import SignupPageClient from "@/components/SignupPageClient";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get API Key — SKINIC",
  description: "Register for a free SKINIC API key. Start integrating AI skin analysis in minutes.",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-16">
        <SignupPageClient />
      </div>
      <Footer />
    </main>
  );
}
