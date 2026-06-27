'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tag, Store, Heart, User } from 'lucide-react';
import { motion } from 'motion/react';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Início', icon: Home, href: '/' },
    { label: 'Promoções', icon: Tag, href: '/promocoes' },
    { label: 'Lojas', icon: Store, href: '/lojas' },
    { label: 'Favoritos', icon: Heart, href: '/favoritos' },
    { label: 'Conta', icon: User, href: '/conta' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 px-2 py-1 pb-safe md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-2 px-1 relative min-w-[64px] transition-colors"
            >
              <motion.div
                initial={false}
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0
                }}
                className={`${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'fill-emerald-600/10' : ''}`} />
              </motion.div>
              <span className={`text-[10px] font-black mt-1 uppercase tracking-tight ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-0 w-8 h-1 bg-emerald-500 rounded-t-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
