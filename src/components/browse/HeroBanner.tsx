'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Info, Plus, Check, Star } from 'lucide-react';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMyList } from '@/hooks/useMyList';

interface HeroBannerProps {
  book: Book;
  onOpenDetail: (book: Book) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ book, onOpenDetail }) => {
  const { isInMyList, toggleMyList } = useMyList();
  const isSaved = isInMyList(book.id);

  return (
    <div className="relative w-full h-[75vh] min-h-[520px] max-h-[820px] flex items-center justify-start overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={book.backdropImage}
          alt={book.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.7]"
        />
        {/* Cinematic Netflix Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/75 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30 z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 flex items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          {/* Top meta badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-[#E50914] text-white font-extrabold text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded shadow">
              Pustaka Utama Ahmadiyah
            </span>
            <Badge variant="match">{book.matchRate}% Direkomendasikan</Badge>
            <Badge variant="age">{book.categoryLabel || 'Karya Utama'}</Badge>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{book.rating}</span>
            </div>
          </div>

          {/* Book Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md leading-tight">
            {book.title}
          </h1>

          {/* Author & Translator */}
          <div className="space-y-1">
            <p className="text-base sm:text-lg text-neutral-300 font-medium">
              Penulis: <span className="text-white font-semibold">{book.author}</span>
            </p>
            {book.translator && (
              <p className="text-xs sm:text-sm text-neutral-400">
                Penerjemah: <span className="text-neutral-200 font-medium">{book.translator}</span>
              </p>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 leading-relaxed drop-shadow">
            {book.synopsis}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {book.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="genre">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 flex-wrap">
            <Link href={`/read/${book.id}`}>
              <Button
                variant="primary"
                size="lg"
                icon={<BookOpen className="w-5 h-5 fill-black" />}
              >
                Baca Sekarang
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="lg"
              icon={<Info className="w-5 h-5" />}
              onClick={() => onOpenDetail(book)}
            >
              Detail Info
            </Button>

            <Button
              variant="icon"
              onClick={() => toggleMyList(book.id)}
              aria-label={isSaved ? 'Hapus dari daftar' : 'Tambah ke daftar'}
              title={isSaved ? 'Hapus dari Daftar Saya' : 'Tambah ke Daftar Saya'}
            >
              {isSaved ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Featured Book Original Cover Preview on Desktop */}
        <div className="hidden lg:block relative w-52 h-76 shrink-0 rounded-lg overflow-hidden shadow-2xl border border-white/15 transform rotate-2 hover:rotate-0 transition-transform duration-500 mr-8">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="220px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Edge Maturity & Format Tag */}
      <div className="absolute right-0 bottom-24 z-20 hidden sm:flex items-center gap-3 bg-neutral-900/70 backdrop-blur-md border-l-4 border-[#E50914] py-1.5 px-4 text-xs font-semibold text-neutral-300">
        <span>BACA LANGSUNG TANPA DOWNLOAD</span>
        <Badge variant="format">PDF</Badge>
        <Badge variant="age">{book.maturityRating}</Badge>
      </div>
    </div>
  );
};
