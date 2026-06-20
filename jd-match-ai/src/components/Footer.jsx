/**
 * Footer.jsx
 * Site footer — attribution, Digital Heroes CTA, dark-mode aware.
 */

import { Heart, ExternalLink } from 'lucide-react';

export default function Footer({ darkMode }) {
  return (
    <footer className={`mt-20 border-t ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Attribution */}
          <div className="text-center md:text-left space-y-1">
            <p className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Full Name: <span className="text-indigo-500 font-bold">Varsha</span>
            </p>
            <p className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Email:{' '}
              <a
                href="mailto:varshajnv2004@gmail.com"
                className="text-indigo-500 hover:underline font-bold"
              >
                varshajnv2004@gmail.com
              </a>
            </p>
          </div>

          {/* CTA Button */}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all duration-200"
          >
            <span>Built for Digital Heroes</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom row */}
        <div className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            © {new Date().getFullYear()} JD Match AI. All rights reserved.
          </p>
          <p className={`text-xs flex items-center gap-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Made with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> for job seekers everywhere
          </p>
        </div>

      </div>
    </footer>
  );
}
