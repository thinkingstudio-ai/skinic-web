export default function DashboardTermsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Legal — Terms, Privacy &amp; Cookies</h2>
        <p className="text-white/40 text-sm mt-0.5">Last updated: July 2026</p>
      </div>

      <div className="card-glass rounded-2xl p-5 border border-white/10">
        <p className="text-white/60 text-sm leading-relaxed mb-4">
          Full legal documents for SKINIC. As an API or Studio client, you are bound by these policies
          and must pass equivalent obligations to your end users.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/terms" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-600/30 transition-colors">
            Terms of Service →
          </a>
          <a href="/privacy" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
            Privacy Policy →
          </a>
          <a href="/cookies" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
            Cookie Policy →
          </a>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-glass rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-amber-300 font-semibold text-sm">Cosmetic-Only Disclaimer</p>
          </div>
          <div className="space-y-2 text-white/50 text-sm leading-relaxed">
            <p>SKINIC is an <strong className="text-white/70">AI cosmetic profiling tool, not a medical device</strong>. Results are for beauty and informational purposes only.</p>
            <p>Outputs <strong className="text-white/70">do not constitute medical advice, diagnosis, or treatment</strong>. Ingredient guidance is cosmetic only — not treatment for any condition.</p>
            <p>You must display this disclaimer to your end users and obtain consent before processing images or biometric data.</p>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <p className="text-white font-semibold text-sm mb-4">Your B2B Obligations (Summary)</p>
          <div className="space-y-3 text-white/45 text-sm leading-relaxed">
            <p><strong className="text-white/70">Acceptable use.</strong> No progress/efficacy UX, no clinical claims, no reselling API access without consent. Secure your API keys.</p>
            <p><strong className="text-white/70">End-user consent.</strong> Explicit consent before scan. Privacy notice covering SKINIC processing. Honour deletion requests.</p>
            <p><strong className="text-white/70">Indemnification.</strong> You indemnify Thinking Studio LLC for claims arising from your product, copy, regulatory non-compliance, or end-user disputes.</p>
            <p><strong className="text-white/70">Liability cap.</strong> Our total liability is limited to fees paid in the prior 3 months or USD $100, whichever is greater.</p>
            <p><strong className="text-white/70">Regulatory.</strong> You are responsible for compliance in your jurisdiction (FDA, EU MDR, NPRA, etc.). SKINIC is positioned as cosmetic only.</p>
            <p><strong className="text-white/70">DPA.</strong> Enterprise clients may request a Data Processing Agreement: skinic@thinkingstudio.ai</p>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <p className="text-white font-semibold text-sm mb-4">Data Handling (Summary)</p>
          <div className="space-y-3 text-white/45 text-sm leading-relaxed">
            <p><strong className="text-white/70">API images.</strong> Processed in-memory, not stored after response unless consent_to_store=true.</p>
            <p><strong className="text-white/70">Studio scans.</strong> Derived profiles stored (not raw images). You are Data Controller for your customers.</p>
            <p><strong className="text-white/70">SKINIC AI.</strong> Ingredient guidance (/recommend) uses skin type + concern text only — no images sent.</p>
            <p><strong className="text-white/70">We do not sell data.</strong> Subprocessors: Paddle, Supabase, Railway, Vercel, Cloudflare, SKINIC AI.</p>
            <p><strong className="text-white/70">Retention.</strong> Account data: 90 days after deletion. Studio customer data: 30 days export window after cancellation.</p>
            <p><strong className="text-white/70">Contact.</strong> Privacy requests: <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">skinic@thinkingstudio.ai</a></p>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-5 border border-white/5">
          <p className="text-white/40 text-xs leading-relaxed">
            This page is a summary only. The full Terms of Service, Privacy Policy, and Cookie Policy at the links above govern your use of SKINIC.
            SKINIC complies with PDPA (Malaysia), GDPR principles, and CCPA where applicable.
            Regulatory requirements vary by jurisdiction — you are responsible for compliance in your market.
          </p>
        </div>
      </div>
    </div>
  );
}
