import Link from "next/link";

export const metadata = {
  title: "Cookie Policy — SKINIC",
  description: "Cookie and similar technologies policy for SKINIC — skinic.app dashboard and Studio.",
};

const sections = [
  {
    title: "1. Introduction",
    body: `This Cookie Policy explains how Thinking Studio LLC ("Company", "we", "us", "our") uses cookies and similar technologies when you visit skinic.app, use the SKINIC dashboard or Studio, or interact with our web properties.

This policy should be read together with our Privacy Policy and Terms of Service.`,
  },
  {
    title: "2. What Are Cookies and Similar Technologies?",
    body: `Cookies are small text files stored on your device by your browser. We also use similar technologies such as:

• Local storage and session storage — used by our authentication provider to maintain your login session
• Server-side session tokens — issued when you sign in to the dashboard

These technologies help the site function, keep you signed in, and protect against abuse.`,
  },
  {
    title: "3. How We Use Cookies",
    body: `We classify cookies and storage used on SKINIC web properties as follows:

3.1 Strictly necessary (essential)
Required for the service to work. Without these, you cannot sign in or use the dashboard.

• Supabase Auth session — maintains your authenticated dashboard session after login
• CSRF / security tokens — protect authenticated requests

3.2 Functional
Support core product features but are not strictly required for every page load.

• Session preferences — e.g. dashboard navigation state within a session

3.3 Payment (third-party, when you subscribe)
When you complete checkout, Paddle (our Merchant of Record) may set cookies or similar identifiers to process payment and prevent fraud. See Paddle's cookie policy at paddle.com/legal/cookies.

We do NOT use:
• Advertising or retargeting cookies
• Social media tracking pixels
• Cross-site profiling cookies
• Third-party analytics cookies that identify individual users on the public landing page`,
  },
  {
    title: "4. Cookies & Storage by Property",
    body: `4.1 skinic.app (landing page)
The marketing landing page does not set SKINIC authentication cookies. Vercel (our hosting provider) may process technical logs and essential infrastructure cookies required for delivery and security.

4.2 skinic.app/dashboard and skinic.app/studio
After you sign in, Supabase Auth stores session tokens in browser storage to keep you logged in. These are essential for the product.

4.3 Branded Studio scan pages (/b/{slug})
Studio scan pages do not require end users to create a SKINIC account. If lead capture is enabled, form data is submitted directly to our backend — not via advertising cookies.

4.4 api.skinic.app
The API domain does not use browser cookies for API clients. Authentication uses the X-API-Key header.`,
  },
  {
    title: "5. Third-Party Processors",
    body: `The following third parties may set or process cookies or similar identifiers when you use SKINIC:

| Provider | Purpose | More information |
|---|---|---|
| Supabase Inc. | Authentication session | supabase.com/privacy |
| Vercel Inc. | Frontend hosting | vercel.com/legal/privacy-policy |
| Paddle.com | Checkout & billing (when subscribing) | paddle.com/legal/cookies |
| Cloudflare Inc. | DNS, CDN, security | cloudflare.com/privacypolicy |

We do not control third-party cookies set during Paddle checkout. Review Paddle's policies when subscribing.`,
  },
  {
    title: "6. How Long Cookies Are Stored",
    body: `• Authentication session tokens — typically until you sign out, close the browser (session), or until the token expires (usually up to 7 days for refresh tokens, configurable by Supabase)
• Essential security cookies — session duration or up to 12 months where persistent storage is required for fraud prevention by our processors

We do not retain marketing or advertising cookies on SKINIC properties.`,
  },
  {
    title: "7. Your Choices",
    body: `You can control cookies through your browser settings:

• Block all cookies — note: the SKINIC dashboard will not function because sign-in requires session storage
• Delete existing cookies — you will be signed out of the dashboard
• Use private/incognito mode — sessions end when you close the window

Because essential cookies are required for authentication, there is no separate on-site cookie consent banner for strictly necessary storage — use of the dashboard after login constitutes acceptance of essential cookies for that purpose.

If we introduce non-essential cookies in the future (e.g. optional analytics), we will update this policy and request consent where required by law.`,
  },
  {
    title: "8. Legal Basis (EEA / UK)",
    body: `For visitors in the European Economic Area and United Kingdom:

• Strictly necessary cookies — legitimate interest and/or contractual necessity (GDPR ePrivacy exemption for cookies strictly required to provide a service you request)
• Any future non-essential cookies — consent, obtained via a consent mechanism before placement`,
  },
  {
    title: "9. Changes to This Policy",
    body: `We may update this Cookie Policy to reflect changes in technology, law, or our services. Material changes will be posted on this page with an updated "Last updated" date. Continued use of the dashboard after changes constitutes acceptance where permitted by law.`,
  },
  {
    title: "10. Contact",
    body: `Questions about this Cookie Policy:

Thinking Studio LLC
Email: skinic@thinkingstudio.ai
Website: https://skinic.app`,
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Back to skinic.app
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Cookie Policy</h1>
          <p className="text-white/40 text-sm">Last updated: July 2026 · Thinking Studio LLC · skinic.app</p>
        </div>

        <div className="card-glass rounded-2xl p-6 border border-violet-500/20 bg-violet-500/5 mb-6">
          <p className="text-violet-300 font-semibold text-sm mb-3">Summary</p>
          <ul className="space-y-1.5 text-white/50 text-sm">
            <li>✓ Essential cookies only for dashboard sign-in — no ad tracking</li>
            <li>✓ Paddle may set cookies during checkout only</li>
            <li>✓ Landing page does not profile individual visitors</li>
            <li>✓ API authentication uses API keys, not browser cookies</li>
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
            <Link href="/privacy" className="text-violet-400">Privacy Policy</Link>
            {" · "}
            <a href="mailto:skinic@thinkingstudio.ai" className="text-violet-400">skinic@thinkingstudio.ai</a>
          </p>
        </div>
      </div>
    </main>
  );
}
