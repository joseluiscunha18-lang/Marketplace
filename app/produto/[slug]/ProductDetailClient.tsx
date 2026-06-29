'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Check, Share2, Heart, ChevronLeft, ChevronRight,
  MoreHorizontal, Star, Truck, RefreshCcw, Lock,
  BadgeCheck, ThumbsUp, ChevronDown,
} from 'lucide-react';
import type { Product, Store, Review } from '@/types';
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

  const [reviewsOpen, setReviewsOpen] = useState(false);
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
      {/* Drawer global (abre ao clicar nas estrelas ou no botão de avaliações) */}
      <ReviewsDrawer product={product} open={reviewsOpen} onClose={() => setReviewsOpen(false)} />

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
                    <button
                      onClick={() => setReviewsOpen(true)}
                      className="ml-1 text-[13px] font-bold text-slate-600 underline underline-offset-2"
                    >
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
                          className={`min-w-11 h-11 px-3 shrink-0 rounded-full text-xs font-extrabold border-2 transition-all flex items-center justify-center ${
                            selectedSize === sz
                              ? 'bg-white text-slate-900 border-slate-900'
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
                              ? 'bg-white text-slate-900 border-slate-900'
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

              {/* CTA Buttons — Adicionar ao carrinho, depois Comprar agora, depois Guardar / Partilhar */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => addToCart(product, selectedSize || undefined, selectedColor || undefined)}
                  className="w-full py-4 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center active:scale-[0.98] transition-all"
                >
                  Adicionar ao Carrinho
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl flex items-center justify-center active:scale-[0.98] transition-all"
                >
                  Comprar Agora
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                      isFav
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-600' : ''}`} />
                    {isFav ? 'Guardado' : 'Guardar'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
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

              {/* Avaliações */}
              <div className="pt-4 border-t border-slate-100">
                <ReviewsSection product={product} onOpenDrawer={() => setReviewsOpen(true)} />
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

/* ─── Reviews Drawer (Etsy / shop.app style) ─────────────────────── */
function ReviewsDrawer({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const reviews = product.reviews ?? [];
  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? reviews.length;
  const [search, setSearch] = useState('');
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  // Reset ao fechar
  useEffect(() => {
    if (!open) {
      setSearch('');
      setFilterStars(null);
      setVisibleCount(8);
    }
  }, [open]);

  // Bloqueia scroll do body quando aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    if (reviews.length > 0) {
      const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
      return { stars, percent: Math.round((count / reviews.length) * 100), count };
    }
    const distance = Math.abs(stars - rating);
    const weight = Math.max(0, 5 - distance * 3.2);
    return { stars, percent: Math.round(weight * 14), count: 0 };
  });

  const filtered = reviews.filter((r) => {
    const matchStars = filterStars === null || Math.round(r.rating) === filterStars;
    const matchSearch =
      search === '' ||
      r.text.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase());
    return matchStars && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 top-0 z-50 flex flex-col bg-white max-w-lg mx-auto sm:top-8 sm:bottom-8 sm:rounded-3xl sm:shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Avaliações ({reviewCount >= 1000
                ? `${(reviewCount / 1000).toFixed(1).replace('.', ',')} mil`
                : reviewCount.toLocaleString('pt-MZ')})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
            aria-label="Fechar avaliações"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 pt-5 space-y-5">

            {/* Rating summary */}
            <div className="flex gap-5 items-center">
              <div className="flex flex-col items-center shrink-0">
                <span className="text-5xl font-black text-slate-900 tabular-nums leading-none">
                  {rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 mt-1">
                  {reviewCount.toLocaleString('pt-MZ')} notas
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                {distribution.map((d) => (
                  <button
                    key={d.stars}
                    onClick={() => setFilterStars(filterStars === d.stars ? null : d.stars)}
                    className={`flex items-center gap-2 w-full group rounded-full px-1 py-0.5 transition-colors ${filterStars === d.stars ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                  >
                    <span className="text-[11px] font-bold text-slate-500 w-2.5 tabular-nums">{d.stars}</span>
                    <Star className="w-3 h-3 fill-slate-300 text-slate-300 shrink-0" />
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all duration-700"
                        style={{ width: `${d.percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 w-7 text-right tabular-nums">
                      {d.percent}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros de estrelas */}
            {filterStars && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filtrar por:</span>
                <button
                  onClick={() => setFilterStars(null)}
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
                >
                  {filterStars} estrela{filterStars !== 1 ? 's' : ''}
                  <span className="text-white/60">×</span>
                </button>
              </div>
            )}

            {/* Search */}
            {reviews.length > 0 && (
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setVisibleCount(8); }}
                  placeholder="Pesquisar avaliações..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-colors"
                />
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}

            {/* Reviews list */}
            <div className="space-y-3 pb-8">
              {visible.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm font-medium">Nenhuma avaliação encontrada</p>
                </div>
              ) : (
                <>
                  {visible.map((r) => (
                    <DrawerReviewCard key={r.id} review={r} />
                  ))}

                  {hasMore && (
                    <button
                      onClick={() => setVisibleCount((n) => n + 8)}
                      className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                    >
                      Ver mais avaliações
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DrawerReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(false);
  const initials = review.author
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedDate = new Date(review.date).toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-[0_1px_8px_rgb(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white shrink-0 flex items-center justify-center text-[11px] font-black tracking-tight">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[13px] font-bold text-slate-900 truncate">{review.author}</p>
              {review.verified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {[1,2,3,4,5].map((i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(review.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
          ))}
        </div>
      </div>

      <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
        {review.text}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        {review.size ? (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Tamanho {review.size}
          </span>
        ) : <span />}
        <button
          onClick={() => setHelpful((v) => !v)}
          className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
            helpful ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${helpful ? 'fill-slate-900' : ''}`} />
          Útil {(review.helpfulCount ?? 0) + (helpful ? 1 : 0)}
        </button>
      </div>
    </div>
  );
}

/* ─── Reviews / Avaliações ───────────────────────────────────────── */
function ReviewStars({ rating, size = 'w-3.5 h-3.5' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${size} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <button className="flex items-center gap-2 w-full group">
      <span className="text-[11px] font-bold text-slate-500 w-2.5 tabular-nums">{stars}</span>
      <Star className="w-3 h-3 fill-slate-300 text-slate-300 shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold text-slate-400 w-7 text-right tabular-nums">{percent}%</span>
    </button>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(false);
  const initials = review.author
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedDate = new Date(review.date).toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="w-[78%] sm:w-auto shrink-0 sm:shrink snap-start bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 shadow-[0_2px_12px_rgb(0,0,0,0.03)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white shrink-0 flex items-center justify-center text-[11px] font-black tracking-tight">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate">{review.author}</p>
              {review.verified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{formattedDate}</p>
          </div>
        </div>
        <ReviewStars rating={review.rating} />
      </div>

      <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium line-clamp-4">
        {review.text}
      </p>

      <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-slate-50">
        {review.size ? (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Tamanho {review.size}
          </span>
        ) : <span />}
        <button
          onClick={() => setHelpful((v) => !v)}
          className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
            helpful ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${helpful ? 'fill-slate-900' : ''}`} />
          Útil {(review.helpfulCount ?? 0) + (helpful ? 1 : 0)}
        </button>
      </div>
    </div>
  );
}

function ReviewsSection({ product, onOpenDrawer }: { product: Product; onOpenDrawer: () => void }) {
  const reviews = product.reviews ?? [];
  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? reviews.length;

  if (reviewCount === 0 && reviews.length === 0) return null;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    if (reviews.length > 0) {
      const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
      return { stars, percent: Math.round((count / reviews.length) * 100) };
    }
    const distance = Math.abs(stars - rating);
    const weight = Math.max(0, 5 - distance * 3.2);
    return { stars, percent: Math.round(weight * 14) };
  });
  const maxPercent = Math.max(...distribution.map((d) => d.percent), 1);
  const normalizedDistribution = distribution.map((d) => ({
    ...d,
    percent: Math.round((d.percent / maxPercent) * 100),
  }));

  const previewReviews = reviews.slice(0, 2);

  return (
    <div className="space-y-4">
      <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">Avaliações</span>

      {/* Resumo clicável: nota + distribuição */}
      <button
        onClick={onOpenDrawer}
        className="w-full text-left rounded-2xl border border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row gap-5 sm:gap-8 hover:bg-slate-100 transition-colors active:scale-[0.99]"
      >
        <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 shrink-0">
          <span className="text-4xl font-black text-slate-900 tracking-tight tabular-nums">
            {rating.toFixed(1)}
          </span>
          <div className="flex flex-col gap-1">
            <ReviewStars rating={rating} size="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-500">
              {reviewCount.toLocaleString('pt-MZ')} classificações
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5 justify-center min-w-0">
          {normalizedDistribution.map((d) => (
            <RatingBar key={d.stars} stars={d.stars} percent={d.percent} />
          ))}
        </div>
      </button>

      {/* Preview: 2 avaliações em carrossel */}
      {previewReviews.length > 0 && (
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible">
          {previewReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      {/* Botão "Ver todas avaliações" */}
      {reviewCount > 0 && (
        <button
          onClick={onOpenDrawer}
          className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
        >
          Ver todas as avaliações
          <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
        </button>
      )}
    </div>
  );
}

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