'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tag, Store, Heart, User } from 'lucide-react';

// Páginas onde a barra inferior aparece (apenas o marketplace e as suas sub-secções)
const MARKETPLACE_ROUTES = ['/produtos', '/lojas', '/promocoes', '/favoritos', '/conta', '/produto', '/loja'];

export const BottomNav = () => {
  const pathname = usePathname();

  // Só renderiza nas páginas do marketplace
  const shouldShow = MARKETPLACE_ROUTES.some((route) => pathname.startsWith(route));
  if (!shouldShow) return null;

  const navItems = [
    {
      label: 'Início',
      icon: Home,
      href: '/produtos',
      // "Início" do marketplace → lista de produtos
      matchRoutes: ['/produtos'],
    },
    {
      label: 'Promoções',
      icon: Tag,
      href: '/promocoes',
      matchRoutes: ['/promocoes'],
    },
    {
      label: 'Lojas',
      icon: Store,
      href: '/lojas',
      matchRoutes: ['/lojas', '/loja'],
    },
    {
      label: 'Favoritos',
      icon: Heart,
      href: '/favoritos',
      matchRoutes: ['/favoritos'],
    },
    {
      label: 'Conta',
      icon: User,
      href: '/conta',
      matchRoutes: ['/conta'],
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Subtle top shadow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200/80" />

      <div className="bg-white/96 backdrop-blur-xl px-3 pt-2 pb-3">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {navItems.map((item) => {
            const isActive = item.matchRoutes.some((r) =>
              r === '/produtos' ? pathname === '/produtos' : pathname.startsWith(r)
            );
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 relative px-3 py-1 rounded-2xl transition-all duration-200 active:scale-90"
              >
                {/* Active pill background */}
                {isActive && (
                  <span className="absolute inset-0 bg-slate-900/5 rounded-2xl" />
                )}

                {/* Icon container */}
                <span
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                      : 'text-slate-400'
                  }`}
                >
                  <Icon
                    className={`transition-all duration-200 ${
                      isActive ? 'w-4 h-4' : 'w-5 h-5'
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </span>

                {/* Label */}
                <span
                  className={`relative z-10 text-[10px] font-semibold tracking-tight transition-colors duration-200 leading-none ${
                    isActive ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
