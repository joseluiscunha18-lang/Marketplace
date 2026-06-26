'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Store as StoreIcon, MapPin, CheckCircle2 } from 'lucide-react';
import type { Store } from '@/types';
import { StoreCard } from '@/components/StoreCard';

const LOCATIONS = ['Todas', 'Maputo', 'Matola', 'Beira', 'Nampula'];

export const StoresClient = ({ stores }: { stores: Store[] }) => {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('Todas');

  const filtered = stores.filter((store) => {
    const matchLoc = locationFilter === 'Todas' || store.location.includes(locationFilter);
    const matchQuery = !search.trim() || store.name.toLowerCase().includes(search.toLowerCase()) || store.category.toLowerCase().includes(search.toLowerCase());
    return matchLoc && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-widest">
          <StoreIcon className="w-3.5 h-3.5" /> Directório Oficial Shopyump
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Lojas Online Verificadas</h1>
        <p className="text-sm sm:text-base text-slate-500">
          Conheça negócios locais em Moçambique com catálogo actualizado, atendimento directo pelo WhatsApp e verificação garantida.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome da loja ou categoria..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-3 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-900"
            />
          </div>
          <div className="flex items-center gap-1 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 shrink-0">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none pr-2 cursor-pointer w-full"
            >
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc === 'Todas' ? '📍 Toda Moçambique' : loc}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-slate-500 font-bold text-sm">Nenhuma loja encontrada para esta pesquisa.</p>
          <button onClick={() => { setSearch(''); setLocationFilter('Todas'); }} className="mt-3 text-xs text-emerald-600 font-extrabold underline">
            Ver todas as lojas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((store) => <StoreCard key={store.id} store={store} />)}
        </div>
      )}

      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-black tracking-tight flex items-center justify-center sm:justify-start gap-2">
            Tem um negócio no WhatsApp? <CheckCircle2 className="w-6 h-6 text-amber-300" />
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
            A sua loja pode aparecer aqui com página pública optimizada para o Google, link exclusivo e pedidos automáticos por mensagem.
          </p>
        </div>
        <Link href="/vender" className="px-8 py-4 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs uppercase tracking-wider rounded-full shrink-0 shadow-lg transition-all active:scale-95">
          Criar Minha Loja Agora
        </Link>
      </div>
    </div>
  );
};
