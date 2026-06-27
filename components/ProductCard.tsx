'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < fullStars;
          const half = !filled && i === fullStars && hasHalf;
          return (
            <span key={i} className="relative inline-block w-3 h-3">
              {/* background star (empty) */}
              <Star className="w-3 h-3 text-slate-200 fill-slate-200 absolute inset-0" />
              {/* filled portion */}
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? '55%' : '100%' }}
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      <span className="text-[10px] font-bold text-amber-500 leading-none">{rating.toFixed(1)}</span>
      <span className="text-[10px] text-slate-400 font-medium leading-none">({count})</span>
    </div>
  );
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useUser();

  const isFav = isFavorite(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : undefined;
    addToCart(product, defaultSize, defaultColor);
  };

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
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
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

        {/* Quick add — desktop only, appears on hover */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 z-20 py-2.5 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-extrabold flex items-center justify-center gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 md:flex hidden"
        >
          <ShoppingCart className="w-3.5 h-3.5" /> Adicionar ao Carrinho
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5">
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

        {/* Price row */}
        <div className="flex items-center justify-between mt-1 gap-2">
          <div className="flex flex-col leading-none">
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

          {/* Add to cart — mobile only */}
          <button
            onClick={handleAddToCart}
            className="md:hidden w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center active:scale-90 transition-all shadow-sm shrink-0"
            title="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
};
