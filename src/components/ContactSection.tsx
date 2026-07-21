'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    contact: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.message) return;
    
    // Simulate submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: '', contact: '', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 px-4 md:px-8 w-full max-w-6xl mx-auto relative z-10">
      {/* Visual Title */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-cyan-400">
          پەیوەندیمان پێوە بکە
        </h2>
        <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto">
          پرسیار، سەرنج، یان دۆزینەوەی کتێبی تایبەت؟ پەیام بنێرە و تیمی ئەرشیف بە زووترین کات وەڵامت دەدەنەوە.
        </p>
      </div>

      {/* Floating 3D-like glass panel */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-0 relative"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      >
        {/* Glow corner effects inside the box */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Column 1: Info (md:col-span-5) */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900/60 to-slate-950/80 p-8 md:p-12 border-l border-white/5 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-100">زانیاری پەیوەندی</h3>
              <p className="text-xs text-slate-400 mt-2">دەتوانیت لە ڕێگەی زانیارییەکانی خوارەوەش پەیوەندیمان پێوە بکەیت.</p>
            </div>

            <div className="space-y-6 mt-10">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">ناونیشان</span>
                  <span className="text-sm font-semibold text-slate-200">کەلار، کوردستان</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">ژمارەی مۆبایل</span>
                  <span className="text-sm font-semibold text-slate-200 font-mono tracking-wider" dir="ltr">+964 770 123 4567</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">ناونیشانی ئیمەیڵ</span>
                  <span className="text-sm font-semibold text-slate-200 font-mono select-all">info@bookarchive.kr</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/5">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ئەرشیفی کتێب بەشێکە لە سەنتەری ڕۆشنبیری گەرمیان. هەموو مافێک پارێزراوە لەلایەن ئەرشیفی کتێبی کوردستانەوە.
            </p>
          </div>
        </div>

        {/* Column 2: Form (md:col-span-7) */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold text-slate-300">
                ناوی تەواو <span className="text-cyan-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="ناوی سیانی خۆت بنووسە..."
                className="w-full bg-slate-950/40 text-slate-200 text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:bg-slate-950/60 focus:outline-none transition-all duration-300 placeholder:text-slate-500"
              />
            </div>

            {/* Input Contact */}
            <div className="space-y-2">
              <label htmlFor="contact" className="text-xs font-bold text-slate-300">
                ئیمەیڵ یان ژمارەی مۆبایل <span className="text-slate-500">(بۆ پەیوەندیکردن)</span>
              </label>
              <input
                id="contact"
                type="text"
                value={formState.contact}
                onChange={(e) => setFormState({ ...formState, contact: e.target.value })}
                placeholder="ئیمەیڵ یان ژمارەی مۆبایلەکەت بنووسە..."
                className="w-full bg-slate-950/40 text-slate-200 text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:bg-slate-950/60 focus:outline-none transition-all duration-300 placeholder:text-slate-500"
              />
            </div>

            {/* Input Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-bold text-slate-300">
                پەیامەکەت <span className="text-cyan-400">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                placeholder="پەیام، ڕەخنە، یان کتێبی داواکراو لێرە بنووسە..."
                className="w-full bg-slate-950/40 text-slate-200 text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-cyan-500/60 focus:bg-slate-950/60 focus:outline-none transition-all duration-300 placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitted}
              className={`w-full py-3.5 px-6 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                isSubmitted
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-emerald-500/20'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20 active:scale-98 cursor-pointer'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>پەیامەکەت بە سەرکەوتوویی نێردرا!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>ناردنی پەیام</span>
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
