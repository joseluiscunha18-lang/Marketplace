import { StoreCheckoutClient } from './StoreCheckoutClient';

export default async function StoreCheckoutPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = await params;
  return <StoreCheckoutClient storeSlug={storeSlug} />;
}
