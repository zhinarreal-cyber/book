'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  Lock, 
  BookOpen, 
  Check, 
  Database, 
  User, 
  Key,
  FolderPlus,
  RefreshCw,
  Search,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';

import { Book, Category, AgeGroup } from '../types';
import { useTheme } from '../../components/ThemeProvider';


export default function AdminPage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Book CRUD state
  const [books, setBooks] = useState<Book[]>([]);
  const [tableSearch, setTableSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverUrl: '',
    category: 'roman' as Category,
    ageGroup: '6' as AgeGroup,
    synopsis: '',
    isbn: '',
    publisher: '',
    year: '',
    pages: 100,
    language: 'کوردی (سۆرانی)',
    locationCode: '',
  });

  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // 1. Check Session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session');
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          fetchBooks();
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  // 2. Fetch Books list
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchBooks();
      } else {
        setLoginError(data.error || 'پەیوەندی سەرکەوتوو نەبوو');
      }
    } catch (err) {
      console.error(err);
      setLoginError('کێشە لە پەیوەندی هەیە');
    }
  };

  // 4. Logout submit
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        setIsAuthenticated(false);
        setBooks([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Create / Update submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    setIsSubmitting(true);

    // Cover validation - default generic book cover if empty
    let finalCoverUrl = formData.coverUrl.trim();
    if (!finalCoverUrl) {
      finalCoverUrl = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop';
    }

    const payload: Partial<Book> = {
      title: formData.title,
      author: formData.author,
      coverUrl: finalCoverUrl,
      category: formData.category,
      synopsis: formData.synopsis,
      isbn: formData.isbn || 'N/A',
      publisher: formData.publisher || 'دەزگای چاپ و بڵاوکردنەوەی ڕۆشنبیری',
      year: formData.year || '٢٠٢٤',
      pages: Number(formData.pages) || 120,
      language: formData.language,
      locationCode: formData.locationCode || 'A-01-G',
    };

    // Include age group only if children's category is selected
    if (formData.category === 'mndalan') {
      payload.ageGroup = formData.ageGroup;
    }

    // Set custom book cover gradient colors based on category
    const coverColorsMap: Record<Category, string> = {
      mndalan: 'from-amber-400 to-orange-600',
      roman: 'from-blue-600 to-cyan-900',
      mejuy: 'from-yellow-600 to-amber-950',
      ayini: 'from-teal-600 to-emerald-950',
    };
    payload.coverColor = coverColorsMap[formData.category];

    try {
      let res;
      if (isEditing && editingId) {
        // Edit existing book
        res = await fetch(`/api/books/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Add new book
        res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (res.ok) {
        setFormFeedback({
          type: 'success',
          message: isEditing ? 'کتێبەکە بە سەرکەوتوویی هەموار کرایەوە' : 'کتێبێکی نوێ بە سەرکەوتوویی تۆمار کرا',
        });
        resetForm();
        fetchBooks();
      } else {
        setFormFeedback({
          type: 'error',
          message: data.error || 'کێشەیەک لە پاشەکەوتکردن دروست بوو',
        });
      }
    } catch (err) {
      console.error(err);
      setFormFeedback({
        type: 'error',
        message: 'سەرکەوتوو نەبوو لە پەیوەندی کردن بە سێرڤەرەوە',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Delete handler
  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`ئایا دڵنیایت لە سڕینەوەی ئەم کتێبە: "${title}"؟`)) return;

    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFormFeedback({ type: 'success', message: 'کتێبەکە بە سەرکەوتوویی سڕایەوە' });
        fetchBooks();
        if (editingId === id) resetForm();
      } else {
        alert('شکستی هێنا لە سڕینەوەی کتێبەکە');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Populate form for editing
  const startEditBook = (book: Book) => {
    setIsEditing(true);
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      category: book.category,
      ageGroup: book.ageGroup || '6',
      synopsis: book.synopsis,
      isbn: book.isbn,
      publisher: book.publisher,
      year: book.year,
      pages: book.pages,
      language: book.language,
      locationCode: book.locationCode,
    });
    // Scroll form into view smoothly
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      author: '',
      coverUrl: '',
      category: 'roman',
      ageGroup: '6',
      synopsis: '',
      isbn: '',
      publisher: '',
      year: '',
      pages: 100,
      language: 'کوردی (سۆرانی)',
      locationCode: '',
    });
  };

  // Helper translations for categories
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'mndalan': return 'منداڵان';
      case 'roman': return 'ڕۆمان';
      case 'mejuy': return 'مێژوویی';
      case 'ayini': return 'ئایینی';
      default: return category;
    }
  };

  // Statistics summaries
  const totalBooks = books.length;
  const countByCategory = (cat: Category) => books.filter(b => b.category === cat).length;

  // Filter local list for admin table
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
    book.author.toLowerCase().includes(tableSearch.toLowerCase()) ||
    book.locationCode.toLowerCase().includes(tableSearch.toLowerCase())
  );

  // Rendering loading state for login check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-sm font-semibold text-slate-400">پشکنینی دانیشتن...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN RENDER
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Floating Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            type="button"
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
        </div>

        {/* Glow orbs background */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md glass-panel border border-white/10 rounded-3xl p-8 relative shadow-2xl">
          {/* Logo Branding */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-3">
              <Lock className="w-6 h-6 text-slate-900 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-cyan-400">ئەرشیفی کتێب</h1>
            <p className="text-xs text-slate-400 mt-2 font-medium">پانێڵی چوونەژوورەوەی بەڕێوبەر</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                ناوی بەکارهێنەر <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ناوی بەکارهێنەر بنووسە..."
                className="w-full bg-slate-950/40 text-slate-200 text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:bg-slate-950/60 focus:outline-none transition-all duration-300 placeholder:text-slate-500"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                وشەی تێپەڕ <span className="text-cyan-400">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="وشەی تێپەڕ بنووسە..."
                className="w-full bg-slate-950/40 text-slate-200 text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:bg-slate-950/60 focus:outline-none transition-all duration-300 placeholder:text-slate-500"
              />
            </div>

            {/* Error prompt */}
            {loginError && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-lg">
                {loginError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 active:scale-98 cursor-pointer"
            >
              چوونە ژوورەوە
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD CMS
  return (
    <div className="min-h-screen relative overflow-hidden p-6 md:p-10">
      
      {/* Background glow animations */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Panel */}
      <header className="w-full glass-panel border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center">
            <Database className="w-5 h-5 text-slate-900 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-100">پانێڵی بەڕێوبەری ئەرشیف (CMS)</h1>
            <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">بەڕێوەبردنی کەتەلۆگ و ڕەفەی کتێبەکان</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Icon */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-white/5 bg-slate-900/30 hover:border-cyan-500/30 hover:bg-slate-900/50 hover:text-cyan-400 text-slate-300 transition-all duration-300 group cursor-pointer"
            title={mounted && resolvedTheme === 'dark' ? 'دۆخی ڕووناک' : 'دۆخی تاریک'}
          >
            {mounted && resolvedTheme === 'light' ? (
              <Moon className="w-4 h-4 group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <Sun className="w-4 h-4 group-hover:scale-105 transition-transform duration-300" />
            )}
          </button>

          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 bg-slate-900/40 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm backdrop-blur-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>بینینی وێبسایت</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 px-4 py-2 rounded-xl transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>چوونە دەرەوە</span>
          </button>
        </div>
      </header>

      {/* Stats Counter Row */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 relative z-10">
        {/* Total */}
        <div className="glass-panel border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-xs text-slate-500 font-semibold">سەرجەم کتێبەکان</span>
          <span className="text-2xl font-black text-cyan-400 mt-2 font-mono">{totalBooks}</span>
        </div>
        {/* Category Mndalan */}
        <div className="glass-panel border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-xs text-slate-500 font-semibold">منداڵان</span>
          <span className="text-2xl font-bold text-slate-200 mt-2 font-mono">{countByCategory('mndalan')}</span>
        </div>
        {/* Category Roman */}
        <div className="glass-panel border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-xs text-slate-500 font-semibold">ڕۆمان</span>
          <span className="text-2xl font-bold text-slate-200 mt-2 font-mono">{countByCategory('roman')}</span>
        </div>
        {/* Category Mejuy */}
        <div className="glass-panel border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-xs text-slate-500 font-semibold">مێژوویی</span>
          <span className="text-2xl font-bold text-slate-200 mt-2 font-mono">{countByCategory('mejuy')}</span>
        </div>
        {/* Category Ayini */}
        <div className="glass-panel border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-xs text-slate-500 font-semibold">ئایینی</span>
          <span className="text-2xl font-bold text-slate-200 mt-2 font-mono">{countByCategory('ayini')}</span>
        </div>
      </section>

      {/* Main Grid: Form Left, Table Right in RTL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Form Container (lg:col-span-5) */}
        <section className="lg:col-span-5">
          <div className="glass-panel border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-lg font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <FolderPlus className="w-5 h-5" />
              {isEditing ? 'هەموارکردنی کتێب' : 'تۆمارکردنی کتێبی نوێ'}
            </h2>

            {formFeedback && (
              <div className={`text-xs px-4 py-3 rounded-xl border mb-6 ${
                formFeedback.type === 'success' 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              }`}>
                {formFeedback.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Split row: Title & Author */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">ناونیشان *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="ناونیشانی کتێب..."
                    className="w-full bg-slate-950/40 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">نووسەر *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="ناوی نووسەر..."
                    className="w-full bg-slate-950/40 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Cover URL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">بەستەری وێنەی بەرگ (Unsplash یان URL)</label>
                <input
                  type="text"
                  value={formData.coverUrl}
                  onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... (بەتاڵ بێت پێشنیار دادەنرێت)"
                  className="w-full bg-slate-950/40 text-slate-200 text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none transition-all duration-300"
                />
              </div>

              {/* Grid: Category & Age Group (Conditionally rendered) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">هاوپۆل *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full bg-slate-950/80 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none transition-all duration-300"
                  >
                    <option value="roman">ڕۆمان</option>
                    <option value="mejuy">مێژوویی</option>
                    <option value="ayini">ئایینی</option>
                    <option value="mndalan">منداڵان</option>
                  </select>
                </div>

                {formData.category === 'mndalan' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">تەمەنی منداڵ *</label>
                    <select
                      value={formData.ageGroup}
                      onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as AgeGroup })}
                      className="w-full bg-slate-950/80 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none"
                    >
                      <option value="4">٤ ساڵ</option>
                      <option value="6">٦ ساڵ</option>
                      <option value="8">٨ ساڵ</option>
                      <option value="10">١٠ ساڵ</option>
                      <option value="12">١٢ ساڵ</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">پوختە / کورتە</label>
                <textarea
                  rows={3}
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  placeholder="کورتەیەک دەربارەی کتێبەکە بنووسە..."
                  className="w-full bg-slate-950/40 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none transition-all duration-300 resize-none"
                />
              </div>

              {/* Spec grid 1: ISBN & LocationCode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-0-1234-..."
                    className="w-full bg-slate-950/40 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">کۆدی شوێن (رەفە) *</label>
                  <input
                    type="text"
                    required
                    value={formData.locationCode}
                    onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })}
                    placeholder="A-12-R"
                    className="w-full bg-slate-950/40 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Spec grid 2: Publisher & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">وەشانخانە</label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    placeholder="دەزگای غەزەلنووس..."
                    className="w-full bg-slate-950/40 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">ساڵ</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="٢٠٢٤"
                      className="w-full bg-slate-950/40 text-slate-200 text-sm px-2 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">لاپەڕە</label>
                    <input
                      type="number"
                      value={formData.pages}
                      onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) })}
                      className="w-full bg-slate-950/40 text-slate-200 text-sm px-2 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60"
                    />
                  </div>
                </div>
              </div>

              {/* Spec grid 3: Language */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">زمانی کتێب</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="کوردی (سۆرانی)"
                  className="w-full bg-slate-950/40 text-slate-200 text-sm px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60"
                />
              </div>

              {/* Form buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-grow py-3 px-4 rounded-xl text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>{isSubmitting ? 'پاشەکەوت دەکرێت...' : isEditing ? 'هەموارکردن و پاشەکەوت' : 'تۆمارکردنی کتێب'}</span>
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-3 px-5 rounded-xl text-sm font-bold bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    پاشگەزبوونەوە
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Books Table list (lg:col-span-7) */}
        <section className="lg:col-span-7">
          <div className="glass-panel border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                کتێبە تۆمارکراوەکان
              </h2>

              {/* Live search table */}
              <div className="relative w-full max-w-xs group">
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="گەڕان بەپێی ناونیشان یان ڕەفە..."
                  className="w-full bg-slate-950/40 text-slate-200 text-xs pl-4 pr-9 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:outline-none transition-all duration-300 placeholder:text-slate-500"
                />
                <Search className="absolute right-3 top-3 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400" />
              </div>
            </div>

            {/* List container */}
            <div className="flex-grow overflow-x-auto custom-scrollbar border border-white/5 rounded-2xl min-h-[400px]">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center p-20">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="w-full text-center p-20 text-slate-500">
                  هیچ کتێبێک نەدۆزرایەوە لە تۆمارەکاندا.
                </div>
              ) : (
                <table className="w-full border-collapse text-right text-sm">
                  <thead>
                    <tr className="border-b border-white/15 bg-slate-950/60 text-slate-400 text-xs font-semibold">
                      <th className="p-4">بەرگ</th>
                      <th className="p-4">ناونیشان / نووسەر</th>
                      <th className="p-4">هاوپۆل</th>
                      <th className="p-4">شوێن (ڕەفە)</th>
                      <th className="p-4 text-left">کردارەکان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-white/[0.02] transition-colors duration-200">
                        {/* Thumbnail Cover */}
                        <td className="p-4">
                          <div className="relative w-10 h-14 rounded-lg overflow-hidden border border-white/10 bg-slate-900 shadow-md">
                            {book.coverUrl && (
                              <Image
                                src={book.coverUrl}
                                alt={book.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            )}
                          </div>
                        </td>

                        {/* Title and author */}
                        <td className="p-4">
                          <div className="font-bold text-slate-100 line-clamp-1">{book.title}</div>
                          <div className="text-xs text-slate-400 mt-1">{book.author}</div>
                        </td>

                        {/* Category */}
                        <td className="p-4">
                          <span className="text-xs px-2.5 py-1 rounded-lg border border-white/5 bg-slate-900/60 text-slate-300">
                            {getCategoryLabel(book.category)}
                            {book.category === 'mndalan' && book.ageGroup && ` (${book.ageGroup} ساڵ)`}
                          </span>
                        </td>

                        {/* Location Shelf code */}
                        <td className="p-4 font-mono text-cyan-400 font-semibold">{book.locationCode}</td>

                        {/* Action buttons */}
                        <td className="p-4 text-left">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => startEditBook(book)}
                              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/20 bg-slate-900/30 transition-all duration-300"
                              title="دەستکاریکردن"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id, book.title)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 bg-slate-900/30 transition-all duration-300"
                              title="سڕینەوە"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
