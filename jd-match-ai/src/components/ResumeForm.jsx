/**
 * ResumeForm.jsx
 * Dual-input form for resume + job description.
 * Resume supports both manual paste AND file upload (.txt / .pdf).
 * PDF text is extracted client-side via pdf.js (CDN) without an extra dependency.
 */

import { useState, useRef } from 'react';
import { FileText, Briefcase, Zap, AlertCircle, X, Upload, FileUp } from 'lucide-react';

/* ── PDF text extraction via pdf.js (loaded from CDN) ───────────────────── */
async function extractTextFromPDF(file) {
  // Dynamically load pdf.js from CDN the first time it's needed
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(' ') + '\n';
  }
  return fullText.trim();
}

/* ── File upload button ─────────────────────────────────────────────────── */
function UploadButton({ onText, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const allowed = ['text/plain', 'application/pdf'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!allowed.includes(file.type) && !['txt', 'pdf'].includes(ext)) {
      setUploadError('Only .txt and .pdf files are supported.');
      return;
    }

    setUploading(true);
    try {
      let text = '';
      if (file.type === 'application/pdf' || ext === 'pdf') {
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      if (!text.trim()) {
        setUploadError('Could not extract text from this file. Try copy-pasting instead.');
        return;
      }
      onText(text.trim());
    } catch {
      setUploadError('Failed to read file. Please try copy-pasting your resume.');
    } finally {
      setUploading(false);
      // Reset so the same file can be re-uploaded if needed
      e.target.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.pdf,text/plain,application/pdf"
        className="hidden"
        onChange={handleFile}
        disabled={disabled || uploading}
      />
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Reading file...
          </>
        ) : (
          <>
            <FileUp className="w-3.5 h-3.5" />
            Upload Resume (.pdf / .txt)
          </>
        )}
      </button>
      {uploadError && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {uploadError}
        </p>
      )}
    </div>
  );
}

/* ── Main form component ─────────────────────────────────────────────────── */
export default function ResumeForm({ onAnalyze, isLoading, darkMode }) {
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [error, setError] = useState('');

  const ta = `w-full px-4 py-3 rounded-xl border text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-y leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 hover:border-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'}`;

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!resume.trim()) {
      setError('Please paste or upload your resume before analyzing.');
      return;
    }
    if (!jobDesc.trim()) {
      setError('Please paste the job description before analyzing.');
      return;
    }
    if (resume.trim().length < 50) {
      setError('Resume seems too short. Please paste the full text.');
      return;
    }
    if (jobDesc.trim().length < 50) {
      setError('Job description seems too short. Please paste the full text.');
      return;
    }

    onAnalyze(resume.trim(), jobDesc.trim());
  }

  const charCount = (str) =>
    str.length > 0 ? (
      <span className="text-xs text-slate-400">{str.length} chars</span>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-medium flex-1">{error}</span>
          <button type="button" onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Resume input ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          {/* Label row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              Your Resume
            </label>
            <div className="flex items-center gap-3">
              {charCount(resume)}
              {/* Clear button */}
              {resume && (
                <button
                  type="button"
                  onClick={() => setResume('')}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Upload button */}
          <UploadButton onText={setResume} disabled={isLoading} />

          {/* Divider */}
          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or paste below</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Textarea */}
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume here...&#10;&#10;Include your skills, experience, education, and any relevant achievements."
            rows={14}
            disabled={isLoading}
            className={ta}
          />

          {/* File type hint */}
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Upload className="w-3 h-3" />
            Supports PDF and .txt file upload
          </p>
        </div>

        {/* ── Job Description input ─────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5 text-violet-600" />
              </div>
              Job Description
            </label>
            <div className="flex items-center gap-3">
              {charCount(jobDesc)}
              {jobDesc && (
                <button
                  type="button"
                  onClick={() => setJobDesc('')}
                  className="text-xs text-slate-400 hover:text-slate-600 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Spacer to align textareas */}
          <div className="h-[34px]" />
          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">paste below</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste job description here...&#10;&#10;Include the role requirements, responsibilities, and required skills."
            rows={14}
            disabled={isLoading}
            className={ta}
          />

          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            Copy directly from LinkedIn, Indeed, or any job board
          </p>
        </div>
      </div>

      {/* Analyze CTA */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-base shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analyzing Resume...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Analyze My Resume
            </>
          )}
        </button>
      </div>

    </form>
  );
}
