import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight, Store, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { MOCK_STORES } from '@/data/mockStores';
import { ProductCard } from '@/components/ProductCard';
import { StoreCard } from '@/components/StoreCard';

export const metadata: Metadata = {
  title: 'Shopyump Moz — Marketplace de Produtos Locais em Moçambique',
  description:
    'Descubra produtos autênticos de lojas verificadas em Maputo, Beira, Nampula e todo Moçambique. Compre directamente via WhatsApp. Zero comissões.',
  alternates: { canonical: 'https://shopyump.com' },
  openGraph: {
    title: 'Shopyump Moz — Marketplace Moçambicano',
    description: 'Marketplace de produtos locais com checkout directo pelo WhatsApp.',
    url: 'https://shopyump.com',
    type: 'website',
  },
};

const categories = [
  'Calçado & Moda',
  'Tecnologia',
  'Moda & Artesanato',
  'Beleza & Saúde',
  'Casa & Decoração',
  'Desporto & Lazer',
];

export default function HomePage() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 8);
  const featuredStores = MOCK_STORES.slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* HERO */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Marketplace Moçambicano 100% WhatsApp
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            Descubra produtos locais ou{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              crie sua loja online
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Compre directamente de negócios locais verificados em Moçambique ou transforme o seu catálogo do WhatsApp numa loja online profissional com SEO automático no Google.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/produtos"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2"
            >
              Explorar Produtos <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/vender"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 font-extrabold text-sm sm:text-base backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4 text-amber-300" /> Criar Loja Grátis
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-400 border-t border-white/10 max-w-xl mx-auto">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> +500 Pedidos gerados</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero comissões</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Indexação no Google</span>
          </div>
        </div>
      </section>

      {/* CATEGORY SHORTCUTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-100 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <Link href="/produtos" className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-extrabold shrink-0 shadow-sm">
            🔥 Todas Categorias
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/produtos?cat=${encodeURIComponent(cat)}`}
              className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl shrink-0 transition-colors border border-slate-200/60"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-1">Catálogo Moçambique</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Produtos em Destaque</h2>
          </div>
          <Link href="/produtos" className="text-xs font-extrabold text-slate-900 hover:text-emerald-600 flex items-center gap-1 group w-fit">
            Ver marketplace completo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* FEATURED STORES */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">Lojas Oficiais</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Lojas em Destaque</h2>
            </div>
            <Link href="/lojas" className="text-xs font-extrabold text-slate-900 hover:text-emerald-600 flex items-center gap-1 group w-fit">
              Ver todas as lojas <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>

      {/* SAAS CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-900 rounded-3xl text-white p-8 sm:p-14 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest">
              SaaS Para Lojistas Moçambicanos
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
              Cansado de perder vendas no meio das conversas do WhatsApp?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Com a Shopyump você cadastra os seus produtos, ganha um link exclusivo da sua loja e recebe pedidos prontos directamente no seu WhatsApp.
            </p>
            <div className="pt-6">
              <Link
                href="/vender"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95 inline-block"
              >
                Criar Minha Loja Grátis →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4 relative z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-2">🟢 Pedido Recebido #412</span>
              <span>Agora</span>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl text-xs space-y-2 text-emerald-200">
              <p className="font-black text-white">📦 Novo Pedido - Kix Maputo</p>
              <p>• 1x Nike Air Force 1 (Tam: 42) — 6.500 MT</p>
              <p>• 1x Quimono Capulana — 3.200 MT</p>
              <p className="font-black pt-2 border-t border-emerald-500/20 text-emerald-400 text-sm">💰 Total: 9.700 MT</p>
              <p className="text-[11px] text-slate-400">👤 Cliente: João Silva (84 123 4567)</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-semibold text-slate-500">Nenhum login de cliente exigido</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
