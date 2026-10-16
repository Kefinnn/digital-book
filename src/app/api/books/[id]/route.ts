import { NextRequest, NextResponse } from 'next/server';
import {
  readBooksCatalog,
  writeBooksCatalog,
  buildBookObject,
} from '@/lib/books-store';
import { Book } from '@/types/book';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const books = await readBooksCatalog();
    const book = books.find((b) => b.id === id);

    if (!book) {
      return NextResponse.json(
        { error: `Buku dengan ID "${id}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json(book, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('GET /api/books/[id] error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil detail buku.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await req.json()) as Partial<Book> & { setAsHero?: boolean };

    const books = await readBooksCatalog();
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: `Buku dengan ID "${id}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    const existingBook = books[index];
    const updatedBook = buildBookObject(
      { ...body, id: existingBook.id },
      existingBook
    );

    const makeHero = Boolean(body.setAsHero || body.isFeatured);

    const updatedBooks = books.map((b, idx) => {
      if (idx === index) {
        return {
          ...updatedBook,
          isFeatured: makeHero ? true : Boolean(body.isFeatured ?? existingBook.isFeatured),
        };
      }
      if (makeHero) {
        return { ...b, isFeatured: false };
      }
      return b;
    });

    await writeBooksCatalog(updatedBooks);
    return NextResponse.json(updatedBooks[index]);
  } catch (error) {
    console.error('PUT /api/books/[id] error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data buku.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const books = await readBooksCatalog();
    const exists = books.some((b) => b.id === id);

    if (!exists) {
      return NextResponse.json(
        { error: `Buku dengan ID "${id}" tidak ditemukan.` },
        { status: 404 }
      );
    }

    const remainingBooks = books.filter((b) => b.id !== id);
    await writeBooksCatalog(remainingBooks);

    return NextResponse.json({
      success: true,
      deletedId: id,
      totalRemaining: remainingBooks.length,
    });
  } catch (error) {
    console.error('DELETE /api/books/[id] error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus buku.' },
      { status: 500 }
    );
  }
}
