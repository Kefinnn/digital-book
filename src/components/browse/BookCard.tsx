'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Plus, Check, ChevronDown, Star } from 'lucide-react';
import { Book } from '@/types/book';
import { Badge } from '@/components/ui/Badge';
import { useMyList } from '@/hooks/useMyList';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  progressPercent?: number;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  progressPercent,
}) => {
  const { isInMyList, toggleMyList } = useMyList();
  const isSaved = isInMyList(book.id);

  return (
    <div className="relative group shrink-0 w-[160px] sm:w-[200px] md:w-[230px] rounded-md transition-all duration-300 ease-out select-none">
      {/* Main Book Card */}
      <div
        onClick={() => onSelect(book)}
        className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-neutral-900 border border-neutral-800 shadow-lg cursor-pointer transform group-hover:scale-105 group-hover:shadow-2xl group-hover:border-neutral-600 transition-all duration-300 z-10"
      >
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 230px"
          className="object-cover object-center group-hover:brightness-90 transition-all duration-300"
        />

        {/* Top-Right Badge: Match rate */}
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-black/75 backdrop-blur-sm text-[#46d369] font-bold text-[11px] px-1.5 py-0.5 rounded border border-neutral-700/60 shadow">
            {book.matchRate}%
          </span>
        </div>

        {/* Hover Quick Overlay on the bottom of the card */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-20">
          <p className="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow">
            {book.title}
          </p>
          <p className="text-neutral-400 text-xs line-clamp-1 mb-2 font-medium">
            {book.author}
          </p>

          {/* Quick action buttons row */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            <div className="flex items-center gap-1.5">
              {/* Read button */}
              <Link
                href={`/read/${book.id}`}
                onClick={(e) => e.stopPropagation()}
                title="Baca Sekarang"
                className="w-8 h-8 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition hover:scale-110 active:scale-90 shadow"
              >
                <BookOpen className="w-4 h-4 fill-black" />
              </Link>

              {/* My List button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMyList(book.id);
                }}
                title={isSaved ? 'Hapus dari Daftar' : 'Tambah ke Daftar'}
                className="w-8 h-8 rounded-full bg-black/60 border border-neutral-400 hover:border-white text-white flex items-center justify-center transition hover:scale-110 active:scale-90"
              >
                {isSaved ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Expand Detail Modal button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(book);
              }}
              title="Detail Selengkapnya"
              className="w-8 h-8 rounded-full bg-black/60 border border-neutral-400 hover:border-white text-white flex items-center justify-center transition hover:scale-110 active:scale-90"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Meta line */}
          <div className="flex items-center gap-2 text-[10px] text-neutral-300 pt-2 font-medium">
            <span className="text-[#46d369] font-bold">{book.rating} ★</span>
            <span>&bull;</span>
            <span className="line-clamp-1">{book.genre[0]}</span>
          </div>
        </div>

        {/* Reading Progress Bar (for continue reading) */}
        {progressPercent !== undefined && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800 z-30">
            <div
              className="h-full bg-[#E50914] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Info Below (Visible even without hover on mobile / clean aesthetic) */}
      <div className="mt-2 px-1">
        <h3 className="text-white text-xs sm:text-sm font-semibold truncate group-hover:text-[#E50914] transition-colors">
          {book.title}
        </h3>
        <p className="text-neutral-400 text-[11px] sm:text-xs truncate">
          {book.author}
        </p>
      </div>
    </div>
  );
};
