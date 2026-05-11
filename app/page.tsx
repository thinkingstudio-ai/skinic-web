import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import AIStack from "@/components/AIStack";
import Pricing from "@/components/Pricing";
import CodeDemo from "@/components/CodeDemo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <HowItWorks />
      <AIStack />
      <CodeDemo />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
