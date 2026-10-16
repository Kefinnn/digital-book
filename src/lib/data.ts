import { Book } from '@/types/book';
import ahmadiyahBooks from './ahmadiyah-books.json';

export const BOOKS_DATA: Book[] = ahmadiyahBooks as Book[];

export const CATEGORY_ROWS = [
  {
    id: 'imam-mahdi',
    title: 'Karya Pendiri / Imam Mahdi',
    subtitle: 'Koleksi buku dan risalah karya Hadhrat Mirza Ghulam Ahmad (as)',
    filter: (book: Book) => book.category === 'imam-mahdi',
  },
  {
    id: 'khalifah',
    title: 'Karya Khalifah',
    subtitle: 'Kumpulan buku, khotbah, dan wejangan para Khalifatul Masih',
    filter: (book: Book) => book.category === 'khalifah',
  },
  {
    id: 'ulama',
    title: 'Karya Ulama',
    subtitle: 'Sirah Nabawiyah, tafsir, dan kajian keislaman karya para ulama Ahmadiyah',
    filter: (book: Book) => book.category === 'ulama',
  },
  {
    id: 'lainnya',
    title: 'Buku Lainnya',
    subtitle: 'Tanggapan ilmiah, pedoman ibadah, dan kajian isu kontemporer',
    filter: (book: Book) => book.category === 'lainnya',
  },
  {
    id: 'continue-reading',
    title: 'Pilihan Populer & Lanjutkan Membaca',
    subtitle: 'Buku rujukan utama yang sering dibaca pengunjung',
    filter: (book: Book) =>
      [
        'filsafat-ajaran-islam',
        'riwayat-rasulullah-saw',
        'penjelasan-ahmadiyah',
        'khutbah-ilhamiyah',
        'tiga-masalah-penting',
        'inti-ajaran-islam-bagian-pertama',
      ].includes(book.id),
  },
];
