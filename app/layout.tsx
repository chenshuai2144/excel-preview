import { Metadata } from 'next';

import './globals.css';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from './style/registry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'miu 姐帮你看',
  description: '早点下班，开罐罐',
  openGraph: {
    title: 'miu 姐帮你看',
    description: '早点下班，开罐罐',
    type: 'article',
    images:
      'https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*88xbQaYvP4YAAAAAAAAAAAAADml6AQ/original',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{
          padding: 24,
          color: 'rgb(255, 255, 255)',
          background: `linear-gradient(to bottom, transparent, rgb(0, 0, 0) ) rgb(6, 6, 6)`,
        }}
      >
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
