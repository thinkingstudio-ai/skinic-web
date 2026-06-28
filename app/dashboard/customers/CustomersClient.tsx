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

const SKIN_TYPES = ["", "Oily", "Dry", "Normal", "Combination"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", {
    day: "numeric", month: "short", year: "numeric",
  });
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
  const limit = 25;

  const fetchCustomers = useCallback(async (st: string, off: number) => {
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
  }, [supabase, apiUrl]);

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
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `skinic-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Customer Database</h2>
          <p className="text-white/40 text-sm mt-0.5">
            End users who scanned via your brand page. Every scan captures the customer&apos;s email. Use the report link to follow up.
          </p>
        </div>
        {customers.length > 0 && (
          <button
            onClick={exportCSV}
            className="shrink-0 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-white/20 hover:text-white/80 transition-all"
          >
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <label className="text-xs text-white/40">Filter by skin type:</label>
        <div className="flex gap-2">
          {SKIN_TYPES.map((t) => (
            <button
              key={t || "all"}
              onClick={() => { setFilterType(t); setOffset(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? "bg-violet-600 text-white" : "bg-white/5 text-white/45 hover:text-white/70"}`}
            >
              {t || "All"}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-white/30">{total} customer{total !== 1 ? "s" : ""}</span>
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
                  <th className="text-right px-5 py-3 text-white/40 text-xs font-semibold uppercase tracking-wider">Report</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id} className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                    <td className="px-5 py-3 text-white/80">{c.name || <span className="text-white/20">—</span>}</td>
                    <td className="px-5 py-3 text-white/55 font-mono text-xs">{c.email || <span className="text-white/20">—</span>}</td>
                    <td className="px-5 py-3">
                      {c.skin_type ? (
                        <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs font-medium">
                          {c.skin_type}
                        </span>
                      ) : <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(c.top_traits || []).slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-white/35 text-[10px]">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/35 text-xs">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyLink(c)}
                          disabled={!slug}
                          title="Copy the customer's report link"
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/55 text-xs font-medium hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                          {copiedId === c.id ? "✓ Copied" : "Copy link"}
                        </button>
                        <button
                          onClick={() => emailReport(c)}
                          disabled={!slug || !c.email}
                          title="Email this report from your own email"
                          className="px-2.5 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/25 disabled:opacity-30 transition-all"
                        >
                          Email
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
  );
}
