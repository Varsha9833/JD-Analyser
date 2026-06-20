/**
 * SuggestionsSection.jsx
 * Strengths, improvements, ATS keywords — dark-mode aware.
 */

import { useState, forwardRef } from 'react';
import { Star, Lightbulb, Key, Copy, Check } from 'lucide-react';

function card(darkMode) {
  return `rounded-2xl border shadow-sm overflow-hidden animate-fade-in ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`;
}
function cardHeader(darkMode) {
  return `px-6 py-4 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`;
}
function title(darkMode) {
  return `text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`;
}
function badge(darkMode) {
  return `ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`;
}

/* ── Strengths ─────────────────────────────────────────────────── */
function StrengthsCard({ strengths, darkMode }) {
  return (
    <div className={card(darkMode)}>
      <div className={cardHeader(darkMode)}>
        <Star className="w-5 h-5 text-amber-500" />
        <h2 className={title(darkMode)}>Strengths</h2>
        <span className={badge(darkMode)}>{strengths.length}</span>
      </div>
      <div className="p-6 grid gap-3 stagger-children">
        {strengths.map((s, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border
            ${darkMode ? 'bg-amber-900/20 border-amber-800/40' : 'bg-amber-50 border-amber-100'}`}
          >
            <span className="shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Improvements ──────────────────────────────────────────────── */
function ImprovementsCard({ improvements, darkMode }) {
  return (
    <div className={card(darkMode)}>
      <div className={cardHeader(darkMode)}>
        <Lightbulb className="w-5 h-5 text-indigo-500" />
        <h2 className={title(darkMode)}>Resume Improvement Suggestions</h2>
        <span className={badge(darkMode)}>{improvements.length}</span>
      </div>
      <div className="p-6 grid gap-3 stagger-children">
        {improvements.map((tip, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border
            ${darkMode ? 'bg-indigo-900/20 border-indigo-800/40' : 'bg-indigo-50 border-indigo-100'}`}
          >
            <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ATS Keywords ──────────────────────────────────────────────── */
const ATSKeywordsCard = forwardRef(function ATSKeywordsCard({ keywords, darkMode }, ref) {
  const [copied, setCopied] = useState(false);

  function handleCopyAll() {
    navigator.clipboard.writeText(keywords.join(', ')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div ref={ref} className={card(darkMode)}>
      <div className={cardHeader(darkMode)}>
        <Key className="w-5 h-5 text-violet-500" />
        <h2 className={title(darkMode)}>ATS Keywords</h2>
        <span className="ml-auto flex items-center gap-2">
          <span className={badge(darkMode)}>{keywords.length}</span>
          <button
            onClick={handleCopyAll}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-colors
              ${darkMode ? 'bg-violet-900/30 text-violet-300 border-violet-700 hover:bg-violet-900/50' : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'}`}
          >
            {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy All</>}
          </button>
        </span>
      </div>
      <div className="p-6">
        <p className={`text-xs mb-4 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Include these keywords naturally in your resume to pass ATS filters.
        </p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => (
            <span key={i} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-default
              ${darkMode ? 'bg-violet-900/30 text-violet-300 border-violet-700 hover:bg-violet-900/50' : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ── Export ────────────────────────────────────────────────────── */
export default function SuggestionsSection({ strengths = [], improvements = [], atsKeywords = [], atsRef, darkMode }) {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrengthsCard strengths={strengths} darkMode={darkMode} />
        <ImprovementsCard improvements={improvements} darkMode={darkMode} />
      </div>
      <ATSKeywordsCard ref={atsRef} keywords={atsKeywords} darkMode={darkMode} />
    </div>
  );
}
