import type { Metadata } from 'next';
import { Playfair_Display, Nunito } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/query-provider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "JR's Kitchen",
  description: 'Authentic Mamak cuisine — scan to view our menu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${nunito.variable} font-nunito`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}