"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";

/* ═══════════════════════════════════════════
   Reveal — one-shot fade-in on scroll
   ═══════════════════════════════════════════ */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Divider — CRED-style gradient line
   ═══════════════════════════════════════════ */

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Feature data
   ═══════════════════════════════════════════ */

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" />
      </svg>
    ),
    title: "0% APR During Residency",
    desc: "Zero interest on essential purchases through your training years.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 7l-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
      </svg>
    ),
    title: "Income-Based Limits",
    desc: "Credit limits based on your projected physician income, not your resident salary.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="16" cy="16" r="2.5" />
        <path d="M18 6L6 18" />
      </svg>
    ),
    title: "1.9% Student Loan Refi",
    desc: "Refinance medical school debt at rates reflecting your career potential.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9" />
        <path d="M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
      </svg>
    ),
    title: "Physician Home Loans",
    desc: "Mortgage pre-approval that understands physician contracts and future income.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z" />
      </svg>
    ),
    title: "Disability & Life Insurance",
    desc: "Specialty-specific coverage designed for physicians at preferred rates.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Financial Planning",
    desc: "One-on-one planning with advisors who specialize in physician finances.",
  },
];

/* ═══════════════════════════════════════════
   Logo — shield + medical cross
   ═══════════════════════════════════════════ */

function Logo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3L5 8v7c0 7.18 4.98 13.89 11 15.5 6.02-1.61 11-8.32 11-15.5V8L16 3z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Page
   ═══════════════════════════════════════════ */

export default function Home() {
  const [email, setEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) alert(`Thanks! We'll reach out to ${email} soon.`);
  };

  return (
    <div className="min-h-screen">
      {/* ─── NAV ─── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0b]/80 backdrop-blur-2xl border-b border-white/[0.06]"
            : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <Logo className="w-7 h-7 text-teal-400" />
            <span className="text-[13px] font-medium tracking-[0.12em] text-white/70">
              WHITE COAT BANK
            </span>
          </a>
          <a
            href="#waitlist"
            className="text-[13px] font-medium px-5 py-2.5 rounded-full border border-white/[0.12] text-white/60 hover:text-white/90 hover:border-white/[0.2] transition-all duration-300"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 rounded-full border border-white/[0.08] text-[13px] text-white/30 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Now accepting early access
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.08] text-white/90">
              You didn&apos;t spend twelve years in training for a{" "}
              <span className="text-teal-400">generic bank.</span>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-8 text-lg md:text-xl text-white/35 leading-relaxed max-w-xl mx-auto">
              White Coat Bank underwrites your future — not just your credit
              score. Premium banking built exclusively for physicians.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <form
              onSubmit={handleSubmit}
              className="mt-12 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full sm:flex-1 h-12 px-5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/90 placeholder:text-white/20 focus:border-teal-400/30 focus:outline-none transition-colors text-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto h-12 px-7 rounded-full bg-teal-500 text-[#0a0a0b] font-semibold text-sm hover:bg-teal-400 transition-colors cursor-pointer"
              >
                Get $100 Free
              </button>
            </form>
          </Reveal>

          <Reveal delay={480}>
            <p className="mt-8 text-[13px] text-white/20 tracking-wide">
              237+ physicians on the waitlist&ensp;&middot;&ensp;First 500 get
              $100 at launch
            </p>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ─── CARD SHOWCASE ─── */}
      <section className="py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-20 md:mb-24">
              <span className="text-[11px] font-medium tracking-[0.25em] text-white/25 uppercase">
                The White Coat Card
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/90">
                A financial instrument
                <br className="hidden sm:block" /> for physicians.
              </h2>
            </div>
          </Reveal>

          {/* Credit card */}
          <Reveal delay={150}>
            <div className="relative max-w-[440px] mx-auto mb-20 md:mb-24">
              {/* Ambient glow */}
              <div className="absolute -inset-24 bg-teal-500/[0.03] blur-[80px] rounded-full pointer-events-none" />

              <div className="relative aspect-[1.586/1] rounded-2xl overflow-hidden border border-white/[0.08]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#0a0a0a]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent" />

                <div className="relative h-full p-7 sm:p-8 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-medium tracking-[0.2em] text-white/25 uppercase">
                      White Coat Bank
                    </span>
                    <svg className="w-6 h-6 text-white/10" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1" />
                      <rect x="14" y="9" width="4" height="14" rx="1" fill="currentColor" />
                      <rect x="9" y="14" width="14" height="4" rx="1" fill="currentColor" />
                    </svg>
                  </div>

                  <div>
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-teal-400/20 to-teal-600/10 border border-teal-400/10 mb-5" />
                    <div className="text-[13px] tracking-[0.3em] text-white/20 font-mono mb-3">
                      &bull;&bull;&bull;&bull;&ensp;&bull;&bull;&bull;&bull;&ensp;&bull;&bull;&bull;&bull;&ensp;4589
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] tracking-[0.15em] text-white/30 uppercase">
                        Dr. Jane Smith, M.D.
                      </span>
                      <span className="text-[11px] tracking-[0.15em] text-white/15 uppercase font-medium">
                        Visa
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: "0%", label: "Foreign transaction fees" },
              { value: "$0", label: "Annual fee, first year" },
              { value: "2%", label: "Cash back on all purchases" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="text-center py-8 md:py-10 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                  <div className="text-2xl md:text-3xl font-bold text-teal-400 mb-1.5">
                    {item.value}
                  </div>
                  <div className="text-[13px] text-white/30">{item.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── FEATURES ─── */}
      <section className="py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16 md:mb-20">
              <span className="text-[11px] font-medium tracking-[0.25em] text-white/25 uppercase">
                Built for Physicians
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/90">
                Every feature designed
                <br className="hidden sm:block" /> around your career.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="group p-7 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300 h-full">
                  <div className="text-teal-400/60 mb-5 group-hover:text-teal-400/80 transition-colors duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-[15px] font-semibold text-white/80 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-white/30 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── NUMBERS ─── */}
      <section className="py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 md:gap-20 text-center">
            {[
              { value: "237+", label: "Physicians on waitlist" },
              { value: "1.9%", label: "Student loan refi rate" },
              { value: "$0", label: "Hidden fees, ever" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-400 tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-3 text-[13px] text-white/30 tracking-wide">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── THESIS ─── */}
      <section className="py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="text-[11px] font-medium tracking-[0.25em] text-white/25 uppercase">
              Our Thesis
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="mt-8 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/90 leading-[1.15]">
              Traditional banks see a medical student and see $300K in debt.
            </h2>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-8 text-lg md:text-xl text-white/35 leading-relaxed">
              We see a future physician. That&apos;s why we built a bank that
              underwrites your future earning potential — not just your current
              balance.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <p className="mt-8 text-sm text-white/15">
              Founded by Stanford-trained physicians who understand your
              financial journey.
            </p>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ─── CTA ─── */}
      <section id="waitlist" className="py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/90">
              Ready to bank differently?
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 text-lg text-white/35">
              Join the waitlist for early access to banking built for
              physicians.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full sm:flex-1 h-12 px-5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/90 placeholder:text-white/20 focus:border-teal-400/30 focus:outline-none transition-colors text-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto h-12 px-7 rounded-full bg-teal-500 text-[#0a0a0b] font-semibold text-sm hover:bg-teal-400 transition-colors cursor-pointer"
              >
                Get $100 Free
              </button>
            </form>
          </Reveal>

          <Reveal delay={360}>
            <p className="mt-8 text-[13px] text-white/15 tracking-wide">
              First 500 members get $100 deposited at launch
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.04] px-6 md:px-12">
        <div className="max-w-6xl mx-auto py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo className="w-4 h-4 text-teal-400/40" />
            <span className="text-[12px] text-white/20">
              White Coat Bank &middot; Exclusively for physicians
            </span>
          </div>
          <span className="text-[12px] text-white/15">
            &copy; 2025 White Coat Bank
          </span>
        </div>
      </footer>
    </div>
  );
}
