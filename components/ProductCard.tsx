'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { useUser } from '@/context/UserContext';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {/* Estrela sólida, âmbar nítido, alinhada com o texto */}
      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" style={{ marginTop: '-1px' }} />
      <span className="text-[12px] font-bold text-slate-700 leading-none">{rating.toFixed(1)}</span>
      <span className="text-[12px] text-slate-600 font-normal leading-none">({count.toLocaleString('pt-MZ')})</span>
    </div>
  );
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleFavorite, isFavorite } = useUser();

  const isFav = isFavorite(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] border border-slate-100 hover:border-slate-200"
    >
      {/* Square Image — 1:1 */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden rounded-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges — subtis, integrados */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-black/45 backdrop-blur-sm text-white font-semibold text-[10px] px-1.5 py-0.5 rounded-md tracking-wide">
              -{discountPercent}%
            </span>
          )}
          {product.featured && !discountPercent && (
            <span className="bg-black/35 backdrop-blur-sm text-white/90 font-medium text-[9px] px-1.5 py-0.5 rounded-md tracking-wide">
              Destaque
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${
            isFav
              ? 'bg-red-500 text-white'
              : 'bg-white/70 backdrop-blur-sm text-slate-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content — padding reduzido p-3 para aproximar da imagem */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-0.5">

        {/* Store name — mais contraste: slate-600 em vez de slate-400 */}
        <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest truncate">
          {product.storeName}
        </span>

        {/* Product name — dominante */}
        <h3 className="font-bold text-[13px] text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[2.4em] mt-0.5">
          {product.name}
        </h3>

        {/* Rating — mais contraste, estrela âmbar nítida */}
        {product.rating && product.reviewCount ? (
          <StarRating rating={product.rating} count={product.reviewCount} />
        ) : null}

        {/* Price — valor e MT unificados em tamanho e peso */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-black text-[16px] text-slate-950 tracking-tight leading-none">
            {product.price.toLocaleString('pt-MZ')}
            <span className="text-[13px] font-bold text-slate-700 ml-1">MT</span>
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[12px] text-slate-500 line-through font-normal leading-none">
              {product.originalPrice.toLocaleString('pt-MZ')} MT
            </span>
          )}
        </div>

      </div>
    </Link>
  );
};
