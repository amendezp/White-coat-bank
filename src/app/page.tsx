"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";

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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
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
   Divider
   ═══════════════════════════════════════════ */

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

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
   Check icon for hero benefits
   ═══════════════════════════════════════════ */

function Check() {
  return (
    <svg
      className="w-4 h-4 text-teal-400 flex-shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5L13 5" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Parallax Background Orbs
   ═══════════════════════════════════════════ */

function BackgroundOrbs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Orb 1 — top left, slow drift */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.035) 0%, transparent 70%)",
          top: "5%",
          left: "-8%",
          transform: `translateY(${scrollY * -0.08}px)`,
          animation: "orb-drift-1 20s ease-in-out infinite",
        }}
      />

      {/* Orb 2 — mid right, medium drift */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.025) 0%, transparent 70%)",
          top: "35%",
          right: "-12%",
          transform: `translateY(${scrollY * -0.05}px)`,
          animation: "orb-drift-2 25s ease-in-out infinite",
        }}
      />

      {/* Orb 3 — lower center-left, fast drift */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.03) 0%, transparent 70%)",
          top: "65%",
          left: "15%",
          transform: `translateY(${scrollY * -0.06}px)`,
          animation: "orb-drift-3 18s ease-in-out infinite",
        }}
      />

      {/* Orb 4 — bottom right, subtle */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.02) 0%, transparent 70%)",
          top: "85%",
          right: "5%",
          transform: `translateY(${scrollY * -0.04}px)`,
          animation: "orb-drift-1 30s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Metallic Credit Card — interactive 3D tilt
   ═══════════════════════════════════════════ */

function MetallicCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 5, y: -8 });
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: -ny * 18, y: nx * 18 });
    });
  }, []);

  const handleMouseEnter = useCallback(() => setHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    setTilt({ x: 5, y: -8 });
  }, []);

  return (
    <div
      style={{ animation: "card-float 6s ease-in-out infinite" }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative w-[340px] sm:w-[400px] lg:w-[420px]"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: hovering
              ? "transform 0.1s ease-out"
              : "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Ambient glow — pulsing */}
          <div
            className="absolute -inset-20 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)",
              animation: "glow-pulse 4s ease-in-out infinite",
            }}
          />

          {/* Card body */}
          <div
            className="relative aspect-[1.586/1] rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: [
                "0 50px 100px -20px rgba(0,0,0,0.6)",
                "0 25px 50px -10px rgba(0,0,0,0.4)",
                "inset 0 1px 0 rgba(255,255,255,0.08)",
                "inset 0 -1px 0 rgba(0,0,0,0.3)",
              ].join(", "),
            }}
          >
            {/* Layer 1: Base metal gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(145deg, #2d2d33 0%, #393940 18%, #27272e 36%, #35353c 54%, #2a2a31 72%, #3a3a42 90%, #2d2d33 100%)",
              }}
            />

            {/* Layer 2: Brushed metal texture */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.018) 1px, transparent 2px, rgba(255,255,255,0.012) 3px, transparent 4px)",
              }}
            />

            {/* Layer 3: Static diagonal light (base reflection) */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.02) 65%, transparent 80%)",
              }}
            />

            {/* Layer 4: Animated shimmer sweep */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-y-0 w-[60%]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)",
                  animation: "card-shimmer 7s ease-in-out infinite",
                  animationDelay: "2s",
                }}
              />
            </div>

            {/* Layer 5: Top edge catch-light */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 12%)",
              }}
            />

            {/* Layer 6: Subtle teal accent along bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />

            {/* Card content */}
            <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between">
              {/* Top row */}
              <div className="flex items-start justify-between">
                <span
                  className="text-[10px] font-medium tracking-[0.2em] text-white/30 uppercase"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                  }}
                >
                  White Coat Bank
                </span>
                <svg
                  className="w-6 h-6 text-white/15"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="11"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <rect
                    x="14"
                    y="9"
                    width="4"
                    height="14"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="9"
                    y="14"
                    width="14"
                    height="4"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Bottom content */}
              <div>
                {/* EMV chip */}
                <div
                  className="relative w-11 h-8 rounded-md overflow-hidden mb-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #8a8a7e 0%, #b5b5a8 20%, #8a8a7e 40%, #a5a598 60%, #8a8a7e 80%, #9a9a8e 100%)",
                  }}
                >
                  <div className="absolute inset-[3px] rounded-sm border border-black/15" />
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-black/10" />
                  <div className="absolute top-0 bottom-0 left-[38%] w-px bg-black/10" />
                  <div className="absolute top-0 bottom-0 left-[62%] w-px bg-black/10" />
                </div>

                {/* Card number */}
                <div
                  className="text-[13px] tracking-[0.35em] text-white/25 font-mono mb-3"
                  style={{
                    textShadow:
                      "0 1px 2px rgba(0,0,0,0.3), 0 -1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  &bull;&bull;&bull;&bull;&ensp;&bull;&bull;&bull;&bull;&ensp;&bull;&bull;&bull;&bull;&ensp;4589
                </div>

                {/* Name + network */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] tracking-[0.15em] text-white/35 uppercase"
                    style={{
                      textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                    }}
                  >
                    Dr. Jane Smith, M.D.
                  </span>
                  <span
                    className="text-[10px] tracking-[0.12em] text-white/20 uppercase font-semibold"
                    style={{
                      textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                    }}
                  >
                    Visa Infinite
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Benefits — real physician financial products
   ═══════════════════════════════════════════ */

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Free Malpractice Insurance",
    value: "Save $12K–$200K/yr",
    desc: "Tail coverage and prior acts included. No separate policy. No extra cost. Scales to your specialty.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "0% APR Through Training",
    value: "PGY-1 through fellowship",
    desc: "Zero interest during residency and fellowship. You start paying when your real salary starts.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 7l-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
      </svg>
    ),
    title: "Income-Based Credit",
    value: "Up to 5x higher limits",
    desc: "An ortho resident earning $68K gets the limit of someone earning $600K. Because soon, they will be.",
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
    value: "Avg. $43K saved",
    desc: "Refinance $300K in med school debt at 1.9%. You won't find that rate anywhere else.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12l9-9 9 9" />
        <path d="M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
      </svg>
    ),
    title: "Physician Mortgage",
    value: "0% down, no PMI",
    desc: "Buy a home with your signed offer letter. Zero down. No PMI. Ever.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z" />
      </svg>
    ),
    title: "Own-Occupation Disability",
    value: "Tax-free benefit",
    desc: "Can't practice your specialty? You're covered. The insurance most physicians need — and most don't have.",
  },
];

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
    if (email) alert(`Thanks! We'll be in touch at ${email}.`);
  };

  return (
    <div className="min-h-screen relative">
      {/* ─── PARALLAX BACKGROUND ORBS ─── */}
      <BackgroundOrbs />

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

      {/* ─── HERO — split layout ─── */}
      <section className="relative z-10 pt-32 pb-20 lg:min-h-screen lg:flex lg:items-center px-6 md:px-12">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: text content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-white/[0.08] text-[13px] text-white/30 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Exclusively for physicians
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold tracking-tight leading-[1.1] text-white/90">
                You didn&apos;t spend twelve years in training for a{" "}
                <span className="text-teal-400">generic bank.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 text-lg text-white/35 leading-relaxed max-w-lg mx-auto lg:mx-0">
                We underwrite your future earning power — not your
                resident salary.
              </p>
            </Reveal>

            {/* Key benefit highlights */}
            <Reveal delay={300}>
              <div className="flex flex-col gap-4 mt-10 items-center lg:items-start">
                {[
                  { text: "Free malpractice insurance", highlight: "Save up to $200K/yr" },
                  { text: "Zero interest through training", highlight: "PGY-1 to fellowship" },
                  { text: "Credit limits based on your future income", highlight: "Up to 5x higher" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[14px]"
                  >
                    <Check />
                    <span className="text-white/55">{b.text}</span>
                    <span className="text-[11px] font-medium text-teal-400/70 bg-teal-400/[0.06] px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                      {b.highlight}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={400}>
              <form
                onSubmit={handleSubmit}
                className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0"
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

            <Reveal delay={500}>
              <p className="mt-6 text-[13px] text-white/20 tracking-wide">
                237 physicians ahead of you
              </p>
            </Reveal>
          </div>

          {/* Right: metallic credit card */}
          <Reveal
            delay={200}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <MetallicCard />
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ─── BENEFITS ─── */}
      <section className="relative z-10 py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16 md:mb-20">
              <span className="text-[11px] font-medium tracking-[0.25em] text-white/25 uppercase">
                What you get
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/90">
                Six products. Zero designed
                <br className="hidden sm:block" /> for anyone else.
              </h2>
              <p className="mt-5 text-white/30 text-lg max-w-2xl mx-auto">
                From match day to retirement. Nothing generic in the
                mix.
              </p>
            </div>
          </Reveal>

          {/* Hero benefit — malpractice (full-width spotlight) */}
          <Reveal>
            <div className="group relative p-10 md:p-14 rounded-2xl border border-teal-400/[0.12] bg-gradient-to-br from-teal-400/[0.04] to-transparent hover:border-teal-400/[0.2] transition-all duration-500 mb-5 overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal-400/[0.03] blur-[80px] rounded-full pointer-events-none" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-teal-400">
                      {benefits[0].icon}
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-teal-400 bg-teal-400/[0.08] px-3 py-1 rounded-full uppercase">
                      Included free
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white/90 mb-3">
                    {benefits[0].title}
                  </h3>
                  <p className="text-[15px] text-white/40 leading-relaxed max-w-xl">
                    {benefits[0].desc}
                  </p>
                </div>
                <div className="text-right md:text-center flex-shrink-0">
                  <div className="text-4xl md:text-5xl font-bold text-teal-400 tracking-tight">
                    $200K
                  </div>
                  <div className="text-[13px] text-white/30 mt-1">
                    /yr coverage value
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Remaining benefits — 2-column grid with value callouts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {benefits.slice(1).map((b, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="group p-8 md:p-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="text-teal-400/60 group-hover:text-teal-400/80 transition-colors duration-300">
                      {b.icon}
                    </div>
                    <span className="text-[11px] font-medium tracking-wider text-teal-400/70 bg-teal-400/[0.06] px-3 py-1 rounded-full">
                      {b.value}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white/85 mb-2.5">
                    {b.title}
                  </h3>
                  <p className="text-[13.5px] text-white/30 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── NUMBERS ─── */}
      <section className="relative z-10 py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 md:gap-20 text-center">
            {[
              { value: "$43K", label: "Average savings on student loans" },
              { value: "$200K", label: "Malpractice coverage, included free" },
              { value: "5x", label: "Higher credit limits than traditional banks" },
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
      <section className="relative z-10 py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="text-[11px] font-medium tracking-[0.25em] text-white/25 uppercase">
              Our Thesis
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="mt-8 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/90 leading-[1.15]">
              Traditional banks look at a medical student and see $300K in debt.
            </h2>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-8 text-lg md:text-xl text-white/35 leading-relaxed">
              We see someone who&apos;ll earn $10M+ over their career.
              So we built a bank around that.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <p className="mt-8 text-sm text-white/15">
              Founded by physicians. Stanford-trained. We&apos;ve been
              where you are — and we built what we wished existed.
            </p>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ─── CTA ─── */}
      <section id="waitlist" className="relative z-10 py-28 md:py-36 lg:py-44 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/90">
              You matched into medicine.
                <br className="hidden sm:block" /> Now match into the right bank.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 text-lg text-white/35">
              First 500 physicians get $100 deposited at launch.
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
              237 physicians ahead of you
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-white/[0.04] px-6 md:px-12">
        <div className="max-w-6xl mx-auto py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo className="w-4 h-4 text-teal-400/40" />
            <span className="text-[12px] text-white/20">
              White Coat Bank &middot; Exclusively for physicians
            </span>
          </div>
          <span className="text-[12px] text-white/15">
            &copy; 2026 White Coat Bank
          </span>
        </div>
      </footer>
    </div>
  );
}
