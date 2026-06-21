/**
 * App.jsx
 * Root component — manages dark mode state, composes Header/Home/Footer.
 */

import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home   from './pages/Home.jsx';

export default function App() {
  // Persist dark mode preference in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('jdMatchAI_darkMode') === 'true';
    } catch { return false; }
  });

  useEffect(() => {
    // Apply/remove 'dark' class on <html> for Tailwind dark variant
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('jdMatchAI_darkMode', darkMode);
  }, [darkMode]);

  function toggleDark() {
    setDarkMode((prev) => !prev);
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Header darkMode={darkMode} onToggleDark={toggleDark} />
      <div className="flex-1">
        <Home darkMode={darkMode} />
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}

