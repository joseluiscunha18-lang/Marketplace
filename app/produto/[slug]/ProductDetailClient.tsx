'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, MapPin, ShieldCheck, ShoppingCart, ArrowLeft, Check, Share2, Heart } from 'lucide-react';
import type { Product, Store } from '@/types';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';

export const ProductDetailClient = ({ product, store }: { product: Product; store?: Store }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useUser();
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name ?? '');
  const [copied, setCopied] = useState(false);

  const isFav = isFavorite(product.id);

  const phone = store?.whatsapp ?? '258840000000';
  const productUrl = `https://shopyump.com/produto/${product.slug}`;
  const waText = `Olá ${product.storeName}! Quero comprar:\n*${product.name}*\nPreço: ${product.price.toLocaleString('pt-MZ')} MT${selectedSize ? `\nTamanho: ${selectedSize}` : ''}${selectedColor ? `\nCor: ${selectedColor}` : ''}\nLink: ${productUrl}`;
  const directBuyUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(waText)}`;

  const handleShare = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="flex items-center justify-between pb-6 text-xs font-bold text-slate-500 border-b border-slate-100 mb-8">
        <Link href="/produtos" className="flex items-center gap-1.5 text-slate-800 hover:text-emerald-600">
          <ArrowLeft className="w-4 h-4" /> Voltar aos produtos
        </Link>
        <span>{product.category} • {product.storeLocation}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square w-full rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden relative">
            <Image src={selectedImage} alt={product.name} fill className="object-contain p-6" sizes="(max-width: 1024px) 100vw, 58vw" priority />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 p-1 border-2 transition-all shrink-0 relative ${
                    selectedImage === img ? 'border-slate-900 scale-105' : 'border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} vista ${i + 1}`} fill className="object-contain" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Store */}
            <Link
              href={`/loja/${product.storeSlug}`}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {store && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm relative">
                    <Image src={store.logo} alt={store.name} fill className="object-cover" sizes="40px" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1 font-black text-sm text-slate-900">
                    {product.storeName}
                    {store?.verified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600" /> {product.storeLocation}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">Ver Loja</span>
            </Link>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{product.name}</h1>
              <div className="flex items-end gap-3 mt-4">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  {product.price.toLocaleString('pt-MZ')} <span className="text-lg font-bold text-slate-600">MT</span>
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 font-bold line-through pb-1">
                    {product.originalPrice.toLocaleString('pt-MZ')} MT
                  </span>
                )}
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">Tamanho: {selectedSize}</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                          selectedSize === sz ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">Cor: {selectedColor}</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                          selectedColor === c.name ? 'border-slate-900 bg-slate-100 text-slate-900' : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">Descrição do Produto</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{product.description}</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-8 border-t border-slate-100 sticky bottom-4 bg-white/95 backdrop-blur-md p-4 -mx-4 rounded-3xl shadow-2xl lg:shadow-none lg:static lg:p-0 lg:m-0">
            <a
              href={directBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-[#25D366]/25 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>💬 Comprar Imediato no WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(product, selectedSize || undefined, selectedColor || undefined)}
                className="col-span-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Adicionar Saco
              </button>
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isFav 
                    ? 'bg-red-50 text-red-600 border border-red-100' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-red-600' : ''}`} />
                {isFav ? 'Guardado' : 'Guardar'}
              </button>
              <button
                onClick={handleShare}
                className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Partilhar'}
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              🔒 Venda directa combinada de forma segura com o lojista de {product.storeLocation}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
