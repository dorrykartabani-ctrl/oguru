import './globals.css';
import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Manrope, Hanken_Grotesk } from 'next/font/google';

const displayFont = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

const bodyFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const labelFont = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'OGuru',
  description: 'Pre-order from your neighbourhood’s best.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.className} ${bodyFont.className} ${labelFont.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
