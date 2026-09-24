import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Manrope, Hanken_Grotesk } from 'next/font/google';
import './globals.css';

// 1. Be Vietnam Pro (Display Font)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

// 2. Manrope (Variable Body Font - NO explicit weight array needed)
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// 3. Hanken Grotesk (Variable Label Font - NO explicit weight array needed)
const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-label',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Oguru — Specialty Coffee & Bakery Pre-orders',
  description:
    'Find your perfect café, your way. Pre-order marketing, live slot availability, gift treats to friends, and skip the morning queue.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${beVietnamPro.variable} ${manrope.variable} ${hankenGrotesk.variable}`}
    >
      <body className="bg-[#f6f4eb] text-[#1b1c19] antialiased selection:bg-[#4a6410] selection:text-white">
        {children}
      </body>
    </html>
  );
}
