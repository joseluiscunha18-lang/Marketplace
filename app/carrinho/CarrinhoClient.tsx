'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart, Minus, Plus, Trash2, ArrowLeft,
  ChevronRight, Star, ShieldCheck, Truck, Zap,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { MOCK_STORES } from '@/data/mockStores';
import type { CartItem, Product } from '@/types';

/* ── helpers ──────────────────────────── */
function groupByStore(cart: CartItem[]): Record<string, CartItem[]> {
  return cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    const key = item.storeSlug;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

/* ── Animated item row ────────────────── */
function CartItemRow({
  item,
  index,
  onRemove,
  onQty,
}: {
  item: CartItem;
  index: number;
  onRemove: () => void;
  onQty: (q: number) => void;
}) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(onRemove, 280);
  };

  return (
    <div
      className="flex gap-3 py-4 transition-all duration-300"
      style={{
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(40px)' : 'translateX(0)',
        maxHeight: removing ? 0 : 200,
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <Link href={`/produto/${item.slug}`} className="shrink-0 relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <Link href={`/produto/${item.slug}`}>
            <h4 className="font-bold text-[14px] text-slate-900 leading-snug line-clamp-2">{item.name}</h4>
          </Link>
          {(item.selectedSize || item.selectedColor) && (
            <div className="flex gap-1.5 mt-1">
              {item.selectedSize && (
                <span className="text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                  {item.selectedSize}
                </span>
              )}
              {item.selectedColor && (
                <span className="text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                  {item.selectedColor}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-black text-[15px] text-slate-900">
            {item.price.toLocaleString('pt-MZ')}
            <span className="text-[11px] font-bold text-slate-500 ml-0.5">MT</span>
          </span>

          <div className="flex items-center gap-1">
            {/* Qty controls */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-full px-1 py-1">
              <button
                onClick={() => onQty(item.quantity - 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors active:scale-90"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[13px] font-black w-5 text-center text-slate-900">{item.quantity}</span>
              <button
                onClick={() => onQty(item.quantity + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={handleRemove}
              className="w-8 h-8 ml-1 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors active:scale-90"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Store group card ─────────────────── */
function StoreGroup({
  storeSlug,
  items,
  cartIndexOffset,
  onRemove,
  onQty,
}: {
  storeSlug: string;
  items: CartItem[];
  cartIndexOffset: number;
  onRemove: (index: number) => void;
  onQty: (index: number, q: number) => void;
}) {
  const store = MOCK_STORES.find((s) => s.slug === storeSlug);
  const storeName = items[0]?.storeName ?? storeSlug;
  const initials = storeName.slice(0, 2).toUpperCase();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Store header */}
      <Link
        href={`/loja/${storeSlug}`}
        className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-colors"
      >
        <div className="relative w-10 h-10 rounded-full bg-slate-900 shrink-0 overflow-hidden shadow-sm">
          {store?.logo ? (
            <Image src={store.logo} alt={storeName} fill className="object-cover" sizes="40px" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">
              {initials}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-[14px] text-slate-900 leading-tight">{storeName}</p>
          {store?.rating && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-500">{store.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </Link>

      {/* Items */}
      <div className="px-4 divide-y divide-slate-100">
        {items.map((item, i) => (
          <CartItemRow
            key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${i}`}
            item={item}
            index={cartIndexOffset + i}
            onRemove={() => onRemove(cartIndexOffset + i)}
            onQty={(q) => onQty(cartIndexOffset + i, q)}
          />
        ))}
      </div>

      {/* Store subtotal */}
      <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/60">
        <span className="text-[12px] font-semibold text-slate-500">Subtotal desta loja</span>
        <span className="text-[14px] font-black text-slate-900">
          {subtotal.toLocaleString('pt-MZ')} MT
        </span>
      </div>

      {/* Per-store checkout button */}
      <div className="px-4 pb-4 pt-1">
        <Link
          href={`/checkout/${storeSlug}`}
          className="w-full py-3.5 flex items-center justify-center rounded-full font-black text-[14px] text-white active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          Continuar para a finalização da compra
        </Link>
      </div>
    </div>
  );
}

/* ── Suggestion card ──────────────────── */
function SuggestionCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="flex-shrink-0 w-36 flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-square bg-slate-50">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="144px" />
      </div>
      <div className="p-2 flex flex-col gap-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{product.storeName}</p>
        <p className="text-[12px] font-bold text-slate-900 leading-snug line-clamp-2">{product.name}</p>
        <p className="text-[12px] font-black text-slate-900">
          {product.price.toLocaleString('pt-MZ')}
          <span className="text-[10px] font-bold text-slate-500 ml-0.5">MT</span>
        </p>
        <button
          onClick={handleAdd}
          className={`mt-1 w-full py-1.5 rounded-full text-[11px] font-black transition-all active:scale-95 ${
            added
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-700'
          }`}
        >
          {added ? '✓ Adicionado' : '+ Carrinho'}
        </button>
      </div>
    </Link>
  );
}

/* ── Main page ────────────────────────── */
export const CarrinhoClient = () => {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const grouped = groupByStore(cart);
  const storeKeys = Object.keys(grouped);

  // Compute offset for each store group so we can map to global cart index
  const offsets: Record<string, number> = {};
  let running = 0;
  storeKeys.forEach((key) => {
    offsets[key] = running;
    running += grouped[key].length;
  });

  // Suggestions: random products not already in cart
  const cartIds = new Set(cart.map((i) => i.id));
  const suggestions = MOCK_PRODUCTS.filter((p) => !cartIds.has(p.id)).slice(0, 10);

  // Flying image effect on page
  const [flyAnim, setFlyAnim] = useState(false);
  useEffect(() => {
    setFlyAnim(true);
    const t = setTimeout(() => setFlyAnim(false), 600);
    return () => clearTimeout(t);
  }, [totalItems]);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center space-y-5 pb-24">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
          <ShoppingCart className="w-9 h-9 text-slate-300" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">O carrinho está vazio</h2>
          <p className="text-sm text-slate-500 mt-1">Adicione produtos de lojas locais em Moçambique.</p>
        </div>
        <Link
          href="/produtos"
          className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-black text-sm"
        >
          Ver Produtos
        </Link>

        {suggestions.length > 0 && (
          <div className="w-full mt-6 text-left">
            <p className="text-[13px] font-black text-slate-800 mb-3 px-1">Talvez goste de…</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {suggestions.slice(0, 6).map((p) => (
                <SuggestionCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-36 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[20px] font-black text-slate-900 flex-1">
          Carrinho
        </h1>
        <span
          className="text-[13px] font-bold text-slate-500 transition-all"
          style={{ transform: flyAnim ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.3s ease' }}
        >
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {/* Store groups */}
      {storeKeys.map((key) => (
        <StoreGroup
          key={key}
          storeSlug={key}
          items={grouped[key]}
          cartIndexOffset={offsets[key]}
          onRemove={removeFromCart}
          onQty={updateQuantity}
        />
      ))}

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 py-1">
        {[
          { icon: <ShieldCheck className="w-4 h-4" />, label: 'Pagamento seguro' },
          { icon: <Truck className="w-4 h-4" />, label: 'Entrega combinada' },
          { icon: <Zap className="w-4 h-4" />, label: 'Via WhatsApp' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-slate-500">{icon}</span>
            <span className="text-[10px] font-bold text-slate-500 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Order total */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 space-y-2.5">
        <div className="flex justify-between text-[13px] text-slate-500 font-semibold">
          <span>Subtotal ({totalItems} itens)</span>
          <span>{totalPrice.toLocaleString('pt-MZ')} MT</span>
        </div>
        <div className="flex justify-between text-[13px] text-slate-500 font-semibold">
          <span>Taxa da plataforma</span>
          <span className="text-emerald-600 font-bold">Grátis</span>
        </div>
        <div className="flex justify-between text-[13px] text-slate-500 font-semibold">
          <span>Entrega</span>
          <span className="text-amber-600 font-bold">A combinar</span>
        </div>
        <div className="flex justify-between text-[16px] font-black text-slate-900 pt-2 border-t border-slate-100">
          <span>Total estimado</span>
          <span>{totalPrice.toLocaleString('pt-MZ')} MT</span>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[15px] font-black text-slate-900">Pode também gostar</p>
            <Link href="/produtos" className="text-[12px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5">
              Ver mais <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            {suggestions.map((p) => (
              <SuggestionCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
