import type { Metadata } from 'next';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { PromocoesClient } from './PromocoesClient';

export const metadata: Metadata = {
  title: 'Promoções & Descontos em Moçambique — Shopyump',
  description: 'As melhores ofertas e descontos das lojas verificadas em Moçambique. Economize agora em calçado, tecnologia, moda e muito mais.',
  alternates: { canonical: 'https://shopyump.com/promocoes' },
};

export default function PromocoesPage() {
  return <PromocoesClient products={MOCK_PRODUCTS} />;
}
