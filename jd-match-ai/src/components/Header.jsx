/**
 * Header.jsx
 * Sticky top nav with brand, dark-mode toggle, and GitHub link.
 */

import { BrainCircuit, Sparkles, Moon, Sun, GitBranch } from 'lucide-react';

export default function Header({ darkMode, onToggleDark }) {
  return (
    <header className={`sticky top-0 z-50 border-b shadow-sm backdrop-blur-md
      ${darkMode
        ? 'bg-slate-900/90 border-slate-700'
        : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-md">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                JD Match <span className="gradient-text">AI</span>
              </span>
              <p className={`text-[10px] font-medium -mt-0.5 hidden sm:block ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                Resume vs Job Description Analyzer
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Gemini badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border
              ${darkMode ? 'bg-indigo-900/50 border-indigo-700' : 'bg-indigo-50 border-indigo-100'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className={`text-xs font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                Powered by Gemini AI
              </span>
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/Varsha9833/JD-Analyser"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
              title="View on GitHub"
            >
              <GitBranch className="w-4 h-4" />
            </a>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDark}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-amber-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
