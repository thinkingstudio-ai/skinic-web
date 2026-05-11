export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-3">Get Access</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-5">
          Ready to integrate?
        </h2>
        <p className="text-white/40 text-lg mb-10">
          Tell us about your use case and we&apos;ll set you up with an API key and onboarding call.
        </p>

        <div className="card-glass rounded-2xl p-8">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <input
                type="text"
                placeholder="Company"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
            <input
              type="email"
              placeholder="Work email"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm focus:outline-none focus:border-violet-500/50 transition-colors appearance-none">
              <option value="" className="bg-[#0a0a0f]">Interested tier</option>
              <option value="free" className="bg-[#0a0a0f]">Free</option>
              <option value="starter" className="bg-[#0a0a0f]">Starter — $29/mo</option>
              <option value="pro" className="bg-[#0a0a0f]">Pro — $99/mo</option>
              <option value="enterprise" className="bg-[#0a0a0f]">Enterprise — $499/mo</option>
            </select>
            <textarea
              rows={3}
              placeholder="Briefly describe your use case (e.g. clinic app, beauty e-commerce, health platform)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
            <a
              href="mailto:hello@skinic.app?subject=API Access Request"
              className="block w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base text-center transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Send Request
            </a>
            <p className="text-white/25 text-xs text-center">
              Or email us directly at{" "}
              <a href="mailto:hello@skinic.app" className="text-violet-400 hover:text-violet-300">
                hello@skinic.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
