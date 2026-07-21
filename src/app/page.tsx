'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Info, 
  Sparkles, 
  Clock, 
  Award, 
  Library, 
  Search,
  Check
} from 'lucide-react';

import { Category, AgeGroup, Book } from './types';
import { BOOKS } from './data';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BookCard from '../components/BookCard';
import BookDetail from '../components/BookDetail';
import ContactSection from '../components/ContactSection';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('mndalan');
  const [activeAgeGroup, setActiveAgeGroup] = useState<AgeGroup>('6');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const [isSavedView, setIsSavedView] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>(BOOKS);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch live books from database
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (err) {
        console.error('Failed to load books from server:', err);
      }
    };
    fetchBooks();
  }, []);

  // Load saved book IDs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('saved_books');
    if (saved) {
      try {
        setSavedBookIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save book handler
  const handleToggleSave = (book: Book) => {
    let updated: string[];
    if (savedBookIds.includes(book.id)) {
      updated = savedBookIds.filter(id => id !== book.id);
    } else {
      updated = [...savedBookIds, book.id];
    }
    setSavedBookIds(updated);
    localStorage.setItem('saved_books', JSON.stringify(updated));
  };

  // Filter books based on category, age group (for children), and search query
  const getFilteredBooks = () => {
    let result = books;

    // Filter by saved view
    if (isSavedView) {
      return result.filter(book => savedBookIds.includes(book.id))
        .filter(book => 
          book.title.includes(searchQuery) || 
          book.author.includes(searchQuery) ||
          book.synopsis.includes(searchQuery)
        );
    }

    // Filter by main category
    result = result.filter(book => book.category === activeCategory);

    // Filter by age group if category is children (mndalan)
    if (activeCategory === 'mndalan') {
      result = result.filter(book => book.ageGroup === activeAgeGroup);
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(book => 
        book.title.includes(searchQuery) || 
        book.author.includes(searchQuery) ||
        book.synopsis.includes(searchQuery)
      );
    }

    return result;
  };

  const filteredBooks = getFilteredBooks();
  
  // Recommend top picks (first 4 elements of filtered list)
  const recommendedBooks = filteredBooks.slice(0, 4);
  // Grid showcase (remaining books or all if count is small)
  const gridBooks = filteredBooks.slice(isSavedView ? 0 : 2); 

  // Handle sidebar category clicks
  const handleCategoryChange = (category: Category) => {
    setIsSavedView(false);
    setActiveCategory(category);
    // Reset search when shifting categories to clear filters
    setSearchQuery('');
    
    // Smooth scroll back to catalog display
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle navbar link clicks
  const handleNavClick = (section: string) => {
    if (section === 'home') {
      setIsSavedView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'catalog') {
      setIsSavedView(false);
      const catalogElement = document.getElementById('catalog-section');
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (section === 'about') {
      const aboutElement = document.getElementById('about-section');
      if (aboutElement) {
        aboutElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (section === 'contact') {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (section === 'saved') {
      setIsSavedView(true);
      const catalogElement = document.getElementById('catalog-section');
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Scroll carousel helper (cinematic Netflix scroll)
  const scrollCarousel = (direction: 'right' | 'left') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Categories helper translation for banner title
  const getCategoryTitle = () => {
    if (isSavedView) return 'کتێبە پاشەکەوتکراوەکانت';
    switch (activeCategory) {
      case 'mndalan':
        return 'ئەرشیفی منداڵان';
      case 'roman':
        return 'ڕۆمان و ئەدەبیات';
      case 'mejuy':
        return 'مێژووی کوردستان و جیهان';
      case 'adults':
        return 'سەروو ١٨ ساڵ (فیکر و فەلسەفە)';
      case 'ayini':
        return 'ئایین و عیرفان';
      default:
        return '';
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Glowing Ambient Orbs (Aurora Effect) */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full animate-float-slow pointer-events-none z-0" />
      <div className="absolute top-[40%] left-10 w-[400px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full animate-float-medium pointer-events-none z-0" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-indigo-500/5 blur-[130px] rounded-full animate-float-fast pointer-events-none z-0" />

      {/* Sticky Top Navbar */}
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavClick={handleNavClick}
        savedBooksCount={savedBookIds.length}
      />

      {/* Fixed Right Sidebar (Only visible on large screen) */}
      <div className="hidden md:block">
        <Sidebar 
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Main Content Area (Margined to make space for the right sidebar in RTL) */}
      <main className="flex-grow md:pr-64 pt-6 pb-20 relative z-10 w-full px-6 md:px-12">
        
        {/* Banner Section (Reference: Hero Banner on image_4034ea.jpg) */}
        {!isSavedView && activeCategory === 'mndalan' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full glass-panel border border-white/10 rounded-3xl p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl"
          >
            {/* Glowing background highlights inside banner */}
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Left text */}
            <div className="md:w-3/5 space-y-4 text-right md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                شاکارە زانستی و چیرۆکییەکان
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-cyan-400 leading-tight">
                بەخێربێیت بۆ بەشی منداڵان
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed max-w-xl">
                لێرەدا جوانترین چیرۆک و بەنرخترین کتێبە فێرکارییەکانمان بۆ منداڵە نازدارەکانتان ئەرشیف کردووە. تەمەنی منداڵەکەت هەڵبژێرە بۆ بینینی پڕخوێنەرترین پەڕتووکەکانیان.
              </p>
            </div>

            {/* Right: Book Stack Graphic (SVG representation) */}
            <div className="md:w-2/5 flex justify-center relative min-h-[180px] w-full">
              <svg viewBox="0 0 350 250" className="w-full max-w-[280px] h-auto drop-shadow-[0_15px_25px_rgba(6,182,212,0.25)]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Spotlight background */}
                <ellipse cx="175" cy="210" rx="90" ry="12" fill="rgba(6, 182, 212, 0.15)" filter="blur(4px)" />
                
                {/* Book 1 (Bottom - Indigo/Purple) */}
                <g className="animate-float-slow">
                  <path d="M50 170 L175 145 L300 170 L175 195 Z" fill="url(#purpleBookCover)" />
                  <path d="M50 170 L50 185 L175 210 L175 195 Z" fill="#4338CA" />
                  <path d="M175 195 L175 210 L300 185 L300 170 Z" fill="#312E81" />
                  {/* Pages side */}
                  <path d="M175 195 L175 208 L295 183 L295 171 Z" fill="#E2E8F0" />
                </g>

                {/* Book 2 (Middle - Emerald/Teal) */}
                <g className="animate-float-medium">
                  <path d="M70 120 L175 98 L280 120 L175 142 Z" fill="url(#tealBookCover)" />
                  <path d="M70 120 L70 135 L175 157 L175 142 Z" fill="#047857" />
                  <path d="M175 142 L175 157 L280 135 L280 120 Z" fill="#064E3B" />
                  {/* Pages */}
                  <path d="M175 142 L175 154 L275 133 L275 121 Z" fill="#E2E8F0" />
                </g>

                {/* Book 3 (Top - Cyan/Gold) */}
                <g className="animate-float-fast">
                  <path d="M90 70 L175 52 L260 70 L175 88 Z" fill="url(#cyanBookCover)" />
                  <path d="M90 70 L90 85 L175 103 L175 88 Z" fill="#0891B2" />
                  <path d="M175 88 L175 103 L260 85 L260 70 Z" fill="#155E75" />
                  {/* Pages */}
                  <path d="M175 88 L175 100 L255 83 L255 71 Z" fill="#F8FAFC" />
                  {/* Bookmark ribbon */}
                  <path d="M165 60 L180 57 L190 115 L175 110 L160 115 Z" fill="#F59E0B" />
                </g>

                {/* Sparkle effects */}
                <circle cx="95" cy="50" r="3" fill="#06B6D4" className="animate-ping" />
                <circle cx="255" cy="40" r="2" fill="#2DD4BF" />
                <circle cx="175" cy="20" r="4" fill="#F59E0B" className="animate-pulse" />

                <defs>
                  <linearGradient id="purpleBookCover" x1="50" y1="170" x2="300" y2="195" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366F1" />
                    <stop offset="1" stopColor="#4F46E5" />
                  </linearGradient>
                  <linearGradient id="tealBookCover" x1="70" y1="120" x2="280" y2="142" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" />
                    <stop offset="1" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="cyanBookCover" x1="90" y1="70" x2="260" y2="88" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06B6D4" />
                    <stop offset="1" stopColor="#0891B2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        )}

        {/* Hero banner for OTHER categories for UI visual excellence */}
        {!isSavedView && activeCategory !== 'mndalan' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full glass-panel border border-white/10 rounded-3xl p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl"
          >
            {/* Glowing background highlights inside banner */}
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Left text */}
            <div className="md:w-3/5 space-y-4 text-right md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                سەرچاوەی باوەڕپێکراو و دێرین
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-cyan-400 leading-tight">
                {getCategoryTitle()}
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed max-w-xl">
                بڕوانە باشترین کتێبە ئەرشیفکراوەکانی ئەم بەشە. شیکاری زانستی، دیزاینی بەرگی ناوازە، و زانیاری تەکنیکی دەربارەی هەر یەکێکیان بخوێنەرەوە.
              </p>
            </div>

            {/* Right: Graphic badge */}
            <div className="md:w-2/5 flex justify-center relative w-full">
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-teal-400/20 border border-cyan-500/30 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl blur-xl group-hover:scale-110 transition-transform duration-500" />
                <Library className="w-20 h-20 text-cyan-400 stroke-[1.2] relative z-10" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Saved Books Banner */}
        {isSavedView && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full glass-panel border border-white/10 rounded-3xl p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl"
          >
            <div className="md:w-3/5 space-y-4 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                <Library className="w-3.5 h-3.5" />
                ئەرشیفی شەخسی تۆ
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-cyan-400 leading-tight">
                {getCategoryTitle()}
              </h1>
              <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed max-w-xl">
                هەموو ئەو کتێبانەی نیشانت کردوون بۆ ئەوەی دواتر بیاندۆزیتەوە لێرەدا کۆکراونەتەوە. دەتوانی کۆدی شوێنەکەیان لە ئەرشیف بەکاربهێنیت.
              </p>
            </div>
            <div className="md:w-2/5 flex justify-center relative w-full">
              <div className="w-40 h-40 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center relative">
                <span className="text-4xl font-extrabold text-cyan-400 font-mono">{savedBookIds.length}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section divider and search details */}
        <div id="catalog-section" className="scroll-mt-24 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-3">
              <span className="w-2.5 h-6 rounded bg-cyan-500" />
              {isSavedView ? 'کتێبخانەی پاشەکەوت' : activeCategory === 'mndalan' ? 'کتێبەکانی منداڵان' : 'کەتەلۆگی بەشەکە'}
            </h2>
            {searchQuery && (
              <p className="text-slate-400 text-xs mt-2">
                ئەنجامەکانی گەڕان بۆ: <span className="text-cyan-400">"{searchQuery}"</span> ({filteredBooks.length} کتێب دۆزرایەوە)
              </p>
            )}
          </div>

          {/* Children Age Tabs System (Reference: pill-shaped outline buttons for age groups) */}
          {!isSavedView && activeCategory === 'mndalan' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-bold ml-2">تەمەن:</span>
              {(['4', '6', '8', '10', '12'] as AgeGroup[]).map((age) => (
                <button
                  key={age}
                  onClick={() => setActiveAgeGroup(age)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                    activeAgeGroup === age
                      ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5 shadow-md shadow-cyan-500/15'
                      : 'border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 bg-slate-900/30'
                  }`}
                >
                  {age} ساڵ
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty Catalog State */}
        {filteredBooks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full glass-panel border border-white/10 rounded-2xl p-16 text-center"
          >
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">هیچ کتێبێک نەدۆزرایەوە</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
              ببوورە، هیچ پەڕتووکێک هاوتا نەبوو لەگەڵ گەڕانەکەت یان هاوپۆلە هەڵبژێردراوەکەدا. تکایە وشەی تر تاقیکەرەوە.
            </p>
          </motion.div>
        )}

        {/* 1. CINEMATIC CAROUSEL (Recommended / Top Picks - Movie poster carousel layout) */}
        {filteredBooks.length > 0 && !searchQuery && (
          <div className="mb-14 relative group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-cyan-400 tracking-wider">
                کتێبە پێشنیارکراوەکان و دیارەکان (ئەرشیفی تایبەت)
              </h3>
              
              {/* Carousel control buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="p-1.5 rounded-lg border border-white/5 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" /> {/* In RTL, ChevronRight scrolls right/backwards, but let's align naturally */}
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="p-1.5 rounded-lg border border-white/5 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Carousel view */}
            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 relative w-full select-none"
            >
              {recommendedBooks.map((book) => (
                <div key={book.id} className="w-[280px] shrink-0">
                  <BookCard book={book} onViewDetails={setSelectedBook} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ALL BOOKS GRID SHOWCASE (Remaining books in category) */}
        {filteredBooks.length > 0 && (
          <div>
            {/* Grid Header */}
            {!searchQuery && (
              <h3 className="text-sm font-bold text-slate-400 mb-6">
                {isSavedView ? 'گشت پاشەکەوتکراوەکان' : 'گشت پەڕتووکەکانی هاوپۆلەکە'}
              </h3>
            )}

            {/* Spacious Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Render all filter results if search is active, otherwise remaining gridBooks */}
              {(searchQuery ? filteredBooks : gridBooks).map((book) => (
                <BookCard key={book.id} book={book} onViewDetails={setSelectedBook} />
              ))}
            </div>
          </div>
        )}

        {/* ABOUT LIBRARY SECTION (دەربارەی ئەرشیف - glass card) */}
        <section id="about-section" className="mt-28 mb-16 max-w-6xl mx-auto">
          <div className="glass-panel border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 blur-[90px] rounded-full pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left text (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-6 text-right">
                <h2 className="text-2xl md:text-3xl font-extrabold text-cyan-400">
                  دەربارەی ئەرشیفی کتێبی کوردستان
                </h2>
                <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed">
                  ئەم پلاتفۆرمە پێشانگایەکی דיוێتالی ئەرشیفی گشتگیری کتێب و دەستنووسە کوردییەکانە. لێرەدا نیشانەکردنی نرخ و کڕین بەردەست نییە، بەڵکو ئامانجمان خزمەتکردنی توێژەران و خوێنەرانە بۆ دۆزینەوەی لۆکەیشن و ناسینی فیکری کتێب لە ئەرشیفی نیشتمانیدا.
                </p>
                <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed">
                  سەرجەم کتێبەکان بەشێوەی ڕاستەقینە لە ڕەفەی هۆڵەکانی ئەرشیفی سەنتەری گەرمیان بەردەستن و دەتوانی لە ڕێگەی کۆدی تایبەتی شوێنەوە (Location Code) بە ئاسانی کتێبەکان لە ناو سەنتەرەکەدا بدۆزیتەوە.
                </p>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">کتێبی دەگمەن</h4>
                      <p className="text-[10px] text-slate-500">بەردەستە لە ئەرشیف</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">گەڕانی خێرا</h4>
                      <p className="text-[10px] text-slate-500">بە سیستمی بارکۆد</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">ڕێبەری هۆڵەکان</h4>
                      <p className="text-[10px] text-slate-500">کۆدی تەواوی شوێن</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right decorative logo (lg:col-span-4) */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-48 h-48 rounded-full bg-slate-900/60 border border-white/10 flex items-center justify-center relative shadow-2xl">
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-2xl animate-pulse" />
                  <BookOpen className="w-24 h-24 text-cyan-400/80 stroke-[1.2]" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ULTRA-MODERN CONTACT SECTION */}
        <ContactSection />

      </main>

      {/* Book Detail Modal Overlay View */}
      <AnimatePresence>
        {selectedBook && (
          <BookDetail 
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            isSaved={savedBookIds.includes(selectedBook.id)}
            onToggleSave={handleToggleSave}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
