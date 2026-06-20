/**
 * Home.jsx
 * Main page — orchestrates the full analysis flow:
 *   1. Resume + JD input form
 *   2. Loading state
 *   3. Full results dashboard
 *
 * Persists the last analysis to localStorage and restores it on mount.
 */

import { useState, useEffect, useRef } from 'react';
import { Download, RefreshCw, AlertTriangle, X } from 'lucide-react';

import ResumeForm        from '../components/ResumeForm.jsx';
import MatchScoreCard    from '../components/MatchScoreCard.jsx';
import SkillsSection     from '../components/SkillsSection.jsx';
import SuggestionsSection from '../components/SuggestionsSection.jsx';
import InterviewQuestions from '../components/InterviewQuestions.jsx';
import RoadmapSection    from '../components/RoadmapSection.jsx';

import { analyzeResume } from '../services/geminiService.js';
import { exportToPDF }   from '../utils/pdfExport.js';

const STORAGE_KEY = 'jdMatchAI_lastAnalysis';

export default function Home() {
  const [analysis, setAnalysis]   = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError]   = useState('');
  const resultsRef = useRef(null);

  /* ── Restore last analysis from localStorage on mount ──────────── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setAnalysis(JSON.parse(saved));
      }
    } catch {
      /* Ignore parse errors */
    }
  }, []);

  /* ── Analyze handler ────────────────────────────────────────────── */
  async function handleAnalyze(resume, jobDesc) {
    setApiError('');
    setIsLoading(true);
    try {
      const result = await analyzeResume(resume, jobDesc);
      setAnalysis(result);
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Reset ──────────────────────────────────────────────────────── */
  function handleReset() {
    setAnalysis(null);
    setApiError('');
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── PDF export ─────────────────────────────────────────────────── */
  function handleExport() {
    if (analysis) exportToPDF(analysis);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Hero section ────────────────────────────────────────────── */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          AI-Powered Resume Analysis
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
          How well does your resume<br />
          <span className="gradient-text">match the job?</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Paste your resume and any job description. Our AI instantly scores your
          match, identifies skill gaps, and gives you a personalized action plan.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {['ATS Analysis', 'Skill Gap Detection', 'Interview Prep', '4-Week Roadmap', 'PDF Export'].map((f) => (
            <span key={f} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm">
              ✓ {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── Input form card ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <ResumeForm onAnalyze={handleAnalyze} isLoading={isLoading} />
      </div>

      {/* ── Loading overlay ──────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">Analyzing Resume...</p>
            <p className="text-sm text-slate-500 mt-1">Gemini AI is reading your resume and job description</p>
          </div>
          <div className="flex gap-2">
            {['Parsing resume', 'Matching skills', 'Generating insights', 'Building roadmap'].map((step, i) => (
              <span
                key={step}
                className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── API Error banner ─────────────────────────────────────────── */}
      {apiError && !isLoading && (
        <div className="flex items-start gap-3 p-5 rounded-2xl bg-red-50 border border-red-200 mb-8 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Analysis Failed</p>
            <p className="text-sm text-red-600 mt-0.5">{apiError}</p>
          </div>
          <button onClick={() => setApiError('')} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Results dashboard ────────────────────────────────────────── */}
      {analysis && !isLoading && (
        <div ref={resultsRef} className="space-y-6 animate-fade-in">

          {/* Results action bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-xl shadow-indigo-200">
            <div>
              <p className="text-white font-bold text-lg">Analysis Complete 🎉</p>
              <p className="text-indigo-200 text-sm mt-0.5">
                Your resume scored <strong className="text-white">{analysis.matchScore}%</strong> for this role.
              </p>
            </div>
            <div className="flex gap-3">
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

          {/* Section nav tabs (cosmetic, for visual polish) */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['Score', 'Skills', 'Strengths', 'ATS Keywords', 'Interview Prep', 'Roadmap'].map((tab) => (
              <span
                key={tab}
                className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm"
              >
                {tab}
              </span>
            ))}
          </div>

          {/* 1. Match Score */}
          <MatchScoreCard score={analysis.matchScore} />

          {/* 2. Skills */}
          <SkillsSection
            matchedSkills={analysis.matchedSkills}
            missingSkills={analysis.missingSkills}
          />

          {/* 3. Strengths + Improvements + ATS */}
          <SuggestionsSection
            strengths={analysis.strengths}
            improvements={analysis.improvements}
            atsKeywords={analysis.atsKeywords}
          />

          {/* 4. Interview Questions */}
          <InterviewQuestions questions={analysis.interviewQuestions} />

          {/* 5. Learning Roadmap */}
          <RoadmapSection roadmap={analysis.learningRoadmap} />

          {/* Bottom export CTA */}
          <div className="flex justify-center pt-4 pb-8">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 active:scale-100 transition-all duration-200"
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
