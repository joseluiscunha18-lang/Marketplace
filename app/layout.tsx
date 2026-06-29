import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { BottomNav } from '@/components/BottomNav';
import { MarketplaceShell } from '@/components/MarketplaceShell';
import { FlyingImageOverlay } from '@/components/FlyingImageOverlay';

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
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-emerald-500 selection:text-white">
        <CartProvider>
          <UserProvider>
            <Header />
            {/*
              MarketplaceShell detecta a rota no cliente e adiciona
              pb-20 ao <main> apenas nas páginas do marketplace,
              para que o conteúdo não fique tapado pela BottomNav.
            */}
            <MarketplaceShell>
              {children}
            </MarketplaceShell>
            <Footer />
            <CartDrawer />
            <FlyingImageOverlay />
            <BottomNav />
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
