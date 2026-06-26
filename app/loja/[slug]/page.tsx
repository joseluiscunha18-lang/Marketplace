import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ShieldCheck, MessageSquare, Package, ArrowLeft } from 'lucide-react';
import { MOCK_STORES } from '@/data/mockStores';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { ProductCard } from '@/components/ProductCard';

type Props = { params: Promise<{ slug: string }> };

// Pre-render all store pages at build time (SSG)
export async function generateStaticParams() {
  return MOCK_STORES.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = MOCK_STORES.find((s) => s.slug === slug);
  if (!store) return { title: 'Loja não encontrada' };

  const storeProducts = MOCK_PRODUCTS.filter((p) => p.storeId === store.id || p.storeSlug === store.slug);

  return {
    title: `${store.name} — Loja Online em ${store.location} | Shopyump`,
    description: `${store.description} ${storeProducts.length} produtos disponíveis em ${store.location}. Compre directamente pelo WhatsApp.`,
    alternates: { canonical: `https://shopyump.com/loja/${store.slug}` },
    openGraph: {
      title: `${store.name} | Shopyump Moz`,
      description: store.description,
      url: `https://shopyump.com/loja/${store.slug}`,
      images: [{ url: store.banner, width: 1200, height: 630, alt: store.name }],
      type: 'website',
    },
  };
}

export default async function StoreDetailPage({ params }: Props) {
  const { slug } = await params;
  const store = MOCK_STORES.find((s) => s.slug === slug);
  if (!store) notFound();

  const storeProducts = MOCK_PRODUCTS.filter((p) => p.storeId === store.id || p.storeSlug === store.slug);
  const whatsappLink = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Olá ${store.name}! Vi a vossa loja no Shopyump e gostaria de saber mais.`)}`;

  return (
    <div className="pb-20">
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: store.name,
            description: store.description,
            image: store.banner,
            address: { '@type': 'PostalAddress', addressLocality: store.location, addressCountry: 'MZ' },
            url: `https://shopyump.com/loja/${store.slug}`,
          }),
        }}
      />

      {/* Store Banner */}
      <div className="h-44 sm:h-72 w-full relative bg-slate-200 overflow-hidden">
        <Image src={store.banner} alt={store.name} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link href="/lojas" className="absolute top-4 left-4 z-20 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-extrabold text-slate-900 flex items-center gap-1.5 shadow-md hover:bg-white">
          <ArrowLeft className="w-3.5 h-3.5" /> Directório
        </Link>
      </div>

      {/* Store Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-20 z-10 mb-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0 relative">
              <Image src={store.logo} alt={store.name} fill className="object-cover" sizes="112px" />
            </div>
            <div className="space-y-1.5 py-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{store.name}</h1>
                {store.verified && <ShieldCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" aria-label="Loja Verificada" />}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {store.location}</span>
                <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5 text-emerald-500" /> {storeProducts.length} Produtos activos</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 pt-2 max-w-xl font-medium leading-relaxed">
                {store.longDescription || store.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" /> Contactar no WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Store Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-slate-900">Catálogo Exclusivo • {store.name}</h2>
          <span className="text-xs font-bold text-slate-400">{storeProducts.length} itens disponíveis</span>
        </div>

        {storeProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl">
            <p className="text-slate-500 text-sm font-semibold">Esta loja ainda não publicou produtos no Shopyump.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
            {storeProducts.map((prod) => <ProductCard key={prod.id} product={prod} />)}
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400">
          ℹ️ Página oficial e indexável de <strong>{store.name}</strong> ({store.location}) no Shopyump. Sem concorrentes exibidos.
        </p>
      </div>
    </div>
  );
}
