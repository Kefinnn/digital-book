import React from 'react';
import Link from 'next/link';
import { BookOpen, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-neutral-800 bg-[#141414] text-neutral-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#E50914]" />
          <span className="font-bold text-neutral-300 tracking-wider">BOOKFLIX &bull; PUSTAKA BUKU AHMADIYAH</span>
        </div>

        <p className="text-sm">
          Koleksi Buku Digital Resmi dari{' '}
          <a
            href="https://ahmadiyah.id/pustaka/buku"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-neutral-300 hover:text-white cursor-pointer"
          >
            ahmadiyah.id/pustaka/buku
          </a>{' '}
          &mdash; Baca langsung di dalam browser tanpa perlu mengunduh file PDF.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
          <Link href="/browse" className="hover:underline">Beranda Pustaka</Link>
          <Link href="/browse#imam-mahdi" className="hover:underline">Karya Imam Mahdi</Link>
          <Link href="/browse#khalifah" className="hover:underline">Karya Khalifah</Link>
          <Link href="/browse#ulama" className="hover:underline">Karya Ulama</Link>
          <Link href="/browse#lainnya" className="hover:underline">Buku Lainnya</Link>
          <Link href="/my-list" className="hover:underline">Daftar Bacaan Saya</Link>
          <a href="https://ahmadiyah.id" target="_blank" rel="noopener noreferrer" className="hover:underline">Situs Resmi Ahmadiyah.id</a>
          <a href="https://ahmadiyah.id/pustaka/buku" target="_blank" rel="noopener noreferrer" className="hover:underline">Katalog Asli</a>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900 px-3 py-1.5 rounded text-xs text-neutral-300">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span>Bahasa Indonesia &bull; Love for All, Hatred for None</span>
          </div>
        </div>

        <p className="text-xs text-neutral-600">
          Bookflix Pustaka Ahmadiyah Indonesia &bull; Pengalaman membaca buku digital langsung di web tanpa perlu download.
        </p>
      </div>
    </footer>
  );
};
