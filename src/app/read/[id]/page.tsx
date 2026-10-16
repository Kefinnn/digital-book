'use client';

import React, { useState, useEffect, useMemo, use, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Chapter } from '@/types/book';
import {
  ReaderSettings,
  defaultReaderSettings,
  getReaderSettings,
  saveReaderSettings,
} from '@/lib/storage';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { useMyList } from '@/hooks/useMyList';
import { useBooksCatalog } from '@/hooks/useBooksCatalog';
import { ReaderView } from '@/components/reader/ReaderView';
import {
  BookOpen,
  ArrowLeft,
  FileText,
  Maximize2,
  Minimize2,
  Plus,
  Check,
  Info,
  Loader2,
  ExternalLink,
  Sparkles,
  X,
} from 'lucide-react';

interface ReadPageProps {
  params: Promise<{ id: string }>;
}

export default function ReadPage({ params }: ReadPageProps) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;

  const { books } = useBooksCatalog();
  const { saveProgress } = useReadingProgress();
  const { isInMyList, toggleMyList } = useMyList();

  // Find book in live catalog
  const book = useMemo(() => {
    return books.find((b) => b.id === bookId);
  }, [books, bookId]);

  const [viewMode, setViewMode] = useState<'pdf' | 'synopsis'>('pdf');
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>(defaultReaderSettings);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Load reader settings & record reading progress when opening book
  useEffect(() => {
    setSettings(getReaderSettings());
    if (book) {
      const chId = book.chapters[0]?.id || `${book.id}-ch-1`;
      saveProgress(book.id, chId, 25);
    }
  }, [book, saveProgress]);

  // Listen to fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && readerContainerRef.current) {
        await readerContainerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
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
          Buku dengan identitas &ldquo;{bookId}&rdquo; tidak dapat ditemukan dalam koleksi Pustaka Digital Ahmadiyah.
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

  const isSaved = isInMyList(book.id);
  const proxyPdfUrl = book.pdfUrl.startsWith('/')
    ? `${book.pdfUrl}#toolbar=1&navpanes=1&view=FitH`
    : `/api/pdf-proxy?url=${encodeURIComponent(book.pdfUrl)}#toolbar=1&navpanes=1&view=FitH`;
  const currentChapter: Chapter = book.chapters[0] || {
    id: `${book.id}-ch-1`,
    title: `Sinopsis: ${book.title}`,
    durationMinutes: 15,
    content: book.synopsis,
  };

  return (
    <div
      ref={readerContainerRef}
      className="h-screen w-full flex flex-col bg-[#121212] text-white overflow-hidden"
    >
      {/* Top Integrated Reader Toolbar */}
      <header className="h-16 shrink-0 bg-[#181818] border-b border-neutral-800 px-3 sm:px-6 flex items-center justify-between gap-3 z-30 select-none">
        {/* Left: Back Button, Mini Cover & Book Metadata */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/browse"
            className="p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 hover:text-white transition shrink-0 flex items-center gap-1.5 text-xs font-semibold"
            title="Kembali ke Katalog"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Katalog</span>
          </Link>

          <div className="hidden sm:block relative w-8 h-11 rounded overflow-hidden border border-neutral-700 shrink-0">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white truncate">
                {book.title}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
                Baca Langsung
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate">
              {book.author}
              {book.translator ? ` • Terjemahan: ${book.translator}` : ''}
            </p>
          </div>
        </div>

        {/* Center: Quick Category Navigation Links back to /browse#kategori */}
        <nav className="hidden xl:flex items-center gap-4 text-xs text-neutral-300 shrink-0">
          <Link href="/browse#imam-mahdi" className="hover:text-white transition">
            Karya Imam Mahdi
          </Link>
          <Link href="/browse#khalifah" className="hover:text-white transition">
            Karya Khalifah
          </Link>
          <Link href="/browse#ulama" className="hover:text-white transition">
            Karya Ulama
          </Link>
          <Link href="/browse#lainnya" className="hover:text-white transition">
            Buku Lainnya
          </Link>
        </nav>

        {/* Right: Mode Toggle, My List, Info Drawer & Fullscreen */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Switcher (PDF Stream vs Synopsis Text) */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <button
              type="button"
              onClick={() => setViewMode('pdf')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                viewMode === 'pdf'
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buku PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('synopsis')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                viewMode === 'synopsis'
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sinopsis</span>
            </button>
          </div>

          {/* Save to My List */}
          <button
            type="button"
            onClick={() => toggleMyList(book.id)}
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition cursor-pointer"
            title={isSaved ? 'Hapus dari Daftar Saya' : 'Simpan ke Daftar Saya'}
          >
            {isSaved ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>

          {/* Book Info Drawer Button */}
          <button
            type="button"
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className={`p-2 rounded-lg transition cursor-pointer ${
              isInfoOpen
                ? 'bg-[#E50914] text-white'
                : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200'
            }`}
            title="Informasi & Detail Buku"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Reader Content Area */}
      <div className="relative flex-1 w-full h-[calc(100vh-4rem)] flex overflow-hidden">
        {viewMode === 'pdf' ? (
          <div className="relative flex-1 w-full h-full bg-[#1a1a1a]">
            {/* Loading Overlay while PDF stream initializes */}
            {isPdfLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#141414]/90 backdrop-blur-sm space-y-3 p-6 text-center">
                <Loader2 className="w-10 h-10 text-[#E50914] animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-bold text-white">
                    Memuat Halaman Buku &ldquo;{book.title}&rdquo;...
                  </p>
                  <p className="text-xs text-neutral-400">
                    Menyiapkan streaming PDF langsung dari Pustaka Ahmadiyah tanpa perlu download
                  </p>
                </div>
              </div>
            )}

            {/* Embedded Inline PDF Stream via Proxy */}
            <iframe
              src={proxyPdfUrl}
              title={`Baca ${book.title}`}
              className="w-full h-full border-0"
              onLoad={() => setIsPdfLoading(false)}
            />
          </div>
        ) : (
          /* Synopsis / Text Reader Mode */
          <div className="flex-1 w-full h-full overflow-y-auto">
            <ReaderView
              book={book}
              currentChapter={currentChapter}
              settings={settings}
              onSelectChapter={() => {}}
              onProgressUpdate={(pct) => saveProgress(book.id, currentChapter.id, Math.round(pct))}
            />
          </div>
        )}

        {/* Collapsible Side Info Panel */}
        {isInfoOpen && (
          <aside className="w-80 sm:w-96 bg-[#181818] border-l border-neutral-800 h-full overflow-y-auto p-5 space-y-5 z-20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
                Informasi Buku
              </h2>
              <button
                type="button"
                onClick={() => setIsInfoOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <div className="relative w-24 h-36 rounded overflow-hidden border border-neutral-700 shrink-0 shadow-lg">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <span className="inline-block bg-[#E50914] text-white font-bold px-2 py-0.5 rounded text-[10px]">
                  {book.categoryLabel || 'Pustaka Ahmadiyah'}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {book.title}
                </h3>
                <p className="text-neutral-300 font-medium">{book.author}</p>
                {book.translator && (
                  <p className="text-neutral-400">
                    Penerjemah: {book.translator}
                  </p>
                )}
                <p className="text-neutral-500">
                  {book.releaseYear} &bull; {book.pageCount} Halaman
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Sinopsis & Resensi
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                {book.synopsis}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Jelajahi Kategori Pustaka
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/browse#imam-mahdi"
                  className="px-3 py-2 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 font-medium transition text-center"
                >
                  Karya Imam Mahdi
                </Link>
                <Link
                  href="/browse#khalifah"
                  className="px-3 py-2 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 font-medium transition text-center"
                >
                  Karya Khalifah
                </Link>
                <Link
                  href="/browse#ulama"
                  className="px-3 py-2 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 font-medium transition text-center"
                >
                  Karya Ulama
                </Link>
                <Link
                  href="/browse#lainnya"
                  className="px-3 py-2 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 font-medium transition text-center"
                >
                  Buku Lainnya
                </Link>
              </div>
            </div>

            {book.detailUrl && (
              <div className="pt-3 border-t border-neutral-800">
                <a
                  href={book.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Lihat Halaman Sumber di Ahmadiyah.id</span>
                </a>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
