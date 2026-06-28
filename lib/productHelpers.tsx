import type { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

/**
 * Detecta se um array de tamanhos representa numeração de calçado
 * (ex: ['39','40','41']) ou tamanho de vestuário (ex: ['S','M','L']).
 * Regra: se TODOS os valores forem puramente numéricos, é calçado.
 */
export function getSizeKind(sizes?: string[]): 'shoe' | 'apparel' | null {
  if (!sizes || sizes.length === 0) return null;
  const allNumeric = sizes.every((s) => /^\d+([.,]\d+)?$/.test(s.trim()));
  return allNumeric ? 'shoe' : 'apparel';
}

export function getSizeLabel(sizes?: string[]): string {
  const kind = getSizeKind(sizes);
  if (kind === 'shoe') return 'Número';
  return 'Tamanho';
}

/**
 * Produtos relacionados da MESMA loja (exclui o produto atual).
 */
export function getRelatedFromSameStore(product: Product, limit = 6): Product[] {
  return MOCK_PRODUCTS.filter(
    (p) => p.storeId === product.storeId && p.id !== product.id
  ).slice(0, limit);
}

/**
 * Produtos relacionados de OUTRAS lojas — prioriza mesma categoria/subcategoria,
 * com fallback para preencher até ao limite com outros produtos em destaque.
 */
export function getRelatedFromOtherStores(product: Product, limit = 8): Product[] {
  const others = MOCK_PRODUCTS.filter((p) => p.storeId !== product.storeId);

  const sameSubcategory = others.filter(
    (p) => product.subcategory && p.subcategory === product.subcategory
  );
  const sameCategory = others.filter(
    (p) => p.category === product.category && !sameSubcategory.includes(p)
  );
  const rest = others.filter(
    (p) => !sameSubcategory.includes(p) && !sameCategory.includes(p)
  );

  const ranked = [...sameSubcategory, ...sameCategory, ...rest];

  // Remove duplicados mantendo ordem
  const seen = new Set<string>();
  const unique = ranked.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return unique.slice(0, limit);
    }
