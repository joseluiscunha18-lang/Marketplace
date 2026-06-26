'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MOCK_STORES } from '@/data/mockStores';

export const CheckoutClient = () => {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900">Seu carrinho está vazio</h2>
        <p className="text-sm text-slate-500">Adicione produtos de uma loja local para finalizar o pedido.</p>
        <Link href="/produtos" className="px-6 py-3 bg-slate-900 text-white font-bold text-xs rounded-full inline-block">
          Explorar Produtos
        </Link>
      </div>
    );
  }

  const firstStoreSlug = cart[0].storeSlug;
  const store = MOCK_STORES.find(s => s.slug === firstStoreSlug);
  const targetPhone = store ? store.whatsapp : '258840000000';
  const targetStoreName = store ? store.name : cart[0].storeName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || phone.trim().length < 8) {
      setError('Por favor preencha o seu nome e um número de telefone válido em Moçambique.');
      return;
    }
    setError('');

    const itemsFormatted = cart
      .map(item => {
        const vars = [];
        if (item.selectedSize) vars.push(`Tam: ${item.selectedSize}`);
        if (item.selectedColor) vars.push(`Cor: ${item.selectedColor}`);
        return `• ${item.quantity}x ${item.name}${vars.length ? ` (${vars.join(', ')})` : ''} — ${(item.price * item.quantity).toLocaleString('pt-MZ')} MT`;
      })
      .join('\n');

    let msg = `Olá *${targetStoreName}*!\nGostaria de finalizar a minha encomenda no Shopyump.\n\n`;
    msg += `📦 *PEDIDO*\n${itemsFormatted}\n\n`;
    msg += `💰 *Total: ${totalPrice.toLocaleString('pt-MZ')} MT*\n\n`;
    msg += `👤 *DADOS DE ENTREGA*\n• Nome: ${name.trim()}\n• Contacto: ${phone.trim()}\n`;
    if (address.trim()) msg += `• Endereço: ${address.trim()}\n`;
    if (notes.trim()) msg += `• Observações: ${notes.trim()}\n`;
    msg += `\n🔗 Link gerado via Shopyump Moz`;

    const url = `https://wa.me/${targetPhone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    clearCart();
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-24">
      <Link href="/produtos" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar a comprar
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* FORM */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Checkout Directo</span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Detalhes de Envio</h1>
            <p className="text-xs text-slate-500 mt-1">Nenhum registo necessário. Pedido finalizado por WhatsApp.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 text-red-600 text-xs font-bold border border-red-200">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Seu Nome Completo *', value: name, setter: setName, placeholder: 'Ex: José Luís Cunha', type: 'text' },
              { label: 'Telefone / WhatsApp Moçambique *', value: phone, setter: setPhone, placeholder: 'Ex: 84 123 4567', type: 'tel' },
              { label: 'Endereço de Entrega', value: address, setter: setAddress, placeholder: 'Ex: Bairro Central, Av. 24 de Julho nº 100', type: 'text' },
            ].map(({ label, value, setter, placeholder, type }) => (
              <div key={label}>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Nota para o vendedor (Opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ex: Entregar apenas no período da tarde..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-colors resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-black text-sm uppercase tracking-wide shadow-xl flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5 fill-white" /> Enviar Pedido para o WhatsApp
              </button>
            </div>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="font-black text-base border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Resumo • {targetStoreName}</span>
              <span className="text-xs font-normal text-slate-400">{cart.length} itens</span>
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs pb-2 border-b border-slate-800/60 last:border-0">
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-200">{item.quantity}x {item.name}</span>
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-[10px] text-slate-400">{item.selectedSize} {item.selectedColor}</p>
                    )}
                  </div>
                  <span className="font-black shrink-0">{(item.price * item.quantity).toLocaleString('pt-MZ')} MT</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400 font-medium"><span>Subtotal</span><span>{totalPrice.toLocaleString('pt-MZ')} MT</span></div>
              <div className="flex justify-between text-slate-400 font-medium"><span>Entrega em Maputo/MZ</span><span className="text-amber-300 font-bold">A combinar</span></div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800"><span>Total estimado</span><span>{totalPrice.toLocaleString('pt-MZ')} MT</span></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>Pagamento 100% seguro combinado directamente no acto de entrega ou M-Pesa.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
