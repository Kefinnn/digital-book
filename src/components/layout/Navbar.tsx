'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, BookOpen, Menu, X, Check, Heart, Bookmark } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const isScrolled = useScrollPosition(25);
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '/browse' },
    { label: 'Karya Imam Mahdi', href: '/browse#imam-mahdi' },
    { label: 'Karya Khalifah', href: '/browse#khalifah' },
    { label: 'Karya Ulama', href: '/browse#ulama' },
    { label: 'Buku Lainnya', href: '/browse#lainnya' },
    { label: 'Daftar Saya', href: '/my-list' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (onSearch) onSearch(q);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMobileMenuOpen(false);

    if (href.startsWith('/browse#')) {
      const targetId = href.split('#')[1];
      if (pathname === '/browse') {
        e.preventDefault();
        if (searchQuery) {
          setSearchQuery('');
          setIsSearchOpen(false);
          if (onSearch) onSearch('');
        }
        window.history.pushState(null, '', href);
        requestAnimationFrame(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    } else if (href === '/browse' && pathname === '/browse') {
      e.preventDefault();
      if (searchQuery) {
        setSearchQuery('');
        setIsSearchOpen(false);
        if (onSearch) onSearch('');
      }
      window.history.pushState(null, '', '/browse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-lg border-b border-neutral-900/50'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/browse"
            onClick={(e) => handleNavClick(e, '/browse')}
            className="flex items-center gap-2 group"
          >
            <span className="text-[#E50914] font-black text-2xl md:text-3xl tracking-tighter uppercase font-sans group-hover:scale-105 transition-transform duration-200">
              BOOK<span className="text-white">FLIX</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Bar */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-black/80 border border-neutral-500 rounded px-2.5 py-1.5 transition-all w-48 sm:w-64">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Judul, penulis, genre..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                  className="bg-transparent text-xs sm:text-sm text-white px-2 focus:outline-none w-full"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    if (onSearch) onSearch('');
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Cari buku"
                className="p-1.5 text-neutral-300 hover:text-white transition"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notification Icon */}
          <button
            aria-label="Notifikasi"
            className="p-1.5 text-neutral-300 hover:text-white transition relative hidden sm:block"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#E50914] rounded-full ring-2 ring-[#141414]"></span>
          </button>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded bg-[#E50914] flex items-center justify-center text-white font-bold text-sm shadow group-hover:ring-2 ring-white transition">
                KB
              </div>
              <span className="hidden lg:block text-xs text-neutral-300 font-medium">
                Khaefin
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-3 w-56 bg-[#181818] border border-neutral-800 rounded-md shadow-2xl py-2 z-50 text-sm text-neutral-300 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-2 border-b border-neutral-800">
                  <p className="font-semibold text-white">Khaefin Bookworm</p>
                  <p className="text-xs text-neutral-400">Pembaca Premium</p>
                </div>

                <Link
                  href="/my-list"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-neutral-800 hover:text-white transition"
                >
                  <Bookmark className="w-4 h-4 text-[#E50914]" />
                  <span>Daftar Bacaan Saya</span>
                </Link>

                <div className="px-4 py-2 text-xs text-neutral-400 border-t border-neutral-800">
                  <p className="font-medium text-neutral-300 mb-1">Status Sinkronisasi</p>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Firebase Siap Dihubungkan</span>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-1">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  >
                    Keluar dari Bookflix
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu navigasi"
            className="md:hidden p-1.5 text-neutral-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#141414] border-b border-neutral-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block py-2 text-base font-medium text-neutral-200 hover:text-[#E50914] transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
