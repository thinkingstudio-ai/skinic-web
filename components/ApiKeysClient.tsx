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
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  function toggleVisibility(id: string) {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function maskKey(id: string) {
    return "sk-" + "•".repeat(24) + id.slice(-4);
  }

  const fetchKeys = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";
      const res = await fetch(`${apiUrl}/dashboard/keys`, {
        headers: { "Authorization": `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch {
      // silently ignore fetch errors on load
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  async function createKey() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError("");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Session expired. Please sign in again.");
      setCreating(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";
    try {
      const res = await fetch(`${apiUrl}/dashboard/keys`, {
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
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  async function deleteKey(id: string) {
    setDeletingId(id);
    const { data: { session } } = await supabase.auth.getSession();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";
    if (session) {
      await fetch(`${apiUrl}/dashboard/keys/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${session.access_token}` },
      });
    }
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
                  {/* Masked key display */}
                  <div className="flex items-center gap-2 mt-2 mb-1">
                    <code className="text-xs font-mono text-white/40 bg-white/5 border border-white/8 rounded-lg px-3 py-1.5 tracking-wider">
                      {visibleKeys.has(key.id) ? key.id : maskKey(key.id)}
                    </code>
                    <button
                      onClick={() => toggleVisibility(key.id)}
                      title={visibleKeys.has(key.id) ? "Hide" : "Show"}
                      className="p-1.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/5 transition-all"
                    >
                      {visibleKeys.has(key.id) ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => copy(key.id, key.id)}
                      title="Copy key"
                      className="p-1.5 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/5 transition-all"
                    >
                      {copied === key.id ? (
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
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
