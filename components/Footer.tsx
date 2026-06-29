export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <span className="font-bold gradient-text">SKINIC</span>
          <span className="text-white/15">·</span>
          <span>AI Skin Intelligence Platform</span>
          <span className="text-white/15">·</span>
          <span>by Thinking Studio LLC</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://api.skinic.app/docs" target="_blank" rel="noreferrer" className="hover:text-white/60 transition-colors">
            API Docs
          </a>
          <a href="/terms" className="hover:text-white/60 transition-colors">
            Terms
          </a>
          <a href="/privacy" className="hover:text-white/60 transition-colors">
            Privacy
          </a>
          <a href="mailto:admin.thinkingstudio@gmail.com?subject=SKINIC%20API%20Inquiry" className="hover:text-white/60 transition-colors">
            Contact
          </a>
        </div>

        <p>© {new Date().getFullYear()} Thinking Studio LLC. All rights reserved.</p>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/5">
        <p className="text-xs text-white/55 text-center leading-relaxed">
          SKINIC is a cosmetic beauty AI tool for skin profiling and product matching — it is not a medical device, does not provide medical advice, and is not a substitute for professional skincare or dermatological consultation. All outputs are for informational and beauty purposes only.
        </p>
      </div>
    </footer>
  );
}
