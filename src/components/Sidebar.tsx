'use client';

import React from 'react';
import { Sparkles, Feather, Scroll, BookOpen } from 'lucide-react';
import { Category } from '../app/types';

interface CategoryItem {
  id: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'mndalan', label: 'منداڵان', icon: Sparkles },
  { id: 'roman', label: 'ڕۆمان', icon: Feather },
  { id: 'mejuy', label: 'مێژوویی', icon: Scroll },
  { id: 'ayini', label: 'ئایینی', icon: BookOpen },
];

interface SidebarProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export default function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="fixed top-20 right-0 h-[calc(100vh-5rem)] w-64 glass-panel border-l border-white/10 z-30 py-8 px-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-3 mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            هاوپۆلە سەرەکییەکان
          </h3>
        </div>
        <nav className="space-y-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25 border border-cyan-400 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer info */}
      <div className="glass-panel-cyan rounded-2xl p-4 border border-cyan-500/10 text-center">
        <div className="text-xs text-slate-400">سەعاتی دەوام</div>
        <div className="text-sm font-semibold text-cyan-400 mt-1">٩:٠٠ ب.ن - ١٠:٠٠ ش</div>
        <div className="text-[10px] text-slate-500 mt-2">ئەرشیفی نیشتمانیی کوردستان</div>
      </div>
    </aside>
  );
}
