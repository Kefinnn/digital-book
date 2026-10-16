import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bookflix - Netflix for Books',
  description: 'Aplikasi membaca buku digital dengan antarmuka dan pengalaman pengguna ala Netflix.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark h-full antialiased bg-[#141414]">
      <body className="min-h-full flex flex-col bg-[#141414] text-[#e5e5e5] select-text">
        {children}
      </body>
    </html>
  );
}
