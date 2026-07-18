import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — SKINIC",
  description: "Privacy Policy for SKINIC AI Skin Intelligence — Studio and API products.",
};

const sections = [
  {
    title: "1. Introduction & Controller Identity",
    body: `This Privacy Policy describes how Thinking Studio LLC ("Company", "we", "us", "our"), a Delaware limited liability company, collects, uses, stores, and protects personal data when you use:

• skinic.app — marketing site, dashboard, and SKINIC Studio
• api.skinic.app — SKINIC API

Controller relationships:
• Thinking Studio LLC is Data Controller for account holder data (signup, billing, support).
• Studio Clients are Data Controllers for Studio End User data collected via branded scan pages; we act as Data Processor.
• API Clients are Data Controllers for their end users' data; we act as Data Processor when processing on their instruction.

Contact: skinic@thinkingstudio.ai

This Policy works together with our Terms of Service and Cookie Policy.`,
  },
  {
    title: "2. Data We Collect",
    body: `2.1 Account Data (you provide)
• Name, email, company name, country/billing region

2.2 Usage & Technical Data (automatic)
• API call counts, endpoints, timestamps, response codes
• Hashed API key identifiers (plaintext never stored)
• IP addresses for rate limiting and abuse prevention
• Browser/device type for dashboard sessions

2.3 Billing Data
• Subscription tier, transaction IDs from Paddle
• We never store full card numbers, CVV, or bank details

2.4 API Submitted Content
• Images to POST /analyze and POST /scan — processed in-memory, not retained after response unless consent_to_store=true
• Text to POST /recommend — not stored beyond the request session
• Optional prev_derm_signature — processed in-memory only

2.5 Studio End User Data (on Studio Client's behalf)
• Name, email (if lead capture enabled)
• Skin profile results (type, traits, clarity score, matches) — not raw images
• Timestamps, catalog match and CTA click metadata

2.6 Support & Communications
• Emails you send us, support ticket content

2.7 Mobile consumer app (skinic-mobile)
When used standalone with a local API key, scan history may be stored only on the device (AsyncStorage). SKINIC does not receive that local history unless the app calls our API.`,
  },
  {
    title: "3. Legal Basis for Processing (GDPR / UK GDPR)",
    body: `For EEA and UK users:

• Contract — providing SKINIC Studio or API services you subscribed to
• Legitimate interests — security, fraud prevention, abuse detection, service improvement (balanced against your rights)
• Legal obligation — tax, accounting, regulatory compliance
• Consent — optional marketing emails (withdraw anytime)

Special category / biometric data: Where skin images constitute biometric data, API Clients and Studio Clients must obtain explicit consent before submission. We process on their documented instruction as Processor.`,
  },
  {
    title: "4. Automated Decision-Making (GDPR Article 22)",
    body: `SKINIC uses automated processing (AI models) to generate cosmetic skin profiles, trait scores, and ingredient suggestions.

These outputs:
• Are for cosmetic and informational purposes only
• Do not produce legal or similarly significant effects
• Are not used by Thinking Studio LLC to make decisions about employment, credit, insurance, or legal status

Clients integrating SKINIC must not use outputs as the sole basis for decisions with legal or significant effects on individuals without appropriate safeguards and human review required by law.`,
  },
  {
    title: "5. How We Use Your Data",
    body: `We use data to:
• Operate Studio and API, authenticate accounts, manage API keys
• Process payments via Paddle
• Enforce quotas, rate limits, and detect abuse
• Send transactional emails (signup, billing, security alerts)
• Improve service using aggregated, anonymised usage statistics
• Respond to support and legal requests
• Comply with law

We do NOT:
• Sell personal data to data brokers
• Use data for third-party advertising
• Cross-reference Studio End User data between different Studio Clients
• Use identifiable submitted images for model training without separate written consent`,
  },
  {
    title: "6. Subprocessors & Data Sharing",
    body: `We share data only with service providers under contractual safeguards:

| Subprocessor | Purpose | Location |
|---|---|---|
| Paddle.com | Payments (Merchant of Record) | US / EU |
| Supabase Inc. | Database, auth (AWS) | US |
| Railway.app | API hosting | US |
| Vercel Inc. | Frontend hosting | US |
| Cloudflare Inc. | DNS, CDN, security | Global |
| SKINIC AI | AI ingredient guidance (/recommend, Starter+) | Processed via our AI infrastructure |

SKINIC AI processes skin type and concern text to generate cosmetic ingredient suggestions. No raw skin images are sent to SKINIC AI for /recommend. We do not disclose underlying infrastructure providers in public documentation.

We may disclose data if required by law, court order, or to protect rights, safety, and security.`,
  },
  {
    title: "7. Biometric & Sensitive Data",
    body: `7.1 API image processing
• TLS encryption in transit
• In-memory processing; deleted after response unless consent_to_store=true
• No thumbnails or individual embeddings retained from API images by default

7.2 Studio scans
• Raw images are not stored — only derived cosmetic profile results
• Stored in Studio Client's database until account termination (see Retention)

7.3 Client obligations
API and Studio Clients must obtain valid consent before capture, provide privacy notices, and honour data subject rights. See Terms Section 24.`,
  },
  {
    title: "8. Data Retention",
    body: `• Account data — duration of account + 90 days after deletion
• Usage metadata — 12 months rolling
• Billing records — 7 years (tax/accounting)
• Security logs — 90 days
• API images — not retained (unless consent_to_store storage applies to scan summaries in Supabase)
• Studio End User records — while Studio account active; 30 days after cancellation for export, then deleted

Early deletion requests honoured subject to legal retention requirements.`,
  },
  {
    title: "9. Studio End User Rights",
    body: `Studio End Users should contact the beauty business (Studio Client) first for access, correction, or deletion.

If unreachable or data is misused, contact skinic@thinkingstudio.ai. As Processor, we will assist Studio Clients and may delete data directly if a Client is unresponsive after reasonable verification.`,
  },
  {
    title: "10. Your Privacy Rights",
    body: `Depending on jurisdiction, you may have rights to:

• Access — copy of data we hold about you
• Rectification — correct inaccurate data
• Erasure — delete data (subject to legal retention)
• Restriction — limit processing in certain cases
• Portability — machine-readable export
• Object — to legitimate-interest processing
• Withdraw consent — where processing is consent-based
• Complain — to your supervisory authority

Request: skinic@thinkingstudio.ai, subject "Privacy Request". Response within 30 days.`,
  },
  {
    title: "11. California Privacy Rights (CCPA / CPRA)",
    body: `California residents have additional rights:

• Know what personal information is collected, used, and disclosed
• Delete personal information (subject to exceptions)
• Correct inaccurate personal information
• Opt out of "sale" or "sharing" of personal information

We do NOT sell or share personal information for cross-context behavioural advertising.

To exercise rights: skinic@thinkingstudio.ai. We will not discriminate against you for exercising privacy rights.

Categories collected in preceding 12 months: identifiers (name, email), commercial information (subscription), internet activity (usage logs). Disclosed to subprocessors listed in Section 6 for business purposes only.`,
  },
  {
    title: "12. Malaysia PDPA",
    body: `For Malaysia data users, we process personal data in accordance with the Personal Data Protection Act 2010 (PDPA):

• General Principle — processed fairly and for specified purposes
• Notice and Choice — this Policy serves as notice; consent obtained at signup and by Clients for end users
• Disclosure — limited to subprocessors in Section 6
• Security — measures in Section 13
• Retention — as Section 8
• Data Integrity — reasonable steps to keep data accurate
• Access — contact skinic@thinkingstudio.ai

Cross-border transfers use contractual safeguards with processors.`,
  },
  {
    title: "13. Data Security",
    body: `Measures include:
• TLS 1.2+ in transit
• Encryption at rest (Supabase/AWS)
• API keys stored as SHA-256 hashes only
• Supabase Auth with email verification for dashboard
• Restricted production database access
• Periodic security reviews

No system is 100% secure. If a breach affects your data, we notify you within 72 hours where required by law, describing nature of breach, data affected, and remediation steps.`,
  },
  {
    title: "14. International Data Transfers",
    body: `Data may be processed in the United States and other countries where subprocessors operate.

EEA/UK transfers rely on Standard Contractual Clauses (SCCs) where applicable. Enterprise clients may request DPA with SCCs: skinic@thinkingstudio.ai.`,
  },
  {
    title: "15. Cookies & Similar Technologies",
    body: `See our dedicated Cookie Policy at /cookies for details on authentication storage, essential cookies, and third-party checkout cookies.

Summary: dashboard uses essential session storage for sign-in. No advertising cookies on SKINIC properties.`,
  },
  {
    title: "16. Children's Privacy",
    body: `SKINIC is for businesses and users 18+. We do not knowingly collect data from children under 13. Contact us to request deletion if you believe a child provided data.

Clients integrating SKINIC for minors must comply with COPPA and local children's privacy laws and obtain parental consent.`,
  },
  {
    title: "17. Marketing Communications",
    body: `We may send product updates and offers to account holders. Unsubscribe via email link or skinic@thinkingstudio.ai. Transactional emails (billing, security) are not marketing and cannot be opted out while you have an account.`,
  },
  {
    title: "18. AI Model Improvement",
    body: `We may use aggregated, anonymised usage statistics (call volumes, latency, error rates) to improve performance. This cannot identify individuals or reconstruct submitted images.

Identifiable images are never used for training without separate written client consent.`,
  },
  {
    title: "19. Limitation of Privacy Liability",
    body: `To the fullest extent permitted by law, liability for privacy breaches is limited to the greater of (a) fees paid in the three months before the incident or (b) USD $100.

We are not liable for breaches caused by: your insecure API keys, your application's vulnerabilities, your end users, subprocessors beyond our reasonable control, or force majeure.`,
  },
  {
    title: "20. Changes to This Policy",
    body: `We may update this Policy. Material changes notified by email or in-dashboard at least 14 days before effect where required. "Last updated" date reflects the current version.`,
  },
  {
    title: "21. Supervisory Authorities (EEA / UK)",
    body: `You may lodge a complaint with your local data protection authority. Examples:
• EU: your national DPA (edpb.europa.eu)
• UK: Information Commissioner's Office (ico.org.uk)
• Malaysia: Department of Personal Data Protection (JPDP)

We encourage contacting us first at skinic@thinkingstudio.ai so we can address concerns promptly.`,
  },
  {
    title: "22. Contact Us",
    body: `Privacy enquiries and data subject requests:

Thinking Studio LLC
Email: skinic@thinkingstudio.ai
Website: https://skinic.app

General enquiries: within 3 business days
Formal data subject requests: within 30 days`,
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
          <p className="text-white/40 text-sm">Last updated: July 2026 · Thinking Studio LLC · Studio &amp; API</p>
        </div>

        <div className="card-glass rounded-2xl p-6 border border-violet-500/20 bg-violet-500/5 mb-6">
          <p className="text-violet-300 font-semibold text-sm mb-3">Summary</p>
          <ul className="space-y-1.5 text-white/50 text-sm">
            <li>✓ Account data: name, email, usage — we don&apos;t sell it</li>
            <li>✓ API images: in-memory only, not stored by default</li>
            <li>✓ Studio: profile results stored (not raw images) for your customers</li>
            <li>✓ SKINIC AI processes text for ingredient guides — no images sent</li>
            <li>✓ Payments via Paddle — we never see card details</li>
            <li>✓ Request deletion anytime: skinic@thinkingstudio.ai</li>
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
            <Link href="/cookies" className="text-violet-400">Cookie Policy</Link>
            {" · "}
            <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">skinic@thinkingstudio.ai</a>
          </p>
        </div>
      </div>
    </main>
  );
}
