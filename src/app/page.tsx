"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ============================================
   TYPES
   ============================================ */

interface SurveyData {
  careerStage: string;
  biggestChallenge: string;
  mostExcitingFeature: string;
}

/* ============================================
   PERK DATA
   ============================================ */

const PERKS = [
  {
    title: "0% APR During Residency",
    description:
      "We know your earning trajectory. Build wealth during training, not after. Zero interest until you're an attending.",
    icon: "shield",
  },
  {
    title: "Built-In Malpractice Shield",
    description:
      "Every dollar you spend strengthens your coverage. Malpractice protection that scales with your career stage.",
    icon: "lock",
  },
  {
    title: "$2,500 Annual CME Fund",
    description:
      "Conferences, boards, certifications — covered. Your brain is your greatest asset. We invest in it.",
    icon: "book",
  },
  {
    title: "Practice Acquisition Loans",
    description:
      "Going independent? Priority capital at physician-grade terms. We underwrite your license, not just your FICO.",
    icon: "building",
  },
  {
    title: "Physician Wellness Retreats",
    description:
      "Burnout is an epidemic. Exclusive access to curated wellness retreats designed for medical professionals.",
    icon: "heart",
  },
  {
    title: "Income Protection",
    description:
      "Disability coverage built for physician-level income. If you can't practice, we've got you. No exceptions.",
    icon: "umbrella",
  },
];

const SURVEY_STAGES = [
  "Medical Student",
  "Resident",
  "Fellow",
  "Attending Physician",
  "Other Healthcare Professional",
];

const SURVEY_CHALLENGES = [
  "Student loan burden",
  "Building credit during training",
  "Malpractice insurance costs",
  "Financing a practice",
  "No financial products designed for my career",
];

const SURVEY_FEATURES = [
  "0% APR during residency",
  "Built-in malpractice coverage",
  "$2,500 CME & conference fund",
  "Practice acquisition loans",
  "High-yield physician savings",
  "Income protection insurance",
];

/* ============================================
   ICON COMPONENTS
   ============================================ */

function PerkIcon({ type }: { type: string }) {
  const iconClass = "w-6 h-6 text-[#14B8A6]";

  switch (type) {
    case "shield":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      );
    case "lock":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      );
    case "book":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
        </svg>
      );
    case "building":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
        </svg>
      );
    case "heart":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    case "umbrella":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-9-9H2m3.343-5.657L4.929 4.93m12.728 0l-.414.414M21 12h-1M12 7a5 5 0 00-5 5h10a5 5 0 00-5-5zm0 5v5a2 2 0 004 0" />
        </svg>
      );
    default:
      return null;
  }
}

/* ============================================
   THEME TOGGLE ICONS
   ============================================ */

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}

/* ============================================
   CREDIT CARD COMPONENT
   ============================================ */

function CreditCardVisual() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  }, []);

  return (
    <div className="card-container">
      <div
        ref={cardRef}
        className="credit-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Top Row */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="text-[10px] sm:text-[10px] font-light tracking-[0.3em] uppercase text-[#14B8A6]/70">
              White Coat Bank
            </div>
            <div className="mt-0.5 text-[7px] sm:text-[8px] font-light tracking-[0.2em] uppercase" style={{ color: "var(--text-card-edition)" }}>
              Physician Edition
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] text-[#14B8A6]">
              M.D.
            </div>
          </div>
        </div>

        {/* Chip + Contactless */}
        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <div className="card-chip" />
          <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "var(--icon-contactless)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M8.5 16.5a7.5 7.5 0 010-9" strokeLinecap="round" />
            <path d="M5 19a11.5 11.5 0 010-14" strokeLinecap="round" />
            <path d="M12 13.5a3.5 3.5 0 010-3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card Bottom */}
        <div className="relative z-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[8px] sm:text-[10px] tracking-widest mb-1" style={{ color: "var(--text-card-num)" }}>
                ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;7890
              </div>
              <div className="text-[9px] sm:text-[11px] font-medium tracking-[0.15em] uppercase" style={{ color: "var(--text-card-name)" }}>
                Dr. Jane Stanford
              </div>
            </div>
            {/* Medical Cross Logo */}
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#14B8A6]/40" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.05"/>
                <rect x="14" y="8" width="4" height="16" rx="1" fill="currentColor"/>
                <rect x="8" y="14" width="16" height="4" rx="1" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   SURVEY MODAL COMPONENT
   ============================================ */

function SurveyModal({
  isOpen,
  onClose,
  onComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: SurveyData) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyData>({
    careerStage: "",
    biggestChallenge: "",
    mostExcitingFeature: "",
  });

  if (!isOpen) return null;

  const handleSelect = (field: keyof SurveyData, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const currentAnswer =
    step === 0
      ? answers.careerStage
      : step === 1
      ? answers.biggestChallenge
      : answers.mostExcitingFeature;

  const questions = [
    {
      title: "Where are you in your medical journey?",
      subtitle: "This helps us tailor your experience.",
      field: "careerStage" as const,
      options: SURVEY_STAGES,
    },
    {
      title: "What's your biggest financial challenge?",
      subtitle: "Be honest — that's why we're here.",
      field: "biggestChallenge" as const,
      options: SURVEY_CHALLENGES,
    },
    {
      title: "Which feature excites you the most?",
      subtitle: "We'll build what you actually want.",
      field: "mostExcitingFeature" as const,
      options: SURVEY_FEATURES,
    },
  ];

  const q = questions[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-black/80">
      <div
        className="relative w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl animate-fade-in-up"
        style={{ backgroundColor: "var(--bg-modal)", borderColor: "var(--border-input)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-colors rounded-full"
          style={{ color: "var(--text-muted)" }}
          aria-label="Close survey"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-0.5 flex-1 rounded-full transition-colors"
              style={{ backgroundColor: i <= step ? "#14B8A6" : "var(--border-input)" }}
            />
          ))}
        </div>

        {/* Question */}
        <div className="mb-2 text-[11px] font-medium tracking-[0.2em] uppercase text-[#14B8A6]/80">
          Question {step + 1} of 3
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-1" style={{ color: "var(--text-heading)" }}>{q.title}</h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-body)" }}>{q.subtitle}</p>

        {/* Options */}
        <div className="space-y-2.5 mb-8">
          {q.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(q.field, option)}
              className={`survey-option w-full text-left px-5 py-3.5 rounded-xl text-sm transition-all ${
                currentAnswer === option ? "selected" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    borderColor: currentAnswer === option ? "#14B8A6" : "var(--survey-radio-border)",
                  }}
                >
                  {currentAnswer === option && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
                  )}
                </span>
                <span style={{ color: currentAnswer === option ? "var(--text-heading)" : "var(--survey-unselected-text)" }}>
                  {option}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Action */}
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all"
          style={{
            backgroundColor: currentAnswer ? "#14B8A6" : "var(--survey-disabled-bg)",
            color: currentAnswer ? "#000000" : "var(--survey-disabled-text)",
            cursor: currentAnswer ? "pointer" : "not-allowed",
          }}
        >
          {step < 2 ? "Continue" : "Submit & Claim Your $100"}
        </button>

        {/* Skip */}
        {step < 2 && (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full mt-3 text-xs transition-colors"
            style={{ color: "var(--text-dim)" }}
          >
            Skip this question
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("wcb-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("wcb-theme", next);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
  }, [mobileMenuOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setShowSurvey(true);
    setWaitlistPosition(Math.floor(Math.random() * 200) + 47);
  };

  const handleSurveyComplete = (_data: SurveyData) => {
    setSurveyComplete(true);
    setShowSurvey(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-heading)" }}>
      {/* ============================================
          NAVBAR
          ============================================ */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--bg-nav)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-nav)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#14B8A6] transition-transform group-hover:scale-105" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L5 8v7c0 7.18 4.98 13.89 11 15.5 6.02-1.61 11-8.32 11-15.5V8L16 3z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
              <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor"/>
              <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor"/>
            </svg>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.1em]" style={{ color: "var(--text-logo)" }}>
              WHITE COAT BANK
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <span className="text-[11px] tracking-[0.15em] uppercase font-medium" style={{ color: "var(--text-nav-tag)" }}>
              Exclusively for Physicians
            </span>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <a
              href="#waitlist"
              className="btn-primary text-xs font-semibold tracking-wide px-6 py-2.5 rounded-full bg-[#14B8A6] text-black hover:bg-[#5EEAD4] transition-colors"
            >
              Join Waitlist
            </a>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--icon-menu)" }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className="md:hidden backdrop-blur-xl animate-fade-in"
            style={{
              backgroundColor: "var(--bg-nav)",
              borderTop: "1px solid var(--border-nav)",
            }}
          >
            <div className="px-5 py-6 space-y-4">
              <p className="text-[11px] tracking-[0.15em] uppercase font-medium" style={{ color: "var(--text-nav-tag)" }}>
                Exclusively for Physicians
              </p>
              <a
                href="#waitlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center text-sm font-semibold tracking-wide px-6 py-3 rounded-xl bg-[#14B8A6] text-black hover:bg-[#5EEAD4] transition-colors"
              >
                Join Waitlist
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-radial-top" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: "var(--glow-ambient)" }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 sm:mb-10 animate-fade-in"
            style={{ backgroundColor: "var(--bg-badge)", border: "1px solid var(--border-input)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium" style={{ color: "var(--text-subtle)" }}>
              Now accepting early access signups
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[2rem] leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 animate-fade-in-up">
            You Didn&apos;t Spend 12 Years
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            in Training for a{" "}
            <span className="text-gradient-gold">Generic&nbsp;Bank.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed animate-fade-in-up delay-200" style={{ color: "var(--text-body)" }}>
            White Coat Bank underwrites your future — not just your credit score.
            Premium banking built exclusively for physicians.
          </p>

          {/* Email Form */}
          <div id="waitlist">
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto animate-fade-in-up delay-300"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full sm:flex-1 px-5 py-3.5 rounded-xl text-sm focus:border-[#14B8A6] focus:ring-0 transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    border: "1px solid var(--border-input)",
                    color: "var(--text-heading)",
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#14B8A6] text-black text-sm font-bold tracking-wide hover:bg-[#5EEAD4] transition-all"
                >
                  Get $100 Free
                </button>
              </form>
            ) : (
              <div className="animate-fade-in-up max-w-md mx-auto">
                <div className="px-6 py-5 rounded-2xl bg-[#14B8A6]/[0.06] border border-[#14B8A6]/20 text-center">
                  <p className="text-[#14B8A6] font-semibold">
                    You&apos;re on the list.{" "}
                    {waitlistPosition && (
                      <span style={{ color: "var(--text-subtle)" }}>#{waitlistPosition}</span>
                    )}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-body)" }}>
                    $100 is reserved for you when we launch.
                  </p>
                  {!surveyComplete && (
                    <button
                      onClick={() => setShowSurvey(true)}
                      className="mt-3 text-xs text-[#14B8A6] hover:text-[#5EEAD4] underline underline-offset-4 transition-colors"
                    >
                      Complete our 30-second survey to help shape your bank
                    </button>
                  )}
                  {surveyComplete && (
                    <p className="mt-3 text-xs text-[#14B8A6]">
                      Survey complete — thank you, Doctor.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social proof */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in delay-500">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14B8A6]/30 to-[#14B8A6]/5 flex items-center justify-center"
                  style={{ border: "2px solid var(--social-proof-border)" }}
                >
                  <span className="text-[8px] font-medium text-[#14B8A6]/80">
                    {["MD", "DO", "MD", "MD"][i]}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              237+ physicians already on the waitlist
            </span>
          </div>

          {/* Bonus tag */}
          <div className="mt-6 animate-fade-in delay-600">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs" style={{ color: "var(--text-dim)" }}>
              <svg className="w-4 h-4 text-[#14B8A6]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              First 500 members get $100 deposited at launch
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <svg className="w-5 h-5" style={{ color: "var(--text-heading)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ============================================
          THE CARD SECTION
          ============================================ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="section-divider max-w-xs mx-auto mb-24 sm:mb-32" />

        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 sm:gap-16 lg:gap-20">
            {/* Card visual */}
            <div className="w-full max-w-[420px] flex-shrink-0 animate-float px-4 sm:px-0">
              <CreditCardVisual />
            </div>

            {/* Card info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#14B8A6]/50 mb-4">
                The White Coat Card
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-5 sm:mb-6">
                Not Another{" "}
                <span className="text-gradient-gold">Points Card.</span>
                <br />A Financial Weapon.
              </h2>
              <p className="leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 text-sm sm:text-base" style={{ color: "var(--text-body)" }}>
                No airport lounges. No cashback on office supplies. The White Coat
                Card is built for what actually matters — malpractice protection,
                CME funding, practice building, and a bank that knows your MD means
                you&apos;re good for it.
              </p>

              {/* Card features */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0">
                {[
                  { label: "APR During Residency", value: "0%" },
                  { label: "Annual CME Fund", value: "$2,500" },
                  { label: "Practice Loan Priority", value: "24hr" },
                  { label: "Income Protection", value: "Built-in" },
                ].map((feat) => (
                  <div
                    key={feat.label}
                    className="glass-card flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 px-4 py-3 rounded-xl"
                  >
                    <span className="text-lg sm:text-xl font-bold text-[#14B8A6]">
                      {feat.value}
                    </span>
                    <span className="text-[11px] sm:text-xs leading-tight" style={{ color: "var(--text-muted)" }}>{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PERKS SECTION
          ============================================ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider max-w-xs mx-auto mb-24 sm:mb-32" />

        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-12 sm:mb-16">
            <div className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#14B8A6]/50 mb-4">
              Physician Perks
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4">
              Built for Your Life.{" "}
              <span className="text-gradient-gold">Not Theirs.</span>
            </h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
              Every feature exists because a physician asked for it.
              No corporate retreat packages. No business class upgrades.
              Just what doctors actually need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PERKS.map((perk, i) => (
              <div
                key={perk.title}
                className="perk-card group p-5 sm:p-6 rounded-2xl transition-all duration-300"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-card)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(201, 169, 110, 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-card)";
                }}
              >
                <div className="relative z-10" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#14B8A6]/[0.08] flex items-center justify-center mb-4 group-hover:bg-[#14B8A6]/[0.12] transition-colors">
                    <PerkIcon type={perk.icon} />
                  </div>
                  <h3 className="text-sm sm:text-[15px] font-semibold mb-2 transition-colors" style={{ color: "var(--text-highlight)" }}>
                    {perk.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed transition-colors" style={{ color: "var(--text-muted)" }}>
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          THE PROMISE / THESIS SECTION
          ============================================ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider max-w-xs mx-auto mb-24 sm:mb-32" />

        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <div className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#14B8A6]/50 mb-4">
            Our Thesis
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-8">
            You&apos;re the{" "}
            <span className="text-gradient-gold">safest bet</span> in America.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Banks just don&apos;t know it yet.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
            {[
              {
                stat: "1.9%",
                label:
                  "Physician unemployment rate — the lowest of any profession in the United States.",
              },
              {
                stat: "$350K+",
                label:
                  "Average physician salary. Your earning power is not a question — it's a guarantee.",
              },
              {
                stat: "<2%",
                label:
                  "Physician loan default rate. You pay your debts. Period.",
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="stat-card glass-card p-6 sm:p-8 rounded-2xl text-center transition-all duration-300"
              >
                <div className="text-3xl sm:text-4xl font-bold text-[#14B8A6] mb-3">
                  {item.stat}
                </div>
                <div className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 sm:mt-16 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
            Traditional banks see a medical student with $200K in debt and say no.
            We see a future attending with one of the highest, most stable incomes in
            the country. We underwrite your license. We underwrite your potential.
            We underwrite <span className="text-[#14B8A6] font-medium">you</span>.
          </p>
        </div>
      </section>

      {/* ============================================
          $100 BONUS CTA
          ============================================ */}
      <section className="relative py-24 sm:py-32">
        <div className="section-divider max-w-xs mx-auto mb-24 sm:mb-32" />

        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#14B8A6]/[0.06] to-transparent border border-[#14B8A6]/10 p-8 sm:p-12 md:p-16 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[#14B8A6]/[0.06] rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-gradient-gold mb-3 sm:mb-4">
                $100
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                Is Waiting for You.
              </h2>
              <p className="max-w-lg mx-auto mb-8 leading-relaxed text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
                Join the waitlist today and receive $100 deposited directly into your
                White Coat Bank account when we launch. No minimums. No catches.
              </p>

              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@stanford.edu"
                    required
                    className="w-full sm:flex-1 px-5 py-3.5 rounded-xl text-sm transition-all"
                    style={{
                      backgroundColor: "var(--bg-cta-input)",
                      border: "1px solid var(--border-input)",
                      color: "var(--text-heading)",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#14B8A6] text-black text-sm font-bold tracking-wide hover:bg-[#5EEAD4] transition-all"
                  >
                    Claim My $100
                  </button>
                </form>
              ) : (
                <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#14B8A6]/[0.08] border border-[#14B8A6]/20">
                  <svg className="w-5 h-5 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[#14B8A6] font-medium text-sm">
                    You&apos;re in. $100 reserved.
                  </span>
                </div>
              )}

              <p className="mt-6 text-[11px]" style={{ color: "var(--text-faint)" }}>
                First 500 members only. Limited spots remaining.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          STANFORD SECTION
          ============================================ */}
      <section className="relative py-20 sm:py-24">
        <div className="section-divider max-w-xs mx-auto mb-20 sm:mb-24" />

        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <div className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#14B8A6]/50 mb-4">
            Our Origin
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6">
            Built by Stanford students who lived it.
          </h2>
          <p className="leading-relaxed max-w-xl mx-auto text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
            We watched our classmates — the most brilliant, dedicated people we
            know — get rejected for credit cards while pulling 80-hour weeks in
            residency. We watched banks treat future surgeons like risks instead
            of certainties. That ends now. White Coat Bank is the bank we wished
            existed when we needed it most.
          </p>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="py-10 sm:py-12" style={{ borderTop: "1px solid var(--border-footer)" }}>
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#14B8A6]/60" viewBox="0 0 32 32" fill="none">
                <path d="M16 3L5 8v7c0 7.18 4.98 13.89 11 15.5 6.02-1.61 11-8.32 11-15.5V8L16 3z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
                <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor"/>
                <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor"/>
              </svg>
              <span className="text-xs font-semibold tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
                WHITE COAT BANK
              </span>
            </div>
            <div className="text-[11px] text-center sm:text-right max-w-md" style={{ color: "var(--text-faint)" }}>
              White Coat Bank is currently in development. Banking services will be
              provided through partner institutions. Not FDIC insured yet.
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================
          SURVEY MODAL
          ============================================ */}
      <SurveyModal
        isOpen={showSurvey}
        onClose={() => setShowSurvey(false)}
        onComplete={handleSurveyComplete}
      />
    </div>
  );
}
