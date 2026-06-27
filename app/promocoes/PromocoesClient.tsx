'use client';

import React, { useState, useMemo } from 'react';
import { Search, Tag, ArrowUpDown } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

export const PromocoesClient = ({ products }: { products: Product[] }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'discount-desc' | 'price-asc' | 'price-desc'>('discount-desc');

  const promoProducts = useMemo(() => {
    let result = products.filter(p => p.originalPrice && p.originalPrice > p.price);
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.storeName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'discount-desc') {
      result.sort((a, b) => {
        const discA = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
        const discB = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
        return discB - discA;
      });
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-red-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest">
            <Tag className="w-3 h-3" /> Melhores Ofertas
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Promoções & Descontos</h1>
          <p className="text-xs sm:text-sm text-red-100">Economize agora com as melhores oportunidades em Moçambique.</p>
        </div>
        <div className="w-full md:w-96 relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-red-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar em promoções..."
            className="w-full bg-red-700 border border-red-500 rounded-full pl-12 pr-4 py-3 text-sm font-semibold text-white placeholder:text-red-300 outline-none focus:border-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
          {promoProducts.length} itens encontrados
        </h2>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="discount-desc">🔥 Maior Desconto</option>
            <option value="price-asc">💰 Menor Preço</option>
            <option value="price-desc">💎 Maior Preço</option>
          </select>
        </div>
      </div>

      {promoProducts.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
          <div className="text-3xl">🏜️</div>
          <h3 className="font-bold text-slate-800 text-lg">Sem promoções no momento</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Volte mais tarde para conferir as novas ofertas das nossas lojas.</p>
          <button onClick={() => setSearch('')} className="text-xs font-black text-red-600 underline">Limpar pesquisa</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
          {promoProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
};
