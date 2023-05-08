import Head from 'next/head';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'miu 姐帮你看',
  description: '早点下班，开罐罐',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta property="og:title" content="miu 姐帮你看" key="title" />
        <meta
          property="og:image"
          content="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*88xbQaYvP4YAAAAAAAAAAAAADml6AQ/original"
          key="image"
        />
        <meta property="og:description" content="看完下班开罐罐" />
        <meta property="og:type" content="article" />
      </Head>
      <body
        className={inter.className}
        style={{
          padding: 24,
        }}
      >
        {children}
      </body>
    </html>
  );
}
