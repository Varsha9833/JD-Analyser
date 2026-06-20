/**
 * RoadmapSection.jsx
 * Visual 4-week learning roadmap with a vertical timeline design.
 */

import { Map, BookOpen, Clock } from 'lucide-react';

/* Week colour palette */
const WEEK_COLORS = [
  { bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700', connector: 'bg-indigo-200' },
  { bg: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700', connector: 'bg-violet-200' },
  { bg: 'bg-cyan-50',   border: 'border-cyan-200',   dot: 'bg-cyan-500',   badge: 'bg-cyan-100 text-cyan-700',     connector: 'bg-cyan-200'   },
  { bg: 'bg-emerald-50',border: 'border-emerald-200',dot: 'bg-emerald-500',badge: 'bg-emerald-100 text-emerald-700',connector: 'bg-emerald-200'},
];

function getColor(index) {
  return WEEK_COLORS[index % WEEK_COLORS.length];
}

export default function RoadmapSection({ roadmap = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Map className="w-5 h-5 text-cyan-500" />
        <h2 className="text-base font-bold text-slate-800">Skill Gap Learning Roadmap</h2>
        <span className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {roadmap.length} weeks
        </span>
      </div>

      <div className="p-6">
        {roadmap.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No roadmap generated.</p>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-200" />

            <div className="space-y-5 stagger-children">
              {roadmap.map((item, i) => {
                const c = getColor(i);
                const isLast = i === roadmap.length - 1;
                return (
                  <div key={i} className="relative flex gap-5">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full ${c.dot} flex items-center justify-center shadow-md`}>
                        <span className="text-white text-xs font-bold">W{item.week}</span>
                      </div>
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 p-4 rounded-xl border ${c.bg} ${c.border} mb-1`}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${c.badge}`}>
                            Week {item.week}
                          </span>
                          <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>~1 week</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
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

        {/* Motivational footer */}
        {roadmap.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
            <p className="text-sm font-semibold text-indigo-700 text-center">
              🚀 Complete this roadmap and re-analyze your resume — your score will improve!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
