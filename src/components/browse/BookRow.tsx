'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Book } from '@/types/book';
import { BookCard } from './BookCard';
import { StoredProgress } from '@/lib/storage';

interface BookRowProps {
  id?: string;
  title: string;
  subtitle?: string;
  books: Book[];
  onSelectBook: (book: Book) => void;
  progressMap?: StoredProgress;
}

export const BookRow: React.FC<BookRowProps> = ({
  id,
  title,
  subtitle,
  books,
  onSelectBook,
  progressMap,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.75;

    const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

    rowRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const onScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  if (!books || books.length === 0) return null;

  return (
    <section id={id} className="relative my-6 md:my-10 px-4 sm:px-6 lg:px-8 group/row">
      {/* Row Header */}
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide group-hover/row:text-[#E50914] transition-colors flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-semibold text-neutral-400 group-hover/row:text-white transition hidden sm:inline-block">
              Jelajahi Semua &rsaquo;
            </span>
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Gulir ke kiri"
            className="absolute left-0 top-0 bottom-8 z-30 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover/row:opacity-100 rounded-r backdrop-blur-xs cursor-pointer"
          >
            <ChevronLeft className="w-8 h-8 transition-transform group-hover:scale-125" />
          </button>
        )}

        {/* Scrollable Books Cards Row */}
        <div
          ref={rowRef}
          onScroll={onScroll}
          className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
        >
          {books.map((book) => {
            const progress = progressMap?.[book.id]?.percent;
            return (
              <BookCard
                key={book.id}
                book={book}
                onSelect={onSelectBook}
                progressPercent={progress}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && books.length > 3 && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Gulir ke kanan"
            className="absolute right-0 top-0 bottom-8 z-30 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover/row:opacity-100 rounded-l backdrop-blur-xs cursor-pointer"
          >
            <ChevronRight className="w-8 h-8 transition-transform group-hover:scale-125" />
          </button>
        )}
      </div>
    </section>
  );
};
