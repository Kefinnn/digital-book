'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStoredProgress, updateStoredProgress, StoredProgress } from '@/lib/storage';

const PROGRESS_EVENT = 'netbook_progress_changed';

export function useReadingProgress() {
  const [progressMap, setProgressMap] = useState<StoredProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgressMap(getStoredProgress());
    setIsLoaded(true);

    const handleUpdate = () => {
      setProgressMap(getStoredProgress());
    };

    window.addEventListener(PROGRESS_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const saveProgress = useCallback((bookId: string, chapterId: string, percent: number) => {
    updateStoredProgress(bookId, chapterId, percent);
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }, []);

  const getBookProgress = useCallback(
    (bookId: string) => {
      return progressMap[bookId] || null;
    },
    [progressMap]
  );

  return {
    progressMap,
    getBookProgress,
    saveProgress,
    isLoaded,
  };
}
