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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative flex flex-col h-[380px] w-full rounded-2xl overflow-hidden glass-card group cursor-pointer shadow-xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300"
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
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={false}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <BookOpen className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs">وێنە بەردەست نییە</span>
          </div>
        )}

        {/* Age Group Tag - corner overlay (strictly only for children category) */}
        {book.category === 'mndalan' && book.ageGroup && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold px-3 py-1 rounded-full text-[11px] shadow-lg shadow-cyan-500/25 border border-cyan-400 z-10">
            {getAgeLabel(book.ageGroup)}
          </div>
        )}

        {/* Subtle quick view button on hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <span className="bg-slate-950/80 text-cyan-400 backdrop-blur-md font-bold text-xs px-4 py-1.5 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            بینینی زانیاری
          </span>
        </div>
      </div>

      {/* Book Metadata Area */}
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
          {/* Status badge */}
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
