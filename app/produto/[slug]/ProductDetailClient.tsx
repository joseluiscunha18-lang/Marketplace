'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, MapPin, ShieldCheck, ShoppingCart, ArrowLeft, Check, Share2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, Store } from '@/types';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';

export const ProductDetailClient = ({ product, store }: { product: Product; store?: Store }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useUser();

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name ?? '');
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef<number | null>(null);

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

  const goTo = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(allImages.length - 1, index)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(activeIndex + 1) : goTo(activeIndex - 1);
    }
    touchStartX.current = null;
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

        {/* ── Gallery ── */}
        <div className="lg:col-span-7 space-y-3">

          {/* Main image — 1:1 com padding lateral */}
          <div className="relative w-full">
            <div
              className="relative w-full aspect-square overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 px-3"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 px-3 transition-opacity duration-300 ${
                    i === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} — imagem ${i + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority={i === 0}
                  />
                </div>
              ))}

              {/* Contador de imagens */}
              {allImages.length > 1 && (
                <span className="absolute top-3 right-4 bg-black/40 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
                  {activeIndex + 1} / {allImages.length}
                </span>
              )}

              {/* Setas de navegação — desktop */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => goTo(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 items-center justify-center text-slate-700 disabled:opacity-30 hover:bg-white transition-all shadow-sm"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => goTo(activeIndex + 1)}
                    disabled={activeIndex === allImages.length - 1}
                    className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 items-center justify-center text-slate-700 disabled:opacity-30 hover:bg-white transition-all shadow-sm"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Dots indicator */}
            {allImages.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-5 h-1.5 bg-slate-900'
                        : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Ir para imagem ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 px-0.5">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`relative w-[72px] h-[72px] rounded-2xl overflow-hidden bg-slate-50 shrink-0 border-2 transition-all duration-200 ${
                    i === activeIndex
                      ? 'border-slate-900 scale-105 shadow-md'
                      : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-300'
                  }`}
                  aria-label={`Ver imagem ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} miniatura ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
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
