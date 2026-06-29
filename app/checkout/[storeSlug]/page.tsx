import { StoreCheckoutClient } from './StoreCheckoutClient';

export default function StoreCheckoutPage({ params }: { params: { storeSlug: string } }) {
  return <StoreCheckoutClient storeSlug={params.storeSlug} />;
}
