'use client';

import React from 'react';
import { Heart, Store, Package } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { StoreCard } from '@/components/StoreCard';
import { useUser } from '@/context/UserContext';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { MOCK_STORES } from '@/data/mockStores';

export const FavoritosClient = () => {
  const { favorites, favoriteStores } = useUser();

  const favProducts = MOCK_PRODUCTS.filter(p => favorites.includes(p.id));
  const favStores = MOCK_STORES.filter(s => favoriteStores.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" /> Meus Favoritos
        </h1>
        <p className="text-sm text-slate-500">Produtos e lojas que você guardou para ver mais tarde.</p>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Package className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-black text-slate-900">Produtos Favoritos ({favProducts.length})</h2>
        </div>
        
        {favProducts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-slate-400 font-bold text-sm">Nenhum produto guardado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
            {favProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Store className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-black text-slate-900">Lojas Favoritas ({favStores.length})</h2>
        </div>
        
        {favStores.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-slate-400 font-bold text-sm">Nenhuma loja guardada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favStores.map((s) => <StoreCard key={s.id} store={s} />)}
          </div>
        )}
      </section>
    </div>
  );
};
