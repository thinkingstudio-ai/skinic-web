"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Customer = {
  id: string;
  email: string | null;
  name: string | null;
  skin_type: string | null;
  top_traits: string[];
  created_at: string;
};

type ConfirmConfig = {
  title: string;
  body: string;
  danger: string;
  onConfirm: () => void;
};

const SKIN_TYPES = ["", "Oily", "Dry", "Normal", "Combination"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ConfirmModal({ config, onClose }: { config: ConfirmConfig; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#13131a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <p className="text-white font-semibold text-base">{config.title}</p>
        <p className="text-white/50 text-sm leading-relaxed">{config.body}</p>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:border-white/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { config.onConfirm(); onClose(); }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all"
          >
            {config.danger}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomersClient() {
  const supabase = createClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.skinic.app";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [offset, setOffset] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmConfig | null>(null);
  const limit = 25;

  const fetchCustomers = useCallback(
    async (st: string, off: number) => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const params = new URLSearchParams({ limit: String(limit), offset: String(off) });
      if (st) params.set("skin_type", st);
      const res = await fetch(`${apiUrl}/dashboard/customers?${params}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
        setTotal(data.total || 0);
        setSlug(data.slug || null);
      }
      setLoading(false);
    },
    [supabase, apiUrl]
  );

  useEffect(() => { fetchCustomers(filterType, offset); }, [fetchCustomers, filterType, offset]);

  function reportLink(c: Customer) {
    return slug ? `https://skinic.app/b/${slug}/r/${c.id}` : "";
  }

  function copyLink(c: Customer) {
    const link = reportLink(c);
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  function emailReport(c: Customer) {
    const link = reportLink(c);
    if (!link || !c.email) return;
    const subject = "Your personalised skin report";
    const body = `Hi ${c.name || "there"},\n\nThank you for taking the skin profiling! Here is your personalised skin report and product recommendations:\n\n${link}\n\nFeel free to reply if you have any questions.`;
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Skin Type", "Top Traits", "Date"];
    const rows = customers.map((c) => [
      c.name || "",
      c.email || "",
      c.skin_type || "",
      (c.top_traits || []).join(" | "),
      formatDate(c.created_at),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `skinic-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  async function deleteOne(c: Customer) {
    setDeletingId(c.id);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setDeletingId(null); return; }
    await fetch(`${apiUrl}/dashboard/customers/${c.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setDeletingId(null);
    fetchCustomers(filterType, offset);
  }

  async function deleteBulk(skinType: string) {
    setBulkDeleting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setBulkDeleting(false); return; }
    const params = skinType ? `?skin_type=${encodeURIComponent(skinType)}` : "";
    await fetch(`${apiUrl}/dashboard/customers${params}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setBulkDeleting(false);
    setOffset(0);
    fetchCustomers(filterType, 0);
  }

  function promptDeleteOne(c: Customer) {
    setConfirm({
      title: "Delete customer?",
      body: `This will permanently remove ${c.name || c.email || "this customer"} and their scan data.`,
      danger: "Delete",
      onConfirm: () => deleteOne(c),
    });
  }

  function promptDeleteFiltered() {
    const label = filterType || "All";
    setConfirm({
      title: `Delete all ${label} customers?`,
      body: filterType
        ? `This will permanently delete all ${filterType} skin-type customers (${total}) and their scan data.`
        : `This will permanently delete all ${total} customers and all their scan data. This cannot be undone.`,
      danger: `Delete ${filterType ? filterType : "All"}`,
      onConfirm: () => deleteBulk(filterType),
    });
  }

  const isFiltered = filterType !== "";

  return (
    <>
      {confirm && (
        <ConfirmModal config={confirm} onClose={() => setConfirm(null)} />
      )}

      <div className="space-y-6 max-w-5xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-white">Customer Database</h2>
            <p className="text-white/40 text-sm mt-0.5">
              End users who scanned via your brand page. Every scan captures the customer&apos;s email. Use the report link to follow up.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {total > 0 && (
              <>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-white/20 hover:text-white/80 transition-all"
                >
                  Export CSV
                </button>
                <button
                  onClick={promptDeleteFiltered}
                  disabled={bulkDeleting}
                  className="px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium hover:bg-red-500/15 disabled:opacity-40 transition-all"
                >
                  {bulkDeleting
                    ? "Deleting…"
                    : isFiltered
                    ? `Delete ${filterType} (${total})`
                    : `Delete all (${total})`}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs text-white/40">Filter by skin type:</label>
          <div className="flex gap-2 flex-wrap">
            {SKIN_TYPES.map((t) => (
              <button
                key={t || "all"}
                onClick={() => { setFilterType(t); setOffset(0); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === t
                    ? "bg-violet-600 text-white"
                    : "bg-white/5 text-white/45 hover:text-white/70"
                }`}
              >
                {t || "All"}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-white/30">
            {total} customer{total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-white/30 text-sm text-center py-10">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="card-glass rounded-2xl p-10 text-center">
            <p className="text-2xl mb-3">👥</p>
            <p className="text-white/60 text-sm font-medium">No customers yet</p>
            <p className="text-white/30 text-xs mt-1">
              Share your scan page link — every customer who scans appears here automatically.
            </p>
          </div>
        ) : (
          <>
            <div className="card-glass rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="text-left px-5 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">Skin Type</th>
                    <th className="text-left px-5 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Top Traits</th>
                    <th className="text-left px-5 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
                    >
                      <td className="px-5 py-3 text-white/80">{c.name || <span className="text-white/20">—</span>}</td>
                      <td className="px-5 py-3 text-white/55 font-mono text-xs">{c.email || <span className="text-white/20">—</span>}</td>
                      <td className="px-5 py-3">
                        {c.skin_type ? (
                          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs font-medium">
                            {c.skin_type}
                          </span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(c.top_traits || []).slice(0, 3).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-white/35 text-[10px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-white/35 text-xs">{formatDate(c.created_at)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => copyLink(c)}
                            disabled={!slug}
                            title="Copy report link"
                            className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/55 text-xs font-medium hover:bg-white/10 disabled:opacity-30 transition-all"
                          >
                            {copiedId === c.id ? "✓" : "Copy link"}
                          </button>
                          <button
                            onClick={() => emailReport(c)}
                            disabled={!slug || !c.email}
                            title="Email this report"
                            className="px-2.5 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/25 disabled:opacity-30 transition-all"
                          >
                            Email
                          </button>
                          <button
                            onClick={() => promptDeleteOne(c)}
                            disabled={deletingId === c.id}
                            title="Delete customer"
                            className="p-1.5 rounded-lg bg-red-500/8 border border-red-500/15 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30 transition-all"
                          >
                            {deletingId === c.id ? (
                              <span className="w-3.5 h-3.5 block rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                            ) : (
                              <TrashIcon />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="px-4 py-2 rounded-xl border border-white/10 text-white/50 disabled:opacity-30 hover:border-white/20 transition-all"
              >
                ← Previous
              </button>
              <span className="text-white/30 text-xs">
                {offset + 1}–{Math.min(offset + limit, total)} of {total}
              </span>
              <button
                disabled={offset + limit >= total}
                onClick={() => setOffset(offset + limit)}
                className="px-4 py-2 rounded-xl border border-white/10 text-white/50 disabled:opacity-30 hover:border-white/20 transition-all"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
