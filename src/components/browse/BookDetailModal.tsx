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
        <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end gap-5">
          <div className="hidden sm:block relative w-28 h-40 rounded-md overflow-hidden shadow-2xl border border-white/20 shrink-0">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
          <div className="space-y-2.5 flex-1">
            {book.categoryLabel && (
              <span className="inline-block bg-[#E50914] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {book.categoryLabel}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md leading-tight">
              {book.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-medium">
              Oleh <span className="text-white font-semibold">{book.author}</span>
              {book.translator && (
                <span className="text-neutral-400 text-xs sm:text-sm">
                  {' '}
                  &bull; Penerjemah: {book.translator}
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <Link href={`/read/${book.id}`}>
                <Button
                  variant="primary"
                  size="md"
                  icon={<BookOpen className="w-5 h-5 fill-black" />}
                >
                  Baca Sekarang (Tanpa Download)
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
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-8 bg-[#181818]">
        {/* Two-Column Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Metadata & Synopsis */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-sm flex-wrap">
              <Badge variant="match">{book.matchRate}% Direkomendasikan</Badge>
              <span className="text-neutral-400">{book.releaseYear}</span>
              <Badge variant="age">{book.maturityRating}</Badge>
              <span className="text-neutral-400">{book.pageCount} Halaman</span>
              <Badge variant="format">PDF STREAM</Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Estimasi Waktu Membaca: <strong className="text-neutral-200">{book.readTimeEstimate}</strong></span>
            </div>

            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed pt-2 whitespace-pre-line">
              {book.synopsis}
            </p>
          </div>

          {/* Right: Cast, Genres, Tags */}
          <div className="space-y-4 text-xs text-neutral-400 border-t md:border-t-0 md:border-l border-neutral-800 md:pl-6 pt-4 md:pt-0">
            <div>
              <span className="text-neutral-500 block mb-1">Penulis:</span>
              <span className="text-neutral-200 font-medium">{book.author}</span>
            </div>

            {book.translator && (
              <div>
                <span className="text-neutral-500 block mb-1">Penerjemah:</span>
                <span className="text-neutral-200 font-medium">{book.translator}</span>
              </div>
            )}

            {book.originalTitle && (
              <div>
                <span className="text-neutral-500 block mb-1">Judul Asli:</span>
                <span className="text-neutral-200 italic">{book.originalTitle}</span>
              </div>
            )}

            <div>
              <span className="text-neutral-500 block mb-1">Kategori:</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {book.genre.map((g) => (
                  <span key={g} className="text-neutral-200">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-neutral-500 block mb-1">Tag Pustaka:</span>
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
                <span>{book.rating} / 5.0 Rating Pembaca</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Web PDF Reader Access Section */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#E50914]" />
              <span>Akses Baca Buku Lengkap</span>
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">Tersedia Baca Langsung di Web</span>
          </div>

          <div className="space-y-2">
            <Link
              href={`/read/${book.id}`}
              className="group flex items-center justify-between p-4 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <span className="text-xl sm:text-2xl font-bold text-[#E50914] w-6 text-right">
                  PDF
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#E50914] transition">
                    Edisi Lengkap: {book.title}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-0.5">
                    Baca seluruh halaman buku ini langsung di dalam browser tanpa perlu mengunduh file PDF ke perangkat Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-xs text-neutral-300 font-medium hidden sm:inline">
                  Buka Pembaca Web
                </span>
                <div className="p-2.5 rounded-full bg-[#E50914] group-hover:bg-white text-white group-hover:text-black transition">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
            </Link>
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
