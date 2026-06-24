import Link from "next/link";

export const metadata = {
  title: "Terms of Service — SKINIC",
  description: "Terms of Service for the SKINIC AI Skin Intelligence API.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to skinic.app
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-white/40 text-sm">Last updated: May 2026 · Thinking Studio LLC</p>
        </div>

        <div className="space-y-6 text-white/50 text-sm leading-relaxed">

          <div className="card-glass rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5">
            <p className="text-amber-300 font-semibold text-sm mb-3">⚠ Medical Disclaimer</p>
            <p>SKINIC is an <strong className="text-white/70">AI-powered screening tool, not a medical device</strong>. Results are for informational and cosmetic purposes only. SKINIC output does not constitute medical advice, diagnosis, or treatment. Always consult a licensed dermatologist for medical concerns.</p>
            <p className="mt-2">By using this API, you agree to communicate this disclaimer clearly to your end users and obtain appropriate consent.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">1. Acceptance</p>
            <p>By accessing or using the SKINIC API, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, do not use the service.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">2. Acceptable Use</p>
            <p>You may use the SKINIC API only for lawful purposes. You must not resell, sublicense, or redistribute API access without written consent from Thinking Studio LLC. Automated scraping, abuse, or attempts to circumvent rate limits are prohibited.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">3. User Consent</p>
            <p>You must obtain explicit consent from your end users before collecting or processing any biometric or skin image data through this API. You are responsible for your users' data under applicable privacy laws.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">4. Rate Limits & Quotas</p>
            <p>You agree to respect the rate limits and monthly call caps assigned to your subscription tier. Sustained abuse may result in temporary throttling or permanent account suspension without refund.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">5. API Key Security</p>
            <p>You are solely responsible for keeping your API keys secure. Do not expose keys in client-side code, public repositories, or logs. Report suspected key compromise immediately to <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">skinic@thinkingstudio.ai</a>.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">6. Payment & Billing</p>
            <p>Paid plans are billed monthly. Payments are processed by Paddle.com as Merchant of Record. Refunds are handled on a case-by-case basis — contact us within 7 days of charge for disputes.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">7. Service Availability</p>
            <p>We target 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance where possible. SLA guarantees apply to Enterprise plans only.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">8. Modifications</p>
            <p>Thinking Studio LLC reserves the right to modify pricing, rate limits, features, and these terms with reasonable notice. Continued use after notice constitutes acceptance of changes.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">9. Termination</p>
            <p>We reserve the right to suspend or terminate access for violations of these terms, fraudulent activity, or non-payment, without prior notice in cases of serious violation.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">10. Limitation of Liability</p>
            <p>To the maximum extent permitted by law, Thinking Studio LLC shall not be liable for any indirect, incidental, or consequential damages arising from use of the SKINIC API. Our total liability shall not exceed the amount paid by you in the 3 months preceding the claim.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">11. Governing Law</p>
            <p>These terms are governed by the laws of the United States. Disputes shall be resolved through binding arbitration, except where prohibited by law.</p>
          </div>

          <div className="card-glass rounded-2xl p-5 border border-white/5 text-center">
            <p className="text-white/30 text-xs">
              Questions? Email{" "}
              <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">skinic@thinkingstudio.ai</a>
              {" "}·{" "}
              <Link href="/privacy" className="text-violet-400">Privacy Policy</Link>
              {" "}·{" "}
              <Link href="/" className="text-violet-400">skinic.app</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
