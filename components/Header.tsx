'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Store, Sparkles, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const MARKETPLACE_ROUTES = ['/produtos', '/lojas', '/promocoes', '/favoritos', '/conta', '/produto', '/loja'];

export const Header = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Páginas sem distrações
  if (pathname === '/checkout' || pathname.startsWith('/checkout/')) return null;
  if (pathname === '/carrinho') return null;

  const isMarketplace = MARKETPLACE_ROUTES.some((r) => pathname.startsWith(r));

  const navLinks = [
    { label: 'Início', route: '/' },
    { label: 'Marketplace', route: '/produtos' },
    { label: 'Lojas', route: '/lojas' },
    { label: 'Vender na Shopyump', route: '/vender', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black tracking-tighter shadow-md">
            SY
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-1">
            Shopyump
            <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
              Moz
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.route || (link.route !== '/' && pathname.startsWith(link.route));
            if (link.highlight) {
              return (
                <Link
                  key={link.route}
                  href={link.route}
                  className="ml-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.route}
                href={link.route}
                className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isActive ? 'text-slate-900 bg-slate-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Ícone de pesquisa — só nas páginas de marketplace mobile */}
          {isMarketplace && (
            <Link
              href="/produtos"
              className="md:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Procurar produtos"
            >
              <Search className="w-5 h-5" />
            </Link>
          )}

          {/* Carrinho */}
          <button
            onClick={() => setIsCartOpen(true)}
            data-cart-icon="true"
            className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all active:scale-95"
            aria-label="Carrinho de Compras"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Menu hambúrguer — só aparece nas páginas NÃO marketplace em mobile */}
          {!isMarketplace && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer — só nas páginas não marketplace */}
      {!isMarketplace && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.route}
              href={link.route}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-between ${
                link.highlight
                  ? 'bg-slate-900 text-white mt-4 shadow-md'
                  : pathname === link.route
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                {link.route === '/lojas' && <Store className="w-4 h-4 text-slate-400" />}
                {link.highlight && <Sparkles className="w-4 h-4 text-amber-300" />}
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
