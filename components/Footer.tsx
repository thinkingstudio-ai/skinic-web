export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/25">
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
          <a href="https://api.skinic.app/terms" target="_blank" rel="noreferrer" className="hover:text-white/60 transition-colors">
            Terms
          </a>
          <a href="mailto:skinic@thinkingstudio.ai?subject=SKINIC%20API%20Inquiry" className="hover:text-white/60 transition-colors">
            Contact
          </a>
        </div>

        <p>© {new Date().getFullYear()} Thinking Studio LLC. All rights reserved.</p>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/5">
        <p className="text-xs text-white/20 text-center leading-relaxed">
          SKINIC is not a medical device. Results are AI-generated screenings for informational purposes only and do not constitute medical diagnosis.
          Always consult a qualified dermatologist for medical concerns.
        </p>
      </div>
    </footer>
  );
}
