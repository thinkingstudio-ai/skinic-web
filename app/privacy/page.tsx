import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — SKINIC",
  description: "Privacy Policy for the SKINIC AI Skin Intelligence API.",
};

const sections = [
  {
    title: "1. Introduction & Controller Identity",
    body: `This Privacy Policy describes how Thinking Studio LLC ("Company", "we", "us", "our"), operator of the SKINIC AI Skin Intelligence API at skinic.app, collects, uses, stores, and protects personal data when you use our services.\n\nThinking Studio LLC acts as the Data Controller for account and usage data. Where you integrate SKINIC into your own product, you act as a separate Data Controller for your end users' data, and we act as a Data Processor on your behalf.\n\nFor privacy enquiries: skinic@thinkingstudio.ai`,
  },
  {
    title: "2. Data We Collect",
    body: `We collect the following categories of data:\n\n2.1 Account Data (provided by you at signup):\n• Full name\n• Email address\n• Company or organisation name\n• Country / billing region\n\n2.2 Usage & Technical Data (collected automatically):\n• API call counts per endpoint and per time period\n• Request timestamps and response times\n• HTTP status codes and error types\n• API key identifiers (hashed — plaintext never stored)\n• IP addresses for rate limiting and abuse prevention\n• Browser/device type for dashboard sessions\n\n2.3 Billing Data:\n• Subscription tier and status\n• Payment transaction IDs (provided by Paddle)\n• We do NOT store full card numbers, CVV, or bank account details\n\n2.4 Submitted Content:\n• Skin images submitted to /analyze endpoints are processed in-memory and are NOT stored after the API response is returned. We retain no copies of user images.\n• Text inputs to /recommend are not stored beyond the API session.`,
  },
  {
    title: "3. Legal Basis for Processing (GDPR)",
    body: `For users in the European Economic Area (EEA) and United Kingdom, we process your personal data under the following legal bases:\n\n• Contract performance: Processing necessary to provide the SKINIC API service you have subscribed to\n• Legitimate interests: Security monitoring, fraud prevention, service improvement, and abuse detection\n• Legal obligation: Compliance with applicable laws, tax obligations, and regulatory requirements\n• Consent: Where we send optional marketing communications (you may withdraw consent at any time)`,
  },
  {
    title: "4. How We Use Your Data",
    body: `We use collected data for the following purposes:\n\n• Providing, operating, and maintaining the SKINIC API and dashboard\n• Account management, authentication, and API key management\n• Processing payments and managing subscriptions\n• Enforcing rate limits and detecting abuse or security threats\n• Sending transactional emails (account creation, API key notifications, billing receipts)\n• Improving the accuracy and performance of our AI models using aggregated, anonymised usage patterns\n• Responding to support requests and legal enquiries\n• Complying with legal obligations and regulatory requirements\n\nWe do NOT use your data for targeted advertising or sell it to data brokers or third parties.`,
  },
  {
    title: "5. Data Sharing & Third-Party Processors",
    body: `We share data only with trusted service providers under data processing agreements:\n\n• Paddle.com — Payment processing and subscription management. Paddle acts as Merchant of Record. See paddle.com/legal/privacy.\n• Supabase Inc. — Database hosting (PostgreSQL) and authentication. Data hosted on AWS infrastructure in the US.\n• Railway.app — API server hosting and deployment infrastructure.\n• Cloudflare Inc. — DNS, CDN, and DDoS protection. May process IP addresses.\n• Vercel Inc. — Frontend hosting for skinic.app dashboard.\n\nWe do not sell, rent, or share your personal data with any other third party for their own commercial purposes.`,
  },
  {
    title: "6. Biometric & Sensitive Data",
    body: `Skin images submitted through the SKINIC API may constitute biometric or sensitive personal data under applicable law (including GDPR Article 9 and Malaysia PDPA Section 40).\n\nOur commitments regarding image data:\n• Images are transmitted over encrypted TLS connections\n• Images are processed in-memory only and deleted immediately after the API response is generated\n• No copies, thumbnails, or embeddings derived from individual images are stored or retained\n• We do not use submitted images to train or fine-tune AI models without explicit written consent\n\nAs a SKINIC API client, you are responsible for obtaining valid consent from your end users before submitting their biometric data.`,
  },
  {
    title: "7. Data Retention",
    body: `We retain different categories of data for different periods:\n\n• Account data: Retained for the duration of your account plus 90 days after deletion or cancellation\n• Usage metadata: Retained for 12 months on a rolling basis\n• Billing records: Retained for 7 years to comply with tax and accounting obligations\n• Security logs (IP addresses, access logs): Retained for 90 days\n• Submitted images: Not retained — deleted immediately after processing\n\nYou may request early deletion of your account data at any time (subject to legal retention obligations).`,
  },
  {
    title: "8. Data Security",
    body: `We implement industry-standard security measures to protect your data:\n\n• All data in transit is encrypted using TLS 1.2 or higher\n• Data at rest is encrypted in Supabase / AWS storage\n• API keys are stored only as SHA-256 hashes — the plaintext key is shown once and never stored\n• Dashboard access is protected by Supabase Auth with email verification\n• Access to production database is restricted to authorised personnel only\n• We conduct periodic security reviews of our infrastructure\n\nDespite these measures, no system is completely secure. In the event of a data breach affecting your personal data, we will notify you within 72 hours where required by law.`,
  },
  {
    title: "9. International Data Transfers",
    body: `Your data may be transferred to and processed in the United States and other countries where our service providers operate. For transfers of EEA personal data to the United States, we rely on Standard Contractual Clauses (SCCs) as approved by the European Commission. For transfers subject to Malaysia PDPA, we ensure adequate protection through contractual safeguards with our processors.`,
  },
  {
    title: "10. Your Rights",
    body: `Depending on your jurisdiction, you may have the following rights regarding your personal data:\n\n• Right of Access: Request a copy of the personal data we hold about you\n• Right to Rectification: Request correction of inaccurate or incomplete data\n• Right to Erasure: Request deletion of your personal data (subject to legal retention obligations)\n• Right to Restriction: Request that we restrict processing of your data in certain circumstances\n• Right to Portability: Receive your data in a structured, machine-readable format\n• Right to Object: Object to processing based on legitimate interests\n• Right to Withdraw Consent: Withdraw consent at any time where processing is based on consent\n• Right to Lodge a Complaint: File a complaint with your local data protection authority\n\nTo exercise any of these rights, email skinic@thinkingstudio.ai with the subject "Privacy Request" and your registered email address. We will respond within 30 days.`,
  },
  {
    title: "11. Cookies & Tracking",
    body: `The SKINIC dashboard uses essential cookies for authentication session management (Supabase Auth tokens stored in browser storage). We do not use third-party tracking cookies, advertising pixels, or analytics platforms that profile individual users.\n\nThe landing page (skinic.app) does not use any tracking cookies beyond what is required for Vercel's hosting infrastructure.`,
  },
  {
    title: "12. Children's Privacy",
    body: `The SKINIC API is intended for use by businesses and developers aged 18 and above. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, contact us at skinic@thinkingstudio.ai and we will delete it promptly.\n\nIf you integrate SKINIC into a product used by minors, you are responsible for obtaining appropriate parental consent and complying with applicable children's privacy laws (including COPPA).`,
  },
  {
    title: "13. Compliance",
    body: `SKINIC operates in compliance with:\n\n• Malaysia Personal Data Protection Act 2010 (PDPA)\n• EU General Data Protection Regulation (GDPR) — where applicable\n• UK GDPR — where applicable\n• California Consumer Privacy Act (CCPA) — where applicable\n\nFor enterprise clients requiring compliance documentation for HIPAA, SOC 2, ISO 27001, or other frameworks, contact skinic@thinkingstudio.ai with subject "Compliance Inquiry".`,
  },
  {
    title: "14. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or service features. We will notify you of material changes via email to your registered address or via an in-dashboard notice at least 14 days before the changes take effect. The "Last updated" date at the top of this page reflects the most recent revision.`,
  },
  {
    title: "15. Contact Us",
    body: `For any privacy-related questions, data requests, or concerns:\n\nThinking Studio LLC\nEmail: skinic@thinkingstudio.ai\nWebsite: https://skinic.app\nResponse time: Within 3 business days for general enquiries; within 30 days for formal data subject requests.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to skinic.app
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: June 2026 · Thinking Studio LLC · Effective immediately</p>
        </div>

        {/* Quick summary */}
        <div className="card-glass rounded-2xl p-6 border border-violet-500/20 bg-violet-500/5 mb-6">
          <p className="text-violet-300 font-semibold text-sm mb-3">Summary (Plain English)</p>
          <ul className="space-y-1.5 text-white/50 text-sm">
            <li>✓ We collect your name, email, and API usage stats — nothing more</li>
            <li>✓ Skin images are processed in-memory and <strong className="text-white/70">never stored</strong></li>
            <li>✓ We do not sell your data to anyone</li>
            <li>✓ Payments handled by Paddle — we never see your card details</li>
            <li>✓ You can request deletion of your data at any time</li>
          </ul>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.title} className="card-glass rounded-2xl p-6">
              <p className="text-white font-semibold text-sm mb-3">{s.title}</p>
              <div className="text-white/45 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="card-glass rounded-2xl p-5 border border-white/5 text-center mt-6">
          <p className="text-white/30 text-xs">
            <Link href="/terms" className="text-violet-400">Terms of Service</Link>
            {" · "}
            <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">skinic@thinkingstudio.ai</a>
            {" · "}
            <Link href="/" className="text-violet-400">skinic.app</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
