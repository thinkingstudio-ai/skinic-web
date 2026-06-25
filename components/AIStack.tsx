const layers = [
  {
    label: "Layer 1",
    title: "Cosmetic Classifier",
    model: "EfficientNetV2B0",
    accuracy: "~95%",
    description: "Identifies 20+ cosmetic skin conditions — acne, oiliness, dryness, hyperpigmentation, wrinkles, and more. Returns top-3 conditions with confidence scores.",
    tags: ["Acne", "Oily Skin", "Hyperpigmentation", "Wrinkles", "Blackheads"],
    color: "from-violet-600/20 to-violet-600/5",
    border: "border-violet-500/20",
    badge: "bg-violet-500/10 text-violet-300",
  },
  {
    label: "Layer 2",
    title: "Medical Screening",
    model: "HAM10000 Dataset",
    accuracy: "73%",
    description: "Screens for 7 dermatological conditions including melanoma, basal cell carcinoma, and benign lesions. Returns flags — not diagnoses — with full disclaimers.",
    tags: ["Melanoma", "BCC", "Actinic Keratosis", "Nevus", "Vascular Lesions"],
    color: "from-blue-600/20 to-blue-600/5",
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-300",
  },
  {
    label: "Layer 3",
    title: "Derm Foundation",
    model: "Google Derm Foundation",
    accuracy: "6144-dim",
    description: "Google's medical-grade vision model generates deep skin embeddings (6144 dimensions). Extracts texture complexity, feature richness, uniformity, and dominant signals.",
    tags: ["Texture", "Uniformity", "Feature Density", "Deep Embeddings"],
    color: "from-emerald-600/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-300",
  },
];

export default function AIStack() {
  return (
    <section id="ai-stack" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-sm font-medium tracking-widest uppercase mb-3">Technology</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Enterprise AI stack,{" "}
            <span className="gradient-text">built for skin</span>
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-2xl mx-auto">
            Three independent AI layers, cross-validated for higher accuracy and trust scoring.
            Powered by RAG with a 500+ ingredient knowledge base.
          </p>
        </div>

        <div className="space-y-5">
          {layers.map((layer) => (
            <div
              key={layer.label}
              className={`rounded-2xl border ${layer.border} bg-gradient-to-br ${layer.color} p-8`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded-md ${layer.badge}`}>
                      {layer.label}
                    </span>
                    <span className="text-xs text-white/30 font-mono">{layer.model}</span>
                    <span className="text-xs text-white/30">· {layer.accuracy}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{layer.title}</h3>
                  <p className="text-white/50 leading-relaxed">{layer.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 md:max-w-xs">
                  {layer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 card-glass rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/80 mb-1">RAG — Ingredient Knowledge Base</p>
            <p className="text-sm text-white/40">
              Ingredient guidance is grounded in 500+ ingredients from INCIDecoder, CosDNA, and EWG Skin Deep,
              then enriched by SKINIC AI for natural language output.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-white">502</p>
            <p className="text-xs text-white/30">ingredients indexed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
