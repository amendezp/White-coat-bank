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

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<SurveyResponse[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/survey?key=${encodeURIComponent(key)}`,
      );
      if (!res.ok) {
        setError("Invalid key");
        setData(null);
      } else {
        setData(await res.json());
      }
    } catch {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    window.open(
      `/api/survey?key=${encodeURIComponent(key)}&format=csv`,
    );
  };

  const careerBreakdown = data
    ? data.reduce(
        (acc, d) => {
          acc[d.careerStage] = (acc[d.careerStage] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      )
    : {};

  const productRanking = data
    ? data.reduce(
        (acc, d) => {
          d.topProducts?.forEach((p) => {
            acc[p] = (acc[p] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>,
      )
    : {};

  const cardDistribution = data
    ? data.reduce(
        (acc, d) => {
          d.currentCards?.forEach((c) => {
            acc[c] = (acc[c] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>,
      )
    : {};

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

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          White Coat Bank — Survey Dashboard
        </h1>
        <p className="text-white/40 mb-8">
          View and export physician survey responses.
        </p>

        {!data ? (
          <div className="max-w-sm">
            <label className="text-sm text-white/50 mb-2 block">
              Admin Key
            </label>
            <div className="flex gap-3">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchData()}
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
            {/* Summary bar */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-4xl font-bold text-teal-400">
                  {data.length}
                </span>
                <span className="text-white/40 ml-3">
                  total responses
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={downloadCSV}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-sm text-white/60 hover:text-white/90 hover:border-white/[0.2] transition-all"
                >
                  Download CSV
                </button>
                <button
                  onClick={() => {
                    setData(null);
                    setKey("");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-white/[0.1] text-sm text-white/60 hover:text-white/90 hover:border-white/[0.2] transition-all"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Career Breakdown */}
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                <h3 className="text-sm font-semibold text-white/60 mb-4">
                  Career Stage
                </h3>
                <div className="space-y-3">
                  {sortedCareer.map(([stage, count]) => (
                    <div key={stage}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{stage}</span>
                        <span className="text-white/40">{count}</span>
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
                </div>
              </div>

              {/* Product Ranking */}
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                <h3 className="text-sm font-semibold text-white/60 mb-4">
                  Most Wanted Products
                </h3>
                <div className="space-y-3">
                  {sortedProducts.map(([product, count], i) => (
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
                  ))}
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
                        <span className="text-white/70">{card}</span>
                        <span className="text-white/40">{count}</span>
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
                    <p className="text-sm text-white/30">
                      No responses yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Responses table */}
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <h3 className="text-sm font-semibold text-white/60 mb-4">
                All Responses
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-white/40 border-b border-white/[0.06]">
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Stage</th>
                      <th className="pb-3 pr-4">Top Products</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((d, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/[0.03] text-white/60"
                      >
                        <td className="py-3 pr-4">{d.email}</td>
                        <td className="py-3 pr-4">
                          {d.careerStage}
                        </td>
                        <td className="py-3 pr-4">
                          {d.topProducts?.join(", ") || "—"}
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
          </div>
        )}
      </div>
    </div>
  );
}
