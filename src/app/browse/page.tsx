'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { BOOKS_DATA, CATEGORY_ROWS } from '@/lib/data';
import { Book } from '@/types/book';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroBanner } from '@/components/browse/HeroBanner';
import { BookRow } from '@/components/browse/BookRow';
import { BookCard } from '@/components/browse/BookCard';
import { BookDetailModal } from '@/components/browse/BookDetailModal';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { Search, Sparkles } from 'lucide-react';

export default function BrowsePage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { progressMap } = useReadingProgress();

  // Smoothly scroll to category section if URL has a #hash (e.g. navigated from /read/[id])
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  // Featured book for Hero Banner
  const featuredBook = useMemo(() => {
    return BOOKS_DATA.find((b) => b.id === 'filsafat-ajaran-islam') || BOOKS_DATA[0];
  }, []);

  // Filter books based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return BOOKS_DATA.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.translator && b.translator.toLowerCase().includes(q)) ||
        (b.categoryLabel && b.categoryLabel.toLowerCase().includes(q)) ||
        b.genre.some((g) => g.toLowerCase().includes(q)) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleOpenDetail = (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
  };

  // Find similar books for the detail modal
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
    <div className="min-h-screen bg-[#141414] text-white flex flex-col overflow-x-hidden">
      {/* Navbar with scroll effect and search callback */}
      <Navbar onSearch={(query) => setSearchQuery(query)} />

      {/* Main Browse Area */}
      <main className="flex-1 pb-16">
        {searchQuery.trim() ? (
          /* Search Results View */
          <div className="pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-[#E50914]" />
              <h1 className="text-xl sm:text-2xl font-bold">
                Hasil Pencarian untuk: &ldquo;<span className="text-[#E50914]">{searchQuery}</span>&rdquo;
              </h1>
              <span className="text-xs text-neutral-400">
                ({searchResults.length} buku ditemukan)
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={handleOpenDetail}
                    progressPercent={progressMap[book.id]?.percent}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 space-y-3">
                <p className="text-lg text-neutral-400">
                  Tidak ditemukan buku dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                </p>
                <p className="text-sm text-neutral-500">
                  Coba cari berdasarkan judul seperti &quot;Filsafat Ajaran Islam&quot;, penulis seperti &quot;Mirza Ghulam Ahmad&quot;, atau kategori seperti &quot;Karya Khalifah&quot;.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Standard Netflix Browse View */
          <>
            {/* Hero Banner */}
            <HeroBanner
              book={featuredBook}
              onOpenDetail={handleOpenDetail}
            />

            {/* Categorized Book Rows */}
            <div className="-mt-14 sm:-mt-20 relative z-20 space-y-2">
              {CATEGORY_ROWS.map((category) => {
                const filteredBooks = BOOKS_DATA.filter(category.filter);

                return (
                  <BookRow
                    key={category.id}
                    id={category.id}
                    title={category.title}
                    subtitle={category.subtitle}
                    books={filteredBooks}
                    onSelectBook={handleOpenDetail}
                    progressMap={progressMap}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        similarBooks={similarBooks}
        onSelectSimilarBook={(book) => setSelectedBook(book)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
