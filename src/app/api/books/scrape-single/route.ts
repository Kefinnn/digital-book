import { NextRequest, NextResponse } from 'next/server';
import { AhmadiyahCategory } from '@/types/book';

export const dynamic = 'force-dynamic';

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripHtml(html: string): string {
  if (!html) return '';
  return decodeHtmlEntities(
    html
      .replace(/<sup[^>]*>(.*?)<\/sup>/gi, ' ($1)')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function inferCategory(author: string, title: string, html: string): AhmadiyahCategory {
  const combined = `${author} ${title}`.toLowerCase();
  if (
    combined.includes('ghulam ahmad') ||
    combined.includes('masih mau') ||
    combined.includes('imam mahdi')
  ) {
    return 'imam-mahdi';
  }
  if (
    combined.includes('mahmud ahmad') ||
    combined.includes('bashiruddin') ||
    combined.includes('tahir ahmad') ||
    combined.includes('masroor ahmad') ||
    combined.includes('nasir ahmad') ||
    combined.includes('khalifatul masih')
  ) {
    return 'khalifah';
  }
  if (
    combined.includes('basyiruddin') ||
    combined.includes('abdul karim') ||
    combined.includes('zafrulla khan') ||
    combined.includes('maulana') ||
    combined.includes('mln.') ||
    html.toLowerCase().includes('karya ulama')
  ) {
    return 'ulama';
  }
  return 'lainnya';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = (body?.url || '').trim();

    if (!rawUrl) {
      return NextResponse.json(
        { error: 'Masukkan URL halaman buku dari ahmadiyah.id.' },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return NextResponse.json(
        { error: 'Format URL tidak valid.' },
        { status: 400 }
      );
    }

    if (!parsedUrl.hostname.endsWith('ahmadiyah.id')) {
      return NextResponse.json(
        { error: 'URL harus berasal dari domain ahmadiyah.id.' },
        { status: 400 }
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gagal mengakses halaman (${response.status}).` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Extract article content area
    const articleMatch =
      html.match(/<article[\s\S]*?<\/article>/i) ||
      html.match(/<div class="fl-content"[\s\S]*?<\/div>\s*<\/div>/i);
    const articleHtml = articleMatch ? articleMatch[0] : html;

    // 1. Extract Title
    let title = '';
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const ogTitleMatch = html.match(
      /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
    );
    if (h1Match) {
      title = stripHtml(h1Match[1]);
    } else if (ogTitleMatch) {
      title = decodeHtmlEntities(ogTitleMatch[1]);
    }
    title = title
      .replace(/^Download\s+Buku\s+/i, '')
      .replace(/^Buku\s+['"‘’“”]?/i, '')
      .replace(/['"‘’“”]?\s*-\s*Download.*$/i, '')
      .replace(/['"‘’“”]$/i, '')
      .trim();

    // 2. Extract Cover Image
    let coverImage = '';
    const imgRegex = /<img[^>]+src=["'](https:\/\/ahmadiyah\.id\/wp-content\/uploads\/[^"']+)["'][^>]*>/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(articleHtml)) !== null) {
      const src = imgMatch[1];
      if (
        !src.includes('Logo-Ahmadiyah') &&
        !src.includes('services-head') &&
        !src.includes('cropped-favicon')
      ) {
        coverImage = src.replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp))/i, '');
        break;
      }
    }
    if (!coverImage) {
      const ogImgMatch = html.match(
        /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
      );
      if (ogImgMatch) {
        coverImage = ogImgMatch[1];
      }
    }

    // 3. Extract PDF Download URL
    let pdfUrl = '';
    const downloadMatch =
      articleHtml.match(/href=["'](https?:\/\/ahmadiyah\.id\/download\/[^"']+)["']/i) ||
      html.match(/href=["'](https?:\/\/ahmadiyah\.id\/download\/[^"']+)["']/i) ||
      articleHtml.match(/href=["'](https?:\/\/[^"']+\.pdf(?:\?[^"']*)?)["']/i);
    if (downloadMatch) {
      pdfUrl = decodeHtmlEntities(downloadMatch[1]);
    }

    // 4. Extract Paragraphs for Metadata & Synopsis
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    const paragraphs: string[] = [];
    while ((pMatch = pRegex.exec(articleHtml)) !== null) {
      const text = stripHtml(pMatch[1]);
      if (text && text !== '0%' && !text.includes('Love for all hatred for none')) {
        paragraphs.push(text);
      }
    }

    let author = '';
    let translator = '';
    let originalTitle = '';
    let releaseYear = new Date().getFullYear();
    let pageCount = 180;
    const synopsisParagraphs: string[] = [];

    for (const p of paragraphs) {
      const lines = p.split('\n').map((l) => l.trim()).filter(Boolean);
      const isMetaBlock = lines.some((l) =>
        /^(Judul|Nama Buku|Penulis|Karya|Penerjemah|Penerbit|Tebal|Jumlah Halaman|Tahun|Edisi|ISBN)\s*:/i.test(l)
      );

      if (isMetaBlock) {
        for (const line of lines) {
          const mJudul = line.match(/^(?:Judul|Nama Buku)\s*:\s*(.+)$/i);
          if (mJudul && !title) title = mJudul[1].trim();

          const mAsli = line.match(/^Judul Asli\s*:\s*(.+)$/i);
          if (mAsli) originalTitle = mAsli[1].trim();

          const mPenulis = line.match(/^(?:Penulis|Karya|Pengarang)\s*:\s*(.+)$/i);
          if (mPenulis) author = mPenulis[1].trim();

          const mPenerjemah = line.match(/^Penerjemah\s*:\s*(.+)$/i);
          if (mPenerjemah) {
            translator = mPenerjemah[1]
              .replace(/Edisi\s*:.*$/i, '')
              .trim();
          }

          const mHalaman = line.match(/^(?:Tebal|Jumlah Halaman|Halaman)\s*:\s*.*?(\d{2,4})/i);
          if (mHalaman) pageCount = parseInt(mHalaman[1], 10);

          const mTahun = line.match(/^(?:Tahun|Edisi|Cetakan)\s*:\s*.*?(\b(?:19|20)\d{2}\b)/i);
          if (mTahun) releaseYear = parseInt(mTahun[1], 10);
        }
      } else if (
        p.length > 35 &&
        !p.startsWith('Download ') &&
        !p.startsWith('Klik ') &&
        !p.startsWith('Buku lainnya')
      ) {
        synopsisParagraphs.push(p);
      }
    }

    let synopsis = synopsisParagraphs.slice(0, 4).join('\n\n');
    if (!synopsis) {
      const ogDescMatch = html.match(
        /<meta\s+(?:name|property)=["'](?:og:)?description["']\s+content=["']([^"']+)["']/i
      );
      if (ogDescMatch) {
        synopsis = decodeHtmlEntities(ogDescMatch[1]);
      }
    }

    if (!author) {
      author = 'Hadhrat Mirza Ghulam Ahmad (as)';
    }

    const category = inferCategory(author, title, articleHtml);

    return NextResponse.json({
      title: title || 'Buku Pustaka Ahmadiyah',
      originalTitle,
      author,
      translator,
      synopsis,
      coverImage,
      pdfUrl,
      releaseYear,
      pageCount,
      category,
      detailUrl: parsedUrl.toString(),
    });
  } catch (error) {
    console.error('POST /api/books/scrape-single error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengekstrak data dari halaman tersebut.' },
      { status: 500 }
    );
  }
}
