import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MapPin, Package, ArrowRight, Star, Heart } from 'lucide-react';
import type { Store } from '@/types';
import { useUser } from '@/context/UserContext';

export const StoreCard: React.FC<{ store: Store }> = ({ store }) => {
  const { toggleFavoriteStore, isFavoriteStore } = useUser();
  const isFav = isFavoriteStore(store.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteStore(store.id);
  };

  return (
    <Link
      href={`/loja/${store.slug}`}
      className="group bg-white rounded-3xl border border-slate-100 hover:border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-28 bg-slate-100 overflow-hidden shrink-0">
        <Image
          src={store.banner}
          alt={store.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-90 ${
            isFav 
              ? 'bg-red-500 border-red-500 text-white shadow-md' 
              : 'bg-white/80 backdrop-blur-md border-slate-100 text-slate-900/40 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
          {store.category}
        </span>
      </div>

      <div className="px-5 relative -mt-8 flex items-end justify-between z-10">
        <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center overflow-hidden relative">
          <Image src={store.logo} alt={store.name} fill className="object-cover rounded-xl" sizes="64px" />
        </div>
        <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-full text-xs font-bold mb-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {store.rating.toFixed(1)}
        </div>
      </div>

      <div className="p-5 pt-3 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-black text-lg text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
              {store.name}
            </h3>
            {store.verified && <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500/10 shrink-0" />}
          </div>
          <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">{store.description}</p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 mt-auto">
          <span className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {store.location}
          </span>
          <span className="flex items-center gap-1 font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            <Package className="w-3.5 h-3.5 text-emerald-500" /> {store.productCount} produtos
            <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </span>
        </div>
      </div>
    </Link>
  );
};
