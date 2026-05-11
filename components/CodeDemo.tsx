"use client";
import { useState } from "react";

const REQUEST_CODE = `curl -X POST https://api.skinic.app/analyze \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "file=@skin_photo.jpg" \\
  -F "terms_accepted=true"`;

const RESPONSE_CODE = `{
  "cosmetic": {
    "condition": "Acne",
    "confidence": 87.4,
    "description": "Active inflammatory acne with visible comedones",
    "top_conditions": [
      { "label": "Acne",      "confidence": 87.4 },
      { "label": "Oily Skin", "confidence": 9.1  },
      { "label": "Blackheads","confidence": 3.5  }
    ]
  },
  "medical": {
    "condition": "Actinic Keratoses",
    "confidence": 23.1,
    "flagged": false
  },
  "derm": {
    "quality_score": 81.2,
    "embedding_dim": 6144,
    "skin_features": {
      "texture_complexity": 0.72,
      "feature_richness": 0.68,
      "uniformity": 0.41
    }
  },
  "cross_validation": {
    "combined_trust_score": 84.2,
    "agrees_with_medical": true
  },
  "disclaimer": "Results are AI-generated screenings only..."
}`;

export default function CodeDemo() {
  const [tab, setTab] = useState<"request" | "response">("request");

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-3">API Reference</p>
          <h2 className="text-3xl md:text-4xl font-bold">One endpoint, complete skin profile</h2>
        </div>

        <div className="card-glass rounded-2xl overflow-hidden">
          <div className="flex items-center border-b border-white/5 px-4">
            <button
              onClick={() => setTab("request")}
              className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === "request"
                  ? "border-violet-500 text-violet-300"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              Request
            </button>
            <button
              onClick={() => setTab("response")}
              className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === "response"
                  ? "border-violet-500 text-violet-300"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              Response
            </button>
            <div className="ml-auto flex items-center gap-2 pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/30 font-mono">api.skinic.app</span>
            </div>
          </div>

          <pre className="p-6 text-sm text-white/75 font-mono overflow-x-auto leading-relaxed">
            <code>{tab === "request" ? REQUEST_CODE : RESPONSE_CODE}</code>
          </pre>
        </div>

        <div className="mt-4 flex justify-center">
          <a
            href="https://api.skinic.app/docs"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            View full API documentation with Swagger UI →
          </a>
        </div>
      </div>
    </section>
  );
}
