/**
 * Home.jsx
 * Main page — analysis flow, score history, section nav, dark mode aware.
 */

import { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, AlertTriangle, X, History, Trash2, Clock } from 'lucide-react';

import ResumeForm         from '../components/ResumeForm.jsx';
import MatchScoreCard     from '../components/MatchScoreCard.jsx';
import SkillsSection      from '../components/SkillsSection.jsx';
import SuggestionsSection from '../components/SuggestionsSection.jsx';
import InterviewQuestions from '../components/InterviewQuestions.jsx';
import RoadmapSection     from '../components/RoadmapSection.jsx';

import { analyzeResume } from '../services/geminiService.js';
import { exportToPDF }   from '../utils/pdfExport.js';

const STORAGE_KEY   = 'jdMatchAI_lastAnalysis';
const HISTORY_KEY   = 'jdMatchAI_history';
const MAX_HISTORY   = 5;

const LOAD_STEPS = [
  { icon: '📄', label: 'Parsing resume' },
  { icon: '🔍', label: 'Matching skills' },
  { icon: '🤖', label: 'Generating insights' },
  { icon: '🗓️', label: 'Building roadmap' },
];

const SECTIONS = [
  { id: 'score',     label: '📊 Score'         },
  { id: 'skills',    label: '🎯 Skills'         },
  { id: 'strengths', label: '💪 Strengths'      },
  { id: 'ats',       label: '🔑 ATS Keywords'   },
  { id: 'interview', label: '❓ Interview Prep' },
  { id: 'roadmap',   label: '🗺️ Roadmap'        },
];

function getQuality(score) {
  if (score >= 90) return { label: 'Excellent', color: 'text-emerald-500' };
  if (score >= 75) return { label: 'Good',      color: 'text-indigo-500'  };
  if (score >= 60) return { label: 'Average',   color: 'text-amber-500'   };
  return                  { label: 'Needs Work', color: 'text-red-500'    };
}

export default function Home({ darkMode }) {
  const [analysis, setAnalysis]   = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadStep, setLoadStep]   = useState(0);
  const [apiError, setApiError]   = useState('');
  const [history, setHistory]     = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const sectionRefs = {
    score:     useRef(null),
    skills:    useRef(null),
    strengths: useRef(null),
    ats:       useRef(null),
    interview: useRef(null),
    roadmap:   useRef(null),
  };
  const resultsRef = useRef(null);

  /* ── Restore on mount ───────────────────────────────────────────── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAnalysis(JSON.parse(saved));
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setHistory(JSON.parse(hist));
    } catch { /* ignore */ }
  }, []);

  /* ── Animate loading steps ──────────────────────────────────────── */
  useEffect(() => {
    if (!isLoading) { setLoadStep(0); return; }
    const interval = setInterval(() => {
      setLoadStep((s) => (s + 1) % LOAD_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  /* ── Analyze ────────────────────────────────────────────────────── */
  async function handleAnalyze(resume, jobDesc) {
    setApiError('');
    setIsLoading(true);
    try {
      const result = await analyzeResume(resume, jobDesc);
      setAnalysis(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

      // Save to history (max 5)
      const entry = { ...result, timestamp: Date.now() };
      setHistory((prev) => {
        const updated = [entry, ...prev].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setAnalysis(null);
    setApiError('');
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleExport() {
    if (analysis) exportToPDF(analysis);
  }

  function loadFromHistory(item) {
    setAnalysis(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
    setShowHistory(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  function scrollTo(id) {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── Styles ─────────────────────────────────────────────────────── */
  const card = darkMode
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200';
  const textPrimary   = darkMode ? 'text-white'     : 'text-slate-900';
  const textSecondary = darkMode ? 'text-slate-300' : 'text-slate-600';
  const textMuted     = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold mb-5
          ${darkMode ? 'bg-indigo-900/40 border-indigo-700 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          AI-Powered Resume Analysis
        </div>

        <h1 className={`text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-4 ${textPrimary}`}>
          How well does your resume<br />
          <span className="gradient-text">match the job?</span>
        </h1>

        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${textMuted}`}>
          Paste your resume and any job description. Our AI instantly scores your
          match, identifies skill gaps, and gives you a personalized action plan.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {['ATS Analysis', 'Skill Gap Detection', 'Interview Prep', '4-Week Roadmap', 'PDF Export', 'Score History'].map((f) => (
            <span key={f} className={`text-xs font-semibold px-3 py-1.5 rounded-full border shadow-sm
              ${darkMode ? 'bg-slate-800 border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              ✓ {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── History panel ─────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all
              ${darkMode
                ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <History className="w-4 h-4 text-indigo-500" />
            Past Analyses ({history.length})
            <span className={`text-xs ${textMuted}`}>{showHistory ? '▲' : '▼'}</span>
          </button>

          {showHistory && (
            <div className={`mt-3 p-4 rounded-2xl border animate-fade-in-fast ${card}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-bold ${textPrimary}`}>Recent Analyses</p>
                <button
                  onClick={clearHistory}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" /> Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {history.map((item, i) => {
                  const q = getQuality(item.matchScore);
                  return (
                    <button
                      key={i}
                      onClick={() => loadFromHistory(item)}
                      className={`text-left p-3 rounded-xl border transition-all hover:scale-[1.02]
                        ${darkMode ? 'bg-slate-700 border-slate-600 hover:border-indigo-500' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-lg font-extrabold ${q.color}`}>{item.matchScore}%</span>
                        <span className={`text-xs font-semibold ${q.color}`}>{q.label}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${textMuted}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <p className={`text-xs mt-1 ${textMuted}`}>
                        {item.matchedSkills?.length ?? 0} matched · {item.missingSkills?.length ?? 0} missing
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Input form ────────────────────────────────────────────────── */}
      <div className={`rounded-2xl border shadow-sm p-6 sm:p-8 mb-8 ${card}`}>
        <ResumeForm onAnalyze={handleAnalyze} isLoading={isLoading} darkMode={darkMode} />
      </div>

      {/* ── Loading ───────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-8 animate-fade-in">
          {/* Spinner */}
          <div className="relative">
            <div className={`w-24 h-24 rounded-full border-4 border-t-indigo-500 animate-spin
              ${darkMode ? 'border-slate-700' : 'border-indigo-100'}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl step-pulse">{LOAD_STEPS[loadStep].icon}</span>
            </div>
          </div>

          <div className="text-center">
            <p className={`text-xl font-bold ${textPrimary}`}>Analyzing Resume...</p>
            <p className={`text-sm mt-1 ${textMuted}`}>
              Gemini AI is working on your analysis
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex flex-wrap justify-center gap-3">
            {LOAD_STEPS.map((step, i) => (
              <div
                key={step.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-500
                  ${i === loadStep
                    ? darkMode
                      ? 'bg-indigo-900 border-indigo-500 text-indigo-200 scale-105 shadow-lg'
                      : 'bg-indigo-50 border-indigo-300 text-indigo-700 scale-105 shadow-md'
                    : i < loadStep
                      ? darkMode
                        ? 'bg-slate-700 border-slate-600 text-slate-400'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                      : darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-500'
                        : 'bg-white border-slate-200 text-slate-400'
                  }`}
              >
                <span>{step.icon}</span>
                <span>{step.label}</span>
                {i < loadStep && <span className="text-emerald-500">✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {apiError && !isLoading && (
        <div className="flex items-start gap-3 p-5 rounded-2xl bg-red-50 border border-red-200 mb-8 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Analysis Failed</p>
            <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
          </div>
          <button onClick={() => setApiError('')} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────────── */}
      {analysis && !isLoading && (
        <div ref={resultsRef} className="space-y-6 animate-slide-up">

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 shadow-xl shadow-indigo-200">
            <div>
              <p className="text-white font-bold text-lg">Analysis Complete 🎉</p>
              <p className="text-indigo-200 text-sm mt-0.5">
                Your resume scored <strong className="text-white">{analysis.matchScore}%</strong> for this role.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow hover:shadow-md hover:bg-indigo-50 transition-all"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 text-white font-bold text-sm border border-white/30 hover:bg-white/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                New Analysis
              </button>
            </div>
          </div>

          {/* Clickable section nav */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95
                  ${darkMode
                    ? 'bg-slate-700 border-slate-600 text-slate-200 hover:border-indigo-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* 1. Score */}
          <div ref={sectionRefs.score}>
            <MatchScoreCard score={analysis.matchScore} darkMode={darkMode} />
          </div>

          {/* 2. Skills */}
          <div ref={sectionRefs.skills}>
            <SkillsSection
              matchedSkills={analysis.matchedSkills}
              missingSkills={analysis.missingSkills}
              darkMode={darkMode}
            />
          </div>

          {/* 3. Strengths + Improvements + ATS */}
          <div ref={sectionRefs.strengths}>
            <SuggestionsSection
              strengths={analysis.strengths}
              improvements={analysis.improvements}
              atsKeywords={analysis.atsKeywords}
              atsRef={sectionRefs.ats}
              darkMode={darkMode}
            />
          </div>

          {/* 4. Interview */}
          <div ref={sectionRefs.interview}>
            <InterviewQuestions questions={analysis.interviewQuestions} darkMode={darkMode} />
          </div>

          {/* 5. Roadmap */}
          <div ref={sectionRefs.roadmap}>
            <RoadmapSection roadmap={analysis.learningRoadmap} darkMode={darkMode} />
          </div>

          {/* Bottom export */}
          <div className="flex justify-center pt-4 pb-8">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 active:scale-100 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Download Full Analysis Report (PDF)
            </button>
          </div>

        </div>
      )}
    </main>
  );
}
