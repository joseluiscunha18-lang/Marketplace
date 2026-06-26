import type { Metadata } from 'next';
import { CheckoutClient } from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout — Finalizar Pedido | Shopyump',
  description: 'Finalize o seu pedido de forma simples e rápida. Sem registo necessário. Pedido enviado directamente pelo WhatsApp.',
  robots: { index: false }, // checkout não precisa de indexação
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
