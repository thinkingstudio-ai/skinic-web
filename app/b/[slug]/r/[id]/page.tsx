import { notFound } from "next/navigation";

type Recommendation = {
  id: string;
  type: "product" | "service";
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
  cta_url: string | null;
  cta_label: string;
};

type ResultData = {
  brand: {
    slug: string;
    app_name: string;
    tagline: string;
    logo_url: string | null;
    primary_color: string;
    remove_powered_by: boolean;
  };
  customer_name: string | null;
  created_at: string;
  result: {
    skin_type?: {
      type?: string;
      confidence?: number;
      description?: string;
      characteristics?: string[];
      skin_barrier?: string;
      all_types?: { type: string; confidence: number }[];
      quality_warning?: string | null;
    };
    concerns?: { name: string; score: number; level: string }[];
    measurements?: { skin_score?: number; skin_label?: string; insight?: string } | null;
    skin_tone?: {
      fitzpatrick_label?: string;
      undertone?: string;
      season?: string;
      season_detail?: string;
      skin_depth?: string;
      colors_that_suit?: string[];
      colors_to_avoid?: string[];
    } | null;
  };
  recommendations: Recommendation[];
};

async function getResult(slug: string, id: string): Promise<ResultData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";
  try {
    const res = await fetch(`${apiUrl}/brand/${slug}/result/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const data = await getResult(slug, id);
  if (!data) return { title: "Skin Report" };
  return {
    title: `Your Skin Report — ${data.brand.app_name}`,
    description: data.brand.tagline || "Your personalised AI skin profile.",
    robots: { index: false },
  };
}

export default async function ResultPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const data = await getResult(slug, id);
  if (!data) notFound();

  const { brand, customer_name, result, recommendations } = data;
  const pc = brand.primary_color;
  const st = result.skin_type || {};
  const concerns = result.concerns || [];
  const score = result.measurements?.skin_score;
  const tone = result.skin_tone;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0a0f" }}>
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          {brand.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo_url} alt={brand.app_name} className="w-8 h-8 rounded-xl object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ background: pc }}>
              {brand.app_name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-white text-sm">{brand.app_name}</span>
        </div>
        {!brand.remove_powered_by && (
          <span className="text-white/20 text-[10px] tracking-wider">POWERED BY SKINIC AI</span>
        )}
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto px-5 py-8 space-y-6">
        {/* Greeting */}
        <div className="text-center">
          <p className="text-white/40 text-sm">
            {customer_name ? `${customer_name}'s` : "Your"} personalised skin profile
          </p>
        </div>

        {/* Quality warning */}
        {st.quality_warning && (
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 flex gap-3">
            <span className="text-amber-400 text-base shrink-0">⚠️</span>
            <div>
              <p className="text-amber-200/90 text-sm font-medium">Photo quality note</p>
              <p className="text-amber-200/50 text-xs mt-0.5 leading-relaxed">
                {st.quality_warning} For the most accurate result, scan again with a sharp, well-lit, filter-free close-up.
              </p>
            </div>
          </div>
        )}

        {/* Score + skin type */}
        <div className="rounded-3xl p-6 text-center" style={{ background: `${pc}14`, border: `1px solid ${pc}33` }}>
          {typeof score === "number" && (
            <div className="mb-3">
              <span className="text-5xl font-extrabold" style={{ color: pc }}>{Math.round(score)}</span>
              <span className="text-lg text-white/30 font-semibold">/100</span>
              {result.measurements?.skin_label && (
                <p className="text-white/50 text-sm mt-1">{result.measurements.skin_label}</p>
              )}
            </div>
          )}
          <h1 className="text-2xl font-bold text-white">{st.type || "—"} Skin</h1>
          {typeof st.confidence === "number" && (
            <p className="text-white/30 text-xs mt-1">{Math.round(st.confidence)}% confidence</p>
          )}
          {st.description && (
            <p className="text-white/50 text-sm mt-2 leading-relaxed">{st.description}</p>
          )}
        </div>

        {/* Skin type breakdown */}
        {st.all_types && st.all_types.length > 1 && (
          <div className="space-y-2">
            {st.all_types.map((t) => (
              <div key={t.type} className="flex items-center gap-3">
                <span className="text-white/50 text-xs w-20 shrink-0">{t.type}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.round(t.confidence)}%`, background: pc }} />
                </div>
                <span className="text-white/35 text-xs w-9 text-right">{Math.round(t.confidence)}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Characteristics + barrier */}
        {((st.characteristics && st.characteristics.length > 0) || st.skin_barrier) && (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3">
            {st.characteristics && st.characteristics.length > 0 && (
              <div>
                <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-2">Your skin characteristics</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {st.characteristics.map((c) => (
                    <p key={c} className="text-white/65 text-sm flex items-start gap-2">
                      <span style={{ color: pc }}>✦</span> {c}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {st.skin_barrier && (
              <div className="pt-1">
                <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-1">Skin barrier</p>
                <p className="text-white/65 text-sm leading-relaxed">{st.skin_barrier}</p>
              </div>
            )}
          </div>
        )}

        {/* Insight */}
        {result.measurements?.insight && (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-white/35 text-xs font-semibold uppercase tracking-wider mb-1.5">SKINIC AI insight</p>
            <p className="text-white/70 text-sm leading-relaxed">{result.measurements.insight}</p>
          </div>
        )}

        {/* Concerns */}
        {concerns.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">Visible traits</h2>
            <div className="flex flex-wrap gap-2">
              {concerns.slice(0, 8).map((c) => (
                <span
                  key={c.name}
                  className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/70"
                >
                  {c.name} · <span className="text-white/40">{c.level}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skin tone */}
        {tone && (tone.season || tone.undertone) && (
          <div className="grid grid-cols-2 gap-3">
            {tone.undertone && (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-wider">Undertone</p>
                <p className="text-white/80 text-sm font-medium capitalize mt-0.5">{tone.undertone}</p>
              </div>
            )}
            {tone.season && (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-wider">Colour season</p>
                <p className="text-white/80 text-sm font-medium mt-0.5">{tone.season_detail || tone.season}</p>
              </div>
            )}
            {tone.fitzpatrick_label && (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-wider">Skin tone</p>
                <p className="text-white/80 text-sm font-medium mt-0.5">{tone.fitzpatrick_label}</p>
              </div>
            )}
            {tone.skin_depth && (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-wider">Depth</p>
                <p className="text-white/80 text-sm font-medium capitalize mt-0.5">{tone.skin_depth}</p>
              </div>
            )}
          </div>
        )}

        {/* Colours / makeup */}
        {tone && ((tone.colors_that_suit && tone.colors_that_suit.length > 0) || (tone.colors_to_avoid && tone.colors_to_avoid.length > 0)) && (
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-4">
            <p className="text-white/35 text-xs font-semibold uppercase tracking-wider">Your colours &amp; makeup</p>
            {tone.colors_that_suit && tone.colors_that_suit.length > 0 && (
              <div>
                <p className="text-white/55 text-xs mb-2">Shades that flatter you</p>
                <div className="flex flex-wrap gap-2">
                  {tone.colors_that_suit.map((c) => (
                    <span key={c} className="px-3 py-1.5 rounded-full text-xs capitalize text-white" style={{ background: `${pc}26`, border: `1px solid ${pc}40` }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tone.colors_to_avoid && tone.colors_to_avoid.length > 0 && (
              <div>
                <p className="text-white/55 text-xs mb-2">Shades to avoid</p>
                <div className="flex flex-wrap gap-2">
                  {tone.colors_to_avoid.map((c) => (
                    <span key={c} className="px-3 py-1.5 rounded-full text-xs capitalize text-white/45 border border-white/10 line-through decoration-white/20">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">Recommended for your skin</h2>
            <div className="space-y-3">
              {recommendations.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/8 bg-white/3 p-4 flex gap-3">
                  {item.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                      {item.price && <span className="text-white/40 text-xs shrink-0">{item.price}</span>}
                    </div>
                    {item.description && (
                      <p className="text-white/45 text-xs mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                    {item.cta_url && (
                      <a
                        href={item.cta_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                        style={{ background: pc }}
                      >
                        {item.cta_label || "Learn More"} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repeat scan notice */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="text-white/45 text-xs leading-relaxed">
            <span className="text-white/60 font-medium">About repeat scans:</span>{" "}
            SKINIC provides a one-time cosmetic skin profile based on the photo you submit.
            Each scan produces an independent result — it is not a progress report.
            Skin type, trait scores, and percentages reflect conditions at the time of capture
            and may vary between scans due to lighting, environment, camera angle, and other factors.
            A higher or lower score on a subsequent scan does not mean your skin has improved,
            worsened, or that any product or routine is working.
          </p>
        </div>

        <a
          href={`/b/${brand.slug}`}
          className="block w-full py-3 rounded-2xl border border-white/10 text-white/50 text-sm font-medium text-center hover:border-white/20 hover:text-white/70 transition-all"
        >
          New Scan
        </a>

        <p className="text-center text-white/20 text-xs leading-relaxed">
          Cosmetic skin profiling only — not a medical service, diagnosis, or treatment.
          {!brand.remove_powered_by && <><br />Powered by SKINIC AI</>}
        </p>
      </main>
    </div>
  );
}
