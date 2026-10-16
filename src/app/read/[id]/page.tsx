'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { BOOKS_DATA } from '@/lib/data';
import { Book, Chapter } from '@/types/book';
import {
  ReaderSettings,
  defaultReaderSettings,
  getReaderSettings,
  saveReaderSettings,
} from '@/lib/storage';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { ReaderToolbar } from '@/components/reader/ReaderToolbar';
import { ReaderView } from '@/components/reader/ReaderView';
import { ReaderTableOfContents } from '@/components/reader/ReaderTableOfContents';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface ReadPageProps {
  params: Promise<{ id: string }>;
}

export default function ReadPage({ params }: ReadPageProps) {
  // Resolve params using React.use() as recommended for Next.js 15+
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  const searchParams = useSearchParams();
  const queryChapterId = searchParams.get('chapter');

  const { getBookProgress, saveProgress } = useReadingProgress();

  // Find book
  const book = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === bookId);
  }, [bookId]);

  // Reader Settings (theme, font size, etc.)
  const [settings, setSettings] = useState<ReaderSettings>(defaultReaderSettings);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState<string>('');
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  // Load saved settings & initial chapter
  useEffect(() => {
    setSettings(getReaderSettings());

    if (book && book.chapters.length > 0) {
      if (queryChapterId && book.chapters.some((c) => c.id === queryChapterId)) {
        setCurrentChapterId(queryChapterId);
      } else {
        const saved = getBookProgress(book.id);
        if (saved && book.chapters.some((c) => c.id === saved.chapterId)) {
          setCurrentChapterId(saved.chapterId);
          setCurrentProgress(saved.percent);
        } else {
          setCurrentChapterId(book.chapters[0].id);
        }
      }
    }
  }, [book, queryChapterId, getBookProgress]);

  const handleUpdateSettings = (partial: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveReaderSettings(next);
      return next;
    });
  };

  const handleSelectChapter = (chapterId: string) => {
    setCurrentChapterId(chapterId);
    if (book) {
      saveProgress(book.id, chapterId, 0);
      setCurrentProgress(0);
    }
  };

  const handleProgressUpdate = (percent: number) => {
    setCurrentProgress(percent);
    if (book && currentChapterId) {
      saveProgress(book.id, currentChapterId, Math.round(percent));
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-[#E50914] mb-2">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Buku Tidak Ditemukan</h1>
        <p className="text-neutral-400 max-w-md text-sm">
          Buku dengan identitas &ldquo;{bookId}&rdquo; tidak dapat ditemukan dalam koleksi perpustakaan Bookflix.
        </p>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#E50914] text-white font-semibold text-sm hover:bg-[#b80710] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  const currentChapter: Chapter =
    book.chapters.find((c) => c.id === currentChapterId) || book.chapters[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      {/* Reader Toolbar with Appearance Settings and TOC toggle */}
      <ReaderToolbar
        book={book}
        currentChapter={currentChapter}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenToc={() => setIsTocOpen(true)}
        progressPercent={currentProgress}
      />

      {/* Main Reader View */}
      <ReaderView
        book={book}
        currentChapter={currentChapter}
        settings={settings}
        onSelectChapter={handleSelectChapter}
        onProgressUpdate={handleProgressUpdate}
      />

      {/* Table of Contents Drawer */}
      <ReaderTableOfContents
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        chapters={book.chapters}
        currentChapterId={currentChapter.id}
        onSelectChapter={handleSelectChapter}
      />
    </div>
  );
}
