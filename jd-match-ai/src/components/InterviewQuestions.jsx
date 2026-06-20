/**
 * InterviewQuestions.jsx
 * Collapsible interview Q cards, dark-mode aware.
 */

import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

function QuestionItem({ index, question, darkMode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all
      ${darkMode ? 'border-slate-700 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors
          ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
      >
        <span className={`shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center
          ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}
        >
          {index + 1}
        </span>
        <span className={`flex-1 text-sm font-medium leading-relaxed pr-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
          {question}
        </span>
        {open
          ? <ChevronUp className={`w-4 h-4 shrink-0 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
          : <ChevronDown className={`w-4 h-4 shrink-0 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
        }
      </button>

      {open && (
        <div className="px-5 pb-4 pl-[60px] animate-fade-in-fast">
          <div className={`p-3 rounded-lg border ${darkMode ? 'bg-indigo-900/20 border-indigo-800/40' : 'bg-indigo-50 border-indigo-100'}`}>
            <p className={`text-xs font-semibold mb-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
              💡 How to approach this:
            </p>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Use the <strong>STAR method</strong> — describe the <strong>Situation</strong>, your <strong>Task</strong>,
              the <strong>Actions</strong> you took, and the <strong>Result</strong> you achieved.
              Be specific, use numbers where possible, and keep your answer under 2 minutes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewQuestions({ questions = [], darkMode }) {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden animate-fade-in
      ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
    >
      <div className={`px-6 py-4 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <MessageSquare className="w-5 h-5 text-indigo-500" />
        <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Interview Questions</h2>
        <span className="ml-auto flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            {questions.length}
          </span>
          <button
            onClick={() => setAllOpen(!allOpen)}
            className={`text-xs font-semibold transition-colors ${darkMode ? 'text-indigo-400 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-800'}`}
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </span>
      </div>

      <div className="p-6 space-y-3 stagger-children">
        {questions.length === 0
          ? <p className={`text-sm italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>No interview questions generated.</p>
          : questions.map((q, i) => (
              <QuestionItem key={i} index={i} question={q} darkMode={darkMode} />
            ))
        }
      </div>
    </div>
  );
}
