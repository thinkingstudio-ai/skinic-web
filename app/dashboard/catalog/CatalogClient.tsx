"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type CatalogItem = {
  id: string;
  type: "product" | "service";
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
  cta_url: string | null;
  cta_label: string;
  skin_type_tags: string[];
  trait_tags: string[];
  is_active: boolean;
  sort_order: number;
};

const SKIN_TYPES = ["Oily", "Dry", "Normal", "Combination"];
const TRAITS = ["Breakouts", "Dryness", "Oiliness", "Dark Spots", "Wrinkles", "Redness", "Visible Pores", "Uneven Pigmentation"];

const EMPTY_ITEM = {
  type: "product" as "product" | "service",
  name: "",
  description: "",
  image_url: "",
  price: "",
  cta_url: "",
  cta_label: "Learn More",
  skin_type_tags: [] as string[],
  trait_tags: [] as string[],
  sort_order: 0,
};

export default function CatalogClient() {
  const supabase = createClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_ITEM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const imgInputRef = useRef<HTMLInputElement>(null);

  const fetchCatalog = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    const res = await fetch(`${apiUrl}/dashboard/catalog`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data.catalog || []);
    }
    setLoading(false);
  }, [supabase, apiUrl]);

  useEffect(() => { fetchCatalog(); }, [fetchCatalog]);

  async function save() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError("");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setError("Session expired."); setSaving(false); return; }

    const url = editingId
      ? `${apiUrl}/dashboard/catalog/${editingId}`
      : `${apiUrl}/dashboard/catalog`;
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.detail || "Failed to save."); setSaving(false); return; }

    await fetchCatalog();
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_ITEM });
    setSaving(false);
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`${apiUrl}/dashboard/catalog/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function toggleActive(item: CatalogItem) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await fetch(`${apiUrl}/dashboard/catalog/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ is_active: !item.is_active }),
    });
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
  }

  function openEdit(item: CatalogItem) {
    setEditingId(item.id);
    setForm({
      type: item.type,
      name: item.name,
      description: item.description || "",
      image_url: item.image_url || "",
      price: item.price || "",
      cta_url: item.cta_url || "",
      cta_label: item.cta_label,
      skin_type_tags: item.skin_type_tags,
      trait_tags: item.trait_tags,
      sort_order: item.sort_order,
    });
    setShowForm(true);
    setError("");
  }

  function toggleTag(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter((t) => t !== val) : [...arr, val];
  }

  async function resizeToBlob(file: File, maxPx = 900, quality = 0.82): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width > height) { height = Math.round((height / width) * maxPx); width = maxPx; }
          else { width = Math.round((width / height) * maxPx); height = maxPx; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Resize failed")), "image/jpeg", quality);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function uploadProductImage(file: File) {
    setUploadError("");
    const allowed = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) { setUploadError("Only PNG, JPG, GIF, WebP allowed."); return; }
    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setUploadError("Session expired."); setUploading(false); return; }
    let blob: Blob;
    try {
      blob = await resizeToBlob(file);
    } catch {
      setUploadError("Could not process image. Please try another file.");
      setUploading(false);
      return;
    }
    const uid = session.user.id;
    const filename = `${uid}/catalog/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { error: upErr } = await supabase.storage
      .from("brand-assets")
      .upload(filename, blob, { upsert: false, contentType: "image/jpeg" });
    if (upErr) { setUploadError(upErr.message || "Upload failed."); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("brand-assets").getPublicUrl(filename);
    setForm((prev) => ({ ...prev, image_url: `${urlData.publicUrl}?t=${Date.now()}` }));
    setUploading(false);
  }

  if (loading) return <div className="text-white/30 text-sm py-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Product &amp; Service Catalog</h2>
          <p className="text-white/40 text-sm mt-0.5">
            Add your products and services — SKINIC matches them to each customer's skin profile automatically.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...EMPTY_ITEM }); setError(""); }}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
        >
          + Add item
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="card-glass rounded-2xl p-5 border border-violet-500/20 space-y-4">
          <p className="text-sm font-semibold text-white">{editingId ? "Edit item" : "New item"}</p>

          {/* Type */}
          <div className="flex gap-3">
            {(["product", "service"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${form.type === t ? "bg-violet-600 text-white" : "bg-white/5 text-white/50 hover:text-white/70"}`}
              >
                {t === "product" ? "🧴 Product" : "✨ Service"}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Glow Serum / Deep Hydration Facial"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Price (display only)</label>
              <input
                type="text"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. RM 89 / From $29"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description shown on the result page"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Product image</label>
              <input
                ref={imgInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadProductImage(f); e.target.value = ""; }}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white/60 text-xs transition-all shrink-0"
                >
                  {uploading ? (
                    <span className="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  )}
                  {uploading ? "Uploading…" : "Upload"}
                </button>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="or paste URL…"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-xs focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
              {form.image_url && (
                <div className="relative inline-block mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image_url: "" }))}
                    title="Remove image"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-400 text-white text-[10px] flex items-center justify-center leading-none transition-all"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Link (Buy / Book / Learn More)</label>
              <input
                type="url"
                value={form.cta_url}
                onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1">Button label</label>
            <select
              value={form.cta_label}
              onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
            >
              {["Learn More", "Shop Now", "Buy Now", "Book Now", "View Details", "Get Offer"].map((l) => (
                <option key={l} value={l} className="bg-[#0a0a0f]">{l}</option>
              ))}
            </select>
          </div>

          {/* Skin type tags */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">
              Skin type tags <span className="text-white/25">(leave blank = show for all)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SKIN_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, skin_type_tags: toggleTag(form.skin_type_tags, t) })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${form.skin_type_tags.includes(t) ? "bg-violet-600 text-white" : "bg-white/5 text-white/45 hover:text-white/70"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Trait tags */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Visible trait tags</label>
            <div className="flex flex-wrap gap-2">
              {TRAITS.map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, trait_tags: toggleTag(form.trait_tags, t) })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${form.trait_tags.includes(t) ? "bg-blue-600 text-white" : "bg-white/5 text-white/45 hover:text-white/70"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Add to catalog"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); setError(""); }}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white/70 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Catalog list */}
      {items.length === 0 && !showForm ? (
        <div className="card-glass rounded-2xl p-10 text-center">
          <p className="text-3xl mb-3">🧴</p>
          <p className="text-white/60 text-sm font-medium">No items yet</p>
          <p className="text-white/30 text-xs mt-1">
            Add your products and services above — they will appear on your scan page results.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`card-glass rounded-2xl p-4 flex items-start gap-4 transition-opacity ${!item.is_active ? "opacity-50" : ""}`}
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                  {item.type === "service" ? "✨" : "🧴"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-semibold tracking-wider ${item.type === "service" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>
                    {item.type}
                  </span>
                  {item.price && <span className="text-[10px] text-white/35">{item.price}</span>}
                  {!item.is_active && <span className="text-[10px] text-amber-400/70">hidden</span>}
                </div>
                <p className="text-sm font-semibold text-white">{item.name}</p>
                {item.description && <p className="text-xs text-white/35 mt-0.5 truncate">{item.description}</p>}
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.skin_type_tags.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400">{t}</span>
                  ))}
                  {item.trait_tags.map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(item)} className="text-xs text-white/30 hover:text-white/60 transition-colors px-2">
                  {item.is_active ? "Hide" : "Show"}
                </button>
                <button onClick={() => openEdit(item)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors px-2">
                  Edit
                </button>
                <button onClick={() => deleteItem(item.id)} className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-2">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
