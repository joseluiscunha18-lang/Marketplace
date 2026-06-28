import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { MOCK_STORES } from '@/data/mockStores';
import { getRelatedFromSameStore, getRelatedFromOtherStores } from '@/lib/productHelpers';
import { ProductDetailClient } from './ProductDetailClient';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Produto não encontrado' };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? ` — ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% desconto`
      : '';

  return {
    title: `${product.name}${discount} | ${product.storeName} — Shopyump`,
    description: `${product.description.slice(0, 150)} Vendido por ${product.storeName} em ${product.storeLocation}. Preço: ${product.price.toLocaleString('pt-MZ')} MT. Compra directa pelo WhatsApp.`,
    alternates: { canonical: `https://shopyump.com/produto/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${product.storeName}`,
      description: product.description.slice(0, 150),
      url: `https://shopyump.com/produto/${product.slug}`,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const store = MOCK_STORES.find((s) => s.id === product.storeId || s.slug === product.storeSlug);
  const relatedFromStore = getRelatedFromSameStore(product);
  const relatedFromOthers = getRelatedFromOtherStores(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.storeName },
    offers: {
      '@type': 'Offer',
      url: `https://shopyump.com/produto/${product.slug}`,
      priceCurrency: 'MZN',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: product.storeName },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient
        product={product}
        store={store}
        relatedFromStore={relatedFromStore}
        relatedFromOthers={relatedFromOthers}
      />
    </>
  );
}
