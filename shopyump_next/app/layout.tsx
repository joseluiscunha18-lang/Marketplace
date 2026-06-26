import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { WhatsAppFloating } from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  metadataBase: new URL('https://shopyump.com'),
  title: {
    default: 'Shopyump Moz — Marketplace de Produtos Locais em Moçambique',
    template: '%s | Shopyump',
  },
  description:
    'Descubra produtos autênticos de lojas verificadas em Moçambique. Compre directamente via WhatsApp, sem comissões. SEO local, pedidos automáticos, zero burocracia.',
  keywords: ['marketplace moçambique', 'comprar online maputo', 'lojas online moçambique', 'shopyump', 'produtos locais moz'],
  openGraph: {
    siteName: 'Shopyump Moz',
    locale: 'pt_MZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-500 selection:text-white">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloating />
        </CartProvider>
      </body>
    </html>
  );
}
