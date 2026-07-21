'use client';

import React, { useState, useEffect } from 'react';
import { Search, User, Library, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavClick: (section: string) => void;
  savedBooksCount: number;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  onNavClick,
  savedBooksCount,
}: NavbarProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-md px-8 py-4 flex items-center justify-between">
      {/* Right Side: Logo and Navigation Links */}
      <div className="flex items-center gap-10">
        <a 
          href="#" 
          onClick={() => onNavClick('home')} 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-5 h-5 text-slate-900 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-wide bg-gradient-to-l from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
            ئەرشیفی کتێب
          </span>
        </a>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => onNavClick('home')}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 hover:shadow-cyan-400/20 transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-300"
          >
            سەرەکی
          </button>
          <button 
            onClick={() => onNavClick('catalog')}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 hover:shadow-cyan-400/20 transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-300"
          >
            کەتەلۆگ
          </button>
          <button 
            onClick={() => onNavClick('about')}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 hover:shadow-cyan-400/20 transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-300"
          >
            دەربارە
          </button>
          <button 
            onClick={() => onNavClick('contact')}
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 hover:shadow-cyan-400/20 transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all after:duration-300"
          >
            پەیوەندی
          </button>
        </div>
      </div>

      {/* Left Side: Search Bar and Icons */}
      <div className="flex items-center gap-6 w-full max-w-md justify-end">
        {/* Search Bar */}
        <div className="relative w-full max-w-xs group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="گەڕان بەدوای ناونیشان یان نووسەر..."
            className="w-full bg-slate-950/40 text-slate-200 text-sm pl-4 pr-10 py-2 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:bg-slate-950/70 focus:outline-none transition-all duration-300 placeholder:text-slate-500 shadow-inner"
          />
          <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
        </div>

        {/* Saved Books Count Icon */}
        <button 
          onClick={() => onNavClick('saved')}
          className="relative p-2.5 rounded-xl border border-white/5 bg-slate-900/30 hover:border-cyan-500/30 hover:bg-slate-900/50 hover:text-cyan-400 text-slate-300 transition-all duration-300 group"
          title="کتێبە پاشەکەوتکراوەکان"
        >
          <Library className="w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
          {savedBooksCount > 0 && (
            <span className="absolute -top-1.5 -left-1.5 min-w-5 h-5 px-1 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse border border-slate-950 shadow-md">
              {savedBooksCount}
            </span>
          )}
        </button>

        {/* Theme Toggle Icon */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-white/5 bg-slate-900/30 hover:border-cyan-500/30 hover:bg-slate-900/50 hover:text-cyan-400 text-slate-300 transition-all duration-300 group cursor-pointer"
          title={mounted && resolvedTheme === 'dark' ? 'دۆخی ڕووناک' : 'دۆخی تاریک'}
        >
          {mounted && resolvedTheme === 'light' ? (
            <Moon className="w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <Sun className="w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
          )}
        </button>

        {/* User Icon */}
        <button 
          className="p-2.5 rounded-xl border border-white/5 bg-slate-900/30 hover:border-cyan-500/30 hover:bg-slate-900/50 hover:text-cyan-400 text-slate-300 transition-all duration-300 group"
          title="پڕۆفایل"
        >
          <User className="w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
        </button>
      </div>
    </nav>
  );
}
