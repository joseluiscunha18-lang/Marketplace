'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tag, ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Páginas onde a barra inferior aparece (apenas o marketplace e as suas sub-secções)
const MARKETPLACE_ROUTES = ['/produtos', '/lojas', '/promocoes', '/favoritos', '/conta', '/produto', '/loja', '/checkout', '/carrinho'];

export const BottomNav = () => {
  const pathname = usePathname();
  const { totalItems, cartAnimating } = useCart();

  // Página de checkout por loja — sem distrações
  if (pathname === '/checkout' || pathname.startsWith('/checkout/')) return null;

  // Só renderiza nas páginas do marketplace
  const shouldShow = MARKETPLACE_ROUTES.some((route) => pathname.startsWith(route));
  if (!shouldShow) return null;

  const navItems = [
    {
      label: 'Início',
      icon: Home,
      href: '/produtos',
      matchRoutes: ['/produtos'],
      onClick: undefined,
    },
    {
      label: 'Promoções',
      icon: Tag,
      href: '/promocoes',
      matchRoutes: ['/promocoes'],
      onClick: undefined,
    },
    {
      label: 'Carrinho',
      icon: ShoppingCart,
      href: '/carrinho',
      matchRoutes: ['/carrinho'],
      onClick: undefined,
      badge: totalItems,
      isCart: true,
    },
    {
      label: 'Favoritos',
      icon: Heart,
      href: '/favoritos',
      matchRoutes: ['/favoritos'],
      onClick: undefined,
    },
    {
      label: 'Conta',
      icon: User,
      href: '/conta',
      matchRoutes: ['/conta'],
      onClick: undefined,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className="backdrop-blur-xl px-3 pt-2 pb-3 rounded-t-3xl shadow-2xl"
        style={{ background: 'rgba(255,255,255,0.97)' }}
      >
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {navItems.map((item) => {
            const isActive = item.matchRoutes.some((r) =>
              r === '/produtos' ? pathname === '/produtos' : pathname.startsWith(r)
            );
            const Icon = item.icon;

            const cartColored = item.isCart && (cartAnimating || totalItems > 0);

            const inner = (
              <>
                {/* Icon container */}
                <span
                  data-cart-icon={item.isCart ? 'true' : undefined}
                  className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                    cartColored
                      ? 'w-11 h-11 text-white shadow-lg' + (cartAnimating ? ' scale-110' : '')
                      : isActive
                      ? 'w-9 h-9 text-[#171717]'
                      : 'w-9 h-9 text-[#8a6d4f]'
                  }`}
                  style={cartColored ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', transition: 'all 0.3s ease' } : {}}
                >
                  <Icon
                    className={`transition-all duration-200 ${cartColored ? 'w-[22px] h-[22px]' : 'w-[22px] h-[22px]'}`}
                    strokeWidth={cartColored ? 2.2 : 1.8}
                    fill="currentColor"
                  />
                  {/* Cart badge */}
                  {item.isCart && totalItems > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-white font-black text-[10px] flex items-center justify-center px-1 z-20"
                      style={{
                        background: '#171717',
                        border: '2px solid #fff',
                        transform: cartAnimating ? 'scale(1.3)' : 'scale(1)',
                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </span>

                {/* Label */}
                <span
                  className={`relative z-10 text-[10px] tracking-tight transition-colors duration-200 leading-none ${
                    isActive ? 'font-bold text-[#171717]' : 'font-semibold text-[#8a6d4f]'
                  }`}
                >
                  {item.label}
                </span>
              </>
            );

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex flex-col items-center gap-1 relative px-3 py-1 rounded-2xl transition-all duration-200 active:scale-90"
                >
                  {inner}
                </button>
              );
            }

            return (
              <Link
                key={item.href!}
                href={item.href!}
                className="flex flex-col items-center gap-1 relative px-3 py-1 rounded-2xl transition-all duration-200 active:scale-90"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
