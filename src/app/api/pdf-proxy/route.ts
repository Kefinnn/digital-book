import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = new Set([
  'ahmadiyah.id',
  'www.ahmadiyah.id',
  'alislam.org',
  'www.alislam.org',
]);

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Parameter "url" wajib disertakan.' },
      { status: 400 }
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json(
      { error: 'Format URL PDF tidak valid.' },
      { status: 400 }
    );
  }

  if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return NextResponse.json(
      { error: 'Domain sumber PDF tidak diizinkan.' },
      { status: 403 }
    );
  }

  try {
    const requestHeaders: HeadersInit = {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/pdf,application/octet-stream,*/*;q=0.8',
      Referer: 'https://ahmadiyah.id/pustaka/buku',
    };

    // Forward Range header if browser PDF viewer requests byte ranges
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      requestHeaders['Range'] = rangeHeader;
    }

    const upstreamResponse = await fetch(parsedUrl.toString(), {
      method: 'GET',
      headers: requestHeaders,
      redirect: 'follow',
    });

    if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
      return NextResponse.json(
        {
          error: `Gagal mengambil PDF dari server sumber (Status: ${upstreamResponse.status})`,
        },
        { status: upstreamResponse.status }
      );
    }

    const responseHeaders = new Headers();
    // Force inline PDF display so browser renders it directly instead of downloading
    responseHeaders.set('Content-Type', 'application/pdf');
    responseHeaders.set('Content-Disposition', 'inline; filename="pustaka-ahmadiyah.pdf"');
    responseHeaders.set('X-Content-Type-Options', 'nosniff');
    responseHeaders.set('Cache-Control', 'public, max-age=86400');

    const contentLength = upstreamResponse.headers.get('content-length');
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength);
    }

    const contentRange = upstreamResponse.headers.get('content-range');
    if (contentRange) {
      responseHeaders.set('Content-Range', contentRange);
    }

    const acceptRanges = upstreamResponse.headers.get('accept-ranges');
    responseHeaders.set('Accept-Ranges', acceptRanges || 'bytes');

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('PDF Proxy Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat melakukan streaming dokumen PDF.' },
      { status: 500 }
    );
  }
}
