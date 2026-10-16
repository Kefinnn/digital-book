import React from 'react';
import Link from 'next/link';
import { BookOpen, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-neutral-800 bg-[#141414] text-neutral-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#E50914]" />
          <span className="font-bold text-neutral-300 tracking-wider">BOOKFLIX INDONESIA</span>
        </div>

        <p className="text-sm">
          Ada pertanyaan? Hubungi kami di <span className="underline hover:text-white cursor-pointer">0800-123-BOOK</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
          <Link href="/browse" className="hover:underline">Beranda Buku</Link>
          <Link href="/my-list" className="hover:underline">Daftar Bacaan Saya</Link>
          <a href="#" className="hover:underline">Pusat Bantuan</a>
          <a href="#" className="hover:underline">Preferensi Cookie</a>
          <a href="#" className="hover:underline">Syarat Penggunaan</a>
          <a href="#" className="hover:underline">Privasi & Keamanan</a>
          <a href="#" className="hover:underline">Integrasi Firebase</a>
          <a href="#" className="hover:underline">Uji Kecepatan Baca</a>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <div className="inline-flex items-center gap-2 border border-neutral-700 bg-neutral-900 px-3 py-1.5 rounded text-xs text-neutral-300">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span>Bahasa Indonesia</span>
          </div>
        </div>

        <p className="text-xs text-neutral-600">
          Bookflix &bull; Netflix for Books. Pengalaman membaca buku digital premium dengan kurasi terbaik.
        </p>
      </div>
    </footer>
  );
};
