'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, BookOpen } from 'lucide-react';
import { Book } from '../app/types';

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
}

export default function BookCard({ book, onViewDetails }: BookCardProps) {
  // Translate age group code to Kurdish display
  const getAgeLabel = (ageGroup?: string) => {
    if (!ageGroup) return '';
    return `${ageGroup} ساڵ`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="relative flex flex-col h-[380px] w-full rounded-2xl overflow-hidden glass-card group cursor-pointer shadow-xl border-t-2 border-t-cyan-500/40"
      onClick={() => onViewDetails(book)}
    >
      {/* Top ambient cover glow inside card */}
      <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b ${book.coverColor || 'from-cyan-500/10'} to-transparent opacity-20 pointer-events-none`} />

      {/* Book Cover Image Area */}
      <div className="relative w-full h-[240px] bg-slate-950/40 overflow-hidden flex items-center justify-center">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={false}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <BookOpen className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs">وێنە بەردەست نییە</span>
          </div>
        )}

        {/* Age Group Tag - corner overlay */}
        {book.category === 'mndalan' && book.ageGroup && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold px-3 py-1 rounded-full text-[11px] shadow-lg shadow-cyan-500/25 border border-cyan-400">
            {getAgeLabel(book.ageGroup)}
          </div>
        )}

        {/* Hover glassmorphic overlay */}
        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/10">
              <Eye className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 px-2">
              {book.title}
            </h4>
            <p className="text-xs text-slate-300 mb-6 font-medium">
              نووسینی: {book.author}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(book);
              }}
              className="bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-cyan-500/20 active:scale-95"
            >
              بینینی زانیاری
            </button>
          </div>
        </div>
      </div>

      {/* Book Metadata Area (Visible when not hovered) */}
      <div className="p-5 flex flex-col justify-between flex-grow relative z-10 bg-slate-950/20 backdrop-blur-[2px]">
        <div>
          <h3 className="text-md font-bold text-slate-100 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            {book.author}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3.5 mt-2">
          {/* Status instead of price */}
          <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1.5 bg-cyan-500/5 px-2.5 py-1 rounded-lg border border-cyan-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {book.status}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {book.locationCode}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
