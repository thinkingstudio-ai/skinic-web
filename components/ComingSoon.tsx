export default function ComingSoon() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg mx-auto text-center">
        <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-6">
          Thinking Studio LLC
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          <span className="gradient-text">SKINIC</span>
        </h1>

        <p className="text-xl md:text-2xl font-semibold text-white/80 mb-4">
          Coming Soon
        </p>

        <p className="text-white/50 text-base leading-relaxed mb-10">
          We&apos;re preparing for launch. Our platform is undergoing legal review
          before public release. Thank you for your patience.
        </p>

        <a
          href="mailto:skinic@thinkingstudio.ai?subject=SKINIC%20Launch%20Interest"
          className="inline-flex px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-500/25"
        >
          Get in touch
        </a>

        <p className="mt-12 text-xs text-white/25 leading-relaxed max-w-sm mx-auto">
          SKINIC is a cosmetic beauty AI tool for skin profiling and product matching —
          not a medical device. All outputs are for informational and beauty purposes only.
        </p>
      </div>
    </main>
  );
}
