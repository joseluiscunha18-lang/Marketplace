import type { Metadata } from 'next';
import { FavoritosClient } from './FavoritosClient';

export const metadata: Metadata = {
  title: 'Meus Favoritos — Shopyump Moz',
  description: 'Seus produtos e lojas favoritas guardados localmente para acesso rápido.',
  robots: { index: false },
};

export default function FavoritosPage() {
  return <FavoritosClient />;
}
