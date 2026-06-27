import type { Metadata } from 'next';
import { ContaClient } from './ContaClient';

export const metadata: Metadata = {
  title: 'Minha Conta — Shopyump Moz',
  description: 'Gerencie seus dados e veja seu histórico de pedidos realizados via WhatsApp.',
  robots: { index: false },
};

export default function ContaPage() {
  return <ContaClient />;
}
