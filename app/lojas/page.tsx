import type { Metadata } from 'next';
import { MOCK_STORES } from '@/data/mockStores';
import { StoresClient } from './StoresClient';

export const metadata: Metadata = {
  title: 'Lojas Verificadas em Moçambique — Directório Oficial Shopyump',
  description: 'Encontre lojas locais verificadas em Maputo, Matola, Beira e Nampula. Catálogos actualizados, atendimento directo pelo WhatsApp.',
  alternates: { canonical: 'https://shopyump.com/lojas' },
  openGraph: {
    title: 'Directório de Lojas Online Verificadas — Shopyump Moz',
    description: 'Todas as lojas locais verificadas num só lugar. Compre com segurança directamente pelo WhatsApp.',
    url: 'https://shopyump.com/lojas',
  },
};

export default function LojasPage() {
  return <StoresClient stores={MOCK_STORES} />;
}
