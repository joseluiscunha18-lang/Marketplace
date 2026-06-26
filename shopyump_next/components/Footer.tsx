import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-white font-black text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center text-sm font-black">SY</div>
            Shopyump
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            A plataforma moçambicana para descobrir produtos autênticos ou criar a sua própria loja online em menos de 2 minutos. Pedidos 100% diretos via WhatsApp.
          </p>
          <div className="flex items-center gap-3 pt-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" /> Sem taxas ocultas de transação
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-white">Explorar</h4>
          <ul className="space-y-2 text-sm font-medium">
            {[
              { href: '/produtos', label: 'Todos os Produtos' },
              { href: '/lojas', label: 'Lojas Verificadas' },
              { href: '/produtos', label: 'Ofertas & Promoções' },
              { href: '/produtos', label: 'Novidades em Maputo' },
            ].map((l) => (
              <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-white">Para Negócios</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <Link href="/vender" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Criar Loja Grátis
              </Link>
            </li>
            {['Painel do Vendedor', 'Vantagens de SEO Local', 'Integração WhatsApp'].map((l) => (
              <li key={l}><Link href="/vender" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-white">Ajuda & Legal</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link href="/" className="hover:text-white transition-colors">Sobre a Shopyump</Link></li>
            <li>
              <Link href="/vender" className="hover:text-white transition-colors flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Suporte no WhatsApp
              </Link>
            </li>
            <li><span className="text-slate-500 cursor-not-allowed">Termos de Serviço</span></li>
            <li><span className="text-slate-500 cursor-not-allowed">Privacidade de Dados</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Shopyump Moçambique. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-slate-400" /> Feito para impulsionar o comércio local
          </span>
        </div>
      </div>
    </footer>
  );
};
