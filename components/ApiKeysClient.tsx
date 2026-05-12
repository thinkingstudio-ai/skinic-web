"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type ApiKey = {
  id: string;
  name: string;
  tier: string;
  is_active: boolean;
  total_calls: number;
  monthly_calls: number;
  created_at: string;
  last_used: string | null;
};

type NewKeyResult = { api_key: string; name: string };

export default function ApiKeysClient() {
  const supabase = createClient();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyResult, setNewKeyResult] = useState<NewKeyResult | null>(null);
  const [copied, setCopied] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchKeys = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("api_keys")
      .select("id, name, tier, is_active, total_calls, monthly_calls, created_at, last_used")
      .eq("supabase_user_id", user.id)
      .order("created_at", { ascending: false });
    setKeys(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  async function createKey() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!user || !session) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ name: newKeyName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.detail || "Failed to create key");
    } else {
      setNewKeyResult({ api_key: data.api_key, name: data.name });
      setNewKeyName("");
      setShowCreate(false);
      fetchKeys();
    }
    setCreating(false);
  }

  async function deleteKey(id: string) {
    setDeletingId(id);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/keys/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${session!.access_token}` },
    });
    setKeys((prev) => prev.filter((k) => k.id !== id));
    setDeletingId("");
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">API Keys</h2>
          <p className="text-white/40 text-sm mt-0.5">Create and manage your API keys. Each key is shown once.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
        >
          + New Key
        </button>
      </div>

      {/* New key result — shown once */}
      {newKeyResult && (
        <div className="card-glass rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-emerald-400 text-sm font-semibold">Key &quot;{newKeyResult.name}&quot; created</p>
          </div>
          <p className="text-amber-400/80 text-xs mb-3">⚠ Copy this key now — it will never be shown again.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-black/30 border border-emerald-500/20 rounded-lg px-3 py-2 text-sm text-emerald-300 font-mono break-all">
              {newKeyResult.api_key}
            </code>
            <button
              onClick={() => copy(newKeyResult.api_key, "new")}
              className="px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/30 transition-colors whitespace-nowrap"
            >
              {copied === "new" ? "Copied!" : "Copy"}
            </button>
          </div>
          <button onClick={() => setNewKeyResult(null)} className="mt-3 text-white/25 text-xs hover:text-white/40 transition-colors">
            Dismiss
          </button>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="card-glass rounded-2xl p-5">
          <p className="text-sm font-semibold text-white mb-3">Name your new key</p>
          <div className="flex gap-3">
            <input
              autoFocus
              type="text"
              placeholder="e.g. Production, Testing, Mobile App"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createKey()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <button
              onClick={createKey}
              disabled={creating || !newKeyName.trim()}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-all"
            >
              {creating ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white/60 transition-colors"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <div className="text-white/30 text-sm py-8 text-center">Loading keys...</div>
      ) : keys.length === 0 ? (
        <div className="card-glass rounded-2xl p-8 text-center">
          <p className="text-white/30 text-sm mb-3">No API keys yet.</p>
          <button onClick={() => setShowCreate(true)} className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
            Create your first key →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <div key={key.id} className="card-glass rounded-2xl p-5 border border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="text-sm font-semibold text-white">{key.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      key.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      {key.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {key.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                    {key.last_used && <span>Last used {new Date(key.last_used).toLocaleDateString()}</span>}
                    <span>{key.total_calls.toLocaleString()} total calls</span>
                    <span>{key.monthly_calls.toLocaleString()} this month</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copy(key.id, key.id)}
                    title="Copy key ID"
                    className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all text-xs"
                  >
                    {copied === key.id ? "✓" : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => deleteKey(key.id)}
                    disabled={deletingId === key.id}
                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/5 transition-all"
                  >
                    {deletingId === key.id ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-white/20 text-xs">
        Include your key as: <code className="text-violet-300">X-API-Key: sk-your-key</code> in every request.
        <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="text-violet-400 ml-2">API Docs →</a>
      </p>
    </div>
  );
}
