import { Book } from '@/types/book';

export const BOOKS_DATA: Book[] = [
  {
    id: 'dune-chronicles',
    title: 'Dune: Kronik Arrakis',
    originalTitle: 'Dune',
    author: 'Frank Herbert',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Petualangan epik di planet gurun Arrakis memperebutkan rempah spice termahal di alam semesta.',
    synopsis: 'Berlatar ribuan tahun di masa depan, Duke Leto Atreides menerima mandat untuk mengelola planet gurun Arrakis, satu-satunya sumber rempah misterius "spice" yang memperpanjang hidup dan memungkinkan perjalanan antarbintang. Ketika konspirasi brutal menghancurkan keluarganya, putranya, Paul Atreides, melarikan diri ke padang pasir bersama kaum Fremen untuk memenuhi takdir luar biasa yang akan mengubah seluruh galaksi.',
    category: 'sci-fi',
    genre: ['Fiksi Ilmiah', 'Petualangan Epik', 'Politik Galaksi'],
    rating: 4.9,
    matchRate: 99,
    releaseYear: 1965,
    pageCount: 688,
    readTimeEstimate: '11 jam 20 mnt',
    maturityRating: '13+',
    tags: ['Mahakarya', 'Space Opera', 'Fiksi Epik', 'Best Seller Dunia'],
    isFeatured: true,
    chapters: [
      {
        id: 'dune-ch-1',
        title: 'Bab 1: Permulaan di Caladan',
        durationMinutes: 25,
        content: `Sebuah awal adalah waktu yang sangat rapuh. Sangat penting bagi kita untuk berhati-hati dalam menimbang setiap timbangan yang ada di alam raya ini.

Di kastil kuno Caladan, ruangan batu megah tempat Paul Atreides menghabiskan masa kecilnya terasa dingin. Angin laut membanting debur ombak ke tebing karang di bawah balkon. Besok mereka akan berangkat ke Arrakis—planet pasir yang membara, mematikan, sekaligus menyimpan harta terbesar di imperium galaksi.

Wanita tua berjubah hitam kelam dari persaudaraan Bene Gesserit, Yang Mulia Pendeta Helen Mohiam, telah tiba di malam buta. Mata dinginnya menatap tajam ke arah Paul.

"Duduklah di sini, Nak," perintahnya dengan intonasi rendah yang seolah menggetarkan sendi-sendi kehendak Paul. The Voice—senjata vokal rahasia ordo kuno itu—terasa merambat di udara.

Paul menarik napas perlahan. Ayahnya, Duke Leto, selalu mendidiknya untuk waspada dan tenang di hadapan bahaya. "Siapa Anda sebenarnya?" tanya Paul dengan nada terukur.

"Aku yang menguji apakah kau benar-benar manusia atau sekadar hewan yang bertubuh manusia," sahut sang Pendeta seraya mengeluarkan sebuah kotak logam kecil berwarna hijau pekat dari balik lipatan jubahnya.`
      },
      {
        id: 'dune-ch-2',
        title: 'Bab 2: Ujian Gom Jabbar',
        durationMinutes: 30,
        content: `"Masukkan tangan kananmu ke dalam kotak ini," kata wanita tua itu.

Paul menatap kotak berukuran sekitar lima belas sentimeter persegi itu. Bagian depannya terbuka gelap gulita, tanpa ada pantulan cahaya sedikit pun. Di tangan kirinya, sang Pendeta memegang jarum beracun berwarna kuning berkilap—Gom Jabbar, pembunuh berkecepatan detik.

"Jika kau menarik tanganmu sebelum kuizinkan, jarum ini akan menembus lehermu. Kematian seketika," desis wanita itu.

Paul memasukkan tangannya ke dalam rongga gelap kotak tersebut. Pada detik-detik awal, tidak ada yang terjadi selain rasa dingin. Namun perlahan, kehangatan mulai menjalar di ujung-ujung jarinya. Rasa hangat berubah menjadi panas mendidih. Dalam hitungan napas, sensasinya meledak bagai daging yang dipanggang langsung di atas bara api kosmik!

Keringat dingin membasahi pelipis Paul. Seluruh insting hewani dalam tubuhnya menjerit untuk menarik tangan keluar dari neraka kecil itu. Namun di dalam benaknya, sebuah mantra kuno mengalir:

"Aku tidak boleh takut. Ketakutan adalah pembunuh pikiran. Ketakutan adalah kematian kecil yang membawa kehancuran total. Aku akan menghadapi ketakutanku..."`
      },
      {
        id: 'dune-ch-3',
        title: 'Bab 3: Selamat Datang di Arrakis',
        durationMinutes: 35,
        content: `Pesawat angkut raksasa Heighliner milik Guild Navigator akhirnya melepaskan armada House Atreides di orbit Arrakis. Dari kaca kokpit, dunia itu terlihat seperti permata ambar yang kering dan tak kenal ampun.

Panas gurun menyengat wajah Leto dan Paul begitu pintu ramp kargo terbuka di bandara Arrakeen. Bau rempah spice—seperti kayu manis yang bercampur dengan debu belerang kering—langsung memenuhi indra penciuman.

Di kejauhan, cacing pasir raksasa Shai-Hulud berkeliaran di bawah lautan pasir yang tak bertepi. Di sinilah takdir baru akan dimulai.`
      }
    ]
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    originalTitle: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Perubahan kecil bernilai dahsyat: cara praktis membangun kebiasaan baik dan membuang kebiasaan buruk.',
    synopsis: 'Kerap kali kita mengira bahwa untuk mengubah hidup, kita harus berpikir dalam skala raksasa. Namun James Clear membuktikan bahwa transformasi sejati berasal dari akumulasi ratusan keputusan kecil—dari push-up harian hingga bangun sepuluh menit lebih awal. Inilah panduan ilmiah langkah-demi-langkah yang membongkar 4 hukum perubahan perilaku.',
    category: 'self-help',
    genre: ['Pengembangan Diri', 'Psikologi', 'Produktivitas'],
    rating: 4.95,
    matchRate: 98,
    releaseYear: 2018,
    pageCount: 320,
    readTimeEstimate: '5 jam 15 mnt',
    maturityRating: 'Semua Umur',
    tags: ['Buku Terlaris New York Times', 'Wajib Baca', 'Mindset', 'Efektivitas'],
    isFeatured: true,
    chapters: [
      {
        id: 'atomic-ch-1',
        title: 'Bab 1: Kekuatan Mengejutkan dari Kebiasaan Mikro',
        durationMinutes: 20,
        content: `Nasib tim balap sepeda Inggris berubah drastis pada suatu hari di tahun 2003. Organisasi British Cycling merekrut Dave Brailsford sebagai direktur performa mereka yang baru.

Selama hampir seabad, para atlet sepeda Inggris hanya mencatat prestasi medioker. Sejak 1908, mereka hanya mengoleksi satu medali emas di Olimpiade. Bahkan produsen sepeda ternama Eropa menolak menjual sepeda balap kepada tim Inggris karena khawatir nama merek mereka tercoreng.

Brailsford membawa strategi yang ia sebut "agregasi keuntungan marjinal" (aggregation of marginal gains). Filosofinya sangat sederhana: carilah peningkatan 1 persen pada setiap hal kecil yang Anda lakukan. Jika Anda menggabungkan semua perbaikan 1 persen itu, hasil akumulasinya akan mencengangkan.

Mereka mendesain ulang jok sepeda agar lebih ergonomis. Mereka menguji kain aerodinamis di terowongan angin. Mereka menginstruksikan atlet mencuci tangan dengan teknik dokter bedah untuk meminimalkan flu. Hasilnya? Pada Olimpiade Beijing 2008, tim Inggris menyapu bersih 60 persen medali emas trek sepeda!`
      },
      {
        id: 'atomic-ch-2',
        title: 'Bab 2: Kebiasaan Membentuk Identitas Anda',
        durationMinutes: 22,
        content: `Mengapa sangat sulit mengubah kebiasaan kita? Alasan utamanya adalah kita mencoba mengubah hal yang salah.

Ada tiga tingkatan perubahan perilaku:
1. Perubahan pada Hasil (Outcomes) - Menurunkan berat badan, menerbitkan buku.
2. Perubahan pada Proses (Process) - Menerapkan jadwal lari baru, merapikan meja kerja.
3. Perubahan pada Identitas (Identity) - Mengubah keyakinan Anda tentang siapa diri Anda.

Sebagian besar orang memulai dengan berfokus pada HASIL: "Aku ingin lari maraton." Pendekatan berbasis identitas berfokus pada: "Aku adalah seorang pelari."

Tujuan Anda bukanlah membaca buku; tujuannya adalah menjadi seorang pembaca. Setiap tindakan yang Anda ambil adalah sebuah suara (vote) untuk tipe orang yang ingin Anda wujudkan.`
      }
    ]
  },
  {
    id: 'filosofi-teras',
    title: 'Filosofi Teras',
    originalTitle: 'Filosofi Teras: Mental Tangguh Masa Kini',
    author: 'Henry Manampiring',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Penerapan Stoisisme kuno Yunani-Romawi untuk mengatasi kecemasan dan stres generasi modern.',
    synopsis: 'Lebih dari 2.000 tahun lalu, mazhab filsafat Stoa lahir di teras berpilar kota Athena. Henry Manampiring mengemas pemikiran Seneca, Epiktetos, dan Marcus Aurelius dalam bahasa santai, relevan, dan jenaka. Menjelaskan dikotomi kendali: apa yang ada di bawah kendali kita dan apa yang di luar kendali kita demi mencapai ketenangan batin sejati (ataraxia).',
    category: 'self-help',
    genre: ['Filsafat Praktis', 'Kesehatan Mental', 'Buku Indonesia Populer'],
    rating: 4.88,
    matchRate: 96,
    releaseYear: 2018,
    pageCount: 346,
    readTimeEstimate: '5 jam 45 mnt',
    maturityRating: 'Semua Umur',
    tags: ['Buku Fenomenal', 'Bebas Overthinking', 'Stoisisme'],
    isFeatured: false,
    chapters: [
      {
        id: 'teras-ch-1',
        title: 'Bab 1: Survei Khawatir Nasional',
        durationMinutes: 18,
        content: `Berapa banyak dari kita yang menghabiskan waktu luang dengan memikirkan hal-hal yang belum tentu terjadi?

Kekhawatiran tentang saldo rekening akhir bulan, celetukan bos kemarin siang, atau komentar sinis netizen di media sosial. Kita sering kali merasa terbebani oleh dunia yang bergerak serba cepat.

Dalam filsafat Stoisisme (Filosofi Teras), akar dari hampir seluruh penderitaan emosional kita bukanlah peristiwa itu sendiri, melainkan persepsi atau opini kita terhadap peristiwa tersebut.

Marcus Aurelius, salah satu kaisar teragung Romawi kuno yang juga seorang filsuf Stoa, pernah menulis dalam catatan pribadinya: "Jika kamu tertekan oleh hal-hal eksternal, bukan hal itu yang menyakitimu, melainkan penilaianmu tentangnya. Dan kamu memiliki kuasa untuk mencabut penilaian itu kapan saja."`
      },
      {
        id: 'teras-ch-2',
        title: 'Bab 2: Dikotomi Kendali',
        durationMinutes: 24,
        content: `Epiktetos mengajarkan satu prinsip paling fundamental: di alam semesta ini ada hal-hal yang berada di bawah kendali kita (in our control), dan ada hal-hal yang tidak berada di bawah kendali kita (out of our control).

Di bawah kendali kita:
- Pikiran kita sendiri
- Reaksi dan respon kita
- Keinginan dan tujuan kita
- Tindakan etis kita

Di luar kendali kita:
- Opini orang lain tentang kita
- Cuaca, kemacetan, bencana alam
- Hasil ujian atau keputusan atasan
- Masa lalu dan masa depan

Kebahagiaan dan kedamaian dimulai saat kita berhenti membuang energi berharga pada hal-hal yang tidak bisa kita atur.`
      }
    ]
  },
  {
    id: 'project-hail-mary',
    title: 'Project Hail Mary',
    originalTitle: 'Project Hail Mary',
    author: 'Andy Weir',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Seorang ilmuwan terbangun sendirian di luar angkasa dengan amnesia, memikul nasib miliaran nyawa Bumi.',
    synopsis: 'Ryland Grace adalah satu-satunya penyintas dalam misi nekat antariksa untuk menyelamatkan Matahari dari mikroba alien misterius yang menguras energinya. Hanya saja, dia baru saja terbangun dari koma panjang dan lupa siapa namanya sendiri. Dengan berbekal sains murni dan teman tak terduga dari kejauhan bintang, ia harus memecahkan misteri kosmik sebelum kepunahan massal tiba.',
    category: 'sci-fi',
    genre: ['Fiksi Ilmiah Keras', 'Antariksa', 'Misteri Kosmik'],
    rating: 4.92,
    matchRate: 97,
    releaseYear: 2021,
    pageCount: 496,
    readTimeEstimate: '8 jam 30 mnt',
    maturityRating: '13+',
    tags: ['Sci-Fi Terbaik Dekade Ini', 'Penuh Humor Cerdas', 'Sains Realistis'],
    isFeatured: false,
    chapters: [
      {
        id: 'phm-ch-1',
        title: 'Bab 1: Suara Komputer dan Lampu Putih',
        durationMinutes: 22,
        content: `"Berapa hasil dari dua tambah dua?"

Suara robotik itu membangunkanku dari kehampaan. Mataku terasa lengket, paru-paruku perih seolah menghirup udara berbau desinfektan kimiawi. Aku tidak bisa menggerakkan lengan.

"Dua tambah dua?" suara itu mengulang.

Bibirku pecah-pecah. Dengan susah payah, aku mengembuskan udara lewat tenggorokan kering: "Empat."

"Bagus. Berapa akar kuadrat dari seratus dua puluh satu?"

"Sebelas..." jawabku terengah.

"Fungsi kognitif dasar pulih." 

Lampu di atap ruangan mulai berpendar lembut. Ketika aku menoleh ke kanan dan ke kiri, aku melihat dua sosok manusia lain di ranjang silinder serupa. Namun mereka tidak bernapas. Kulit mereka telah kering keriput menjadi mumi kelabu. Aku satu-satunya yang selamat.`
      }
    ]
  },
  {
    id: 'sapiens',
    title: 'Sapiens: Riwayat Singkat Umat Manusia',
    originalTitle: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Bagaimana spesies kera yang tak berdaya menaklukkan Bumi dan menciptakan peradaban global.',
    synopsis: 'Seratus ribu tahun lalu, setidaknya ada enam spesies manusia yang menghuni planet ini. Hari ini hanya tersisa satu: Homo sapiens. Yuval Noah Harari membawa pembaca melintasi tiga revolusi besar—Revolusi Kognitif, Revolusi Pertanian, dan Revolusi Ilmiah—untuk menjawab bagaimana kita menciptakan uang, agama, negara, dan sains melalui imajinasi kolektif.',
    category: 'trending',
    genre: ['Sejarah Dunia', 'Antropologi', 'Sains Populer'],
    rating: 4.85,
    matchRate: 95,
    releaseYear: 2014,
    pageCount: 512,
    readTimeEstimate: '9 jam 10 mnt',
    maturityRating: 'Semua Umur',
    tags: ['Masterpiece', 'Pemikiran Global', 'Wajib Baca'],
    isFeatured: false,
    chapters: [
      {
        id: 'sapiens-ch-1',
        title: 'Bab 1: Hewan yang Tak Penting',
        durationMinutes: 28,
        content: `Sekitar 13,5 miliar tahun lalu, materi, energi, waktu, dan ruang tercipta dalam apa yang kita kenal sebagai Big Bang. Kisah tentang fitur-fitur fundamental alam semesta ini dinamakan fisika.

Sekitar 300.000 tahun kemudian, materi dan energi mulai menyatu membentuk struktur kompleks yang disebut atom, yang kemudian bergabung membentuk molekul. Kisah atom dan molekul dinamakan kimia.

Dan kira-kira 2,5 juta tahun lalu di Afrika Timur, makhluk-makhluk yang mirip dengan kita mulai membuat alat-alat batu sederhana. Namun selama ratusan ribu tahun, mereka tidak lebih berdampak bagi ekosistem dibanding gorila, kunang-kunang, atau ubur-ubur. Mereka hanyalah salah satu kera di tengah belantara.`
      }
    ]
  },
  {
    id: 'psychology-of-money',
    title: 'The Psychology of Money',
    originalTitle: 'The Psychology of Money: Timeless lessons on wealth, greed, and happiness',
    author: 'Morgan Housel',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Pelajaran abadi mengenai kekayaan, keserakahan, dan kebahagiaan di balik keputusan finansial manusia.',
    synopsis: 'Kesuksesan finansial bukanlah tentang seberapa pintar Anda dalam rumus matematika keuangan, melainkan tentang bagaimana perilaku emosional Anda memperlakukan uang. Morgan Housel membagikan 19 cerita pendek berwawasan tajam yang membongkar biases psikologis dan seni mencapai kebebasan waktu yang sesungguhnya.',
    category: 'business',
    genre: ['Keuangan Pribadi', 'Psikologi Perilaku', 'Ekonomi'],
    rating: 4.89,
    matchRate: 94,
    releaseYear: 2020,
    pageCount: 256,
    readTimeEstimate: '4 jam 40 mnt',
    maturityRating: 'Semua Umur',
    tags: ['Kecerdasan Finansial', 'Best Seller Global', 'Mindset Sukses'],
    isFeatured: false,
    chapters: [
      {
        id: 'money-ch-1',
        title: 'Bab 1: Tidak Ada Orang yang Benar-Benar Gila',
        durationMinutes: 20,
        content: `Pengalaman pribadi Anda dengan uang barangkali hanya mencakup 0,00000001% dari apa yang pernah terjadi di dunia finansial, tetapi mungkin mewakili 80% dari cara Anda berpikir tentang bagaimana dunia bekerja.

Orang-orang dari generasi berbeda, dibesarkan oleh orang tua berlatar belakang ekonomi berlainan, di belahan bumi berlainan, memiliki nilai-nilai yang sama sekali berbeda tentang risiko.

Seseorang yang tumbuh dewasa di era Depresi Besar 1930-an memandang pasar saham dengan ketakutan yang tak pernah dipahami oleh generasi yang tumbuh di era ledakan teknologi 1990-an. Keduanya bersikap rasional berdasarkan pengalaman hidup masing-masing.`
      }
    ]
  },
  {
    id: 'laut-bercerita',
    title: 'Laut Bercerita',
    originalTitle: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Sebuah novel menyentuh tentang aktivis yang dihilangkan secara paksa dan keluarga yang tak pernah berhenti mencari.',
    synopsis: 'Jakarta, 1998. Biru Laut, seorang mahasiswa sastra Inggris yang kritis bersama rekan-rekan aktivisnya di kelompok Winatra, diculik dan disekap di tempat tak dikenal. Disiksa tanpa ampun hingga akhirnya dibuang ke dasar samudra yang sunyi. Sementara itu, adiknya, Asmara Jati, bersama keluarga para korban terus berjuang mencari kebenaran dalam heningnya ketidakpastian.',
    category: 'trending',
    genre: ['Fiksi Sejarah', 'Sastra Indonesia', 'Drama Kemanusiaan'],
    rating: 4.96,
    matchRate: 99,
    releaseYear: 2017,
    pageCount: 379,
    readTimeEstimate: '6 jam 15 mnt',
    maturityRating: '17+',
    tags: ['Karya Sastra Agung', 'Mengharukan', 'Penghargaan Sastra Khatulistiwa'],
    isFeatured: true,
    chapters: [
      {
        id: 'laut-ch-1',
        title: 'Bab 1: Di Dasar Laut yang Gelap',
        durationMinutes: 20,
        content: `Mati, bagi sebagian orang, mungkin adalah urusan yang berlangsung cepat dan selesai. Namun bagiku, mati adalah sebuah proses panjang yang dingin.

Tubuhku terikat pada rantai besi dan balok semen berat. Air asin laut Kepulauan Seribu perlahan mengisi rongga dadaku, dingin menusuk hingga ke sumsum tulang. Cahaya matahari dari permukaan perlahan memudar, berganti dengan birunya kegelapan samudra yang tak berdasar.

Di kedalaman ini, aku masih mendengar suara bapak yang sedang menyeduh kopi sore di teras rumah kami di Solo, dan wangi tengkleng masakan ibu di hari Minggu yang hangat.`
      }
    ]
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    originalTitle: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Keahlian berharga untuk fokus tanpa distraksi di tengah dunia yang bising dan penuh notifikasi.',
    synopsis: 'Deep work adalah kemampuan untuk berkonsentrasi tanpa teralihkan pada tugas kognitif yang menuntut. Ini adalah keterampilan super di abad ke-21. Cal Newport menyajikan argumen kuat bahwa kemampuan fokus mendalam kian langka sekaligus semakin berharga di pasar ekonomi modern.',
    category: 'self-help',
    genre: ['Produktivitas', 'Karier & Bisnis', 'Fokus Mental'],
    rating: 4.82,
    matchRate: 91,
    releaseYear: 2016,
    pageCount: 304,
    readTimeEstimate: '5 jam 00 mnt',
    maturityRating: 'Semua Umur',
    tags: ['Fokus Tinggi', 'Bebas Distraksi', 'Produktivitas Puncak'],
    isFeatured: false,
    chapters: [
      {
        id: 'deep-ch-1',
        title: 'Bab 1: Hipotesis Deep Work',
        durationMinutes: 18,
        content: `Di sebuah pondok kayu sederhana di tepi Danau Zurich, Carl Jung biasa mengunci diri berjam-jam untuk menulis dan merumuskan teori psikologi analitisnya. Pondok itu tidak memiliki listrik maupun sambungan telepon.

Jung memahami rahasia yang kerap dilupakan oleh masyarakat modern: karya-karya revolusioner yang abadi lahir dari konsentrasi yang tidak terinterupsi.

Ketika Anda beralih bolak-balik antara membuka email, memeriksa media sosial, dan menulis laporan, sisa perhatian (attention residue) tertinggal di tugas sebelumnya. Anda tidak pernah benar-benar bekerja dengan daya otak 100%.`
      }
    ]
  },
  {
    id: 'neuromancer',
    title: 'Neuromancer',
    originalTitle: 'Neuromancer',
    author: 'William Gibson',
    coverImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Novel cyberpunk legendaris yang menciptakan istilah Cyberspace dan meramalkan dunia digital masa depan.',
    synopsis: 'Case pernah menjadi peretas konsol terbaik di dunia siber, mencuri rahasia dari megakorporasi adidaya. Namun ketika tertangkap mencuri dari majikannya, sistem sarafnya diracuni dengan mikotoksin yang melumpuhkan aksesnya ke Matriks. Kini, seorang mantan perwira militer misterius menawarinya kesembuhan dengan satu syarat: melakukan pencurian data terbesar dalam sejarah umat manusia.',
    category: 'sci-fi',
    genre: ['Cyberpunk', 'Fiksi Ilmiah', 'Distopia'],
    rating: 4.79,
    matchRate: 93,
    releaseYear: 1984,
    pageCount: 271,
    readTimeEstimate: '4 jam 50 mnt',
    maturityRating: '17+',
    tags: ['Pelopor Cyberpunk', 'Pemenang Hugo & Nebula', 'Kultur Populer'],
    isFeatured: false,
    chapters: [
      {
        id: 'neuro-ch-1',
        title: 'Bab 1: Langit di Atas Pelabuhan Chiba',
        durationMinutes: 20,
        content: `Langit di atas pelabuhan Chiba berwarna seperti layar televisi yang disetel ke saluran tanpa sinyal.

"Bukan urusanku," gumam Ratz seraya mengelap meja bar dengan lap basah bernoda bir kusam. Lengannya yang terbuat dari prostetik militer Rusia mendesing lirih setiap kali sendi motoriknya berputar.

Case duduk di sudut bar Chatsubo, menatap gelas wiski sintetisnya. Di jalanan Chiba City yang disiram hujan asam dan neon lampu halogen ungu, orang-orang berjalan cepat di bawah payung plastik transparan. Di sinilah para pencari suku cadang organ tubuh ilegal dan tentara bayaran digital berkumpul.`
      }
    ]
  },
  {
    id: 'bumi-manusia',
    title: 'Bumi Manusia',
    originalTitle: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Kisah cinta Minke dan Annelies di masa kolonial Hindia Belanda di tengah gelora kesadaran kebangsaan.',
    synopsis: 'Minke, seorang pribumi cerdas yang menuntut ilmu di HBS Surabaya, terpikat oleh pesona Annelies Mellema, putri dari Nyai Ontosoroh—seorang perempuan gigih yang mengelola perkebunan besar Wonokromo dengan keberanian luar biasa melawan ketidakadilan hukum kolonial Belanda. Roman sejarah yang menggetarkan tentang harga diri dan kemanusiaan.',
    category: 'fiction',
    genre: ['Sastra Klasik', 'Roman Sejarah', 'Kemanusiaan'],
    rating: 4.97,
    matchRate: 99,
    releaseYear: 1980,
    pageCount: 535,
    readTimeEstimate: '9 jam 40 mnt',
    maturityRating: '13+',
    tags: ['Tetralogi Buru', 'Mahakarya Sastra Dunia', 'Wajib Baca Nasional'],
    isFeatured: false,
    chapters: [
      {
        id: 'bumi-ch-1',
        title: 'Bab 1: Menatap Fajar Abad Modern',
        durationMinutes: 26,
        content: `Orang memanggilku: Minke. Namaku sendiri... sementara tak perlu kusebutkan. Bukan karena gila misteri. Aku tahu pembaca takkan merugi karena tidak mengetahui nama asliku.

Suatu hari di awal abad keduapuluh. Bumi bergerak maju dengan roda-roda besi tenaga uap dan cetak kilat surat kabar. Ilmu pengetahuan modern Eropa telah menyihirku. Aku merasa bangga menjadi salah satu dari segelintir anak pribumi yang bisa bersekolah di HBS Surabaya.

Lalu sahabatku, Robert Suurhof, mengajakku bertaruh untuk mengunjungi seorang gadis Indo tercantik di Wonokromo... Annelies Mellema.`
      }
    ]
  },
  {
    id: 'cosmos',
    title: 'Cosmos',
    originalTitle: 'Cosmos',
    author: 'Carl Sagan',
    coverImage: 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    shortDescription: 'Penjelajahan puitis dan memukau tentang 15 miliar tahun evolusi kosmik dan sains peradaban manusia.',
    synopsis: 'Kosmos adalah segala sesuatu yang ada, pernah ada, atau akan selalu ada. Melalui narasi Carl Sagan yang puitis sekaligus berpijak kokoh pada metode ilmiah, buku ini mengupas bagaimana manusia—sebagai "debu bintang yang bisa berpikir"—berusaha memahami tempatnya di tengah miliaran galaksi yang membentang tak terbatas.',
    category: 'trending',
    genre: ['Astronomi', 'Sains Populer', 'Kosmologi'],
    rating: 4.93,
    matchRate: 97,
    releaseYear: 1980,
    pageCount: 384,
    readTimeEstimate: '6 jam 45 mnt',
    maturityRating: 'Semua Umur',
    tags: ['Buku Sains Terbaik', 'Puitis & Mencerahkan', 'Klasik Abadi'],
    isFeatured: false,
    chapters: [
      {
        id: 'cosmos-ch-1',
        title: 'Bab 1: Tepian Samudra Kosmik',
        durationMinutes: 24,
        content: `Kosmos adalah segalanya yang ada, pernah ada, atau akan pernah ada. Kontemplasi sekecil apa pun tentang Kosmos akan menggetarkan jiwa kita—sebuah sensasi meremang di tulang belakang, suara yang tercekat di kerongkongan, atau kenangan samar bagai terjatuh dari ketinggian.

Kita tahu bahwa kita sedang mendekati misteri terbesar dari segala misteri.

Bumi adalah sebuah tempat yang sangat kecil di arena kosmik yang teramat luas. Jika kita dihempaskan secara acak ke suatu titik di alam semesta, kemungkinan kita berada di dekat sebuah planet adalah kurang dari satu berbanding satu miliar miliar miliar. Ruang antariksa sebagian besar adalah kehampaan dingin yang sunyi.`
      }
    ]
  },
  {
    id: 'show-your-work',
    title: 'Show Your Work!',
    originalTitle: 'Show Your Work!: 10 Ways to Share Your Creativity and Get Discovered',
    author: 'Austin Kleon',
    coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    backdropImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1920&q=80',
    shortDescription: '10 cara berani membagikan proses kreatif Anda, membangun audiens, dan ditemukan oleh dunia.',
    synopsis: 'Anda tidak harus menjadi seorang jenius untuk mulai berkarya dan membagikannya ke khalayak luas. Austin Kleon memperlihatkan bahwa di era jejaring digital saat ini, keterbukaan proses (process sharing) jauh lebih bernilai dan memikat daripada sekadar memamerkan hasil akhir.',
    category: 'business',
    genre: ['Kreativitas', 'Pengembangan Karier', 'Desain & Seni'],
    rating: 4.81,
    matchRate: 92,
    releaseYear: 2014,
    pageCount: 224,
    readTimeEstimate: '3 jam 10 mnt',
    maturityRating: 'Semua Umur',
    tags: ['Panduan Praktis', 'Inspiratif', 'Kreativitas Digital'],
    isFeatured: false,
    chapters: [
      {
        id: 'show-ch-1',
        title: 'Bab 1: Anda Tidak Perlu Menjadi Jenius',
        durationMinutes: 15,
        content: `Ada mitos usang tentang sosok jenius penyendiri—seorang master yang menghabiskan waktu bertahun-tahun di dalam gua gelap, lalu tiba-tiba keluar mempersembahkan mahakarya sempurna kepada dunia.

Kenyataannya, ide-ide hebat hampir selalu lahir dari sebuah jaringan pemikir, pengrajin, dan pecinta seni yang saling berbagi gagasan mentah. Musisi Brian Eno menyebut konsep ini sebagai "scenius" (kecerdasan kolektif sebuah komunitas skena).

Jadilah seorang amatir yang antusias. Orang amatir memiliki keunggulan yang tidak dimiliki para ahli kaku: mereka bebas bereksperimen, tidak takut salah, dan mencintai proses belajar secara terbuka.`
      }
    ]
  }
];

export const CATEGORY_ROWS = [
  {
    id: 'continue-reading',
    title: 'Lanjutkan Membaca',
    subtitle: 'Buku yang terakhir Anda buka',
    filter: (book: Book) => ['dune-chronicles', 'atomic-habits', 'filosofi-teras'].includes(book.id)
  },
  {
    id: 'trending',
    title: 'Trending Sekarang',
    subtitle: 'Paling banyak dibaca minggu ini',
    filter: (book: Book) => book.matchRate >= 95
  },
  {
    id: 'sci-fi',
    title: 'Fiksi Ilmiah & Petualangan Epik',
    subtitle: 'Jelajahi batas imajinasi dan kosmos luas',
    filter: (book: Book) => book.category === 'sci-fi' || book.genre.includes('Fiksi Ilmiah')
  },
  {
    id: 'self-help',
    title: 'Pengembangan Diri & Pola Pikir',
    subtitle: 'Tingkatkan produktivitas dan kedamaian batin Anda',
    filter: (book: Book) => book.category === 'self-help' || book.category === 'business'
  },
  {
    id: 'popular',
    title: 'Bestseller Pilihan Redaksi',
    subtitle: 'Karya sastra dan buku ikonik yang dicintai pembaca',
    filter: (book: Book) => book.rating >= 4.85
  }
];
