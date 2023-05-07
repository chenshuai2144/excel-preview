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
