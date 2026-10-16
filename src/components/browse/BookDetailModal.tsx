'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Plus, Check, Star, ThumbsUp, Clock, BookMarked } from 'lucide-react';
import { Book } from '@/types/book';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useMyList } from '@/hooks/useMyList';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  similarBooks?: Book[];
  onSelectSimilarBook?: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  similarBooks = [],
  onSelectSimilarBook,
}) => {
  const { isInMyList, toggleMyList } = useMyList();

  if (!book) return null;

  const isSaved = isInMyList(book.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      {/* Modal Hero Banner */}
      <div className="relative w-full h-[320px] sm:h-[400px]">
        <Image
          src={book.backdropImage}
          alt={book.title}
          fill
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover object-center filter brightness-90"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/80 via-transparent to-transparent" />

        {/* Action Controls over Banner */}
        <div className="absolute bottom-6 left-6 right-6 z-20 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md">
            {book.title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-medium">
            Oleh <span className="text-white font-semibold">{book.author}</span>
          </p>

          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <Link href={`/read/${book.id}`}>
              <Button
                variant="primary"
                size="md"
                icon={<BookOpen className="w-5 h-5 fill-black" />}
              >
                Mulai Membaca
              </Button>
            </Link>

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

            <Button
              variant="icon"
              aria-label="Suka buku ini"
              title="Rekomendasikan buku ini"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-8 bg-[#181818]">
        {/* Two-Column Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Metadata & Synopsis */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-sm flex-wrap">
              <Badge variant="match">{book.matchRate}% Cocok</Badge>
              <span className="text-neutral-400">{book.releaseYear}</span>
              <Badge variant="age">{book.maturityRating}</Badge>
              <span className="text-neutral-400">{book.pageCount} Halaman</span>
              <Badge variant="format">E-BOOK</Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Estimasi Waktu Membaca: <strong className="text-neutral-200">{book.readTimeEstimate}</strong></span>
            </div>

            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed pt-2">
              {book.synopsis}
            </p>
          </div>

          {/* Right: Cast, Genres, Tags */}
          <div className="space-y-4 text-xs text-neutral-400 border-t md:border-t-0 md:border-l border-neutral-800 md:pl-6 pt-4 md:pt-0">
            <div>
              <span className="text-neutral-500 block mb-1">Penulis:</span>
              <span className="text-neutral-200 font-medium">{book.author}</span>
            </div>

            <div>
              <span className="text-neutral-500 block mb-1">Genre:</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {book.genre.map((g) => (
                  <span key={g} className="text-neutral-200 hover:underline cursor-pointer">
                    {g},
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-neutral-500 block mb-1">Karakteristik Buku:</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {book.tags.map((t) => (
                  <Badge key={t} variant="genre">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{book.rating} / 5.0 Rating Komunitas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters / Bab Tersedia (Netflix Episode List Style) */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#E50914]" />
              <span>Daftar Bab Tersedia ({book.chapters.length})</span>
            </h3>
            <span className="text-xs text-neutral-400">Sampel Gratis</span>
          </div>

          <div className="space-y-2">
            {book.chapters.map((ch, index) => (
              <div
                key={ch.id}
                className="group flex items-center justify-between p-3.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/80 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <span className="text-xl sm:text-2xl font-bold text-neutral-500 group-hover:text-white transition w-6 text-right">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#E50914] transition">
                      {ch.title}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                      {ch.content.slice(0, 110)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-xs text-neutral-400 hidden sm:inline">
                    {ch.durationMinutes} mnt baca
                  </span>
                  <Link
                    href={`/read/${book.id}?chapter=${ch.id}`}
                    className="p-2 rounded-full bg-neutral-800 group-hover:bg-white text-neutral-300 group-hover:text-black transition"
                    title={`Baca ${ch.title}`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Books (More Like This) */}
        {similarBooks.length > 0 && (
          <div className="border-t border-neutral-800 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Buku Serupa Lainnya
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {similarBooks.slice(0, 4).map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => onSelectSimilarBook && onSelectSimilarBook(sim)}
                  className="group bg-neutral-900 rounded-md overflow-hidden border border-neutral-800 cursor-pointer hover:border-neutral-600 transition"
                >
                  <div className="relative aspect-[2/3] w-full">
                    <Image
                      src={sim.coverImage}
                      alt={sim.title}
                      fill
                      sizes="180px"
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-white truncate">
                      {sim.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {sim.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
