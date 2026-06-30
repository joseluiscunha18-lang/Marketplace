'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-black text-base text-slate-900">Seu Carrinho</h2>
                <p className="text-xs font-semibold text-slate-400">{cart.length} produto{cart.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">O carrinho está vazio</h3>
                  <p className="text-xs text-slate-400 mt-1">Navegue pelas lojas locais e adicione produtos.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800"
                >
                  <Link href="/produtos">Ver Marketplace</Link>
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="flex gap-4 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 relative">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0 relative">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-col flex-1 justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">{item.name}</h4>
                        <button onClick={() => removeFromCart(index)} className="text-slate-400 hover:text-red-500 p-1 -mr-1 -mt-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Loja: {item.storeName}</p>
                      {(item.selectedSize || item.selectedColor) && (
                        <div className="flex gap-1.5 mt-1">
                          {item.selectedSize && <span className="text-[10px] font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-600">Tam: {item.selectedSize}</span>}
                          {item.selectedColor && <span className="text-[10px] font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-600">Cor: {item.selectedColor}</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-sm text-slate-900">{item.price.toLocaleString('pt-MZ')} MT</span>
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-white space-y-4 shadow-lg shrink-0">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Subtotal</span><span>{totalPrice.toLocaleString('pt-MZ')} MT</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Taxa da plataforma</span><span className="text-emerald-600 font-bold">Grátis</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total estimado</span><span>{totalPrice.toLocaleString('pt-MZ')} MT</span>
                </div>
              </div>
              <Link
                href="/carrinho"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-black text-sm uppercase tracking-wide shadow-xl flex items-center justify-center gap-2"
              >
                Ver Carrinho e Finalizar <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-center text-slate-400">⚡ Pedido enviado directamente para o WhatsApp do vendedor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
