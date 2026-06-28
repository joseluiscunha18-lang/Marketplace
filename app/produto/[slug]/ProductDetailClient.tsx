'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, ShoppingCart, ShoppingBag,
  Check, Share2, Heart, ChevronLeft, ChevronRight,
  MoreHorizontal, Star, Truck, RefreshCcw, Lock,
} from 'lucide-react';
import type { Product, Store } from '@/types';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { getSizeLabel } from '@/lib/productHelpers';
import { ProductCard } from '@/components/ProductCard';

/* ─── Store top-bar (replica shop.app) ──────────────────────────── */
function StoreTopBar({ product, store }: { product: Product; store?: Store }) {
  const reviewCount = product.reviewCount
    ? product.reviewCount >= 1000
      ? `${(product.reviewCount / 1000).toFixed(1).replace('.', ',')} mil`
      : product.reviewCount.toString()
    : null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
      {/* Logo + nome + rating */}
      <Link href={`/loja/${product.storeSlug}`} className="flex items-center gap-3 min-w-0">
        {/* Logo circular */}
        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-900 shrink-0 shadow-sm">
          {store?.logo ? (
            <Image src={store.logo} alt={product.storeName} fill className="object-cover" sizes="44px" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-white font-black text-sm tracking-tighter">
              {product.storeName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-black text-[15px] text-slate-900 leading-tight truncate">{product.storeName}</p>
          {product.rating && reviewCount && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[12px] font-bold text-slate-700">{product.rating.toFixed(1)}</span>
              <span className="text-[12px] text-slate-400 font-medium">({reviewCount})</span>
            </div>
          )}
        </div>
      </Link>

      {/* Visitar loja */}
      <Link
        href={`/loja/${product.storeSlug}`}
        className="ml-3 shrink-0 border border-slate-300 rounded-full px-4 py-1.5 text-[13px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
      >
        Visitar loja
      </Link>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export const ProductDetailClient = ({
  product,
  store,
  relatedFromStore = [],
  relatedFromOthers = [],
}: {
  product: Product;
  store?: Store;
  relatedFromStore?: Product[];
  relatedFromOthers?: Product[];
}) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useUser();

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name ?? '');
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScroll = useRef(false);

  const isFav = isFavorite(product.id);

  // Oculta o Header global nesta página (substituído pela StoreTopBar)
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
    return () => {
      if (header) header.style.display = '';
    };
  }, []);

  const productUrl = `https://shopyump.com/produto/${product.slug}`;
  const sizeLabel = getSizeLabel(product.sizes);

  const handleShare = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize || undefined, selectedColor || undefined);
    router.push('/checkout');
  };

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(allImages.length - 1, index));
    setActiveIndex(clamped);
    const el = scrollRef.current;
    if (el) {
      isProgrammaticScroll.current = true;
      el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
      // Liberta o flag de scroll-sync após a animação terminar
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 400);
    }
  };

  // Mantém activeIndex sincronizado enquanto o utilizador arrasta/desliza
  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== activeIndex) {
      setActiveIndex(Math.max(0, Math.min(allImages.length - 1, index)));
    }
  };

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10 lg:px-4 sm:px-6 lg:py-8">

          {/* ── Gallery column ───────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-0">

            {/* Shop.app–style store bar — visible on mobile, above the image */}
            <div className="lg:hidden">
              <StoreTopBar product={product} store={store} />
            </div>

            {/* Main image — fills the full 1:1, edge-to-edge on mobile */}
            <div className="relative w-full">
              <div className="relative w-full aspect-square overflow-hidden bg-slate-100 lg:rounded-3xl lg:border lg:border-slate-100">
                {/* Scroller fluido — swipe nativo com inércia do navegador */}
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="absolute inset-0 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar scroll-smooth"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {allImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-full h-full shrink-0 snap-start snap-always"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} — imagem ${i + 1}`}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Overlays — ficam fixos sobre o carrossel, não acompanham o scroll */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Counter badge */}
                  {allImages.length > 1 && (
                    <span className="absolute top-3 right-3 bg-black/45 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
                      {activeIndex + 1} / {allImages.length}
                    </span>
                  )}

                  {/* More options button (shop.app style) */}
                  <button
                    className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-700 shadow-sm pointer-events-auto"
                    aria-label="Mais opções"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {/* Desktop arrow buttons */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => goTo(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 items-center justify-center text-slate-700 disabled:opacity-20 hover:bg-white transition-all shadow-sm pointer-events-auto"
                        aria-label="Imagem anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => goTo(activeIndex + 1)}
                        disabled={activeIndex === allImages.length - 1}
                        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 items-center justify-center text-slate-700 disabled:opacity-20 hover:bg-white transition-all shadow-sm pointer-events-auto"
                        aria-label="Próxima imagem"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Dots */}
              {allImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-3 pb-1">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 shrink-0 ${
                        i === activeIndex
                          ? 'bg-slate-900'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir para imagem ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Info column ──────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between px-4 lg:px-0 pt-5 lg:pt-0">
            <div className="space-y-6">

              {/* Store bar — desktop only (inside info column) */}
              <div className="hidden lg:block">
                <StoreTopBar product={product} store={store} />
              </div>

              {/* Title, rating & price */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight flex-1">
                    {product.name}
                  </h1>
                  <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5" aria-label="Mais opções">
                    <MoreHorizontal className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Stars inline — like shop.app */}
                {product.rating && product.reviewCount && (
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(product.rating!) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
                      />
                    ))}
                    <button className="ml-1 text-[13px] font-bold text-slate-600 underline underline-offset-2">
                      {product.reviewCount.toLocaleString('pt-MZ')} classificações
                    </button>
                  </div>
                )}

                {/* Badge */}
                {product.reviewCount && product.reviewCount > 200 && (
                  <span className="inline-block mt-2 bg-slate-100 text-slate-600 text-[11px] font-semibold px-3 py-1 rounded-full">
                    {Math.floor(product.reviewCount / 2)}+ comprados no mês passado
                  </span>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    {product.price.toLocaleString('pt-MZ')}
                    <span className="text-lg font-bold text-slate-500 ml-1">MT</span>
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 font-bold line-through">
                      {product.originalPrice.toLocaleString('pt-MZ')} MT
                    </span>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      {sizeLabel} <span className="font-semibold normal-case tracking-normal">{selectedSize}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-11 h-11 px-3 rounded-full text-xs font-extrabold border-2 transition-all ${
                            selectedSize === sz
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
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
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Cor <span className="font-semibold normal-case tracking-normal">{selectedColor}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`px-4 py-2.5 rounded-full text-xs font-bold border-2 transition-all ${
                            selectedColor === c.name
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Buttons — Adicionar ao carrinho / Comprar agora, depois Guardar / Partilhar */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => addToCart(product, selectedSize || undefined, selectedColor || undefined)}
                    className="py-4 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" /> Comprar Agora
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
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
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Partilhar'}
                  </button>
                </div>

                <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Venda directa combinada de forma segura com o lojista de {product.storeLocation}.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">Descrição do Produto</span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{product.description}</p>
              </div>

              {/* Política de entrega, devolução e garantia */}
              <div className="pt-4 border-t border-slate-100">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 divide-y divide-slate-100 overflow-hidden">
                  <div className="flex items-start gap-3 p-3.5">
                    <Truck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Entrega em {product.storeLocation}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Prazo e custo de envio combinados directamente com o lojista no checkout.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5">
                    <RefreshCcw className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Trocas e devoluções</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Verifique a política de trocas do vendedor antes de confirmar o pedido.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Pagamento seguro</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Pagamento na entrega ou por M-Pesa, combinado directamente com o vendedor.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Produtos relacionados ─────────────────────────────────── */}
        <div className="px-4 lg:px-4 mt-10 space-y-10">
          {relatedFromStore.length > 0 && (
            <RelatedSection
              title={`Mais de ${product.storeName}`}
              ctaHref={`/loja/${product.storeSlug}`}
              ctaLabel="Visitar loja"
              products={relatedFromStore}
            />
          )}

          {relatedFromOthers.length > 0 && (
            <RelatedSection
              title="Também poderá gostar de"
              ctaHref="/produtos"
              ctaLabel="Ver mais"
              products={relatedFromOthers}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Related products carousel/grid section ────────────────────────── */
function RelatedSection({
  title,
  ctaHref,
  ctaLabel,
  products,
}: {
  title: string;
  ctaHref: string;
  ctaLabel: string;
  products: Product[];
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{title}</h2>
        <Link
          href={ctaHref}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 shrink-0 transition-colors"
        >
          {ctaLabel}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 sm:mx-0 sm:px-0">
        {products.map((p) => (
          <div key={p.id} className="w-[42%] shrink-0 sm:w-auto sm:shrink">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}