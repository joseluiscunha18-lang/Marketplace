'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, MapPin } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

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

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
    >
      {/* Image Box */}
      <div className="aspect-square w-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain object-center group-hover:scale-105 transition-transform duration-500 p-2"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="bg-slate-900 text-amber-300 font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              Destaque
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full text-slate-900 shadow-md border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-slate-900 hover:text-white active:scale-90 md:flex hidden"
          title="Adicionar rapidamente"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 gap-1.5 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-0.5">
            <span className="hover:text-slate-900 hover:underline transition-colors line-clamp-1 truncate pr-1">
              {product.storeName}
            </span>
            <span className="flex items-center gap-0.5 shrink-0 font-medium text-slate-400 text-[10px]">
              <MapPin className="w-2.5 h-2.5" /> {product.storeLocation}
            </span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-slate-100/80 flex items-end justify-between mt-auto gap-2">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-400 font-semibold line-through leading-none mb-0.5">
                {product.originalPrice.toLocaleString('pt-MZ')} MT
              </span>
            )}
            <div className="font-black text-base sm:text-lg text-slate-950 tracking-tight leading-none">
              {product.price.toLocaleString('pt-MZ')} <span className="text-[11px] font-bold text-slate-600">MT</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="md:hidden px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full text-xs font-extrabold flex items-center gap-1 active:scale-95 transition-transform shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> +
          </button>
        </div>
      </div>
    </Link>
  );
};
