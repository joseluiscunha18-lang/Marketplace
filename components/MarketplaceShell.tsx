'use client';

import { usePathname } from 'next/navigation';

// Rotas onde o padding extra para a BottomNav é necessário
const MARKETPLACE_ROUTES = ['/produtos', '/lojas', '/promocoes', '/favoritos', '/conta', '/produto', '/loja', '/carrinho', '/checkout'];

export const MarketplaceShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isMarketplace = MARKETPLACE_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <main className={`flex-1 ${isMarketplace ? 'pb-24 md:pb-0' : ''}`}>
      {children}
    </main>
  );
};
