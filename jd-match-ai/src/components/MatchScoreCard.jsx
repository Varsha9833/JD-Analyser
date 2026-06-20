/**
 * MatchScoreCard.jsx
 * Displays the overall match score with an animated SVG progress ring
 * and a colour-coded quality badge.
 */

import { useEffect, useRef } from 'react';
import { Award } from 'lucide-react';

/* ── Score metadata ─────────────────────────────────────────────────────── */
function getScoreMeta(score) {
  if (score >= 90) return { label: 'Excellent', color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', ring: '#10b981' };
  if (score >= 75) return { label: 'Good',      color: '#6366f1', bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-700',  ring: '#6366f1' };
  if (score >= 60) return { label: 'Average',   color: '#f59e0b', bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  ring: '#f59e0b' };
  return                  { label: 'Needs Improvement', color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', ring: '#ef4444' };
}

/* ── Animated ring component ────────────────────────────────────────────── */
function ScoreRing({ score, color }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const circleRef = useRef(null);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    const target = circumference - (score / 100) * circumference;
    // Start fully hidden, animate to target
    el.style.strokeDashoffset = String(circumference);
    // RAF to allow the initial state to paint first
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
        {/* Track */}
        <circle
          cx="72" cy="72" r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="72" cy="72" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      {/* Centre text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold text-slate-900">{score}<span className="text-lg font-bold text-slate-500">%</span></span>
        <span className="text-xs font-medium text-slate-400">Match</span>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function MatchScoreCard({ score }) {
  const meta = getScoreMeta(score);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-fade-in">
      {/* Header strip */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-500" />
        <h2 className="text-base font-bold text-slate-800">Match Score</h2>
      </div>

      <div className="p-6 flex flex-col sm:flex-row items-center gap-8">
        {/* Ring */}
        <ScoreRing score={score} color={meta.ring} />

        {/* Text summary */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          {/* Badge */}
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${meta.bg} ${meta.border} ${meta.text}`}
          >
            {meta.label} Match
          </span>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed">
            {score >= 90 && 'Outstanding! Your resume is an excellent fit for this role. You are highly competitive.'}
            {score >= 75 && score < 90 && 'Great fit! A few tweaks could push you into the top tier of applicants.'}
            {score >= 60 && score < 75 && 'Decent alignment. Address the missing skills to significantly improve your chances.'}
            {score < 60 && 'Your resume needs work to match this job. Follow the roadmap below to close skill gaps.'}
          </p>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${score}%`,
                  backgroundColor: meta.color,
                  transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
          </div>

          {/* Score breakdown legend */}
          <div className="flex flex-wrap gap-3 pt-1">
            {[
              { range: '90-100', label: 'Excellent', color: 'bg-emerald-500' },
              { range: '75-89',  label: 'Good',      color: 'bg-indigo-500'  },
              { range: '60-74',  label: 'Average',   color: 'bg-amber-500'   },
              { range: '<60',    label: 'Needs Work', color: 'bg-red-500'    },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-slate-500">{item.range}: {item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
