"use client";
import { useState } from "react";

const REQUEST_CODE = `curl -X POST https://api.skinic.app/analyze \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "file=@skin_photo.jpg" \\
  -F "terms_accepted=true"`;

const RESPONSE_CODE = `{
  "skin_type": {
    "type": "Combination",
    "confidence": 46.6,
    "description": "Mixed skin — oily T-zone with normal to dry cheeks.",
    "all_types": [
      { "type": "Oily",   "confidence": 46.6 },
      { "type": "Dry",    "confidence": 34.1 },
      { "type": "Normal", "confidence": 19.3 }
    ]
  },
  "concerns": [
    { "name": "Oily Skin",           "score": 84.2, "level": "Prominent" },
    { "name": "Visible Pores",       "score": 72.0, "level": "Prominent" },
    { "name": "Dark Spots",          "score": 41.0, "level": "Moderate"  },
    { "name": "Uneven Pigmentation", "score": 59.0, "level": "Moderate"  }
  ],
  "all_concerns": [
    { "name": "Oily Skin",           "score": 84.2, "level": "Prominent" },
    { "name": "Visible Pores",       "score": 72.0, "level": "Prominent" },
    { "name": "Uneven Pigmentation", "score": 59.0, "level": "Moderate"  },
    { "name": "Dark Spots",          "score": 41.0, "level": "Moderate"  },
    { "name": "Redness",             "score": 38.0, "level": "Mild"      },
    { "name": "Acne",                "score": 12.5, "level": "Mild"      },
    { "name": "Dry Skin",            "score": 8.0,  "level": "Mild"      },
    { "name": "Wrinkles",            "score": 4.1,  "level": "Mild"      }
  ],
  "measurements": {
    "skin_texture": {
      "uniformity": 41.0,
      "texture_complexity": 72.0,
      "skin_entropy": 63.4,
      "feature_balance": 58.1
    },
    "skin_score": 62,
    "skin_label": "Fair"
  },
  "skin_tone": {
    "fitzpatrick": 3,
    "fitzpatrick_label": "Type III",
    "undertone": "warm",
    "season": "Autumn",
    "hex_avg": "#C8956C"
  },
  "disclaimer": "Cosmetic skincare insights only — for beauty and informational purposes."
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
