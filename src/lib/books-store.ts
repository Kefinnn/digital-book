import fs from 'fs/promises';
import path from 'path';
import { Book, AhmadiyahCategory } from '@/types/book';

const CATALOG_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'ahmadiyah-books.json');

export const CATEGORY_LABELS: Record<AhmadiyahCategory, string> = {
  'imam-mahdi': 'Karya Pendiri / Imam Mahdi',
  khalifah: 'Karya Khalifah',
  ulama: 'Karya Ulama',
  lainnya: 'Buku Lainnya',
};

export const DEFAULT_BACKDROPS: Record<AhmadiyahCategory, string> = {
  'imam-mahdi':
    'https://ahmadiyah.id/wp-content/uploads/2016/04/feature_pustaka.jpg',
  khalifah:
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1920&q=80',
  ulama:
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80',
  lainnya:
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1920&q=80',
};

export function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function readBooksCatalog(): Promise<Book[]> {
  const raw = await fs.readFile(CATALOG_FILE_PATH, 'utf-8');
  return JSON.parse(raw) as Book[];
}

export async function writeBooksCatalog(books: Book[]): Promise<void> {
  await fs.writeFile(CATALOG_FILE_PATH, JSON.stringify(books, null, 2), 'utf-8');
}

export function buildBookObject(
  input: Partial<Book>,
  existing?: Book,
  existingIds: Set<string> = new Set()
): Book {
  const title = (input.title ?? existing?.title ?? 'Buku Baru').trim();
  let id = (input.id ?? existing?.id ?? slugifyTitle(title)).trim();
  if (!id) id = `buku-${Date.now()}`;

  if (!existing && existingIds.has(id)) {
    let counter = 2;
    while (existingIds.has(`${id}-${counter}`)) {
      counter++;
    }
    id = `${id}-${counter}`;
  }

  const category: AhmadiyahCategory =
    (input.category as AhmadiyahCategory) ?? existing?.category ?? 'lainnya';
  const categoryLabel =
    input.categoryLabel ?? CATEGORY_LABELS[category] ?? 'Buku Lainnya';

  const author = (input.author ?? existing?.author ?? 'Pustaka Ahmadiyah Indonesia').trim();
  const translator =
    input.translator !== undefined
      ? input.translator.trim() || undefined
      : existing?.translator;
  const originalTitle =
    input.originalTitle !== undefined
      ? input.originalTitle.trim() || undefined
      : existing?.originalTitle;

  const synopsis = (
    input.synopsis ??
    existing?.synopsis ??
    `Buku "${title}" karya ${author} dari koleksi Pustaka Jemaat Muslim Ahmadiyah Indonesia.`
  ).trim();

  const firstParagraph = synopsis.split('\n\n')[0] || synopsis;
  const shortDescription =
    input.shortDescription ??
    (firstParagraph.length > 160
      ? `${firstParagraph.slice(0, 157)}...`
      : firstParagraph);

  const pageCount = Number(input.pageCount ?? existing?.pageCount ?? 180) || 180;
  const releaseYear =
    Number(input.releaseYear ?? existing?.releaseYear ?? new Date().getFullYear()) ||
    new Date().getFullYear();
  const matchRate = Math.min(
    100,
    Math.max(50, Number(input.matchRate ?? existing?.matchRate ?? 96) || 96)
  );
  const rating = Math.min(
    5,
    Math.max(1, Number(input.rating ?? existing?.rating ?? 4.9) || 4.9)
  );

  const readHours = Math.max(1, Math.round(pageCount / 45));
  const readTimeEstimate =
    input.readTimeEstimate ??
    existing?.readTimeEstimate ??
    `${readHours} jam 15 mnt`;

  const coverImage = (
    input.coverImage ??
    existing?.coverImage ??
    'https://ahmadiyah.id/wp-content/uploads/2020/02/filsafat-ajaran-islam.jpg'
  ).trim();

  const backdropImage = (
    input.backdropImage ??
    existing?.backdropImage ??
    DEFAULT_BACKDROPS[category]
  ).trim();

  const pdfUrl = (
    input.pdfUrl ??
    existing?.pdfUrl ??
    'https://ahmadiyah.id/download/10719/'
  ).trim();

  const tags =
    input.tags && input.tags.length > 0
      ? input.tags
      : [
          categoryLabel,
          ...(translator ? [`Terjemahan: ${translator}`] : []),
          'Pustaka Ahmadiyah',
        ];

  const genre =
    input.genre && input.genre.length > 0
      ? input.genre
      : [categoryLabel, 'Khazanah Islam', 'Literatur Ahmadiyah'];

  return {
    id,
    title,
    ...(originalTitle ? { originalTitle } : {}),
    author,
    ...(translator ? { translator } : {}),
    coverImage,
    backdropImage,
    shortDescription,
    synopsis,
    category,
    categoryLabel,
    genre,
    rating,
    matchRate,
    releaseYear,
    pageCount,
    readTimeEstimate,
    maturityRating: input.maturityRating ?? existing?.maturityRating ?? 'Semua Umur',
    tags,
    pdfUrl,
    detailUrl: input.detailUrl ?? existing?.detailUrl,
    isFeatured: Boolean(input.isFeatured ?? existing?.isFeatured ?? false),
    chapters: [
      {
        id: `${id}-ch-1`,
        title: `Pengantar & Sinopsis: ${title}`,
        durationMinutes: 15,
        content: synopsis,
      },
    ],
  };
}
