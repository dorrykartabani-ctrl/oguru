import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Manrope, Hanken_Grotesk } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-label',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OGuru — Organic Marketplace',
  description: 'Discover local artisans, farmers, and cafés. Pre-order, gift, and grow together.',
};

export const viewport: Viewport = {
  themeColor: '#4a6410',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'var(--font-body), system-ui, -apple-system, sans-serif',
          backgroundColor: '#fbf9f4',
          color: '#1b1c19',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </body>
    </html>
  );
}
