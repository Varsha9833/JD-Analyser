/**
 * SkillsSection.jsx
 * Matched / missing skill badges, dark-mode aware.
 */

import { CheckCircle2, XCircle } from 'lucide-react';

function SkillBadge({ skill, variant }) {
  const styles = {
    matched: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    missing: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-default ${styles[variant]}`}>
      {variant === 'matched' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {skill}
    </span>
  );
}

function SkillCard({ title, icon, skills, variant, emptyMessage, darkMode }) {
  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden animate-fade-in
      ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
    >
      <div className={`px-6 py-4 border-b flex items-center gap-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        {icon}
        <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h2>
        <span className={`ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
          {skills.length}
        </span>
      </div>
      <div className="p-6">
        {skills.length === 0 ? (
          <p className={`text-sm italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{emptyMessage}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => <SkillBadge key={i} skill={skill} variant={variant} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SkillsSection({ matchedSkills = [], missingSkills = [], darkMode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkillCard
        title="Matched Skills"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        skills={matchedSkills} variant="matched"
        emptyMessage="No explicitly matched skills found."
        darkMode={darkMode}
      />
      <SkillCard
        title="Missing Skills"
        icon={<XCircle className="w-5 h-5 text-red-500" />}
        skills={missingSkills} variant="missing"
        emptyMessage="Great news — no critical missing skills found!"
        darkMode={darkMode}
      />
    </div>
  );
}
