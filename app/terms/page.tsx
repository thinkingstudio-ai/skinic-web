import Link from "next/link";

export const metadata = {
  title: "Terms of Service — SKINIC",
  description: "Terms of Service for SKINIC AI Skin Intelligence — Studio and API products.",
};

const sections = [
  {
    title: "1. Agreement to Terms",
    body: `By accessing or using any SKINIC product — including SKINIC Studio (skinic.app/studio), the SKINIC API (api.skinic.app), dashboard, branded scan pages, or related services operated by Thinking Studio LLC ("Company", "we", "us", "our") — you ("Client", "you") agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and our Cookie Policy (together, the "Agreement").

If you use our services on behalf of an organisation, you represent that you have authority to bind that organisation. If you do not agree, you must not use our services.`,
  },
  {
    title: "2. Description of Service",
    body: `SKINIC operates two distinct products under a single account:

2.1 SKINIC Studio (skinic.app/studio)
A no-code platform for beauty businesses to launch branded AI skin profiling pages, manage product catalogs, capture leads, and view analytics. Studio Clients serve Studio End Users via branded scan pages.

2.2 SKINIC API (api.skinic.app)
A REST API providing skin-type profiling, visible trait scoring, ingredient guidance, catalog matching, and optional embedding fields for third-party integrations.

Both products are for cosmetic and informational purposes only. SKINIC is a cosmetic beauty tool — not a medical device and not intended for clinical screening. Regulatory requirements vary by jurisdiction; see Section 23.`,
  },
  {
    title: "3. Account Registration & Security",
    body: `You must provide accurate information at signup. You are responsible for safeguarding login credentials and API keys. Notify us immediately at skinic@thinkingstudio.ai if you suspect unauthorised access.

API Clients: Each API key is for one authorised application. Do not embed keys in public client-side code.

Studio Clients: You are responsible for all activity on your branded scan page and Studio dashboard.`,
  },
  {
    title: "4. Acceptable Use",
    body: `You must use SKINIC lawfully and comply with all applicable laws.

All Clients must not:
• Reverse-engineer, decompile, or extract underlying AI models
• Conduct DoS attacks, systematic scraping, or abuse rate limits
• Generate defamatory, harmful, or infringing content
• Process data of children under 13 without verifiable parental consent
• Represent SKINIC as FDA-approved, CE-marked, clinically validated, or a medical device

API Clients additionally must not:
• Resell or sublicense API access without written consent
• Share keys across organisations without Enterprise agreement
• Present outputs as progress reports, before/after comparisons, or product efficacy validation
• Use skin_stability or skin_trajectory to imply improvement, worsening, or product efficacy
• Present ingredient guidance as treatment, cure, or diagnosis

Studio Clients additionally must not:
• Impersonate another brand or business
• Collect data beyond stated cosmetic business purposes
• Misrepresent scans as medical or clinical assessments
• Remove or hide required cosmetic disclaimers on scan or result pages`,
  },
  {
    title: "5. Cosmetic-Only Disclaimer",
    body: `SKINIC is an AI-powered cosmetic profiling tool — NOT a medical device, diagnostic tool, or clinical decision support system.

SKINIC outputs:
• Do not constitute medical advice, diagnosis, or treatment
• Do not detect, screen for, or assess any disease or medical condition
• Must not be the sole basis for any health decision

Repeat scans produce independent cosmetic profiles. SKINIC does not monitor treatment progress or validate product efficacy. Score differences between scans may reflect lighting, angle, and environment — not improvement or worsening.

Clients must display cosmetic-only disclaimers to end users, obtain informed consent before image processing, and never represent outputs as clinical findings.`,
  },
  {
    title: "6. End User & Studio End User Obligations",
    body: `If you integrate SKINIC into a product serving end users, you are solely responsible for:

• Obtaining valid consent for data collection and AI profiling
• Providing a privacy notice covering SKINIC processing
• Complying with consumer protection and data protection laws in your jurisdiction
• Handling end-user complaints, data requests, and disputes

Studio Clients act as Data Controller for Studio End User data. Thinking Studio LLC acts as Data Processor. We have no direct relationship with your end users and accept no liability arising from your product's use of SKINIC except as stated in this Agreement.

API Clients integrating into consumer apps bear full responsibility for UX, copy, regulatory compliance, and end-user communications.`,
  },
  {
    title: "7. Usage Limits & Quotas",
    body: `Tier limits (rate limits, monthly quotas) are published on our pricing page. Exceeding limits may result in HTTP 429 or paused Studio scans. Abuse may lead to suspension. We may adjust limits with 14 days' notice to paid subscribers.`,
  },
  {
    title: "8. Payment, Billing & Refunds",
    body: `Paid plans bill monthly in advance via Paddle.com (Merchant of Record). By subscribing, you authorise recurring charges until cancellation.

Refunds:
• Within 7 days of initial charge — reviewed case-by-case
• No pro-rated refunds after 7 days
• No refunds for accounts suspended for Terms violations

Prices are USD; taxes may apply per jurisdiction.`,
  },
  {
    title: "9. Cancellation & Data on Termination",
    body: `Cancel anytime via dashboard or email. Access continues until period end.

On cancellation:
• API keys deactivated; usage history retained 90 days then deleted
• Studio scan pages inactive; customer data retained 30 days for export then deleted

We may terminate immediately for material breach. Export Studio data before cancelling.`,
  },
  {
    title: "10. Intellectual Property",
    body: `All IP in SKINIC (software, AI models, documentation, branding) remains Thinking Studio LLC property. No ownership is transferred. You retain ownership of data you submit. You grant us a limited licence to process submitted data solely to provide the service.`,
  },
  {
    title: "11. Confidentiality",
    body: `Non-public platform information (beta features, pricing, roadmap, specs) received in connection with SKINIC is confidential unless publicly released by us.`,
  },
  {
    title: "12. Warranty Disclaimer",
    body: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED, ERROR-FREE, OR SECURE OPERATION. AI OUTPUTS MAY BE INACCURATE OR INCOMPLETE.`,
  },
  {
    title: "13. Limitation of Liability",
    body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, THINKING STUDIO LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA, GOODWILL, OR BUSINESS INTERRUPTION.

OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THIS AGREEMENT OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) FEES PAID BY YOU IN THE THREE MONTHS BEFORE THE CLAIM OR (B) USD $100.

Some jurisdictions do not allow certain limitations; in those cases our liability is limited to the maximum permitted by law.`,
  },
  {
    title: "14. Indemnification",
    body: `You agree to indemnify, defend, and hold harmless Thinking Studio LLC and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from:

(a) Your use of SKINIC in violation of this Agreement
(b) Your product, Studio scan page, or integration — including UX, marketing copy, and end-user communications
(c) Claims by your end users or Studio End Users relating to your product or business
(d) Your failure to obtain required consents, especially for biometric or image data
(e) Regulatory actions, fines, or investigations arising from your deployment of SKINIC (including FDA, EU MDR, NPRA, FTC, or advertising standards claims)
(f) Your infringement of third-party IP or privacy rights
(g) Misrepresentation of SKINIC outputs as medical, clinical, diagnostic, or efficacy-validating
(h) Your breach of applicable law

We may assume exclusive defence of any matter subject to indemnification; you will cooperate fully. This section survives termination.`,
  },
  {
    title: "15. Service Modifications & Termination",
    body: `We may modify, suspend, or discontinue any part of the service. Material changes to paid features receive at least 30 days' notice where practicable. We may terminate accounts for Terms violations, fraud, or non-payment without notice in serious cases.`,
  },
  {
    title: "16. Changes to Terms",
    body: `We may update this Agreement. Material changes are notified by email or in-dashboard notice. Continued use after the effective date constitutes acceptance. Disagree? Cancel before the effective date.`,
  },
  {
    title: "17. Governing Law & Dispute Resolution",
    body: `This Agreement is governed by the laws of the State of Delaware, USA, without regard to conflict-of-law rules.

Disputes shall first be resolved through good-faith negotiation (30 days). If unresolved, binding arbitration under American Arbitration Association rules in Delaware, unless both parties agree otherwise in writing.

CLASS ACTION WAIVER: You and Thinking Studio LLC agree to resolve disputes individually. Neither party may bring or participate in class, consolidated, or representative actions.

Each party waives jury trial to the extent permitted by law.`,
  },
  {
    title: "18. AI Output Accuracy Disclaimer",
    body: `SKINIC AI models may produce inaccurate, incomplete, or inconsistent outputs including miscategorised skin types, incorrect ingredient suggestions, and variable scores for similar inputs.

WE MAKE NO WARRANTIES ABOUT AI OUTPUT ACCURACY OR SUITABILITY. YOU ASSUME ALL RISK FROM RELIANCE ON OUTPUTS. WE ARE NOT LIABLE FOR DECISIONS OR HARM ARISING FROM AI OUTPUTS, WHETHER ACCURATE OR NOT.

Model updates may change outputs without notice.`,
  },
  {
    title: "19. Force Majeure",
    body: `We are not liable for failure or delay due to events beyond reasonable control: natural disasters, pandemics, third-party outages (Supabase, Railway, Paddle, Cloudflare, AWS, Vercel, SKINIC AI infrastructure), cyberattacks, government actions, sanctions, or labour disputes.`,
  },
  {
    title: "20. Third-Party Services",
    body: `SKINIC relies on third-party providers. We are not responsible for their outages, security incidents, billing errors, or policy changes. Paddle checkout is governed by Paddle's terms. SKINIC AI inference for ingredient guidance is processed via our AI infrastructure; see Privacy Policy for subprocessors.`,
  },
  {
    title: "21. Feedback & Testimonials",
    body: `Feedback you submit grants us a perpetual, royalty-free licence to use it without compensation. You warrant it does not infringe third-party rights.`,
  },
  {
    title: "22. Beta Features",
    body: `Beta or experimental features are "AS IS", may change without notice, and must not be used in production serving end users without our written consent.`,
  },
  {
    title: "23. Regulatory & Jurisdiction",
    body: `SKINIC is marketed as a cosmetic beauty tool. Laws differ by country (FDA US, EU MDR/AI Act, UK, Malaysia NPRA, etc.). We make no representation of approval or registration in any jurisdiction.

You are solely responsible for determining legal compliance in your market, obtaining required registrations, and ensuring copy/UX stay within cosmetic claims. Consult qualified legal counsel before consumer launch.`,
  },
  {
    title: "24. Biometric & Sensitive Data",
    body: `Skin images and profiles may constitute biometric or sensitive data under GDPR, PDPA, BIPA, and other laws.

Clients must:
• Obtain explicit, informed consent before capture or API submission
• Provide a privacy notice explaining processing, retention, and rights
• Not store images without consent (consent_to_store for API)
• Honour deletion requests from end users promptly

Thinking Studio LLC processes API images in-memory unless consent_to_store=true. Studio stores derived profiles, not raw images. Breach of these obligations is your responsibility; see Indemnification (Section 14).`,
  },
  {
    title: "25. Export Control, Sanctions & Prohibited Users",
    body: `You may not use SKINIC if you are located in, organised under, or ordinarily resident in a country subject to comprehensive US sanctions, or if you are on any US denied-party list. You represent you are not prohibited from receiving US-origin services.`,
  },
  {
    title: "26. Chargebacks & Payment Abuse",
    body: `Filing fraudulent chargebacks or payment disputes after receiving service may result in immediate account termination and collection action. We reserve the right to dispute illegitimate chargebacks with evidence of service delivery.`,
  },
  {
    title: "27. API Availability & Deprecation",
    body: `Unless covered by a separate Enterprise SLA, SKINIC is provided without guaranteed uptime. We aim for high availability but do not warrant uninterrupted access.

We may deprecate endpoints with reasonable notice (typically 90 days for material breaking changes). Continued use after deprecation notice constitutes acceptance of migration requirements.`,
  },
  {
    title: "28. Data Processing Agreement",
    body: `Where Thinking Studio LLC processes personal data on your behalf (Studio End Users or API end-user data you control), we act as Data Processor. Enterprise clients may request a Data Processing Agreement (DPA) by emailing skinic@thinkingstudio.ai with subject "DPA Request". Standard DPAs incorporate SCCs for international transfers where applicable.`,
  },
  {
    title: "29. Electronic Communications",
    body: `You consent to receive service-related communications electronically (email, in-dashboard notices). These satisfy any legal requirement for written communication where permitted.`,
  },
  {
    title: "30. Survival & Entire Agreement",
    body: `Sections that by nature should survive termination survive, including: Cosmetic Disclaimer, IP, Warranty Disclaimer, Limitation of Liability, Indemnification, Governing Law, AI Output Disclaimer, and Regulatory sections.

This Agreement (Terms + Privacy + Cookies) is the entire agreement and supersedes prior understandings. If any provision is unenforceable, the remainder stays in effect. Failure to enforce a right is not a waiver. You may not assign without our consent; we may assign to a successor. Notices to us: skinic@thinkingstudio.ai.`,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to skinic.app
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-white/40 text-sm">Last updated: July 2026 · Thinking Studio LLC · Covers SKINIC Studio &amp; SKINIC API</p>
        </div>

        <div className="card-glass rounded-2xl p-6 border border-amber-500/20 bg-amber-500/5 mb-6">
          <p className="text-amber-300 font-semibold text-sm mb-2">⚠ Cosmetic-Only — Please Read</p>
          <p className="text-white/50 text-sm leading-relaxed">
            SKINIC is an <strong className="text-white/70">AI cosmetic skin profiling tool, not a medical device</strong>.
            Outputs do not constitute medical advice, diagnosis, or treatment.
            Clients must display this to end users and must not represent results as clinical findings.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => {
            const anchor = s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            return (
              <div key={s.title} id={anchor} className="card-glass rounded-2xl p-6 scroll-mt-20">
                <p className="text-white font-semibold text-sm mb-3">{s.title}</p>
                <div className="text-white/45 text-sm leading-relaxed whitespace-pre-line">{s.body}</div>
              </div>
            );
          })}
        </div>

        <div className="card-glass rounded-2xl p-5 border border-white/5 text-center mt-6">
          <p className="text-white/30 text-xs">
            <Link href="/privacy" className="text-violet-400">Privacy Policy</Link>
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
