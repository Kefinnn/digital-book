'use client';

import React from 'react';
import { X, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { Chapter } from '@/types/book';

interface ReaderTableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
}

export const ReaderTableOfContents: React.FC<ReaderTableOfContentsProps> = ({
  isOpen,
  onClose,
  chapters,
  currentChapterId,
  onSelectChapter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-[#181818] h-full shadow-2xl border-l border-neutral-800 flex flex-col text-white animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-lg font-bold">Daftar Bab & Isi</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chapters.map((ch, index) => {
            const isCurrent = ch.id === currentChapterId;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  onSelectChapter(ch.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#E50914]/15 border-[#E50914] text-white'
                    : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-800 text-neutral-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`text-sm font-bold mt-0.5 ${
                      isCurrent ? 'text-[#E50914]' : 'text-neutral-500'
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        isCurrent ? 'text-white' : 'text-neutral-200'
                      }`}
                    >
                      {ch.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{ch.durationMinutes} menit estimasi</span>
                    </div>
                  </div>
                </div>

                {isCurrent && (
                  <CheckCircle2 className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
