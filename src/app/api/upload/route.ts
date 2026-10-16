import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
const ALLOWED_PDF_EXTENSIONS = ['.pdf'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) || 'auto';

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan dalam permintaan upload.' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'uploaded-file';
    const ext = path.extname(originalName).toLowerCase();

    const isImage =
      ALLOWED_IMAGE_EXTENSIONS.includes(ext) || file.type.startsWith('image/');
    const isPdf =
      ALLOWED_PDF_EXTENSIONS.includes(ext) || file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      return NextResponse.json(
        {
          error:
            'Format file tidak didukung. Gunakan gambar (.jpg, .png, .webp) atau dokumen (.pdf).',
        },
        { status: 400 }
      );
    }

    if (uploadType === 'cover' && !isImage) {
      return NextResponse.json(
        { error: 'File sampul harus berupa gambar (.jpg, .png, .webp).' },
        { status: 400 }
      );
    }

    if (uploadType === 'pdf' && !isPdf) {
      return NextResponse.json(
        { error: 'File buku harus berformat .pdf.' },
        { status: 400 }
      );
    }

    const subFolder = isPdf ? 'pdfs' : 'covers';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'file';

    const safeFileName = `${Date.now()}-${baseName}${ext || (isPdf ? '.pdf' : '.jpg')}`;
    const targetPath = path.join(uploadDir, safeFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(targetPath, buffer);

    const publicUrl = `/uploads/${subFolder}/${safeFileName}`;

    return NextResponse.json({
      url: publicUrl,
      filename: safeFileName,
      originalName,
      size: file.size,
      type: isPdf ? 'pdf' : 'cover',
    });
  } catch (error) {
    console.error('POST /api/upload error:', error);
    return NextResponse.json(
      { error: 'Gagal mengunggah file ke server.' },
      { status: 500 }
    );
  }
}
