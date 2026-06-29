'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Check, Share2, Heart, ChevronLeft, ChevronRight,
  MoreHorizontal, Star, Truck, RefreshCcw, Lock,
  BadgeCheck, ThumbsUp, ChevronDown, X, SlidersHorizontal,
  MessageSquareDashed, Flag,
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
      <Link href={`/loja/${product.storeSlug}`} className="flex items-center gap-3 min-w-0">
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
  const [reviewsOpenId, setReviewsOpenId] = useState<string | null>(null);
  const isFav = isFavorite(product.id);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
    return () => {
      if (header) header.style.display = '';
    };
  }, []);

  // Hide/show bottom nav when reviews drawer is open
  useEffect(() => {
    const bottomNav = document.querySelector('nav[class*="fixed bottom-0"]') as HTMLElement | null;
    if (!bottomNav) return;
    if (reviewsOpen) {
      bottomNav.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
      bottomNav.style.transform = 'translateY(100%)';
      bottomNav.style.opacity = '0';
    } else {
      bottomNav.style.transform = 'translateY(0)';
      bottomNav.style.opacity = '1';
    }
    return () => {
      bottomNav.style.transform = '';
      bottomNav.style.opacity = '';
    };
  }, [reviewsOpen]);

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
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 400);
    }
  };

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
      <ReviewsDrawer product={product} open={reviewsOpen} onClose={() => { setReviewsOpen(false); setReviewsOpenId(null); }} initialReviewId={reviewsOpenId} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10 lg:px-4 sm:px-6 lg:py-8">

          {/* ── Gallery column ───────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-0">
            <div className="lg:hidden">
              <StoreTopBar product={product} store={store} />
            </div>

            <div className="relative w-full">
              <div className="relative w-full aspect-square overflow-hidden bg-slate-100 lg:rounded-3xl lg:border lg:border-slate-100">
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

                <div className="absolute inset-0 pointer-events-none">
                  {allImages.length > 1 && (
                    <span className="absolute top-3 right-3 bg-black/45 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10">
                      {activeIndex + 1} / {allImages.length}
                    </span>
                  )}

                  <button
                    className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-700 shadow-sm pointer-events-auto"
                    aria-label="Mais opções"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

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

              {allImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-3 pb-1">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 shrink-0 ${
                        i === activeIndex ? 'bg-slate-900' : 'bg-gray-300 hover:bg-gray-400'
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
              <div className="hidden lg:block">
                <StoreTopBar product={product} store={store} />
              </div>

              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight flex-1">
                    {product.name}
                  </h1>
                  <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5" aria-label="Mais opções">
                    <MoreHorizontal className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {product.rating && product.reviewCount && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setReviewsOpen(true)}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full px-3 py-1.5 active:scale-95"
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.round(product.rating!) ? 'fill-amber-400 text-amber-400' : 'fill-slate-300 text-slate-300'}`}
                        />
                      ))}
                      <span className="text-[12px] font-bold text-slate-700 ml-0.5">
                        {product.rating.toFixed(1)}
                      </span>
                    </button>
                    <button
                      onClick={() => setReviewsOpen(true)}
                      className="text-[12px] font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-800 transition-colors"
                    >
                      {product.reviewCount.toLocaleString('pt-MZ')} classificações
                    </button>
                  </div>
                )}

                {product.reviewCount && product.reviewCount > 200 && (
                  <span className="inline-block mt-2 bg-slate-100 text-slate-600 text-[11px] font-semibold px-3 py-1 rounded-full">
                    {Math.floor(product.reviewCount / 2)}+ comprados no mês passado
                  </span>
                )}

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

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">Descrição do Produto</span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{product.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <ReviewsSection product={product} onOpenDrawer={() => setReviewsOpen(true)} onOpenDrawerAtReview={(id) => { setReviewsOpenId(id); setReviewsOpen(true); }} />
              </div>
            </div>
          </div>
        </div>

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

/* ─── Sort options type ──────────────────────────────────────────── */
type SortOption = 'relevant' | 'recent' | 'oldest' | 'low_high' | 'high_low';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevant', label: 'Mais relevantes' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'low_high', label: 'Classificação: baixa → alta' },
  { value: 'high_low', label: 'Classificação: alta → baixa' },
];

function sortReviews(reviews: Review[], sort: SortOption): Review[] {
  const arr = [...reviews];
  switch (sort) {
    case 'recent':
      return arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'oldest':
      return arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'low_high':
      return arr.sort((a, b) => a.rating - b.rating);
    case 'high_low':
      return arr.sort((a, b) => b.rating - a.rating);
    case 'relevant':
    default:
      return arr.sort((a, b) => (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0));
  }
}

/* ─── Reviews Drawer ─────────────────────────────────────────────── */
function ReviewsDrawer({
  product,
  open,
  onClose,
  initialReviewId,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  initialReviewId?: string | null;
}) {
  const reviews = product.reviews ?? [];
  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? reviews.length;

  const [search, setSearch] = useState('');
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortBy, setSortBy] = useState<SortOption>('relevant');
  const [showSortModal, setShowSortModal] = useState(false);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);

  // Animation state
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
        setShowSortModal(false);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Scroll to specific review when opened with initialReviewId
  useEffect(() => {
    if (open && initialReviewId && scrollContentRef.current) {
      const tryScroll = () => {
        const el = document.getElementById(`review-${initialReviewId}`);
        if (el && scrollContentRef.current) {
          scrollContentRef.current.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
        }
      };
      const t = setTimeout(tryScroll, 500);
      return () => clearTimeout(t);
    }
  }, [open, initialReviewId]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      setFilterStars(null);
      setVisibleCount(8);
    }
  }, [open]);

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

  const filtered = sortReviews(
    reviews.filter((r) => {
      const matchStars = filterStars === null || Math.round(r.rating) === filterStars;
      const matchSearch =
        search === '' ||
        r.text.toLowerCase().includes(search.toLowerCase()) ||
        r.author.toLowerCase().includes(search.toLowerCase());
      return matchStars && matchSearch;
    }),
    sortBy
  );

  const visible2 = filtered.slice(0, visibleCount);
  const hasMore = visible2.length < filtered.length;
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Ordenar';

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: `rgba(0,0,0,${visible ? 0.45 : 0})`,
          backdropFilter: visible ? 'blur(2px)' : 'blur(0px)',
          transition: 'background-color 0.35s ease, backdrop-filter 0.35s ease',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-x-0 bottom-0 top-0 z-50 flex flex-col bg-white max-w-lg mx-auto sm:top-8 sm:bottom-8 sm:rounded-3xl sm:shadow-2xl overflow-hidden"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.35s ease',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0 bg-white">
          {/* Close button — LEFT side */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
            aria-label="Fechar avaliações"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-black text-slate-900 leading-tight">
              Avaliações{' '}
              <span className="text-slate-400 font-semibold">
                ({reviewCount >= 1000
                  ? `${(reviewCount / 1000).toFixed(1).replace('.', ',')} mil`
                  : reviewCount.toLocaleString('pt-MZ')})
              </span>
            </h2>
          </div>
        </div>

        {/* Filter bar — Sort + Star chips */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-50 shrink-0 bg-white">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Sort button */}
            <button
              onClick={() => setShowSortModal(true)}
              className="flex items-center gap-1.5 shrink-0 bg-slate-900 text-white text-[12px] font-bold px-3.5 py-2 rounded-full transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {currentSortLabel}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 shrink-0" />

            {/* Star rating filter chips */}
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStars(filterStars === s ? null : s)}
                className={`flex items-center gap-1 shrink-0 text-[12px] font-bold px-3 py-2 rounded-full border transition-all active:scale-95 ${
                  filterStars === s
                    ? 'bg-amber-400 border-amber-400 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Star className={`w-3 h-3 ${filterStars === s ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={scrollContentRef} className="flex-1 overflow-y-auto overscroll-contain">
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

            {/* Reviews list or empty states */}
            <div className="space-y-3 pb-8">
              {reviews.length === 0 ? (
                /* ── No reviews at all ── */
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <MessageSquareDashed className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-[15px] font-black text-slate-800 mb-1">Ainda sem avaliações</p>
                  <p className="text-[13px] text-slate-400 font-medium leading-relaxed max-w-xs">
                    Seja o primeiro a partilhar a sua experiência com este produto.
                  </p>
                </div>
              ) : visible2.length === 0 ? (
                /* ── No results for current filter/search ── */
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <Star className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-[14px] font-black text-slate-800 mb-1">Sem resultados</p>
                  <p className="text-[12px] text-slate-400 font-medium">
                    Tente ajustar os filtros ou a pesquisa.
                  </p>
                  {(filterStars !== null || search) && (
                    <button
                      onClick={() => { setFilterStars(null); setSearch(''); }}
                      className="mt-4 text-[12px] font-bold text-slate-700 underline underline-offset-2"
                    >
                      Limpar filtros
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {visible2.map((r) => (
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

      {/* Sort Modal */}
      {showSortModal && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            onClick={() => setShowSortModal(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-2xl overflow-hidden max-w-lg mx-auto"
            style={{ animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)' }}
          >
            <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
            <div className="px-5 pt-5 pb-2 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-slate-900">Ordenar por</h3>
              <button
                onClick={() => setShowSortModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 pb-8 space-y-1 mt-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortModal(false); setVisibleCount(8); }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[14px] font-semibold transition-colors ${
                    sortBy === opt.value
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                  {sortBy === opt.value && (
                    <Check className="w-4 h-4 text-white shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function DrawerReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reported, setReported] = useState(false);
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
    <div id={`review-${review.id}`} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-[0_1px_8px_rgb(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white shrink-0 flex items-center justify-center text-[11px] font-black tracking-tight">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[13px] font-bold text-slate-900 truncate">{review.author}</p>
              {review.verified && <BadgeCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(review.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
            ))}
          </div>
          {/* More options menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Mais opções"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 top-8 z-20 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden min-w-[150px]">
                  <button
                    onClick={() => { setReported(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {reported ? 'Denunciado' : 'Denunciar'}
                  </button>
                </div>
              </>
            )}
          </div>
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

function ReviewCard({ review, onOpen }: { review: Review; onOpen: () => void }) {
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
    <button
      onClick={onOpen}
      className="w-[78%] sm:w-auto shrink-0 sm:shrink snap-start bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 shadow-[0_2px_12px_rgb(0,0,0,0.03)] text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white shrink-0 flex items-center justify-center text-[11px] font-black tracking-tight">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-[13px] font-bold text-slate-900 truncate">{review.author}</p>
              {review.verified && <BadgeCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
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
        <div
          onClick={(e) => { e.stopPropagation(); setHelpful((v) => !v); }}
          className={`flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${
            helpful ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${helpful ? 'fill-slate-900' : ''}`} />
          Útil {(review.helpfulCount ?? 0) + (helpful ? 1 : 0)}
        </div>
      </div>
    </button>
  );
}

function ReviewsSection({ product, onOpenDrawer, onOpenDrawerAtReview }: { product: Product; onOpenDrawer: () => void; onOpenDrawerAtReview: (id: string) => void }) {
  const reviews = product.reviews ?? [];
  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? reviews.length;

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

      {reviewCount === 0 && reviews.length === 0 ? (
        /* ── Empty state for product page (inline) ── */
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-3">
            <MessageSquareDashed className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-[14px] font-black text-slate-700 mb-1">Ainda sem avaliações</p>
          <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
            Este produto ainda não tem avaliações de clientes.
          </p>
        </div>
      ) : (
        <>
          {/* Resumo clicável */}
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

          {previewReviews.length > 0 && (
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible">
              {previewReviews.map((r) => (
                <ReviewCard key={r.id} review={r} onOpen={() => onOpenDrawerAtReview(r.id)} />
              ))}
            </div>
          )}

          <button
            onClick={onOpenDrawer}
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
          >
            Ver todas as avaliações
            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </button>
        </>
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
