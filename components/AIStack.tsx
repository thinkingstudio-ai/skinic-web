const layers = [
  {
    label: "Layer 1",
    title: "Skin Type Analysis",
    model: "SKINIC Vision",
    accuracy: "Dry · Normal · Oily",
    description: "Classifies your skin type — dry, normal, oily, or combination — with a confidence breakdown across every type for a clear, stable read.",
    tags: ["Dry", "Normal", "Oily", "Combination"],
    color: "from-violet-600/20 to-violet-600/5",
    border: "border-violet-500/20",
    badge: "bg-violet-500/10 text-violet-300",
  },
  {
    label: "Layer 2",
    title: "Aesthetic Concerns",
    model: "SKINIC Multi-Label",
    accuracy: "8 concerns",
    description: "Detects 8 visible cosmetic concerns — acne, dryness, oiliness, dark spots, wrinkles, redness, visible pores, and uneven pigmentation — each scored independently with Mild/Moderate/Prominent severity bands.",
    tags: ["Acne", "Dryness", "Oiliness", "Dark Spots", "Wrinkles", "Redness", "Visible Pores", "Uneven Pigmentation"],
    color: "from-blue-600/20 to-blue-600/5",
    border: "border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-300",
  },
  {
    label: "Layer 3",
    title: "Deep Skin Embeddings",
    model: "SKINIC Deep Vision",
    accuracy: "6144-dim",
    description: "Produces a high-dimensional visual embedding trained on millions of skin images — used to derive texture complexity, skin uniformity, and feature balance as relative cosmetic trend indicators, not absolute benchmarks.",
    tags: ["Texture Complexity", "Uniformity", "Feature Balance", "Skin Entropy"],
    color: "from-emerald-600/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-300",
  },
  {
    label: "Layer 4",
    title: "Acne Lesion Detector",
    model: "SKINIC Lesion Guard",
    accuracy: "YOLOv8 ONNX",
    description: "Object-detection model that localises and counts individual acne lesions — comedones, papules, pustules, and nodules — and classifies overall acne severity for trend tracking over time.",
    tags: ["Comedones", "Papules", "Pustules", "Nodules", "Severity"],
    color: "from-amber-600/20 to-amber-600/5",
    border: "border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-300",
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
            Four independent AI layers working together — skin type, 8 cosmetic concerns, deep texture embeddings, and acne lesion detection. Enriched by a 500+ ingredient knowledge base.
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
