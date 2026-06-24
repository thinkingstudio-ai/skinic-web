import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — SKINIC",
  description: "Privacy Policy for the SKINIC AI Skin Intelligence API.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to skinic.app
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: May 2026 · Thinking Studio LLC</p>
        </div>

        <div className="space-y-6 text-white/50 text-sm leading-relaxed">

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-3">Overview</p>
            <p>Thinking Studio LLC ("we", "us") operates the SKINIC API at <strong className="text-white/70">skinic.app</strong>. This policy explains what data we collect, how we use it, and your rights.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">Data We Collect</p>
            <ul className="space-y-2">
              <li>• <strong className="text-white/70">Account data:</strong> Name, email address, company name when you sign up.</li>
              <li>• <strong className="text-white/70">Usage metadata:</strong> API call counts, timestamps, endpoint usage, tier information.</li>
              <li>• <strong className="text-white/70">Billing data:</strong> Subscription tier and payment status (payment details handled by Paddle, not stored by us).</li>
              <li>• <strong className="text-white/70">Images:</strong> Skin images submitted to <code className="text-violet-400/70">/analyze</code> are processed in-memory and <strong className="text-white/70">not stored</strong> after the API response is returned.</li>
            </ul>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">How We Use Your Data</p>
            <ul className="space-y-2">
              <li>• To provide and maintain the SKINIC API service</li>
              <li>• To manage your account, billing, and API keys</li>
              <li>• To monitor usage and enforce rate limits</li>
              <li>• To improve our AI models and service quality</li>
              <li>• To send service-related emails (not marketing without consent)</li>
            </ul>
            <p className="mt-3">We <strong className="text-white/70">do not sell</strong> your data to third parties.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">Data Storage & Security</p>
            <p>Account and usage data is stored in Supabase (PostgreSQL) hosted on AWS infrastructure. We apply encryption at rest and in transit (TLS). API keys are stored as SHA-256 hashes — the plaintext key is never stored.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">Third-Party Services</p>
            <ul className="space-y-2">
              <li>• <strong className="text-white/70">Paddle.com</strong> — Payment processing. Your payment details are governed by <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-400">Paddle's Privacy Policy</a>.</li>
              <li>• <strong className="text-white/70">Supabase</strong> — Database and authentication hosting.</li>
              <li>• <strong className="text-white/70">Railway.app</strong> — API server hosting.</li>
            </ul>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">Data Retention</p>
            <p>Account data is retained for the duration of your subscription plus 90 days after cancellation. Usage logs are retained for 12 months. You may request deletion at any time by contacting us.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">Your Rights</p>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="space-y-1 mt-2">
              <li>• Access the data we hold about you</li>
              <li>• Request correction or deletion of your data</li>
              <li>• Object to or restrict processing</li>
              <li>• Data portability</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">skinic@thinkingstudio.ai</a>.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">Compliance</p>
            <p>SKINIC complies with applicable data protection laws including <strong className="text-white/70">PDPA (Malaysia)</strong> and <strong className="text-white/70">GDPR principles</strong>. For enterprise compliance requirements (HIPAA, SOC 2), contact <a href="mailto:skinic@thinkingstudio.ai?subject=Compliance%20Inquiry" className="text-violet-400">skinic@thinkingstudio.ai</a>.</p>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <p className="text-white font-semibold text-sm mb-4">Contact</p>
            <p>Thinking Studio LLC<br />
            Email: <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">skinic@thinkingstudio.ai</a><br />
            Website: <a href="https://skinic.app" className="text-violet-400">skinic.app</a></p>
          </div>

          <div className="card-glass rounded-2xl p-5 border border-white/5 text-center">
            <p className="text-white/30 text-xs">
              <Link href="/terms" className="text-violet-400">Terms of Service</Link>
              {" "}·{" "}
              <Link href="/" className="text-violet-400">skinic.app</Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
