'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft, MessageSquare, ShieldCheck, Star,
  User, Phone, MapPin, FileText, ChevronRight, Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { MOCK_STORES } from '@/data/mockStores';
import type { CartItem } from '@/types';

export const CheckoutClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buynow') === '1';

  const { cart, removeFromCart, clearCart } = useCart();
  const { addOrderToHistory, updateUserInfo, userInfo } = useUser();

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [name, setName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [address, setAddress] = useState(userInfo?.location || '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  // Load buy-now item from sessionStorage
  useEffect(() => {
    if (isBuyNow) {
      try {
        const raw = sessionStorage.getItem('shopyump_buynow');
        if (raw) setBuyNowItem(JSON.parse(raw));
      } catch { /* ignore */ }
    }
  }, [isBuyNow]);

  // Items to show in this checkout
  const items: CartItem[] = isBuyNow
    ? buyNowItem ? [buyNowItem] : []
    : cart;

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  // Determine which store this order goes to
  const storeSlug = items[0]?.storeSlug;
  const store = MOCK_STORES.find((s) => s.slug === storeSlug);
  const storeName = store?.name ?? items[0]?.storeName ?? '';
  const storePhone = store?.whatsapp ?? '258840000000';
  const storeInitials = storeName.slice(0, 2).toUpperCase();

  // Empty state
  if (!isBuyNow && cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center pb-24">
        <p className="text-slate-500 font-semibold">Não há itens no carrinho.</p>
        <button
          onClick={() => router.push('/produtos')}
          className="px-6 py-3 bg-slate-900 text-white rounded-full font-black text-sm"
        >
          Explorar Produtos
        </button>
      </div>
    );
  }

  if (isBuyNow && !buyNowItem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center pb-24">
        <p className="text-slate-500 font-semibold">Produto não encontrado.</p>
        <button
          onClick={() => router.push('/produtos')}
          className="px-6 py-3 bg-slate-900 text-white rounded-full font-black text-sm"
        >
          Explorar Produtos
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!name.trim() || !phone.trim() || phone.trim().length < 8) {
      setError('Por favor preencha o seu nome e um número de telefone válido.');
      return;
    }
    setError('');

    const itemsFormatted = items
      .map((item) => {
        const vars: string[] = [];
        if (item.selectedSize) vars.push(`Tam: ${item.selectedSize}`);
        if (item.selectedColor) vars.push(`Cor: ${item.selectedColor}`);
        return `• ${item.quantity}x ${item.name}${vars.length ? ` (${vars.join(', ')})` : ''} — ${(item.price * item.quantity).toLocaleString('pt-MZ')} MT`;
      })
      .join('\n');

    let msg = `Olá *${storeName}*! 👋\nGostaria de finalizar a minha encomenda pelo Shopyump.\n\n`;
    msg += `📦 *PEDIDO*\n${itemsFormatted}\n\n`;
    msg += `💰 *Total: ${subtotal.toLocaleString('pt-MZ')} MT*\n\n`;
    msg += `👤 *OS MEUS DADOS*\n• Nome: ${name.trim()}\n• Telefone: ${phone.trim()}\n`;
    if (address.trim()) msg += `• Endereço: ${address.trim()}\n`;
    if (notes.trim()) msg += `• Nota: ${notes.trim()}\n`;
    msg += `\n🔗 Pedido gerado via Shopyump Moz`;

    const waUrl = `https://wa.me/${storePhone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;

    addOrderToHistory(items, storeName);
    updateUserInfo({ name: name.trim(), phone: phone.trim(), location: address.trim() });

    if (isBuyNow) {
      sessionStorage.removeItem('shopyump_buynow');
    } else {
      // Remove only items from this store
      const indexes = cart
        .map((item, i) => (item.storeSlug === storeSlug ? i : -1))
        .filter((i) => i !== -1)
        .reverse();
      indexes.forEach((i) => removeFromCart(i));
    }

    setSent(true);
    setTimeout(() => {
      window.open(waUrl, '_blank');
      router.push('/produtos');
    }, 800);
  };

  if (sent) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-6 text-center pb-24">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Pedido enviado!</h2>
          <p className="text-sm text-slate-500 mt-1">A abrir o WhatsApp de <strong>{storeName}</strong>…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-36 space-y-5">

      {/* Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[18px] font-black text-slate-900">Finalizar Pedido</h1>
      </div>

      {/* Store identity */}
      <button
        onClick={() => router.push(`/loja/${storeSlug}`)}
        className="w-full flex items-center gap-3 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors text-left"
      >
        <div className="relative w-12 h-12 rounded-full bg-slate-900 shrink-0 overflow-hidden shadow">
          {store?.logo ? (
            <Image src={store.logo} alt={storeName} fill className="object-cover" sizes="48px" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-white font-black text-sm">
              {storeInitials}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-[15px] text-slate-900">{storeName}</p>
          {store?.rating && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[12px] font-bold text-slate-500">{store.rating.toFixed(1)} · Loja verificada ✓</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {/* Order summary */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-[12px] font-black uppercase tracking-wider text-slate-400 mb-3">
            Resumo do pedido · {totalQty} {totalQty === 1 ? 'item' : 'itens'}
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 px-4 py-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[13px] text-slate-900 line-clamp-1">{item.name}</p>
                {(item.selectedSize || item.selectedColor) && (
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    {[item.selectedSize, item.selectedColor].filter(Boolean).join(' · ')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[12px] text-slate-500 font-semibold">Qtd: {item.quantity}</span>
                  <span className="text-[13px] font-black text-slate-900">
                    {(item.price * item.quantity).toLocaleString('pt-MZ')} MT
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 flex justify-between items-center">
          <span className="text-[13px] font-bold text-slate-500">Total</span>
          <span className="text-[16px] font-black text-slate-900">{subtotal.toLocaleString('pt-MZ')} MT</span>
        </div>
      </div>

      {/* WhatsApp info banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#25D366' }}
        >
          <MessageSquare className="w-4 h-4 text-white fill-white" />
        </div>
        <div>
          <p className="text-[13px] font-black text-emerald-900">Pedido via WhatsApp</p>
          <p className="text-[12px] text-emerald-700 font-medium mt-0.5">
            Após preencher os seus dados, será redirecionado para o WhatsApp de <strong>{storeName}</strong> com o pedido já formatado.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-[12px] font-black uppercase tracking-wider text-slate-400">Os seus dados</p>
        </div>

        {error && (
          <div className="mx-4 mb-2 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-[12px] font-bold">
            ⚠️ {error}
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {/* Name */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Nome completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: José Luís Cunha"
                className="w-full text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-300 bg-transparent"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Telefone / WhatsApp *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 84 123 4567"
                className="w-full text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-300 bg-transparent"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Localização actual <span className="font-medium normal-case tracking-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Av. 24 de Julho, Maputo"
                className="w-full text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-300 bg-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex items-start gap-3 px-4 py-3.5">
            <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Nota para a loja <span className="font-medium normal-case tracking-normal">(opcional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Entregar de tarde, tocar a campainha…"
                className="w-full text-[14px] font-semibold text-slate-900 outline-none placeholder:text-slate-300 bg-transparent resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 px-1">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
        <p className="text-[11px] text-slate-400 font-medium">
          Pagamento combinado directamente com a loja — na entrega ou via M-Pesa.
        </p>
      </div>

      {/* Sticky send button */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <button
          onClick={handleSend}
          className="w-full py-4 flex items-center justify-center gap-2.5 rounded-full font-black text-[15px] text-white shadow-xl active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)' }}
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          Enviar pedido para o WhatsApp
        </button>
      </div>
    </div>
  );
};
