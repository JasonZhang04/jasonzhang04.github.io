import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_URL, IS_PUBLIC, absolute } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: 'Chenjia Zhang | Research & Academic Profile',
  description: 'Chenjia Zhang, Johns Hopkins undergraduate researcher. Machine learning for healthcare, multi-agent communication, optimization, and embodied intelligence.',
  icons: {
    icon: [
      { url: '/pixel/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/pixel/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/pixel/apple-touch.png',
  },
  robots: IS_PUBLIC ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: 'Chenjia Zhang',
    description: 'Machine learning for healthcare · Multi-agent systems',
    type: 'website',
    url: `${SITE_URL}/`,
    images: [{ url: absolute('/og.png'), width: 1200, height: 630, alt: 'Chenjia Zhang: machine learning for healthcare and multi-agent systems, beside a pixel-art night lab.' }],
  },
  twitter: { card: 'summary_large_image', images: [absolute('/og.png')], title: 'Chenjia Zhang', description: 'Machine learning for healthcare · Multi-agent systems' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F1F3F3' },
    { media: '(prefers-color-scheme: dark)', color: '#0E191C' },
  ],
};

// Runs before first paint: restores a saved theme to prevent a flash, and picks sizes
// that land on whole device pixels so pixel type and sprites stay crisp at any zoom.
const bootScript = `(function(){var e=document.documentElement;e.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')e.setAttribute('data-theme',t)}catch(n){}var r=window.devicePixelRatio||1,c=function(n){return Math.max(1,Math.round(n*r))/r+'px'},s=e.style;s.setProperty('--u',c(2));s.setProperty('--cell-1',c(1));s.setProperty('--cell-2',c(2));s.setProperty('--cell-3',c(3));s.setProperty('--cell-h2',r<=1?'1px':Math.max(2,Math.round(1.5*r))/r+'px');var q=1.5*r;if(Math.abs(q-Math.round(q))<.01||r>=3)e.classList.add('crisp-portrait')})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <link rel="preload" href="/fonts/GeistPixel-Square.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body id="top">
        {children}
        <script type="module" src="/js/site.js" />
      </body>
    </html>
  );
}
