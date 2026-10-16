import { NextRequest, NextResponse } from 'next/server';
import {
  readBooksCatalog,
  writeBooksCatalog,
  buildBookObject,
} from '@/lib/books-store';
import { Book } from '@/types/book';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const books = await readBooksCatalog();
    return NextResponse.json(books, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('GET /api/books error:', error);
    return NextResponse.json(
      { error: 'Gagal membaca katalog buku.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Book>;
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Judul buku wajib diisi.' },
        { status: 400 }
      );
    }

    const books = await readBooksCatalog();
    const existingIds = new Set(books.map((b) => b.id));
    const newBook = buildBookObject(body, undefined, existingIds);

    let updatedBooks = books;
    if (newBook.isFeatured) {
      updatedBooks = books.map((b) => ({ ...b, isFeatured: false }));
    }

    updatedBooks = [newBook, ...updatedBooks];
    await writeBooksCatalog(updatedBooks);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('POST /api/books error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan buku baru.' },
      { status: 500 }
    );
  }
}
