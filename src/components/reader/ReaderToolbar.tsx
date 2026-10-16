'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  List,
  Type,
  Sun,
  Moon,
  Bookmark,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { Book, Chapter } from '@/types/book';
import { ReaderSettings } from '@/lib/storage';

interface ReaderToolbarProps {
  book: Book;
  currentChapter: Chapter;
  settings: ReaderSettings;
  onUpdateSettings: (settings: Partial<ReaderSettings>) => void;
  onOpenToc: () => void;
  progressPercent: number;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  book,
  currentChapter,
  settings,
  onUpdateSettings,
  onOpenToc,
  progressPercent,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const themeOptions: { label: string; value: 'dark' | 'sepia' | 'light'; bg: string }[] = [
    { label: 'Gelap', value: 'dark', bg: 'bg-[#141414] text-white border-neutral-700' },
    { label: 'Sepia', value: 'sepia', bg: 'bg-[#f4ecd8] text-[#5b4636] border-[#d8cbb5]' },
    { label: 'Terang', value: 'light', bg: 'bg-white text-black border-neutral-300' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-[#181818]/95 backdrop-blur-md border-b border-neutral-800 text-white px-4 py-3 select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Back to Browse & Book Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/browse"
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer shrink-0"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="min-w-0">
            <h1 className="text-sm font-bold truncate text-white">
              {book.title}
            </h1>
            <p className="text-xs text-neutral-400 truncate">
              {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Right: Controls & Progress */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Progress Percent */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-400">
            <span>{Math.round(progressPercent)}% selesai</span>
          </div>

          {/* Table of Contents Button */}
          <button
            onClick={onOpenToc}
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Daftar Bab"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Daftar Isi</span>
          </button>

          {/* Reader Appearance Settings Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Pengaturan Tampilan Baca"
            >
              <Type className="w-4 h-4" />
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Appearance Popup Menu */}
            {showSettingsMenu && (
              <div
                className="absolute right-0 mt-3 w-72 bg-[#1f1f1f] border border-neutral-700 rounded-xl shadow-2xl p-4 z-50 text-xs space-y-4 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowSettingsMenu(false)}
              >
                {/* Theme Selector */}
                <div>
                  <label className="text-neutral-400 block mb-2 font-medium">Tema Tampilan</label>
                  <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => onUpdateSettings({ theme: t.value })}
                        className={`py-1.5 px-2 rounded border text-center font-medium transition cursor-pointer ${t.bg} ${
                          settings.theme === t.value ? 'ring-2 ring-[#E50914]' : ''
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size Adjuster */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-neutral-400 font-medium">Ukuran Teks</label>
                    <span className="text-white font-mono">{settings.fontSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 2) })
                      }
                      className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 text-white font-bold cursor-pointer"
                    >
                      A-
                    </button>
                    <button
                      onClick={() =>
                        onUpdateSettings({ fontSize: Math.min(28, settings.fontSize + 2) })
                      }
                      className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-700 rounded border border-neutral-700 text-white font-bold cursor-pointer"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Font Family Selector */}
                <div>
                  <label className="text-neutral-400 block mb-2 font-medium">Gaya Huruf</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onUpdateSettings({ fontFamily: 'serif' })}
                      className={`py-1.5 px-2 rounded border border-neutral-700 font-serif text-center cursor-pointer ${
                        settings.fontFamily === 'serif'
                          ? 'bg-[#E50914] text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Serif (Klasik)
                    </button>
                    <button
                      onClick={() => onUpdateSettings({ fontFamily: 'sans' })}
                      className={`py-1.5 px-2 rounded border border-neutral-700 font-sans text-center cursor-pointer ${
                        settings.fontFamily === 'sans'
                          ? 'bg-[#E50914] text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Sans (Modern)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
