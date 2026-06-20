/**
 * Header.jsx
 * Top navigation bar with brand identity and tagline.
 */

import { BrainCircuit, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                JD Match <span className="gradient-text">AI</span>
              </span>
              <p className="text-[10px] font-medium text-slate-400 -mt-0.5 hidden sm:block">
                Resume vs Job Description Analyzer
              </p>
            </div>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600">Powered by Gemini AI</span>
          </div>

        </div>
      </div>
    </header>
  );
}
