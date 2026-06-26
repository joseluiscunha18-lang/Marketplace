import type { MetadataRoute } from 'next';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { MOCK_STORES } from '@/data/mockStores';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://shopyump.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/produtos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/lojas`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/vender`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const storeRoutes: MetadataRoute.Sitemap = MOCK_STORES.map((store) => ({
    url: `${base}/loja/${store.slug}`,
    lastModified: new Date(store.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((product) => ({
    url: `${base}/produto/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...storeRoutes, ...productRoutes];
}
