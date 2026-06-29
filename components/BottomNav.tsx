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
  if (pathname.startsWith('/checkout/') && pathname.split('/').length > 2) return null;

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
      {/* Subtle top shadow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200/80" />

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

            const inner = (
              <>
                {/* Active pill background */}
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(99,102,241,0.08)' }} />
                )}

                {/* Icon container */}
                <span
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-md'
                      : item.isCart && cartAnimating
                      ? 'text-white shadow-lg scale-110'
                      : 'text-slate-400'
                  }`}
                  style={
                    isActive
                      ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }
                      : item.isCart && cartAnimating
                      ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', transition: 'all 0.3s ease' }
                      : {}
                  }
                >
                  <Icon
                    className={`transition-all duration-200 ${isActive ? 'w-4 h-4' : 'w-5 h-5'}`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {/* Cart badge */}
                  {item.isCart && totalItems > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full text-white font-black text-[9px] flex items-center justify-center px-1 z-20"
                      style={{
                        background: 'linear-gradient(135deg,#ec4899,#f43f5e)',
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
                  className={`relative z-10 text-[10px] font-semibold tracking-tight transition-colors duration-200 leading-none ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
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
                  data-cart-icon={item.isCart ? 'true' : undefined}
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
                data-cart-icon={item.isCart ? 'true' : undefined}
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
