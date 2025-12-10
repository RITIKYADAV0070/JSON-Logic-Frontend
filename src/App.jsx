
import React, { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://json-logic-backend.onrender.com";

;

const EXAMPLES = [
  "Approve if bureau score > 700 and business vintage at least 3 years and applicant age between 25 and 60.",
  "Flag as high risk if wilful default is true OR overdue amount > 50000 OR bureau.dpd >= 90.",
  "Prefer applicants with tag ‘veteran’ OR with monthly_income > 100000.",
];

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [prompt, setPrompt] = useState(EXAMPLES[0]);
  const [contextDocs, setContextDocs] = useState(
    "Credit Policy v1.0 – minimum bureau score 600...\nRisk guidelines – suit filed = high risk..."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleUseExample = (i) => {
    setPrompt(EXAMPLES[i]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = {
        prompt,
        context_docs: contextDocs
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      };
      const resp = await fetch(`${API_BASE_URL}/generate-rule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || data.error || `Request failed: ${resp.status}`);
      }
      const data = await resp.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = async () => {
    if (!result?.json_logic) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(result.json_logic, null, 2)
      );
      alert("JSON Logic copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div
      className={cx(
        "min-h-screen w-full",
        theme === "dark"
          ? "bg-slate-950 text-slate-50"
          : "bg-slate-100 text-slate-900"
      )}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-60 pointer-events-none">
        <div className="w-[700px] h-[700px] bg-emerald-500/15 blur-3xl rounded-full absolute -top-64 -left-40" />
        <div className="w-[600px] h-[600px] bg-sky-500/15 blur-3xl rounded-full absolute bottom-[-260px] right-[-200px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-8 space-y-5 md:space-y-7">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Json Logic · Embeddings · Rag</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                JSON Logic Rule Generator
              </h1>
              <p className="text-sm text-slate-400 max-w-xl">
                Describe your credit policy in natural language. The system
                maps it to JSON Logic using embeddings + policy-aware RAG.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={cx(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border shadow-sm",
                theme === "dark"
                  ? "bg-slate-900/80 border-slate-700 text-slate-100"
                  : "bg-white border-slate-300 text-slate-800"
              )}
            >
              <span
                className={cx(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]",
                  theme === "dark"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-emerald-50 text-emerald-700"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>
            </button>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              FastAPI · OpenRouter · JSONLogic · Embeddings · RAG
            </p>
          </div>
        </header>

        {/* Layout */}
        <main className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] gap-6 items-start">
          {/* Left: Rule builder */}
          <section
            className={cx(
              "rounded-2xl border shadow-lg shadow-slate-950/40 p-4 md:p-5 space-y-4",
              theme === "dark"
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white border-slate-200"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="space-y-0.5">
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
                  Rule Builder
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 hidden md:inline-flex items-center gap-1">
                <span className="text-slate-400">⚡</span> FastAPI · OpenRouter ·
                JSONLogic
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Prompt
                </label>
                <textarea
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className={cx(
                    "w-full rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/70",
                    theme === "dark"
                      ? "bg-slate-950/70 border-slate-700 text-slate-50 placeholder:text-slate-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  )}
                  placeholder="Approve if bureau score > 700 and business vintage at least 3 years..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Context docs (optional){" "}
                  <span className="text-[10px] text-slate-500">
                    one snippet per line
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={contextDocs}
                  onChange={(e) => setContextDocs(e.target.value)}
                  className={cx(
                    "w-full rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/70",
                    theme === "dark"
                      ? "bg-slate-950/70 border-slate-700 text-slate-50 placeholder:text-slate-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  )}
                  placeholder="Credit Policy v1.0 – minimum bureau score 600..."
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleUseExample(i)}
                    className={cx(
                      "rounded-full px-3 py-1 text-xs border transition",
                      theme === "dark"
                        ? "border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-300"
                        : "border-slate-300 text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                    )}
                  >
                    Use example {i + 1}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cx(
                  "w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  loading
                    ? "bg-emerald-600/80 text-emerald-50 cursor-wait"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white",
                  theme === "dark"
                    ? "focus:ring-emerald-500 focus:ring-offset-slate-950"
                    : "focus:ring-emerald-500 focus:ring-offset-slate-100"
                )}
              >
                {loading ? "Generating rule..." : "Generate JSON Logic"}
              </button>

              {error && (
                <pre
                  className={cx(
                    "mt-2 rounded-xl px-3 py-2 text-xs whitespace-pre-wrap border",
                    theme === "dark"
                      ? "bg-rose-950/60 border-rose-800 text-rose-100"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  )}
                >
                  {JSON.stringify({ message: error }, null, 2)}
                </pre>
              )}
            </form>
          </section>

          {/* Right: Model insight */}
          <section
            className={cx(
              "rounded-2xl border shadow-lg shadow-slate-950/40 p-4 md:p-5 flex flex-col gap-4",
              theme === "dark"
                ? "bg-slate-900/80 border-slate-800"
                : "bg-white border-slate-200"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
                  Model Insight
                </h2>
              </div>
              <div className="inline-flex items-center rounded-full border text-[11px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className={cx(
                    "px-3 py-1",
                    activeTab === "summary"
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-transparent text-slate-400"
                  )}
                >
                  Summary
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("raw")}
                  className={cx(
                    "px-3 py-1",
                    activeTab === "raw"
                      ? "bg-slate-800 text-slate-100"
                      : "bg-transparent text-slate-400"
                  )}
                >
                  Raw JSON
                </button>
              </div>
            </div>

            {activeTab === "summary" ? (
              <>
                {/* Explanation */}
                <div
                  className={cx(
                    "rounded-xl border px-3 py-2.5 text-xs",
                    theme === "dark"
                      ? "bg-slate-900 border-slate-800 text-slate-200"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  )}
                >
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-1">
                    Explanation
                  </div>
                  <p className="leading-relaxed">
                    {result?.explanation ||
                      "Run a prompt to see a natural-language explanation of the generated JSON Logic rule."}
                  </p>
                </div>

                {/* Used keys */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Used keys
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result?.used_keys?.length ? (
                      result.used_keys.map((k) => (
                        <span
                          key={k}
                          className={cx(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] border",
                            theme === "dark"
                              ? "border-slate-700 bg-slate-900 text-slate-100"
                              : "border-slate-300 bg-slate-50 text-slate-800"
                          )}
                        >
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">
                        When a rule is generated, the referenced fields appear here.
                      </span>
                    )}
                  </div>
                </div>

                {/* Key mappings */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Key mappings (embeddings)
                  </div>
                  <div className="space-y-1.5 max-h-44 overflow-auto pr-1 text-xs">
                    {result?.key_mappings?.length ? (
                      result.key_mappings.map((km, idx) => (
                        <div
                          key={`${km.user_phrase}-${km.mapped_to}-${idx}`}
                          className={cx(
                            "flex items-center justify-between gap-3 rounded-lg px-3 py-1.5 border",
                            theme === "dark"
                              ? "bg-slate-950/70 border-slate-800"
                              : "bg-slate-50 border-slate-200"
                          )}
                        >
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {km.user_phrase}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              → {km.mapped_to}
                            </div>
                          </div>
                          <div className="text-[11px] tabular-nums text-slate-400">
                            {km.similarity.toFixed(3)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">
                        Embedding-based phrase → field mappings will show up
                        here when you generate a rule.
                      </p>
                    )}
                  </div>
                </div>

                {/* Policy snippets */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Policy snippets (RAG)
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-auto pr-1 text-xs">
                    {result?.retrieved_policy_snippets?.length ? (
                      result.retrieved_policy_snippets.map((snip, idx) => (
                        <pre
                          key={idx}
                          className={cx(
                            "rounded-lg px-3 py-2 whitespace-pre-wrap border font-mono text-[11px]",
                            theme === "dark"
                              ? "bg-slate-950/80 border-slate-800 text-slate-200"
                              : "bg-slate-900 text-emerald-200 border-slate-800"
                          )}
                        >
                          {snip}
                        </pre>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">
                        Retrieved policy context used to steer the model will be
                        displayed here.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div
                className={cx(
                  "rounded-xl border px-3 py-2.5 text-xs",
                  theme === "dark"
                    ? "bg-slate-950/80 border-slate-800 text-slate-200"
                    : "bg-slate-900 text-emerald-200 border-slate-800"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Raw JSON response
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-slate-600 text-slate-200 hover:border-slate-300"
                  >
                    Copy JSON Logic
                  </button>
                </div>
                <pre className="overflow-auto max-h-72">
                  {result
                    ? JSON.stringify(result, null, 2)
                    : "// Generate a rule to inspect the full response payload."}
                </pre>
              </div>
            )}

            <footer className="pt-1 mt-1 text-[10px] flex flex-col md:flex-row gap-1 md:items-center md:justify-between text-slate-500">
              <span>
                Built with React · Vite · Tailwind v4 · FastAPI · OpenRouter · JSONLogic · Embeddings · RAG
              </span>
              <span>AI Developer Assignment · Crego · by Ritik</span>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
