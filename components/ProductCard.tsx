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
    <div className="flex items-center gap-1 mt-0.5">
      <Star className="w-3.5 h-3.5 text-slate-800 fill-slate-800 shrink-0" style={{ marginTop: '-1px' }} />
      <span className="text-[12px] font-bold text-slate-800 leading-none">{rating.toFixed(1)}</span>
      <span className="text-[12px] text-slate-700 font-semibold leading-none">({count.toLocaleString('pt-MZ')})</span>
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
      className="group bg-white rounded-[18px] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 active:scale-[0.98] border border-slate-100 p-1.5"
    >
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden rounded-[14px]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-slate-900/80 backdrop-blur-md text-white font-semibold text-[10px] px-2 py-1 rounded-md tracking-wider shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.featured && !discountPercent && (
            <span className="bg-white/80 backdrop-blur-md text-slate-900 font-semibold text-[10px] px-2 py-1 rounded-md tracking-wider shadow-sm border border-slate-200/50">
              Destaque
            </span>
          )}
        </div>

        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-sm backdrop-blur-md ${
            isFav
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-slate-500 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>
      </div>

      <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-grow justify-between gap-1">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate block mb-0.5">
            {product.storeName}
          </span>

          <h3 className="font-semibold text-[14px] text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors">
            {product.name}
          </h3>

          {product.rating && product.reviewCount ? (
            <StarRating rating={product.rating} count={product.reviewCount} />
          ) : null}
        </div>

        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-extrabold text-[16px] text-slate-900 tracking-tight flex items-baseline">
            {product.price.toLocaleString('pt-MZ')}
            <span className="text-[14px] font-bold text-slate-800 ml-1">MT</span>
          </span>
          
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[12px] text-slate-600 line-through font-medium">
              {product.originalPrice.toLocaleString('pt-MZ')} MT
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
