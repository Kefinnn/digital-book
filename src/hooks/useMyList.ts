'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSavedMyList, saveMyList } from '@/lib/storage';

const EVENT_NAME = 'netbook_mylist_changed';

export function useMyList() {
  const [myList, setMyList] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMyList(getSavedMyList());
    setIsLoaded(true);

    const handleStorageUpdate = () => {
      setMyList(getSavedMyList());
    };

    window.addEventListener(EVENT_NAME, handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const toggleMyList = useCallback((bookId: string) => {
    setMyList((prev) => {
      const exists = prev.includes(bookId);
      const next = exists ? prev.filter((id) => id !== bookId) : [...prev, bookId];
      saveMyList(next);
      window.dispatchEvent(new Event(EVENT_NAME));
      return next;
    });
  }, []);

  const isInMyList = useCallback((bookId: string) => {
    return myList.includes(bookId);
  }, [myList]);

  return {
    myList,
    isInMyList,
    toggleMyList,
    isLoaded,
  };
}
