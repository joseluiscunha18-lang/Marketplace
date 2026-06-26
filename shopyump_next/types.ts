export interface Store {
  id: string;
  slug: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  longDescription?: string;
  location: string;
  whatsapp: string;
  instagram?: string;
  facebook?: string;
  category: string;
  verified: boolean;
  productCount: number;
  rating: number;
  createdAt: string;
}

export interface ProductVariantColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  storeLocation: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  images: string[];
  description: string;
  sizes?: string[];
  colors?: ProductVariantColor[];
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface FilterState {
  search: string;
  category: string;
  storeSlug?: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}
