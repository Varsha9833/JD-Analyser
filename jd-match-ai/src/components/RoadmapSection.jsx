/**
 * RoadmapSection.jsx
 * 4-week vertical timeline roadmap, dark-mode aware.
 */

import { Map, BookOpen, Clock } from 'lucide-react';

const WEEK_COLORS = [
  { dot: 'bg-indigo-500',  badge: 'bg-indigo-100 text-indigo-700',   cardLight: 'bg-indigo-50 border-indigo-200',   cardDark: 'bg-indigo-900/20 border-indigo-800/40'  },
  { dot: 'bg-violet-500',  badge: 'bg-violet-100 text-violet-700',   cardLight: 'bg-violet-50 border-violet-200',   cardDark: 'bg-violet-900/20 border-violet-800/40'  },
  { dot: 'bg-cyan-500',    badge: 'bg-cyan-100 text-cyan-700',       cardLight: 'bg-cyan-50 border-cyan-200',       cardDark: 'bg-cyan-900/20 border-cyan-800/40'      },
  { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', cardLight: 'bg-emerald-50 border-emerald-200', cardDark: 'bg-emerald-900/20 border-emerald-800/40'},
];

export default function RoadmapSection({ roadmap = [], darkMode }) {
  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden animate-fade-in
      ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
    >
      <div className={`px-6 py-4 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <Map className="w-5 h-5 text-cyan-500" />
        <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Skill Gap Learning Roadmap
        </h2>
        <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          {roadmap.length} weeks
        </span>
      </div>

      <div className="p-6">
        {roadmap.length === 0 ? (
          <p className={`text-sm italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>No roadmap generated.</p>
        ) : (
          <div className="relative">
            {/* Timeline spine */}
            <div className={`absolute left-[19px] top-6 bottom-6 w-0.5 ${darkMode ? 'bg-slate-600' : 'bg-slate-200'}`} />

            <div className="space-y-5 stagger-children">
              {roadmap.map((item, i) => {
                const c = WEEK_COLORS[i % WEEK_COLORS.length];
                return (
                  <div key={i} className="relative flex gap-5">
                    {/* Dot */}
                    <div className="relative z-10 shrink-0">
                      <div className={`w-10 h-10 rounded-full ${c.dot} flex items-center justify-center shadow-md`}>
                        <span className="text-white text-xs font-bold">W{item.week}</span>
                      </div>
                    </div>

                    {/* Card */}
                    <div className={`flex-1 p-4 rounded-xl border mb-1 ${darkMode ? c.cardDark : c.cardLight}`}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${c.badge}`}>
                            Week {item.week}
                          </span>
                          <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{item.title}</h3>
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>~1 week</span>
                        </div>
                      </div>
                      <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                      <div className={`mt-3 flex items-center gap-1.5 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Study, build, and practice this week's topic</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {roadmap.length > 0 && (
          <div className={`mt-6 p-4 rounded-xl border text-center
            ${darkMode ? 'bg-indigo-900/20 border-indigo-800/40' : 'bg-linear-to-r from-indigo-50 to-violet-50 border-indigo-100'}`}
          >
            <p className={`text-sm font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
              🚀 Complete this roadmap and re-analyze your resume — your score will improve!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
