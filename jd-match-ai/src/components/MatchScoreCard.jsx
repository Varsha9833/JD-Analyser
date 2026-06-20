/**
 * MatchScoreCard.jsx
 * Animated SVG ring + quality badge, dark-mode aware.
 */

import { useEffect, useRef } from 'react';
import { Award } from 'lucide-react';

function getScoreMeta(score) {
  if (score >= 90) return { label: 'Excellent',         color: '#10b981', ring: '#10b981', badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' };
  if (score >= 75) return { label: 'Good',              color: '#6366f1', ring: '#6366f1', badgeBg: 'bg-indigo-50 dark:bg-indigo-900/30',   badgeBorder: 'border-indigo-200',  badgeText: 'text-indigo-700'  };
  if (score >= 60) return { label: 'Average',           color: '#f59e0b', ring: '#f59e0b', badgeBg: 'bg-amber-50 dark:bg-amber-900/30',     badgeBorder: 'border-amber-200',   badgeText: 'text-amber-700'   };
  return                  { label: 'Needs Improvement', color: '#ef4444', ring: '#ef4444', badgeBg: 'bg-red-50 dark:bg-red-900/30',          badgeBorder: 'border-red-200',     badgeText: 'text-red-700'     };
}

function ScoreRing({ score, color }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const circleRef = useRef(null);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    const target = circumference - (score / 100) * circumference;
    el.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
        el.style.strokeDashoffset = String(target);
      });
    });
  }, [score, circumference]);

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          ref={circleRef}
          cx="72" cy="72" r={radius}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {score}<span className="text-lg font-bold text-slate-500">%</span>
        </span>
        <span className="text-xs font-medium text-slate-400">Match</span>
      </div>
    </div>
  );
}

export default function MatchScoreCard({ score, darkMode }) {
  const meta = getScoreMeta(score);

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden animate-fade-in
      ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
    >
      <div className={`px-6 py-4 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <Award className="w-5 h-5 text-indigo-500" />
        <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Match Score</h2>
      </div>

      <div className="p-6 flex flex-col sm:flex-row items-center gap-8">
        <ScoreRing score={score} color={meta.ring} />

        <div className="flex-1 space-y-4 text-center sm:text-left">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${meta.badgeBg} ${meta.badgeBorder} ${meta.badgeText}`}>
            {meta.label} Match
          </span>

          <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {score >= 90 && 'Outstanding! Your resume is an excellent fit for this role. You are highly competitive.'}
            {score >= 75 && score < 90 && 'Great fit! A few tweaks could push you into the top tier of applicants.'}
            {score >= 60 && score < 75 && 'Decent alignment. Address the missing skills to significantly improve your chances.'}
            {score < 60 && 'Your resume needs work to match this job. Follow the roadmap below to close skill gaps.'}
          </p>

          {/* Progress bar */}
          <div>
            <div className={`flex justify-between text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>0%</span><span>100%</span>
            </div>
            <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div
                className="h-full rounded-full"
                style={{ width: `${score}%`, backgroundColor: meta.color, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-1">
            {[
              { range: '90-100', label: 'Excellent', color: 'bg-emerald-500' },
              { range: '75-89',  label: 'Good',      color: 'bg-indigo-500'  },
              { range: '60-74',  label: 'Average',   color: 'bg-amber-500'   },
              { range: '<60',    label: 'Needs Work', color: 'bg-red-500'    },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.range}: {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
