import ComingSoon from "@/components/ComingSoon";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ForDevelopers from "@/components/ForDevelopers";
import AIStack from "@/components/AIStack";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const comingSoon = process.env.COMING_SOON !== "false";

export default function Home() {
  if (comingSoon) {
    return <ComingSoon />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <HowItWorks />
      <AIStack />
      <ForDevelopers />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
