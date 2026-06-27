'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Phone, MapPin, History, Store, Save } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export const ContaClient = () => {
  const { userInfo, updateUserInfo, orderHistory } = useUser();
  const [editing, setEditing] = useState(!userInfo);
  const [name, setName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [location, setLocation] = useState(userInfo?.location || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserInfo({ name, phone, location });
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Minha Conta</h1>
        <p className="text-sm text-slate-500">Seus dados e histórico de pedidos no Shopyump.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-6 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" /> Meus Dados
            </h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-xs font-black text-emerald-600 underline">
                Editar
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: 'Nome', value: name, setter: setName, icon: User, placeholder: 'Ex: João Silva' },
                  { label: 'Telefone', value: phone, setter: setPhone, icon: Phone, placeholder: 'Ex: 84 123 4567' },
                  { label: 'Localização', value: location, setter: setLocation, icon: MapPin, placeholder: 'Ex: Maputo, Cidade' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">{field.label}</label>
                    <div className="relative">
                      <field.icon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-900"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95">
                <Save className="w-4 h-4" /> Salvar Dados
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Nome', value: userInfo?.name, icon: User },
                { label: 'Telefone', value: userInfo?.phone, icon: Phone },
                { label: 'Localização', value: userInfo?.location, icon: MapPin },
              ].map((field) => (
                <div key={field.label} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <field.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase text-slate-400">{field.label}</span>
                    <span className="text-sm font-bold text-slate-900">{field.value || 'Não definido'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-slate-100">
            <Link href="/vender" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
              <Store className="w-5 h-5" /> Criar Minha Loja
            </Link>
          </div>
        </div>

        {/* Order History */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" /> Histórico de Pedidos
          </h2>

          {orderHistory.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="text-2xl">📦</div>
              <p className="text-slate-400 font-bold text-xs">Nenhum pedido registado ainda.</p>
              <Link href="/produtos" className="text-xs font-black text-emerald-600 underline">Explorar marketplace</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <div key={order.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 overflow-hidden shrink-0 relative">
                    <Image src={order.productImage} alt={order.productName} fill className="object-cover group-hover:scale-110 transition-transform" sizes="64px" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1">{order.productName}</h4>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">WhatsApp</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">Loja: {order.storeName}</p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-[10px] font-bold text-slate-400">{new Date(order.date).toLocaleDateString('pt-MZ')}</span>
                      <span className="text-sm font-black text-slate-900">{order.price.toLocaleString('pt-MZ')} MT</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
