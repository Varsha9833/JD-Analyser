/**
 * InterviewQuestions.jsx
 * Renders interview questions in collapsible accordion cards.
 */

import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

/* ── Single collapsible question ───────────────────────────────────────── */
function QuestionItem({ index, question }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        {/* Number badge */}
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>

        <span className="flex-1 text-sm font-medium text-slate-700 leading-relaxed pr-2">
          {question}
        </span>

        {open
          ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        }
      </button>

      {/* Hint panel (expandable) */}
      {open && (
        <div className="px-5 pb-4 pl-[60px] animate-fade-in">
          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-600 mb-1">💡 How to approach this:</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use the STAR method — describe the <strong>Situation</strong>, your <strong>Task</strong>,
              the <strong>Actions</strong> you took, and the <strong>Result</strong> you achieved.
              Be specific, use numbers where possible, and keep your answer under 2 minutes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function InterviewQuestions({ questions = [] }) {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-bold text-slate-800">Interview Questions</h2>
        <span className="ml-auto flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {questions.length}
          </span>
          <button
            onClick={() => setAllOpen(!allOpen)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </span>
      </div>

      {/* Questions list */}
      <div className="p-6 space-y-3 stagger-children">
        {questions.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No interview questions generated.</p>
        ) : (
          questions.map((q, i) => (
            <QuestionItem key={i} index={i} question={q} forceOpen={allOpen} />
          ))
        )}
      </div>
    </div>
  );
}
