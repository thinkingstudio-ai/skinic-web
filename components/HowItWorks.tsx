const steps = [
  {
    number: "01",
    title: "Set Up Your Studio",
    description: "Sign up, brand your page with your logo and colours, and set your custom scan link in minutes. No code needed.",
    color: "text-violet-400",
  },
  {
    number: "02",
    title: "Add Your Products & Services",
    description: "List your offerings — facials, serums, treatments — and tag them by skin type and traits. SKINIC learns what to recommend.",
    color: "text-blue-400",
  },
  {
    number: "03",
    title: "Share Your Scan Link",
    description: "Post the link on Instagram, WhatsApp, or embed it on your website. Customers tap, selfie, and get their skin profile in seconds.",
    color: "text-emerald-400",
  },
  {
    number: "04",
    title: "Convert & Grow",
    description: "Every scan captures a lead, matches them to what you offer, and records them in your customer database — ready for follow-up.",
    color: "text-amber-400",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold">Live in under 10 minutes</h2>
          <p className="mt-4 text-white/60 text-lg max-w-xl mx-auto">
            No developers. No app store. Just a link your customers tap to discover exactly what they need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="card-glass rounded-2xl p-8 hover:border-white/14 transition-colors">
              <div className={`font-mono text-sm font-bold ${step.color} mb-4`}>{step.number}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-white/65 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
