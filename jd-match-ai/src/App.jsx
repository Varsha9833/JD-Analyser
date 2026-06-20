/**
 * App.jsx
 * Root component — composes Header, Home page, and Footer.
 */

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home   from './pages/Home.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1">
        <Home />
      </div>
      <Footer />
    </div>
  );
}
