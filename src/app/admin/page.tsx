'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  Star,
  Sparkles,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  LogOut,
  LayoutGrid,
  List as ListIcon,
  ArrowUpRight,
  Layers,
  FileText,
  X,
  Wand2,
} from 'lucide-react';
import { Book, AhmadiyahCategory } from '@/types/book';
import { useBooksCatalog } from '@/hooks/useBooksCatalog';

const ADMIN_AUTH_STORAGE_KEY = 'bookflix_admin_authenticated';

const CATEGORY_OPTIONS: { value: AhmadiyahCategory; label: string }[] = [
  { value: 'imam-mahdi', label: 'Karya Pendiri / Imam Mahdi' },
  { value: 'khalifah', label: 'Karya Khalifah' },
  { value: 'ulama', label: 'Karya Ulama' },
  { value: 'lainnya', label: 'Buku Lainnya' },
];

interface BookFormState {
  title: string;
  originalTitle: string;
  author: string;
  translator: string;
  category: AhmadiyahCategory;
  releaseYear: number;
  pageCount: number;
  matchRate: number;
  rating: number;
  coverImage: string;
  backdropImage: string;
  pdfUrl: string;
  detailUrl: string;
  synopsis: string;
  isFeatured: boolean;
}

const initialFormState: BookFormState = {
  title: '',
  originalTitle: '',
  author: 'Hadhrat Mirza Ghulam Ahmad (as)',
  translator: '',
  category: 'imam-mahdi',
  releaseYear: new Date().getFullYear(),
  pageCount: 180,
  matchRate: 97,
  rating: 4.9,
  coverImage: '',
  backdropImage: '',
  pdfUrl: '',
  detailUrl: '',
  synopsis: '',
  isFeatured: false,
};

export default function AdminDashboardPage() {
  const { books, setBooks, isLoading, refreshBooks } = useBooksCatalog();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Filter & View State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | AhmadiyahCategory>('all');
  const [viewLayout, setViewLayout] = useState<'table' | 'grid'>('table');

  // Toast / Notification Banner
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Add / Edit Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormState>(initialFormState);
  const [coverInputMode, setCoverInputMode] = useState<'url' | 'upload'>('url');
  const [pdfInputMode, setPdfInputMode] = useState<'url' | 'upload'>('url');
  const [isUploadingCover, setIsUploadingCover] = useState<boolean>(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [isSavingBook, setIsSavingBook] = useState<boolean>(false);

  // Auto-Scrape State
  const [scrapeUrl, setScrapeUrl] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);

  // Delete Confirmation Modal State
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Hero Action Loading State
  const [settingHeroId, setSettingHeroId] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Handle PIN Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
        setIsAuthenticated(true);
        setPinInput('');
      } else {
        setAuthError(data.error || 'PIN / Password Admin salah.');
      }
    } catch {
      setAuthError('Gagal menghubungi server autentikasi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  // Computed Statistics & Filtered Books
  const heroBook = useMemo(() => {
    return (
      books.find((b) => b.isFeatured) ||
      books.find((b) => b.id === 'filsafat-ajaran-islam') ||
      books[0]
    );
  }, [books]);

  const categoryCounts = useMemo(() => {
    return {
      all: books.length,
      'imam-mahdi': books.filter((b) => b.category === 'imam-mahdi').length,
      khalifah: books.filter((b) => b.category === 'khalifah').length,
      ulama: books.filter((b) => b.category === 'ulama').length,
      lainnya: books.filter((b) => b.category === 'lainnya').length,
    };
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCat =
        selectedCategory === 'all' || book.category === selectedCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.translator && book.translator.toLowerCase().includes(q)) ||
        book.id.toLowerCase().includes(q)
      );
    });
  }, [books, selectedCategory, searchQuery]);

  // Open Modal for Adding New Book
  const handleOpenAddModal = () => {
    setEditingBook(null);
    setFormData(initialFormState);
    setScrapeUrl('');
    setCoverInputMode('url');
    setPdfInputMode('url');
    setIsFormModalOpen(true);
  };

  // Open Modal for Editing Existing Book
  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      originalTitle: book.originalTitle || '',
      author: book.author,
      translator: book.translator || '',
      category: book.category,
      releaseYear: book.releaseYear,
      pageCount: book.pageCount,
      matchRate: book.matchRate,
      rating: book.rating,
      coverImage: book.coverImage,
      backdropImage: book.backdropImage || '',
      pdfUrl: book.pdfUrl,
      detailUrl: book.detailUrl || '',
      synopsis: book.synopsis,
      isFeatured: book.isFeatured,
    });
    setScrapeUrl(book.detailUrl || '');
    setCoverInputMode(book.coverImage.startsWith('/uploads/') ? 'upload' : 'url');
    setPdfInputMode(book.pdfUrl.startsWith('/uploads/') ? 'upload' : 'url');
    setIsFormModalOpen(true);
  };

  // Auto-Fetch Metadata from Ahmadiyah.id URL
  const handleAutoFetchAhmadiyah = async () => {
    if (!scrapeUrl.trim()) {
      showToast('error', 'Masukkan link halaman detail buku dari ahmadiyah.id terlebih dahulu.');
      return;
    }

    setIsScraping(true);
    try {
      const res = await fetch('/api/books/scrape-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast('error', data.error || 'Gagal mengambil data dari URL tersebut.');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        originalTitle: data.originalTitle || prev.originalTitle,
        author: data.author || prev.author,
        translator: data.translator || prev.translator,
        category: (data.category as AhmadiyahCategory) || prev.category,
        releaseYear: data.releaseYear || prev.releaseYear,
        pageCount: data.pageCount || prev.pageCount,
        coverImage: data.coverImage || prev.coverImage,
        pdfUrl: data.pdfUrl || prev.pdfUrl,
        detailUrl: data.detailUrl || scrapeUrl.trim(),
        synopsis: data.synopsis || prev.synopsis,
      }));

      setCoverInputMode('url');
      setPdfInputMode('url');
      showToast(
        'success',
        `Berhasil mengekstrak data buku "${data.title}" dari Ahmadiyah.id!`
      );
    } catch {
      showToast('error', 'Terjadi kesalahan jaringan saat melakukan auto-fetch.');
    } finally {
      setIsScraping(false);
    }
  };

  // Handle File Upload (Cover or PDF)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'pdf'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'cover') setIsUploadingCover(true);
    else setIsUploadingPdf(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', type);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) {
        showToast('error', data.error || 'Gagal mengunggah file.');
        return;
      }

      if (type === 'cover') {
        setFormData((prev) => ({ ...prev, coverImage: data.url }));
        showToast('success', `Gambar cover "${file.name}" berhasil di-upload!`);
      } else {
        setFormData((prev) => ({ ...prev, pdfUrl: data.url }));
        showToast('success', `File PDF "${file.name}" berhasil di-upload!`);
      }
    } catch {
      showToast('error', 'Gagal mengunggah file ke server.');
    } finally {
      if (type === 'cover') setIsUploadingCover(false);
      else setIsUploadingPdf(false);
      e.target.value = '';
    }
  };

  // Submit Create or Update Book
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Judul buku wajib diisi.');
      return;
    }

    setIsSavingBook(true);
    try {
      if (editingBook) {
        const res = await fetch(`/api/books/${editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            setAsHero: formData.isFeatured,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          showToast('error', data.error || 'Gagal menyimpan perubahan buku.');
          return;
        }
        await refreshBooks();
        setIsFormModalOpen(false);
        showToast('success', `Buku "${data.title}" berhasil diperbarui!`);
      } else {
        const res = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          showToast('error', data.error || 'Gagal menambahkan buku baru.');
          return;
        }
        await refreshBooks();
        setIsFormModalOpen(false);
        showToast('success', `Buku baru "${data.title}" berhasil ditambahkan ke katalog!`);
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan buku.');
    } finally {
      setIsSavingBook(false);
    }
  };

  // Set Book as Hero Banner
  const handleSetAsHero = async (book: Book) => {
    setSettingHeroId(book.id);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setAsHero: true, isFeatured: true }),
      });
      if (res.ok) {
        setBooks((prev) =>
          prev.map((b) => ({
            ...b,
            isFeatured: b.id === book.id,
          }))
        );
        showToast(
          'success',
          `"${book.title}" sekarang menjadi Hero Banner utama di /browse!`
        );
      } else {
        showToast('error', 'Gagal mengubah Hero Banner.');
      }
    } catch {
      showToast('error', 'Gagal menghubungi server.');
    } finally {
      setSettingHeroId(null);
    }
  };

  // Confirm Delete Book
  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/books/${bookToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const deletedTitle = bookToDelete.title;
        setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));
        setBookToDelete(null);
        showToast('success', `Buku "${deletedTitle}" telah dihapus dari katalog.`);
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Gagal menghapus buku.');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menghapus buku.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
      </div>
    );
  }

  // PIN / Password Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.18),_transparent_55%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#181818] border border-neutral-800 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link href="/browse" className="inline-block">
              <span className="text-[#E50914] font-black text-3xl tracking-tighter uppercase">
                BOOK<span className="text-white">FLIX</span>{' '}
                <span className="text-xs font-bold bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 px-2 py-0.5 rounded ml-1 align-middle">
                  STUDIO
                </span>
              </span>
            </Link>
            <h1 className="text-xl font-bold text-white pt-2">
              Portal Manajemen Katalog Buku
            </h1>
            <p className="text-xs text-neutral-400">
              Masukkan PIN atau Password Admin untuk mengelola koleksi buku Pustaka Ahmadiyah secara real-time.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                PIN / Password Admin
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan PIN Admin (default: admin123)"
                  autoFocus
                  className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
                />
              </div>
              {authError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-lg bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard Admin</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
            <span>PIN Default: <code className="text-neutral-300">admin123</code></span>
            <Link
              href="/browse"
              className="text-neutral-300 hover:text-white underline"
            >
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      {/* Top Studio Header */}
      <header className="sticky top-0 z-30 bg-[#141414]/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/browse" className="flex items-center gap-2 group">
            <span className="text-[#E50914] font-black text-2xl sm:text-3xl tracking-tighter uppercase">
              BOOK<span className="text-white">FLIX</span>
            </span>
          </Link>
          <span className="text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30">
            Netflix Studio Admin
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs sm:text-sm font-semibold text-neutral-200 transition"
          >
            <span>Lihat Beranda</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#b80710] text-xs sm:text-sm font-bold text-white transition cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Buku</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Kunci Panel Admin"
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/95 border-red-500/50 text-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1. Top Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Books */}
          <div className="bg-[#181818] border border-neutral-800/90 rounded-xl p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Total Koleksi Buku
              </span>
              <p className="text-3xl font-black text-white">{books.length}</p>
              <p className="text-xs text-emerald-400 font-medium">
                Aktif &amp; Siap Baca Tanpa Download
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Categories */}
          <div className="bg-[#181818] border border-neutral-800/90 rounded-xl p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Jumlah Kategori
              </span>
              <p className="text-3xl font-black text-white">4</p>
              <p className="text-xs text-neutral-400">
                Imam Mahdi ({categoryCounts['imam-mahdi']}) &bull; Khalifah ({categoryCounts.khalifah}) &bull; Ulama ({categoryCounts.ulama}) &bull; Lainnya ({categoryCounts.lainnya})
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Active Hero Banner Book */}
          <div className="bg-[#181818] border border-neutral-800/90 rounded-xl p-5 flex items-center gap-3.5 sm:col-span-2">
            {heroBook && (
              <>
                <img
                  src={heroBook.coverImage}
                  alt={heroBook.title}
                  className="w-14 h-20 object-cover rounded border border-neutral-700 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      Hero Banner Aktif
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white truncate">
                    {heroBook.title}
                  </h2>
                  <p className="text-xs text-neutral-400 truncate">
                    {heroBook.author}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    href={`/read/${heroBook.id}`}
                    className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition text-center"
                  >
                    Uji Baca
                  </Link>
                  <Link
                    href="/browse"
                    className="px-3 py-1.5 rounded bg-[#E50914]/20 hover:bg-[#E50914]/30 text-[#E50914] border border-[#E50914]/30 text-xs font-semibold transition text-center"
                  >
                    Ke /browse
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 2. Search, Category Tabs & Layout Toggle */}
        <section className="bg-[#181818] border border-neutral-800/90 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul buku, penulis, penerjemah, atau ID..."
                className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg pl-10 pr-9 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right: View Switcher & Count */}
            <div className="flex items-center justify-between md:justify-end gap-3">
              <span className="text-xs text-neutral-400">
                Menampilkan <strong className="text-white">{filteredBooks.length}</strong> dari {books.length} buku
              </span>

              <div className="flex items-center bg-[#111111] p-1 rounded-lg border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setViewLayout('table')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                    viewLayout === 'table'
                      ? 'bg-[#E50914] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Tampilan Tabel"
                >
                  <ListIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Tabel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewLayout('grid')}
                  className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                    viewLayout === 'grid'
                      ? 'bg-[#E50914] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Tampilan Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: 'all', label: 'Semua Buku', count: categoryCounts.all },
              {
                id: 'imam-mahdi',
                label: 'Karya Imam Mahdi',
                count: categoryCounts['imam-mahdi'],
              },
              {
                id: 'khalifah',
                label: 'Karya Khalifah',
                count: categoryCounts.khalifah,
              },
              {
                id: 'ulama',
                label: 'Karya Ulama',
                count: categoryCounts.ulama,
              },
              {
                id: 'lainnya',
                label: 'Buku Lainnya',
                count: categoryCounts.lainnya,
              },
            ].map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(tab.id as 'all' | AhmadiyahCategory)
                  }
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#E50914] text-white shadow'
                      : 'bg-[#111111] text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] ${
                      active
                        ? 'bg-black/30 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Book Management Table or Grid */}
        {isLoading && books.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#E50914] animate-spin mx-auto" />
            <p className="text-sm text-neutral-400">Memuat data katalog buku...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-[#181818] border border-neutral-800 rounded-xl p-12 text-center space-y-4">
            <BookOpen className="w-10 h-10 text-neutral-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Tidak Ada Buku yang Cocok
              </h3>
              <p className="text-xs text-neutral-400">
                Ubah kata kunci pencarian atau tambahkan buku baru ke dalam katalog.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-white text-xs font-bold hover:bg-[#b80710] transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Buku Baru</span>
            </button>
          </div>
        ) : viewLayout === 'table' ? (
          /* Studio Table View */
          <div className="bg-[#181818] border border-neutral-800/90 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#121212] text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    <th className="py-3.5 px-4">Buku &amp; Sampul</th>
                    <th className="py-3.5 px-4">Penulis &amp; Penerjemah</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Status PDF</th>
                    <th className="py-3.5 px-4 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/70 text-sm">
                  {filteredBooks.map((book) => {
                    const isHero = heroBook?.id === book.id;
                    const isLocalPdf = book.pdfUrl.startsWith('/uploads/');
                    return (
                      <tr
                        key={book.id}
                        className="hover:bg-neutral-800/40 transition group"
                      >
                        {/* Cover & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-11 h-16 object-cover rounded border border-neutral-700 shrink-0 bg-neutral-900"
                            />
                            <div className="min-w-0 max-w-xs sm:max-w-md space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white leading-snug">
                                  {book.title}
                                </span>
                                {isHero && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                    Hero Banner
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-500 truncate">
                                ID: {book.id} &bull; {book.releaseYear} &bull;{' '}
                                {book.pageCount} hal
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Author & Translator */}
                        <td className="py-3.5 px-4">
                          <p className="text-xs sm:text-sm font-medium text-neutral-200">
                            {book.author}
                          </p>
                          {book.translator && (
                            <p className="text-xs text-neutral-400 mt-0.5">
                              Terj: {book.translator}
                            </p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-xs font-medium text-neutral-300">
                            {book.categoryLabel || book.category}
                          </span>
                        </td>

                        {/* PDF Status */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col items-start gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                                isLocalPdf
                                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              <FileText className="w-3 h-3" />
                              {isLocalPdf ? 'PDF Upload Lokal' : 'PDF Stream Ahmadiyah'}
                            </span>
                            <Link
                              href={`/read/${book.id}`}
                              className="text-[11px] text-neutral-400 hover:text-white underline inline-flex items-center gap-1"
                            >
                              <span>Buka Pembaca Web</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Set as Hero Banner */}
                            <button
                              type="button"
                              disabled={isHero || settingHeroId === book.id}
                              onClick={() => handleSetAsHero(book)}
                              title={
                                isHero
                                  ? 'Sedang menjadi Hero Banner aktif'
                                  : 'Jadikan Hero Banner di /browse'
                              }
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                                isHero
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                                  : 'bg-neutral-800 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-neutral-700'
                              }`}
                            >
                              {settingHeroId === book.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    isHero ? 'fill-amber-400 text-amber-400' : ''
                                  }`}
                                />
                              )}
                              <span className="hidden xl:inline">
                                {isHero ? 'Hero Aktif' : 'Jadikan Hero'}
                              </span>
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(book)}
                              title="Edit Buku"
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setBookToDelete(book)}
                              title="Hapus Buku"
                              className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/70 text-red-400 hover:text-red-200 border border-red-900/60 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Studio Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => {
              const isHero = heroBook?.id === book.id;
              return (
                <div
                  key={book.id}
                  className="bg-[#181818] border border-neutral-800 rounded-xl p-4 flex gap-4 hover:border-neutral-700 transition"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded border border-neutral-700 shrink-0 bg-neutral-900"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                          {book.categoryLabel || book.category}
                        </span>
                        {isHero && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            ★ Hero
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-neutral-400 truncate">
                        {book.author}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                      <button
                        type="button"
                        disabled={isHero}
                        onClick={() => handleSetAsHero(book)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer ${
                          isHero
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                        }`}
                      >
                        {isHero ? 'Hero Aktif' : 'Set Hero'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(book)}
                        className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white border border-neutral-700 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookToDelete(book)}
                        className="ml-auto p-1.5 rounded bg-red-950/50 hover:bg-red-900/70 text-red-400 border border-red-900/50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 4. Add & Edit Book Modal Form */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#181818] border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#121212] border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#E50914]" />
                <h2 className="text-lg font-bold text-white">
                  {editingBook ? `Edit Buku: ${editingBook.title}` : 'Tambah Buku Baru ke Katalog'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form
              onSubmit={handleSaveBook}
              className="p-6 overflow-y-auto space-y-6 flex-1"
            >
              {/* Smart Auto-Fetch Box from Ahmadiyah.id */}
              <div className="bg-gradient-to-r from-[#E50914]/15 via-[#1f1f1f] to-[#1f1f1f] border border-[#E50914]/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E50914]">
                  <Wand2 className="w-4 h-4" />
                  <span>Fitur Pintar: Ambil Otomatis dari Link Ahmadiyah.id</span>
                </div>
                <p className="text-xs text-neutral-300">
                  Tempel link halaman detail buku dari{' '}
                  <code className="text-white">https://ahmadiyah.id/pustaka/buku/...</code>{' '}
                  untuk mengekstrak Judul, Penulis, Penerjemah, Sinopsis, Gambar Cover, dan Link PDF secara otomatis.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    placeholder="Contoh: https://ahmadiyah.id/pustaka/buku/tiga-masalah-penting"
                    className="flex-1 bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isScraping}
                    onClick={handleAutoFetchAhmadiyah}
                    className="px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    {isScraping ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengekstrak...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Ambil Otomatis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Book Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Judul Buku <span className="text-[#E50914]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Contoh: Filsafat Ajaran Islam"
                    className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Penulis <span className="text-[#E50914]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, author: e.target.value }))
                    }
                    placeholder="Contoh: Hadhrat Mirza Ghulam Ahmad (as)"
                    className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Penerjemah (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.translator}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        translator: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Mukhlis Ilyas"
                    className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Kategori Pustaka
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as AhmadiyahCategory,
                      }))
                    }
                    className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Judul Asli (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.originalTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        originalTitle: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Islami Ushul Ki Filafasi (Urdu)"
                    className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Tahun Terbit
                    </label>
                    <input
                      type="number"
                      value={formData.releaseYear}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          releaseYear: Number(e.target.value) || 2024,
                        }))
                      }
                      className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Jumlah Halaman
                    </label>
                    <input
                      type="number"
                      value={formData.pageCount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pageCount: Number(e.target.value) || 100,
                        }))
                      }
                      className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Match Rate (%)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={formData.matchRate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          matchRate: Number(e.target.value) || 95,
                        }))
                      }
                      className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image Section (Dual Mode: URL or Local Upload) */}
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Gambar Sampul (Cover Buku)
                  </label>
                  <div className="flex items-center bg-[#1b1b1b] p-1 rounded-lg border border-neutral-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setCoverInputMode('url')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold cursor-pointer transition ${
                        coverInputMode === 'url'
                          ? 'bg-[#E50914] text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Tempel Link URL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverInputMode('upload')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold cursor-pointer transition ${
                        coverInputMode === 'upload'
                          ? 'bg-[#E50914] text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload dari Komputer</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt="Preview Cover"
                      className="w-16 h-24 object-cover rounded border border-neutral-700 shrink-0 bg-neutral-900"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    {coverInputMode === 'url' ? (
                      <input
                        type="text"
                        value={formData.coverImage}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            coverImage: e.target.value,
                          }))
                        }
                        placeholder="https://ahmadiyah.id/wp-content/uploads/..."
                        className="w-full bg-[#181818] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                      />
                    ) : (
                      <div className="space-y-2">
                        <label className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed border-neutral-700 hover:border-[#E50914] rounded-lg cursor-pointer bg-[#181818] transition text-xs font-semibold text-neutral-300">
                          {isUploadingCover ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#E50914]" />
                              <span>Mengunggah Gambar Cover...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-[#E50914]" />
                              <span>Pilih File Gambar (.jpg, .png, .webp)</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'cover')}
                            className="hidden"
                          />
                        </label>
                        {formData.coverImage && (
                          <p className="text-[11px] text-emerald-400 truncate">
                            Tersimpan: {formData.coverImage}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PDF Book File Section (Dual Mode: URL or Local Upload) */}
              <div className="bg-[#121212] border border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    File Buku PDF (Untuk Dibaca Langsung di Web)
                  </label>
                  <div className="flex items-center bg-[#1b1b1b] p-1 rounded-lg border border-neutral-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setPdfInputMode('url')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold cursor-pointer transition ${
                        pdfInputMode === 'url'
                          ? 'bg-[#E50914] text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Tempel Link URL PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfInputMode('upload')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold cursor-pointer transition ${
                        pdfInputMode === 'upload'
                          ? 'bg-[#E50914] text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload PDF dari Komputer</span>
                    </button>
                  </div>
                </div>

                {pdfInputMode === 'url' ? (
                  <input
                    type="text"
                    value={formData.pdfUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pdfUrl: e.target.value,
                      }))
                    }
                    placeholder="https://ahmadiyah.id/download/10719/ atau /uploads/pdfs/..."
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#E50914] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                ) : (
                  <div className="space-y-2">
                    <label className="flex items-center justify-center gap-2 w-full py-3.5 px-4 border-2 border-dashed border-neutral-700 hover:border-[#E50914] rounded-lg cursor-pointer bg-[#181818] transition text-xs font-semibold text-neutral-300">
                      {isUploadingPdf ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#E50914]" />
                          <span>Mengunggah File PDF Buku...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[#E50914]" />
                          <span>Pilih File Buku (.pdf) dari Komputer</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => handleFileUpload(e, 'pdf')}
                        className="hidden"
                      />
                    </label>
                    {formData.pdfUrl && (
                      <p className="text-[11px] text-emerald-400 truncate">
                        File PDF Aktif: {formData.pdfUrl}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Sinopsis / Resensi Buku
                </label>
                <textarea
                  rows={5}
                  value={formData.synopsis}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      synopsis: e.target.value,
                    }))
                  }
                  placeholder="Tuliskan deskripsi atau sinopsis lengkap buku ini..."
                  className="w-full bg-[#111111] border border-neutral-700 focus:border-[#E50914] rounded-lg p-3.5 text-sm text-white focus:outline-none leading-relaxed"
                />
              </div>

              {/* Hero Banner Checkbox */}
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#E50914] rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-amber-300 block">
                    Jadikan Buku Ini Sebagai Hero Banner Utama di /browse
                  </span>
                  <span className="text-neutral-400">
                    Jika dicentang, buku ini akan langsung tampil besar di bagian paling atas halaman utama BOOKFLIX.
                  </span>
                </div>
              </label>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs sm:text-sm font-semibold text-neutral-300 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingBook}
                  className="px-6 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b80710] disabled:opacity-50 text-xs sm:text-sm font-bold text-white transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  {isSavingBook ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{editingBook ? 'Simpan Perubahan' : 'Simpan Buku Baru'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#181818] border border-neutral-700 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Hapus Buku dari Katalog?
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Apakah Anda yakin ingin menghapus buku{' '}
                  <strong className="text-white">&ldquo;{bookToDelete.title}&rdquo;</strong>?
                  Tindakan ini akan langsung memperbarui katalog aktif di halaman <code className="text-neutral-300">/browse</code>.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setBookToDelete(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Buku</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
