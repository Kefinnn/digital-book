export interface Chapter {
  id: string;
  title: string;
  durationMinutes: number;
  content: string; // Markdown or rich text paragraphs
}

export type AhmadiyahCategory =
  | 'imam-mahdi'
  | 'khalifah'
  | 'ulama'
  | 'lainnya';

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  translator?: string;
  coverImage: string; // High-res portrait book cover from ahmadiyah.id
  backdropImage: string; // Wide landscape hero/banner image
  synopsis: string;
  shortDescription: string;
  category: AhmadiyahCategory;
  categoryLabel?: string;
  genre: string[];
  rating: number; // e.g. 4.9
  matchRate: number; // Netflix style: "98% Match"
  releaseYear: number;
  pageCount: number;
  readTimeEstimate: string; // e.g. "4 jam 30 mnt"
  maturityRating: 'Semua Umur' | '13+' | '17+' | '18+';
  tags: string[];
  pdfUrl: string; // Direct download/stream URL on ahmadiyah.id
  detailUrl?: string; // Source detail page on ahmadiyah.id
  chapters: Chapter[];
  isFeatured?: boolean;
}

export type CategoryKey =
  | 'continue-reading'
  | 'imam-mahdi'
  | 'khalifah'
  | 'ulama'
  | 'lainnya';

export interface BookCategoryRow {
  id: string;
  title: string;
  subtitle?: string;
  books: Book[];
}

export interface ReadingProgress {
  bookId: string;
  lastReadChapterId: string;
  progressPercent: number; // 0 to 100
  updatedAt: string;
}
