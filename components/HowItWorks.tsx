const steps = [
  {
    number: "01",
    title: "Send a Skin Image",
    description: "POST a JPG, PNG, WEBP, or HEIC image to /analyze with your API key. Supports mobile captures from iOS and Android.",
    color: "text-violet-400",
  },
  {
    number: "02",
    title: "Multi-Layer AI Analysis",
    description: "Our stack runs skin-type classification, aesthetic concern detection, and deep skin embeddings in parallel.",
    color: "text-blue-400",
  },
  {
    number: "03",
    title: "Receive Structured JSON",
    description: "Get a detailed JSON response with skin type, concern scores, and a tailored ingredient guide.",
    color: "text-emerald-400",
  },
  {
    number: "04",
    title: "Render in Your App",
    description: "Display insights in your UI. Our response schema is designed for direct rendering — no post-processing needed.",
    color: "text-amber-400",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-3">Integration</p>
          <h2 className="text-3xl md:text-5xl font-bold">From image to insight in one request</h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl mx-auto">
            Simple REST API. No SDK required. Works with any language or framework.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="card-glass rounded-2xl p-8 hover:border-white/14 transition-colors">
              <div className={`font-mono text-sm font-bold ${step.color} mb-4`}>{step.number}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-white/45 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
