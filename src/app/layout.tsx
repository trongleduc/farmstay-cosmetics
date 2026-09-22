import type { Metadata, Viewport } from 'next';
import { Montserrat, Playfair_Display } from 'next/font/google';

import { site } from '@/lib/site';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
});

// Font chữ chung của toàn site. Tiêu đề lớn vẫn dùng Playfair Display.
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Mỹ phẩm chăm sóc da Hàn Quốc`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'Farmstay',
    'mỹ phẩm Hàn Quốc',
    'chăm sóc da',
    'K-Beauty',
    'collagen',
    'hyaluronic acid',
    'serum',
    'toner',
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — Mỹ phẩm chăm sóc da Hàn Quốc`,
    description: site.description,
    url: '/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Mỹ phẩm chăm sóc da Hàn Quốc`,
    description: site.description,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${montserrat.variable}`}
    >
      <head>
        {/*
          Khi trình duyệt tắt JavaScript, hiệu ứng reveal không bao giờ được kích hoạt
          nên nội dung phải hiện sẵn. Dùng <noscript> thay vì script sửa class trên
          <html>: không đụng vào DOM trước lúc hydrate nên không lệch server/client.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: '<style>[data-reveal]{opacity:1!important;transform:none!important}</style>',
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-ink">{children}</body>
    </html>
  );
}
