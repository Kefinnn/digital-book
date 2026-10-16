'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { Book, Chapter } from '@/types/book';
import { ReaderSettings } from '@/lib/storage';

interface ReaderViewProps {
  book: Book;
  currentChapter: Chapter;
  settings: ReaderSettings;
  onSelectChapter: (chapterId: string) => void;
  onProgressUpdate: (percent: number) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  currentChapter,
  settings,
  onSelectChapter,
  onProgressUpdate,
}) => {
  const [scrollPercent, setScrollPercent] = useState(0);

  const currentIndex = book.chapters.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? book.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < book.chapters.length - 1 ? book.chapters[currentIndex + 1] : null;

  // Track scroll position to update reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollPercent(percent);
        onProgressUpdate(percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentChapter.id, onProgressUpdate]);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentChapter.id]);

  // Theme styling classes
  const themeClasses = {
    dark: 'bg-[#141414] text-[#d4d4d4]',
    sepia: 'bg-[#f4ecd8] text-[#433422]',
    light: 'bg-[#fafafa] text-[#262626]',
  };

  const articleBorderClasses = {
    dark: 'border-neutral-800',
    sepia: 'border-[#dfd3be]',
    light: 'border-neutral-200',
  };

  const fontClass = settings.fontFamily === 'serif' ? 'font-book-serif' : 'font-book-sans';

  // Split chapter content into readable paragraphs
  const paragraphs = currentChapter.content
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses[settings.theme]}`}>
      {/* Scroll Progress Bar at the top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/20">
        <div
          className="h-full bg-[#E50914] transition-all duration-150"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Main Content Article Container */}
      <main className="max-w-3xl mx-auto px-5 sm:px-8 pt-12 pb-24">
        {/* Chapter Header */}
        <header className={`pb-8 mb-10 border-b ${articleBorderClasses[settings.theme]}`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">
            <BookOpen className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{book.title}</span>
            <span>&bull;</span>
            <span>Oleh {book.author}</span>
          </div>

          <h1
            className={`font-bold leading-tight mb-3 ${
              settings.theme === 'sepia' ? 'text-[#2b1f14]' : settings.theme === 'light' ? 'text-black' : 'text-white'
            }`}
            style={{ fontSize: `${settings.fontSize * 1.55}px` }}
          >
            {currentChapter.title}
          </h1>

          <div className="flex items-center gap-3 text-xs opacity-75">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentChapter.durationMinutes} menit estimasi baca
            </span>
            <span>&bull;</span>
            <span>Bab {currentIndex + 1} dari {book.chapters.length}</span>
          </div>
        </header>

        {/* Chapter Paragraphs */}
        <article
          className={`space-y-6 ${fontClass} leading-relaxed`}
          style={{ fontSize: `${settings.fontSize}px`, lineHeight: 1.85 }}
        >
          {paragraphs.map((para, i) => (
            <p key={i} className="tracking-normal text-justify">
              {para}
            </p>
          ))}
        </article>

        {/* Chapter Completion Marker */}
        <div className="my-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700/60 bg-black/10 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Akhir dari {currentChapter.title}</span>
          </div>
        </div>

        {/* Chapter Navigation Controls */}
        <nav
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t ${articleBorderClasses[settings.theme]}`}
        >
          {prevChapter ? (
            <button
              onClick={() => onSelectChapter(prevChapter.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-neutral-700/80 hover:border-neutral-500 transition text-sm font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <div className="text-left">
                <span className="text-[10px] uppercase block opacity-60">Bab Sebelumnya</span>
                <span className="truncate max-w-[200px] block">{prevChapter.title}</span>
              </div>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextChapter ? (
            <button
              onClick={() => onSelectChapter(nextChapter.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-white transition text-sm font-semibold cursor-pointer shadow-md"
            >
              <div className="text-right">
                <span className="text-[10px] uppercase block opacity-80">Lanjut Membaca</span>
                <span className="truncate max-w-[200px] block">{nextChapter.title}</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition text-sm font-semibold"
            >
              <span>Selesai Buku &bull; Kembali ke Beranda</span>
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
};
