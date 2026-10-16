'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BOOKS_DATA } from '@/lib/data';
import { Book } from '@/types/book';
import { useMyList } from '@/hooks/useMyList';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookCard } from '@/components/browse/BookCard';
import { BookDetailModal } from '@/components/browse/BookDetailModal';
import { Bookmark, Compass } from 'lucide-react';

export default function MyListPage() {
  const { myList } = useMyList();
  const { progressMap } = useReadingProgress();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const savedBooks = useMemo(() => {
    return BOOKS_DATA.filter((book) => myList.includes(book.id));
  }, [myList]);

  const handleOpenDetail = (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };

  const similarBooks = useMemo(() => {
    if (!selectedBook) return [];
    return BOOKS_DATA.filter(
      (b) =>
        b.id !== selectedBook.id &&
        (b.category === selectedBook.category ||
          b.genre.some((g) => selectedBook.genre.includes(g)))
    );
  }, [selectedBook]);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Title & Count */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Daftar Bacaan Saya
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                Koleksi buku favorit yang Anda simpan untuk dibaca nanti
              </p>
            </div>
          </div>

          <span className="text-xs sm:text-sm font-semibold text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
            {savedBooks.length} Buku
          </span>
        </div>

        {/* Saved Books Grid or Empty State */}
        {savedBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {savedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={handleOpenDetail}
                progressPercent={progressMap[book.id]?.percent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 px-4 max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">
                Daftar Anda Masih Kosong
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Temukan buku menarik dari beranda dan tekan tombol tambah (+) untuk menyimpannya di sini.
              </p>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-sm transition shadow-lg"
            >
              <Compass className="w-4 h-4" />
              <span>Jelajahi Buku Sekarang</span>
            </Link>
          </div>
        )}
      </main>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        similarBooks={similarBooks}
        onSelectSimilarBook={(book) => setSelectedBook(book)}
      />

      <Footer />
    </div>
  );
}
