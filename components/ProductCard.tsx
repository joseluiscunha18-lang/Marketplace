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
      <Star className="w-3 h-3 text-slate-700 fill-slate-700 shrink-0" />
      <span className="text-[11px] font-bold text-slate-700 leading-none">{rating.toFixed(1)}</span>
      <span className="text-[11px] text-slate-400 font-normal leading-none">({count.toLocaleString('pt-MZ')})</span>
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
      className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] border border-slate-100 hover:border-slate-200"
    >
      {/* Square Image — 1:1 */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden rounded-t-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wide">
              -{discountPercent}%
            </span>
          )}
          {product.featured && !discountPercent && (
            <span className="bg-slate-900/80 backdrop-blur-sm text-amber-300 font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
              Destaque
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${
            isFav
              ? 'bg-red-500 text-white'
              : 'bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-1.5">
        {/* Store name */}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">
          {product.storeName}
        </span>

        {/* Product name */}
        <h3 className="font-bold text-[13px] text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[2.4em]">
          {product.name}
        </h3>

        {/* Stars — only if rating exists */}
        {product.rating && product.reviewCount ? (
          <StarRating rating={product.rating} count={product.reviewCount} />
        ) : null}

        {/* Price */}
        <div className="flex flex-col leading-none mt-1">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] text-slate-400 line-through font-medium mb-0.5">
              {product.originalPrice.toLocaleString('pt-MZ')} MT
            </span>
          )}
          <span className="font-black text-[15px] text-slate-950 tracking-tight">
            {product.price.toLocaleString('pt-MZ')}{' '}
            <span className="text-[10px] font-bold text-slate-500">MT</span>
          </span>
        </div>
      </div>
    </Link>
  );
};
