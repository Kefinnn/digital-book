import fs from 'fs/promises';
import path from 'path';

const SOURCE_API_URL = 'https://ahmadiyah.id/wp-json/wp/v2/pages/5483';
const OUTPUT_PATH = path.join(process.cwd(), 'src/lib/ahmadiyah-books.json');

function decodeHtmlEntities(str = '') {
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/&#215;/g, 'x')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...')
    .replace(/&#039;/g, "'")
    .replace(/\u00a0/g, ' ');
}

function stripTags(html = '') {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

function slugify(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Known detail URLs for items on the catalog page that didn't have an <a> tag on their title
const KNOWN_DETAIL_URLS = {
  'Kekacauan Global serta Kebutuhan Mendesak akan Persatuan Umat Islam':
    'https://ahmadiyah.id/buku-kekacauan-global-serta-kebutuhan-mendesak-akan-persatuan-umat-islam',
  'Keadilan dan Perdamaian Sejati':
    'https://ahmadiyah.id/buku-keadilan-dan-perdamaian-sejati',
};

// High-resolution aesthetic Islamic/library backdrop images per category
const BACKDROP_IMAGES = {
  'imam-mahdi': [
    'https://ahmadiyah.id/wp-content/uploads/2016/04/feature_pustaka.jpg',
    'https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1920&q=80',
  ],
  khalifah: [
    'https://ahmadiyah.id/wp-content/uploads/2016/04/feature_pustaka.jpg',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1920&q=80',
  ],
  ulama: [
    'https://ahmadiyah.id/wp-content/uploads/2016/04/feature_pustaka.jpg',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80',
  ],
  lainnya: [
    'https://ahmadiyah.id/wp-content/uploads/2016/04/feature_pustaka.jpg',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1920&q=80',
  ],
};

function parseGutentorSection(sectionHtml, categoryKey, categoryLabel) {
  const items = [];
  const itemRegex =
    /<div class="gutentor-single-item-wrap">([\s\S]*?)<\/div><\/div><\/div><\/div>/g;
  let match;
  while ((match = itemRegex.exec(sectionHtml)) !== null) {
    const block = match[1];
    const imgMatch = block.match(/<img[^>]+src="([^"]+)"/i);
    const coverImage = imgMatch ? imgMatch[1] : '';

    const titleBlockMatch = block.match(
      /<h3 class="gutentor-single-item-title">([\s\S]*?)<\/h3>/i
    );
    const titleHtml = titleBlockMatch ? titleBlockMatch[1] : '';
    const linkMatch = titleHtml.match(/<a[^>]+href="([^"]+)"/i);
    const rawTitle = stripTags(titleHtml).replace(/\s+/g, ' ').trim();

    let detailOrDownloadUrl = linkMatch ? linkMatch[1].trim() : '';
    if (!detailOrDownloadUrl && KNOWN_DETAIL_URLS[rawTitle]) {
      detailOrDownloadUrl = KNOWN_DETAIL_URLS[rawTitle];
    }

    const descMatch = block.match(
      /<p class="gutentor-single-item-desc">([\s\S]*?)<\/p>/i
    );
    const descText = descMatch ? stripTags(descMatch[1]) : '';

    let author = '';
    let translator = '';

    // Parse Penulis / Editor / Karya and Penerjemah / Penterjemah from descText
    const lines = descText.split('\n').map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^(Penulis|Editor|Karya)\s*:?/i.test(line)) {
        // Check if Penerjemah is on the same line
        if (/Penerjemah|Penterjemah/i.test(line)) {
          const parts = line.split(/(?=Penerjemah|Penterjemah)/i);
          author = parts[0].replace(/^(Penulis|Editor|Karya)\s*:?\s*/i, '').trim();
          translator = parts[1]
            .replace(/^(Penerjemah|Penterjemah)\s*:?\s*/i, '')
            .trim();
        } else {
          author = line
            .replace(/^(Penulis\s*:\s*Penulis\s*:|Penulis|Editor|Karya)\s*:?\s*/i, '')
            .trim();
        }
      } else if (/^(Penerjemah|Penterjemah)\s*:?/i.test(line)) {
        translator = line.replace(/^(Penerjemah|Penterjemah)\s*:?\s*/i, '').trim();
      } else if (translator) {
        translator += ' ' + line;
      } else if (author) {
        author += ' ' + line;
      }
    }

    if (!author) {
      author =
        categoryKey === 'imam-mahdi'
          ? 'Hadhrat Mirza Ghulam Ahmad (as)'
          : 'Tim Pustaka Ahmadiyah';
    }

    items.push({
      title: rawTitle,
      author: author.replace(/\s+/g, ' ').trim(),
      translator: translator.replace(/\s+/g, ' ').trim() || undefined,
      coverImage,
      category: categoryKey,
      categoryLabel,
      sourceUrl: detailOrDownloadUrl,
    });
  }
  return items;
}

function parseOrderedListSection(html, categoryKey, categoryLabel) {
  const items = [];
  const olMatch = html.match(/<ol class="wp-block-list">([\s\S]*?)<\/ol>/i);
  if (!olMatch) return items;

  const liRegex = /<li>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(olMatch[1])) !== null) {
    const liHtml = match[1];
    const linkMatch = liHtml.match(/<a[^>]+href="([^"]+)"/i);
    const url = linkMatch ? linkMatch[1].trim() : '';

    const strongMatch = liHtml.match(/<strong>([\s\S]*?)<\/strong>/i);
    let title = strongMatch ? stripTags(strongMatch[1]) : '';
    const fullText = stripTags(liHtml).replace(/\s+/g, ' ').trim();

    if (!title) {
      title = fullText.split(',')[0].trim();
    }
    title = title.replace(/,\s*$/, '').trim();

    let author = fullText.slice(title.length).replace(/^[,\s”"]+/, '').trim();
    if (!author) author = 'Pustaka Jemaat Ahmadiyah Indonesia';

    items.push({
      title,
      author,
      translator: undefined,
      coverImage: '',
      category: categoryKey,
      categoryLabel,
      sourceUrl: url,
    });
  }
  return items;
}

async function enrichBookFromDetailPage(item, index) {
  const id =
    item.title.toLowerCase().includes('filsafat ajaran islam')
      ? 'filsafat-ajaran-islam'
      : slugify(item.title);

  let pdfUrl = '';
  let detailPageUrl = item.sourceUrl || 'https://ahmadiyah.id/pustaka/buku';
  let synopsis = '';
  let originalTitle = undefined;
  let pageCount = 180;
  let releaseYear = 2018;
  let coverImage = item.coverImage;
  let author = item.author;
  let translator = item.translator;

  const isDirectDownload = /\/download\/\d+/i.test(item.sourceUrl) || /\.pdf($|\?)/i.test(item.sourceUrl);

  if (isDirectDownload) {
    pdfUrl = item.sourceUrl;
  } else if (item.sourceUrl && item.sourceUrl.startsWith('http')) {
    try {
      const res = await fetch(item.sourceUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });
      if (res.ok) {
        const html = await res.text();
        const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
        const contentHtml = articleMatch ? articleMatch[0] : html;

        // 1. Find PDF download link inside article
        const dlMatch =
          contentHtml.match(/href="(https?:\/\/ahmadiyah\.id\/download\/[^"]+)"/i) ||
          contentHtml.match(/href="(https?:\/\/[^"]+\.pdf[^"]*)"/i);
        if (dlMatch) {
          pdfUrl = decodeHtmlEntities(dlMatch[1]);
        }

        // 2. Find better cover image if available
        const imgRegex = /<img[^>]+src="(https?:\/\/ahmadiyah\.id\/wp-content\/uploads\/[^"]+)"/gi;
        let imgM;
        while ((imgM = imgRegex.exec(contentHtml)) !== null) {
          const candidate = imgM[1];
          if (
            !candidate.includes('Logo-Ahmadiyah') &&
            !candidate.includes('logo_jai') &&
            !candidate.includes('services-head')
          ) {
            if (!coverImage || coverImage.includes('default-image')) {
              coverImage = candidate;
            }
            break;
          }
        }

        // 3. Extract metadata & synopsis paragraphs
        const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
        const paragraphs = [];
        let pMatch;
        while ((pMatch = pRegex.exec(contentHtml)) !== null) {
          const text = stripTags(pMatch[1]);
          if (!text) continue;

          // Check if metadata block
          if (/Judul\s*:|Penulis\s*:|Judul Asli\s*:|Isi\s*:|Penerbit\s*:/i.test(text)) {
            const origMatch = text.match(/Judul Asli\s*:\s*([^\n]+)/i);
            if (origMatch) originalTitle = origMatch[1].trim();

            const transMatch = text.match(/(?:Penerjemah|Alih Bahasa|Penterjemah)\s*:\s*([^\n]+)/i);
            if (transMatch && !translator) translator = transMatch[1].trim();

            const authorMatch = text.match(/(?:Penulis|Karya)\s*:\s*([^\n]+)/i);
            if (authorMatch) author = authorMatch[1].trim();

            const pageMatch = text.match(/(\d+)\s*(?:halaman|hal\b)/i);
            if (pageMatch) pageCount = parseInt(pageMatch[1], 10);

            const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
            if (yearMatch) releaseYear = parseInt(yearMatch[1], 10);
            continue;
          }

          if (
            /^Download Buku/i.test(text) ||
            /^Buku Lainnya/i.test(text) ||
            text.length < 35
          ) {
            continue;
          }

          paragraphs.push(text);
        }

        if (paragraphs.length > 0) {
          synopsis = paragraphs.slice(0, 4).join('\n\n');
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch detail page for ${item.title}:`, err.message);
    }
  }

  // Fallback cover image if default-image.jpg or empty
  if (!coverImage || coverImage.includes('default-image.jpg')) {
    coverImage = 'https://ahmadiyah.id/wp-content/uploads/2017/09/filsafat-ajaran-islam.png';
  }

  // Fallback synopsis if none found on detail page
  if (!synopsis) {
    synopsis = `Buku "${item.title}" merupakan karya literatur Islam dari koleksi Pustaka Jemaat Muslim Ahmadiyah Indonesia yang ditulis oleh ${author}${
      translator ? ` dan diterjemahkan oleh ${translator}` : ''
    }. Karya ini menyajikan penjelasan mendalam mengenai ajaran Islam yang damai, rasional, dan relevan dengan perkembangan zaman.`;
  }

  const shortDescription =
    synopsis.split('\n\n')[0].length > 160
      ? synopsis.split('\n\n')[0].slice(0, 157) + '...'
      : synopsis.split('\n\n')[0];

  const backdrops = BACKDROP_IMAGES[item.category] || BACKDROP_IMAGES['imam-mahdi'];
  const backdropImage = backdrops[index % backdrops.length];

  const hours = Math.max(1, Math.floor(pageCount / 45));
  const mins = Math.max(15, (pageCount % 45) + 10);

  // Split synopsis into readable overview chapters for metadata preview
  const synopsisParas = synopsis.split('\n\n').filter(Boolean);

  return {
    id,
    title: item.title,
    originalTitle,
    author,
    translator,
    coverImage,
    backdropImage,
    synopsis,
    shortDescription,
    category: item.category,
    categoryLabel: item.categoryLabel,
    genre: [item.categoryLabel, 'Khazanah Islam', 'Literatur Ahmadiyah'],
    rating: Number((4.8 + (index % 20) * 0.01).toFixed(2)),
    matchRate: 99 - (index % 8),
    releaseYear,
    pageCount,
    readTimeEstimate: `${hours} jam ${mins} mnt`,
    maturityRating: 'Semua Umur',
    tags: [
      item.categoryLabel,
      translator ? `Terjemahan: ${translator}` : 'Bahasa Indonesia',
      'Pustaka Ahmadiyah',
    ],
    pdfUrl: pdfUrl || 'https://ahmadiyah.id/download/10719/',
    detailUrl: detailPageUrl,
    isFeatured:
      id === 'filsafat-ajaran-islam' ||
      id === 'riwayat-rasulullah-saw' ||
      id === 'al-wasiat' ||
      id === 'penjelasan-ahmadiyah',
    chapters: [
      {
        id: `${id}-ch-1`,
        title: `Pengantar & Sinopsis: ${item.title}`,
        durationMinutes: 15,
        content: synopsisParas.join('\n\n'),
      },
    ],
  };
}

async function main() {
  console.log('Fetching catalog from', SOURCE_API_URL);
  const res = await fetch(SOURCE_API_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch catalog: ${res.status}`);
  }
  const data = await res.json();
  const html = data.content.rendered;

  // Extract 3 Gutentor sections + 1 ordered list section
  const section1Match = html.match(
    /<section id="section-0bdca643-2707-425f-8a8f-d174f61d8414"[\s\S]*?<\/section>/i
  );
  const section2Match = html.match(
    /<section id="section-ca2147c1-90cc-492c-ab52-e3609aa2ec2e"[\s\S]*?<\/section>/i
  );
  const section3Match = html.match(
    /<section id="section-5a67c9e3-b7fc-4323-8538-d40af3d2b0c5"[\s\S]*?<\/section>/i
  );

  const imamMahdiBooks = section1Match
    ? parseGutentorSection(
        section1Match[0],
        'imam-mahdi',
        'Karya Pendiri / Imam Mahdi'
      )
    : [];
  const ulamaBooks = section2Match
    ? parseGutentorSection(section2Match[0], 'ulama', 'Karya Ulama')
    : [];
  const khalifahBooks = section3Match
    ? parseGutentorSection(section3Match[0], 'khalifah', 'Karya Khalifah')
    : [];
  const lainnyaBooks = parseOrderedListSection(
    html,
    'lainnya',
    'Buku Lainnya'
  );

  const allRawBooks = [
    ...imamMahdiBooks,
    ...khalifahBooks,
    ...ulamaBooks,
    ...lainnyaBooks,
  ];

  console.log(
    `Found ${allRawBooks.length} books across 4 categories:` +
      `\n - Karya Pendiri / Imam Mahdi: ${imamMahdiBooks.length}` +
      `\n - Karya Khalifah: ${khalifahBooks.length}` +
      `\n - Karya Ulama: ${ulamaBooks.length}` +
      `\n - Buku Lainnya: ${lainnyaBooks.length}`
  );

  // Enrich in batches of 6 to be fast and polite
  const enrichedBooks = [];
  const batchSize = 6;
  for (let i = 0; i < allRawBooks.length; i += batchSize) {
    const batch = allRawBooks.slice(i, i + batchSize);
    console.log(
      `Scraping detail pages ${i + 1}-${Math.min(
        i + batchSize,
        allRawBooks.length
      )} of ${allRawBooks.length}...`
    );
    const results = await Promise.all(
      batch.map((item, idx) => enrichBookFromDetailPage(item, i + idx))
    );
    enrichedBooks.push(...results);
  }

  // Ensure unique IDs
  const seenIds = new Set();
  for (const book of enrichedBooks) {
    let uniqueId = book.id;
    let counter = 2;
    while (seenIds.has(uniqueId)) {
      uniqueId = `${book.id}-${counter++}`;
    }
    book.id = uniqueId;
    seenIds.add(uniqueId);
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(enrichedBooks, null, 2), 'utf8');
  console.log(`Successfully saved ${enrichedBooks.length} books to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
