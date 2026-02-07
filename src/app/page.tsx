"use client";

import { useState, useRef, useCallback } from "react";

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
  const iconClass = "w-7 h-7 text-[#C9A96E]";

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
            <div className="text-[10px] font-light tracking-[0.3em] uppercase text-[#C9A96E]/70">
              White Coat Bank
            </div>
            <div className="mt-0.5 text-[8px] font-light tracking-[0.2em] uppercase text-white/30">
              Physician Edition
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold tracking-[0.15em] text-[#C9A96E]">
              M.D.
            </div>
          </div>
        </div>

        {/* Chip + Contactless */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="card-chip" />
          <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M8.5 16.5a7.5 7.5 0 010-9" strokeLinecap="round" />
            <path d="M5 19a11.5 11.5 0 010-14" strokeLinecap="round" />
            <path d="M12 13.5a3.5 3.5 0 010-3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card Bottom */}
        <div className="relative z-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] text-white/25 tracking-widest mb-1">
                ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;7890
              </div>
              <div className="text-[11px] font-medium tracking-[0.15em] text-white/60 uppercase">
                Dr. Jane Stanford
              </div>
            </div>
            {/* Medical Cross Logo */}
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-[#C9A96E]/40" viewBox="0 0 32 32" fill="currentColor">
                <rect x="12" y="4" width="8" height="24" rx="1" />
                <rect x="4" y="12" width="24" height="8" rx="1" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay bg-black/70">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0f0f0f] border border-white/10 p-8 shadow-2xl animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Close survey"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-[#C9A96E]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <div className="mb-2 text-[11px] font-medium tracking-[0.2em] uppercase text-[#C9A96E]">
          Question {step + 1} of 3
        </div>
        <h3 className="text-xl font-semibold text-white mb-1">{q.title}</h3>
        <p className="text-sm text-white/40 mb-6">{q.subtitle}</p>

        {/* Options */}
        <div className="space-y-3 mb-8">
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
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    currentAnswer === option
                      ? "border-[#C9A96E]"
                      : "border-white/20"
                  }`}
                >
                  {currentAnswer === option && (
                    <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
                  )}
                </span>
                <span className={currentAnswer === option ? "text-white" : "text-white/60"}>
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
          className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all ${
            currentAnswer
              ? "bg-[#C9A96E] text-black hover:bg-[#E8D5A8]"
              : "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
        >
          {step < 2 ? "Next" : "Submit & Claim Your $100"}
        </button>

        {/* Skip */}
        {step < 2 && (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full mt-3 text-xs text-white/20 hover:text-white/40 transition-colors"
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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ============================================
          NAVBAR
          ============================================ */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Mark */}
            <svg className="w-7 h-7 text-[#C9A96E]" viewBox="0 0 32 32" fill="currentColor">
              <rect x="13" y="5" width="6" height="22" rx="1" />
              <rect x="5" y="13" width="22" height="6" rx="1" />
            </svg>
            <span className="text-sm font-semibold tracking-[0.08em] text-white">
              WHITE COAT BANK
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-[11px] tracking-[0.15em] uppercase text-white/30">
              Exclusively for Physicians
            </span>
            <a
              href="#waitlist"
              className="text-xs font-semibold tracking-wide px-5 py-2 rounded-full bg-[#C9A96E] text-black hover:bg-[#E8D5A8] transition-colors"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </nav>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 bg-radial-top">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse" />
            <span className="text-[11px] tracking-[0.1em] uppercase text-white/50">
              Now accepting early access signups
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
            You Didn&apos;t Spend 12 Years
            <br />
            in Training for a{" "}
            <span className="text-gradient-gold">Generic Bank.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            White Coat Bank underwrites your future — not just your credit score.
            Premium banking built exclusively for physicians, by people who
            understand your journey.
          </p>

          {/* Email Form */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto animate-fade-in-up delay-300"
              id="waitlist"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full sm:flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:border-[#C9A96E] focus:ring-0 transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C9A96E] text-black text-sm font-bold tracking-wide hover:bg-[#E8D5A8] transition-all animate-pulse-gold"
              >
                Get $100 Free
              </button>
            </form>
          ) : (
            <div className="animate-fade-in-up max-w-md mx-auto">
              <div className="px-6 py-4 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-center">
                <p className="text-[#E8D5A8] font-semibold">
                  You&apos;re on the list.{" "}
                  {waitlistPosition && (
                    <span className="text-white/50">#{waitlistPosition}</span>
                  )}
                </p>
                <p className="text-white/40 text-sm mt-1">
                  $100 is reserved for you when we launch.
                </p>
                {!surveyComplete && (
                  <button
                    onClick={() => setShowSurvey(true)}
                    className="mt-3 text-xs text-[#C9A96E] hover:text-[#E8D5A8] underline underline-offset-4 transition-colors"
                  >
                    Complete our 30-second survey to help shape your bank
                  </button>
                )}
                {surveyComplete && (
                  <p className="mt-3 text-xs text-[#C9A96E]">
                    Survey complete — thank you, Doctor.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Social proof */}
          <div className="mt-6 flex items-center justify-center gap-2 animate-fade-in delay-500">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9A96E]/40 to-[#C9A96E]/10 border-2 border-[#050505] flex items-center justify-center"
                >
                  <span className="text-[8px] text-[#C9A96E]">
                    {["MD", "DO", "MD", "MD"][i]}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-xs text-white/30">
              237+ physicians already on the waitlist
            </span>
          </div>

          {/* Bonus tag */}
          <div className="mt-8 animate-fade-in delay-600">
            <span className="inline-flex items-center gap-2 text-xs text-white/20">
              <svg className="w-4 h-4 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              First 500 members get $100 deposited at launch — no strings attached
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ============================================
          THE CARD SECTION
          ============================================ */}
      <section className="relative py-32 overflow-hidden">
        <div className="section-divider max-w-xs mx-auto mb-32" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Card visual */}
            <div className="flex-shrink-0 animate-float">
              <CreditCardVisual />
            </div>

            {/* Card info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#C9A96E]/60 mb-4">
                The White Coat Card
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
                Not Another{" "}
                <span className="text-gradient-gold">Points Card.</span>
                <br />A Financial Weapon.
              </h2>
              <p className="text-white/40 leading-relaxed mb-8 max-w-lg">
                No airport lounges. No cashback on office supplies. The White Coat
                Card is built for what actually matters to you — malpractice
                protection, CME funding, practice building, and a bank that knows
                your MD means you&apos;re good for it.
              </p>

              {/* Card features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "APR During Residency", value: "0%" },
                  { label: "Annual CME Fund", value: "$2,500" },
                  { label: "Practice Loan Priority", value: "24hr" },
                  { label: "Income Protection", value: "Built-in" },
                ].map((feat) => (
                  <div
                    key={feat.label}
                    className="flex items-baseline gap-3 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <span className="text-xl font-bold text-[#C9A96E]">
                      {feat.value}
                    </span>
                    <span className="text-xs text-white/30">{feat.label}</span>
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
      <section className="relative py-32">
        <div className="section-divider max-w-xs mx-auto mb-32" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#C9A96E]/60 mb-4">
              Physician Perks
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              Built for Your Life.{" "}
              <span className="text-gradient-gold">Not Theirs.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Every feature exists because a physician asked for it.
              No corporate retreat packages. No business class upgrades.
              Just what doctors actually need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map((perk, i) => (
              <div
                key={perk.title}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C9A96E]/20 hover:bg-white/[0.04] transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center mb-4 group-hover:bg-[#C9A96E]/15 transition-colors">
                  <PerkIcon type={perk.icon} />
                </div>
                <h3 className="text-base font-semibold mb-2 text-white/90 group-hover:text-white transition-colors">
                  {perk.title}
                </h3>
                <p className="text-sm text-white/30 leading-relaxed group-hover:text-white/40 transition-colors">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          THE PROMISE SECTION
          ============================================ */}
      <section className="relative py-32">
        <div className="section-divider max-w-xs mx-auto mb-32" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#C9A96E]/60 mb-4">
            Our Thesis
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
            You&apos;re the{" "}
            <span className="text-gradient-gold">safest bet</span> in America.
            <br />
            Banks just don&apos;t know it yet.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6">
              <div className="text-4xl font-bold text-[#C9A96E] mb-2">1.9%</div>
              <div className="text-sm text-white/30">
                Physician unemployment rate — the lowest of any profession in the
                United States.
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#C9A96E] mb-2">$350K+</div>
              <div className="text-sm text-white/30">
                Average physician salary. Your earning power is not a question — it&apos;s
                a guarantee.
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#C9A96E] mb-2">&lt;2%</div>
              <div className="text-sm text-white/30">
                Physician loan default rate. You pay your debts. Period.
              </div>
            </div>
          </div>
          <p className="mt-12 text-white/30 max-w-2xl mx-auto leading-relaxed">
            Traditional banks see a medical student with $200K in debt and say no.
            We see a future attending with one of the highest, most stable incomes in
            the country. We underwrite your license. We underwrite your potential.
            We underwrite <span className="text-[#C9A96E] font-medium">you</span>.
          </p>
        </div>
      </section>

      {/* ============================================
          $100 BONUS CTA
          ============================================ */}
      <section className="relative py-32">
        <div className="section-divider max-w-xs mx-auto mb-32" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#C9A96E]/10 to-transparent border border-[#C9A96E]/15 p-12 sm:p-16 glow-gold">
            <div className="text-7xl sm:text-8xl font-bold text-gradient-gold mb-4">
              $100
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Is Waiting for You.
            </h2>
            <p className="text-white/40 max-w-lg mx-auto mb-8 leading-relaxed">
              Join the waitlist today and receive $100 deposited directly into your
              White Coat Bank account when we launch. No minimums. No catches.
              Our way of saying: we believe in your future.
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
                  className="w-full sm:flex-1 px-5 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder:text-white/25 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C9A96E] text-black text-sm font-bold tracking-wide hover:bg-[#E8D5A8] transition-all"
                >
                  Claim My $100
                </button>
              </form>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/30">
                <svg className="w-5 h-5 text-[#C9A96E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[#E8D5A8] font-medium text-sm">
                  You&apos;re in. $100 reserved.
                </span>
              </div>
            )}

            <p className="mt-6 text-[11px] text-white/15">
              First 500 members only. Limited spots remaining.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          STANFORD SECTION
          ============================================ */}
      <section className="relative py-24">
        <div className="section-divider max-w-xs mx-auto mb-24" />

        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#C9A96E]/60 mb-4">
            Born at Stanford
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Built by Stanford students who lived it.
          </h2>
          <p className="text-white/30 leading-relaxed max-w-xl mx-auto">
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
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#C9A96E]" viewBox="0 0 32 32" fill="currentColor">
                <rect x="13" y="5" width="6" height="22" rx="1" />
                <rect x="5" y="13" width="22" height="6" rx="1" />
              </svg>
              <span className="text-xs font-semibold tracking-[0.08em] text-white/40">
                WHITE COAT BANK
              </span>
            </div>
            <div className="text-[11px] text-white/15">
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
