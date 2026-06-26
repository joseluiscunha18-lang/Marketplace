'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

const CATEGORIES = ['Tudo', 'Calçado & Moda', 'Tecnologia', 'Moda & Artesanato', 'Beleza & Saúde', 'Casa & Decoração', 'Desporto & Lazer'];

export const MarketplaceClient = ({ products }: { products: Product[] }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tudo');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCat !== 'Tudo') result = result.filter(p => p.category === selectedCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q));
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, search, selectedCat, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Marketplace Shopyump</h1>
          <p className="text-xs sm:text-sm text-slate-300">Descubra {products.length} produtos de lojas verificadas em Moçambique.</p>
        </div>
        <div className="w-full md:w-96 relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar ténis, airpods, capulana..."
            className="w-full bg-slate-800 border border-slate-700 rounded-full pl-12 pr-4 py-3 text-sm font-semibold text-white placeholder:text-slate-400 outline-none focus:border-emerald-500"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white">Limpar</button>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block ml-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="featured">✨ Mais Populares</option>
            <option value="price-asc">💰 Preço: Menor para Maior</option>
            <option value="price-desc">💎 Preço: Maior para Menor</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
          <div className="text-3xl">🔍</div>
          <h3 className="font-bold text-slate-800 text-lg">Nenhum produto encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Não encontrámos resultados para "{search}". Tente palavras mais genéricas.</p>
          <button onClick={() => { setSearch(''); setSelectedCat('Tudo'); }} className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-bold mt-2">
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
};
