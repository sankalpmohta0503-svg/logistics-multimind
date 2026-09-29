import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Radar, Menu, X, Instagram, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import './Header2.css';

const NAV_LINKS = [
  { label: 'Control Hub', href: '/command-center' },
  { label: 'Shipments', href: '/shipments' },
  { label: 'Fleet', href: '/fleet' },
  { label: 'Warehouse', href: '/warehouses' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'AI Optimization', href: '/optimization' },
];

function Header2() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm transition-colors">
      {/* Status / trust strip */}
      <div className="hidden md:flex items-center justify-between text-slate-500 text-xs px-8 py-1.5 bg-slate-50/90 border-b border-slate-200/60 font-medium">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-slate-700">All systems operational</span> &mdash; Real-time supply chain telemetry active
        </span>
        <div className="flex items-center gap-4">
          <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-blue-600 transition-colors"><Instagram size={14} /></a>
          <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook size={14} /></a>
          <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-blue-600 transition-colors"><Twitter size={14} /></a>
          <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-blue-600 transition-colors"><Linkedin size={14} /></a>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Radar size={18} strokeWidth={2.5} />
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              SC-LogiX
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/70">AI</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            to="/signin"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-full px-5 py-2 shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            Get started
            <ArrowRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3 shadow-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block text-sm font-medium text-slate-700 hover:text-blue-600 py-1.5 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <Link
              to="/signin"
              className="flex-1 text-center text-sm font-semibold text-slate-700 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="flex-1 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full py-2 shadow-md shadow-blue-500/20 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header2;
