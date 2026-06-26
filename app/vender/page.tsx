import type { Metadata } from 'next';
import Link from 'next/link';
import { Store, CheckCircle2, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Criar Loja Online Grátis em Moçambique — Shopyump para Lojistas',
  description: 'Crie a sua loja online grátis em Moçambique. Link exclusivo, SEO no Google, pedidos automáticos no WhatsApp. Sem comissões. Configuração em 2 minutos.',
  alternates: { canonical: 'https://shopyump.com/vender' },
  openGraph: {
    title: 'Crie a Sua Loja Online Grátis | Shopyump Moz',
    description: 'Transforme o seu negócio no WhatsApp numa loja profissional com SEO automático no Google. Zero comissões.',
    url: 'https://shopyump.com/vender',
  },
};

const benefits = [
  { title: 'Link exclusivo para a bio', desc: 'shopyump.com/loja/sua-marca pronta para divulgar no Instagram e TikTok.' },
  { title: 'Indexação de SEO no Google', desc: 'Os seus produtos aparecem nas buscas de quem procura em Moçambique.' },
  { title: 'Pedidos organizados no WhatsApp', desc: 'Receba a encomenda com nome, endereço e cálculo total pronto.' },
  { title: 'Zero comissões por venda', desc: 'Lucra 100% do valor dos seus produtos. Pagamento directo entre si e o cliente.' },
  { title: 'Catálogo fácil no telemóvel', desc: 'Adicione ou edite preços de qualquer lugar em poucos segundos.' },
  { title: 'Suporte humanizado em Moçambique', desc: 'A nossa equipa ajuda-o a configurar a sua loja sem complicações técnicas.' },
];

const waLink = `https://wa.me/258841112233?text=${encodeURIComponent('Olá! Quero criar a minha loja online na Shopyump grátis. Podem me ajudar?')}`;

export default function VenderPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-widest">
            Plataforma SaaS Shopyump
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Venda mais no WhatsApp com uma{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
              loja online de verdade
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg font-normal max-w-xl mx-auto leading-relaxed">
            Abandone as conversas infinitas com fotos soltas. Crie a sua vitrine pública com SEO no Google em menos de 2 minutos.
          </p>
          <div className="pt-4">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black rounded-full text-base uppercase tracking-wider shadow-2xl inline-flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <MessageSquare className="w-5 h-5 fill-white" /> Criar Minha Loja Grátis via WhatsApp
            </a>
            <p className="text-[11px] text-slate-400 mt-3">⚡ Configuração assistida pela nossa equipa em Moçambique.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">Simples e Prático</span>
          <h2 className="text-3xl font-black text-slate-900">Como funciona?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '1', title: 'Cadastre seus produtos', desc: 'Coloque o nome, foto e preço em Meticais no seu painel simplificado do telemóvel.' },
            { n: '2', title: 'Partilhe o seu link', desc: 'Divulgue o seu link shopyump.com/loja/sua-marca nos seus stories e redes sociais.' },
            { n: '3', title: 'Receba no WhatsApp', desc: 'O cliente escolhe o que quer e envia a encomenda pronta com nome e endereço no seu WhatsApp.', green: true },
          ].map((step) => (
            <div key={step.n} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md space-y-4 text-center">
              <div className={`w-14 h-14 ${step.green ? 'bg-[#25D366]' : 'bg-slate-900'} text-${step.green ? 'white' : 'amber-300'} font-black text-xl rounded-2xl flex items-center justify-center mx-auto shadow-sm`}>
                {step.n}
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900">Porquê escolher o Shopyump?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-2 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{b.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <Store className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Pronto para profissionalizar as suas vendas?
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Junte-se a centenas de negócios locais que já faturam todos os dias com o Shopyump Moçambique.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-full text-xs uppercase tracking-wider shadow-xl inline-block"
        >
          Falar com Suporte & Criar Loja
        </a>
      </section>
    </div>
  );
}
