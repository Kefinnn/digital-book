import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bookflix - Pustaka Buku Digital Ahmadiyah Indonesia',
  description: 'Baca langsung koleksi buku Islam dari Pustaka Jemaat Muslim Ahmadiyah Indonesia (ahmadiyah.id) di dalam browser tanpa perlu download.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark h-full scroll-smooth antialiased bg-[#141414]">
      <body className="min-h-full flex flex-col bg-[#141414] text-[#e5e5e5] select-text">
        {children}
      </body>
    </html>
  );
}
