"use client";

import { useState } from "react";

interface SurveyResponse {
  email: string;
  careerStage: string;
  currentCards: string[];
  topProducts: string[];
  dreamFeature: string;
  submittedAt: string;
}

interface WaitlistEntry {
  email: string;
  joinedAt: string;
  referralCode: string;
  referredBy: string | null;
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [surveyData, setSurveyData] = useState<SurveyResponse[] | null>(
    null,
  );
  const [waitlistData, setWaitlistData] = useState<
    WaitlistEntry[] | null
  >(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"overview" | "waitlist" | "survey">(
    "overview",
  );

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [surveyRes, waitlistRes] = await Promise.all([
        fetch(`/api/survey?key=${encodeURIComponent(key)}`),
        fetch(`/api/waitlist?key=${encodeURIComponent(key)}`),
      ]);
      if (!surveyRes.ok && !waitlistRes.ok) {
        setError("Invalid key");
        return;
      }
      if (surveyRes.ok) setSurveyData(await surveyRes.json());
      if (waitlistRes.ok) setWaitlistData(await waitlistRes.json());
    } catch {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  const downloadSurveyCSV = () => {
    window.open(
      `/api/survey?key=${encodeURIComponent(key)}&format=csv`,
    );
  };

  const downloadWaitlistCSV = () => {
    window.open(
      `/api/waitlist?key=${encodeURIComponent(key)}&format=csv`,
    );
  };

  const data = surveyData ?? [];
  const waitlist = waitlistData ?? [];

  const surveyEmails = new Set(data.map((d) => d.email));
  const waitlistOnly = waitlist.filter(
    (w) => !surveyEmails.has(w.email),
  );
  const referralCount = waitlist.filter(
    (w) => w.referredBy,
  ).length;

  const careerBreakdown = data.reduce(
    (acc, d) => {
      acc[d.careerStage] = (acc[d.careerStage] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const productRanking = data.reduce(
    (acc, d) => {
      d.topProducts?.forEach((p) => {
        acc[p] = (acc[p] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const cardDistribution = data.reduce(
    (acc, d) => {
      d.currentCards?.forEach((c) => {
        acc[c] = (acc[c] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedProducts = Object.entries(productRanking).sort(
    (a, b) => b[1] - a[1],
  );
  const sortedCards = Object.entries(cardDistribution).sort(
    (a, b) => b[1] - a[1],
  );
  const sortedCareer = Object.entries(careerBreakdown).sort(
    (a, b) => b[1] - a[1],
  );

  const maxProductVotes = Math.max(
    ...Object.values(productRanking),
    1,
  );
  const maxCardVotes = Math.max(
    ...Object.values(cardDistribution),
    1,
  );

  const isLoggedIn = surveyData !== null || waitlistData !== null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          White Coat Bank — Dashboard
        </h1>
        <p className="text-white/40 mb-8">
          Waitlist, survey responses, and product insights.
        </p>

        {!isLoggedIn ? (
          <div className="max-w-sm">
            <label className="text-sm text-white/50 mb-2 block">
              Admin Key
            </label>
            <p className="text-xs text-white/25 mb-4">
              Set via SURVEY_ADMIN_KEY environment variable.
            </p>
            <div className="flex gap-3">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && fetchData()
                }
                placeholder="Enter admin key"
                className="flex-1 h-12 px-5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/90 placeholder:text-white/20 focus:border-teal-400/30 focus:outline-none text-sm"
              />
              <button
                onClick={fetchData}
                disabled={loading || !key}
                className="px-6 h-12 rounded-xl bg-teal-500 text-[#0a0a0b] font-semibold text-sm hover:bg-teal-400 transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "View"}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-3">{error}</p>
            )}
          </div>
        ) : (
          <div>
            {/* Top metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Waitlist signups",
                  value: waitlist.length,
                },
                {
                  label: "Surveys completed",
                  value: data.length,
                },
                {
                  label: "Drop-off (no survey)",
                  value: waitlistOnly.length,
                },
                { label: "From referrals", value: referralCount },
              ].map((m) => (
                <div
                  key={m.label}
                  className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.015] text-center"
                >
                  <div className="text-3xl font-bold text-teal-400">
                    {m.value}
                  </div>
                  <div className="text-xs text-white/30 mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-8 border-b border-white/[0.06]">
              {(
                [
                  ["overview", "Overview"],
                  ["waitlist", "Waitlist"],
                  ["survey", "Survey Data"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                    tab === id
                      ? "text-teal-400 border-b-2 border-teal-400 -mb-px"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {label}
                </button>
              ))}
              <div className="flex-1" />
              <div className="flex gap-2 pb-2">
                <button
                  onClick={downloadWaitlistCSV}
                  className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs text-white/40 hover:text-white/70 hover:border-white/[0.15] transition-all"
                >
                  Waitlist CSV
                </button>
                <button
                  onClick={downloadSurveyCSV}
                  className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs text-white/40 hover:text-white/70 hover:border-white/[0.15] transition-all"
                >
                  Survey CSV
                </button>
                <button
                  onClick={() => {
                    setSurveyData(null);
                    setWaitlistData(null);
                    setKey("");
                  }}
                  className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs text-white/40 hover:text-white/70 hover:border-white/[0.15] transition-all"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* ─── OVERVIEW TAB ─── */}
            {tab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Career Breakdown */}
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">
                    Career Stage
                  </h3>
                  <div className="space-y-3">
                    {sortedCareer.map(([stage, count]) => (
                      <div key={stage}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">
                            {stage}
                          </span>
                          <span className="text-white/40">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full">
                          <div
                            className="h-full bg-teal-400 rounded-full"
                            style={{
                              width: `${(count / data.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {sortedCareer.length === 0 && (
                      <p className="text-sm text-white/20">
                        No data yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Product Ranking */}
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">
                    Most Wanted Products
                  </h3>
                  <div className="space-y-3">
                    {sortedProducts.map(
                      ([product, count], i) => (
                        <div key={product}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/70">
                              <span className="text-teal-400 mr-2">
                                #{i + 1}
                              </span>
                              {product}
                            </span>
                            <span className="text-white/40">
                              {count} votes
                            </span>
                          </div>
                          <div className="h-2 bg-white/[0.06] rounded-full">
                            <div
                              className="h-full bg-teal-400 rounded-full"
                              style={{
                                width: `${(count / maxProductVotes) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                    {sortedProducts.length === 0 && (
                      <p className="text-sm text-white/20">
                        No data yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Distribution */}
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">
                    Current Cards
                  </h3>
                  <div className="space-y-3">
                    {sortedCards.map(([card, count]) => (
                      <div key={card}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">
                            {card}
                          </span>
                          <span className="text-white/40">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full">
                          <div
                            className="h-full bg-teal-400 rounded-full"
                            style={{
                              width: `${(count / maxCardVotes) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {sortedCards.length === 0 && (
                      <p className="text-sm text-white/20">
                        No data yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Dream Features */}
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                  <h3 className="text-sm font-semibold text-white/60 mb-4">
                    Dream Features
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {data
                      .filter((d) => d.dreamFeature)
                      .map((d, i) => (
                        <div
                          key={i}
                          className="text-sm text-white/50 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                        >
                          <p className="text-white/70">
                            &ldquo;{d.dreamFeature}&rdquo;
                          </p>
                          <p className="text-xs text-white/25 mt-1">
                            {d.email} &middot; {d.careerStage}
                          </p>
                        </div>
                      ))}
                    {data.filter((d) => d.dreamFeature).length ===
                      0 && (
                      <p className="text-sm text-white/20">
                        No responses yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─── WAITLIST TAB ─── */}
            {tab === "waitlist" && (
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                <h3 className="text-sm font-semibold text-white/60 mb-4">
                  Waitlist Entries ({waitlist.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-white/40 border-b border-white/[0.06]">
                        <th className="pb-3 pr-4">#</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">
                          Referral Code
                        </th>
                        <th className="pb-3 pr-4">
                          Referred By
                        </th>
                        <th className="pb-3 pr-4">
                          Survey Done
                        </th>
                        <th className="pb-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waitlist.map((w, i) => (
                        <tr
                          key={i}
                          className="border-b border-white/[0.03] text-white/60"
                        >
                          <td className="py-3 pr-4 text-white/30">
                            {i + 1}
                          </td>
                          <td className="py-3 pr-4">
                            {w.email}
                          </td>
                          <td className="py-3 pr-4 font-mono text-teal-400/60">
                            {w.referralCode}
                          </td>
                          <td className="py-3 pr-4">
                            {w.referredBy || (
                              <span className="text-white/20">
                                —
                              </span>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            {surveyEmails.has(w.email) ? (
                              <span className="text-teal-400">
                                Yes
                              </span>
                            ) : (
                              <span className="text-white/20">
                                No
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            {new Date(
                              w.joinedAt,
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── SURVEY TAB ─── */}
            {tab === "survey" && (
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                <h3 className="text-sm font-semibold text-white/60 mb-4">
                  Survey Responses ({data.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-white/40 border-b border-white/[0.06]">
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Stage</th>
                        <th className="pb-3 pr-4">
                          Top Products
                        </th>
                        <th className="pb-3 pr-4">Cards</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((d, i) => (
                        <tr
                          key={i}
                          className="border-b border-white/[0.03] text-white/60"
                        >
                          <td className="py-3 pr-4">
                            {d.email}
                          </td>
                          <td className="py-3 pr-4">
                            {d.careerStage}
                          </td>
                          <td className="py-3 pr-4">
                            {d.topProducts?.join(", ") || "—"}
                          </td>
                          <td className="py-3 pr-4">
                            {d.currentCards?.join(", ") || "—"}
                          </td>
                          <td className="py-3">
                            {d.submittedAt
                              ? new Date(
                                  d.submittedAt,
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
