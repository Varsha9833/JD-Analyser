/**
 * SuggestionsSection.jsx
 * Displays Strengths as cards and Resume Improvement Suggestions as
 * a numbered action list. Also shows ATS keywords with a Copy All button.
 */

import { useState } from 'react';
import { Star, Lightbulb, Key, Copy, Check } from 'lucide-react';

/* ── Strengths ──────────────────────────────────────────────────────────── */
function StrengthsCard({ strengths }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-500" />
        <h2 className="text-base font-bold text-slate-800">Strengths</h2>
        <span className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {strengths.length}
        </span>
      </div>
      <div className="p-6 grid gap-3 stagger-children">
        {strengths.map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Improvements ───────────────────────────────────────────────────────── */
function ImprovementsCard({ improvements }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-bold text-slate-800">Resume Improvement Suggestions</h2>
        <span className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {improvements.length}
        </span>
      </div>
      <div className="p-6 grid gap-3 stagger-children">
        {improvements.map((tip, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ATS Keywords ───────────────────────────────────────────────────────── */
function ATSKeywordsCard({ keywords }) {
  const [copied, setCopied] = useState(false);

  function handleCopyAll() {
    navigator.clipboard.writeText(keywords.join(', ')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Key className="w-5 h-5 text-violet-500" />
        <h2 className="text-base font-bold text-slate-800">ATS Keywords</h2>
        <span className="ml-auto flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {keywords.length}
          </span>
          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
          >
            {copied
              ? <><Check className="w-3 h-3" /> Copied!</>
              : <><Copy className="w-3 h-3" /> Copy All</>
            }
          </button>
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Include these keywords naturally in your resume to pass ATS filters.
        </p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors cursor-default"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Exported component ─────────────────────────────────────────────────── */
export default function SuggestionsSection({ strengths = [], improvements = [], atsKeywords = [] }) {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrengthsCard strengths={strengths} />
        <ImprovementsCard improvements={improvements} />
      </div>
      <ATSKeywordsCard keywords={atsKeywords} />
    </div>
  );
}
