export const MY_LIST_STORAGE_KEY = 'netbook_my_list';
export const READING_PROGRESS_KEY = 'netbook_reading_progress';
export const READER_SETTINGS_KEY = 'netbook_reader_settings';

export interface ReaderSettings {
  fontSize: number; // in pixels (e.g., 16, 18, 20, 22)
  fontFamily: 'serif' | 'sans';
  theme: 'dark' | 'sepia' | 'light';
  lineHeight: 'normal' | 'relaxed' | 'loose';
}

export const defaultReaderSettings: ReaderSettings = {
  fontSize: 18,
  fontFamily: 'serif',
  theme: 'dark',
  lineHeight: 'relaxed',
};

export const getSavedMyList = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MY_LIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['filsafat-ajaran-islam', 'riwayat-rasulullah-saw', 'penjelasan-ahmadiyah'];
  } catch (e) {
    console.error('Failed to load my list from storage', e);
    return [];
  }
};

export const saveMyList = (ids: string[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MY_LIST_STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save my list', e);
  }
};

export interface StoredProgress {
  [bookId: string]: {
    chapterId: string;
    percent: number;
    updatedAt: string;
  };
}

export const getStoredProgress = (): StoredProgress => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(READING_PROGRESS_KEY);
    if (!raw) {
      // Default initial progress for continue-reading demo
      return {
        'filsafat-ajaran-islam': { chapterId: 'filsafat-ajaran-islam-ch-1', percent: 45, updatedAt: new Date().toISOString() },
        'riwayat-rasulullah-saw': { chapterId: 'riwayat-rasulullah-saw-ch-1', percent: 30, updatedAt: new Date().toISOString() },
        'penjelasan-ahmadiyah': { chapterId: 'penjelasan-ahmadiyah-ch-1', percent: 70, updatedAt: new Date().toISOString() },
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get reading progress', e);
    return {};
  }
};

export const updateStoredProgress = (bookId: string, chapterId: string, percent: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredProgress();
    current[bookId] = {
      chapterId,
      percent: Math.min(100, Math.max(0, percent)),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to update reading progress', e);
  }
};

export const getReaderSettings = (): ReaderSettings => {
  if (typeof window === 'undefined') return defaultReaderSettings;
  try {
    const raw = localStorage.getItem(READER_SETTINGS_KEY);
    return raw ? { ...defaultReaderSettings, ...JSON.parse(raw) } : defaultReaderSettings;
  } catch (e) {
    return defaultReaderSettings;
  }
};

export const saveReaderSettings = (settings: Partial<ReaderSettings>): void => {
  if (typeof window === 'undefined') return;
  try {
    const current = getReaderSettings();
    const merged = { ...current, ...settings };
    localStorage.setItem(READER_SETTINGS_KEY, JSON.stringify(merged));
  } catch (e) {
    console.error('Failed to save reader settings', e);
  }
};
