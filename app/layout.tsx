import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Manrope, Hanken_Grotesk } from 'next/font/google';

const displayFont = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
});

const bodyFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const labelFont = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-label',
});

export const metadata: Metadata = {
  title: 'OGuru — Organic Marketplace',
  description: 'Discover local artisans, farmers, and cafés. Pre-order, gift, and grow together.',
  manifest: '/manifest.json',
  applicationName: 'OGuru',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OGuru',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#4a6410',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${labelFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
