'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Share2, Check, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { Book } from '../app/types';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (book: Book) => void;
}

export default function BookDetail({
  book,
  onClose,
  isSaved,
  onToggleSave,
}: BookDetailProps) {
  const [copied, setCopied] = useState(false);

  // Helper to translate category keys to Kurdish
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'mndalan':
        return 'کتێبی منداڵان';
      case 'roman':
        return 'ڕۆمان';
      case 'mejuy':
        return 'مێژوویی';
      case 'ayini':
        return 'ئایینی';
      default:
        return category;
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/book/${book.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl flex justify-center items-center p-4 md:p-8"
    >
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-6xl glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-10 flex flex-col">
        {/* Back / Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all duration-300 group z-10"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span className="text-xs font-semibold">گەڕانەوە</span>
        </button>

        {/* Main Grid Layout (Visual Right: Book 3D, Visual Left: details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8 lg:mt-4 items-stretch">
          
          {/* Right Column: 3D pedestal, Spotlight, Cover, Location (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between py-6 relative min-h-[480px]">
            {/* Spotlight cone */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-96 bg-gradient-to-b from-cyan-500/20 via-cyan-500/5 to-transparent clip-path-spotlight pointer-events-none blur-sm" />

            <div className="flex-grow flex items-center justify-center relative w-full">
              {/* 3D Container with custom rotations */}
              <div 
                className="relative w-56 h-[340px] shadow-2xl transition-all duration-500 group-hover:scale-105 z-10"
                style={{
                  perspective: '1200px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Book spine simulated side */}
                <div 
                  className="absolute top-0 right-0 h-full w-[16px] bg-slate-800 border-l border-t border-b border-white/10 origin-right"
                  style={{
                    transform: 'rotateY(90deg) translateZ(8px)',
                    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(0,0,0,0.2))'
                  }}
                />

                {/* Main 3D Cover */}
                <div 
                  className="w-full h-full rounded-l-lg overflow-hidden border border-white/20 shadow-2xl relative"
                  style={{
                    transform: 'rotateY(-20deg) rotateX(8deg) rotateZ(-3deg)',
                    transformOrigin: 'right center',
                    boxShadow: '-15px 15px 30px rgba(0,0,0,0.6), inset 2px 0 10px rgba(255,255,255,0.1)'
                  }}
                >
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-500 gap-3">
                      <BookOpen className="w-16 h-16" />
                    </div>
                  )}
                  {/* Subtle glossy overlay on the 3D cover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Glowing Stand / Pedestal */}
            <div className="w-64 h-5 bg-cyan-900/20 border border-cyan-500/20 rounded-full blur-[2px] shadow-[0_12px_24px_rgba(6,182,212,0.3)] relative mt-2 mb-8" />

            {/* Status box: Dark card, cyan checkmark */}
            <div className="w-full max-w-sm glass-panel border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between shadow-xl mt-auto z-10 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">ئامادەیی بۆ بینین</h4>
                  <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">{book.status}</p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-500 uppercase block">کۆدی شوێن</span>
                <span className="text-md font-bold text-slate-200 font-mono tracking-wider">{book.locationCode}</span>
              </div>
            </div>

          </div>

          {/* Left Column: Title, Author, description, Action buttons, Spec Table (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            
            {/* Top Info section */}
            <div>
              {/* Category Pill */}
              <div className="inline-block px-3 py-1 text-xs font-semibold text-cyan-400 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
                {getCategoryLabel(book.category)}
              </div>

              {/* Title & Author */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400 leading-snug tracking-wide">
                {book.title}
              </h1>
              <p className="text-slate-300 font-medium mt-3 text-lg">
                نووسینی: <span className="text-white font-bold">{book.author}</span>
              </p>

              {/* Synopsis / Description */}
              <div className="mt-6 border-t border-white/5 pt-6">
                <h3 className="text-sm font-bold text-slate-400 mb-3">کورتەی کتێب:</h3>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base font-light text-justify bg-slate-900/20 p-4 rounded-xl border border-white/5">
                  {book.synopsis}
                </p>
              </div>
            </div>

            {/* Actions & Specs Table */}
            <div className="mt-8 space-y-6">
              
              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Save (پاشەکەوتکردن) */}
                <button
                  onClick={() => onToggleSave(book)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isSaved
                      ? 'bg-cyan-500 text-slate-950 border border-cyan-400 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-transparent text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
                  <span>{isSaved ? 'پاشەکەوت کراوە' : 'پاشەکەوتکردن'}</span>
                </button>

                {/* Share (هاوبەشکردن) */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>{copied ? 'لیۆنکەکە کۆپی کرا!' : 'هاوبەشکردن'}</span>
                </button>
              </div>

              {/* Specs Table (زانیاری تەکنیکی) */}
              <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/40">
                <div className="bg-slate-900/40 px-5 py-3 border-b border-white/5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    زانیاری تەکنیکی
                  </h3>
                </div>
                <div className="divide-y divide-white/5 text-sm">
                  <div className="grid grid-cols-12 px-5 py-3">
                    <span className="col-span-4 text-slate-500 font-medium">ISBN (کۆدی نێودەوڵەتی)</span>
                    <span className="col-span-8 text-slate-300 font-mono select-all">{book.isbn}</span>
                  </div>
                  <div className="grid grid-cols-12 px-5 py-3">
                    <span className="col-span-4 text-slate-500 font-medium">وەشانخانە</span>
                    <span className="col-span-8 text-slate-300">{book.publisher}</span>
                  </div>
                  <div className="grid grid-cols-12 px-5 py-3">
                    <span className="col-span-4 text-slate-500 font-medium">ساڵی چاپ</span>
                    <span className="col-span-8 text-slate-300 font-mono">{book.year}</span>
                  </div>
                  <div className="grid grid-cols-12 px-5 py-3">
                    <span className="col-span-4 text-slate-500 font-medium">ژمارەی لاپەڕەکان</span>
                    <span className="col-span-8 text-slate-300 font-mono">{book.pages} لاپەڕە</span>
                  </div>
                  <div className="grid grid-cols-12 px-5 py-3">
                    <span className="col-span-4 text-slate-500 font-medium">زمان</span>
                    <span className="col-span-8 text-slate-300">{book.language}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
