import type { Metadata } from 'next';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { MarketplaceClient } from './MarketplaceClient';

export const metadata: Metadata = {
  title: 'Marketplace — Produtos de Lojas Verificadas em Moçambique',
  description: `Explore ${MOCK_PRODUCTS.length} produtos de lojas locais verificadas em Moçambique. Calçado, tecnologia, moda, beleza, decoração e muito mais. Compra directa via WhatsApp.`,
  alternates: { canonical: 'https://shopyump.com/produtos' },
  openGraph: {
    title: 'Marketplace Shopyump — Compre Produtos Locais em Moçambique',
    description: 'Catálogo completo de produtos de lojas verificadas. Compra directa pelo WhatsApp, sem intermediários.',
    url: 'https://shopyump.com/produtos',
  },
};

export default function ProdutosPage() {
  return <MarketplaceClient products={MOCK_PRODUCTS} />;
}
