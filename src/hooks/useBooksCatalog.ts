'use client';

import { useState, useEffect, useCallback } from 'react';
import { Book } from '@/types/book';
import { BOOKS_DATA } from '@/lib/data';

export function useBooksCatalog() {
  const [books, setBooks] = useState<Book[]>(BOOKS_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/books', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as Book[];
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
          return data;
        }
      }
    } catch (err) {
      console.error('Failed to fetch live books catalog:', err);
    } finally {
      setIsLoading(false);
    }
    return books;
  }, []);

  useEffect(() => {
    refreshBooks();
    const handleFocus = () => {
      refreshBooks();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshBooks]);

  return {
    books,
    setBooks,
    isLoading,
    refreshBooks,
  };
}
