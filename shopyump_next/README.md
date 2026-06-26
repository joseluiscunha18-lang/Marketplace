# Shopyump — Migração Vite → Next.js

## Como iniciar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm start          # servidor de produção
```

## O que mudou (Vite → Next.js App Router)

### Estrutura de pastas

```
Vite (antes)               Next.js (agora)
─────────────────────────  ─────────────────────────────────────
src/App.tsx (router manual) app/layout.tsx + cada page.tsx
src/pages/*.tsx             app/<rota>/page.tsx
src/components/             components/
src/context/                context/
src/data/                   data/
index.html                  (gerido pelo Next.js)
vite.config.ts              next.config.ts
```

### Melhorias de SEO implementadas

| Funcionalidade | Antes (Vite SPA) | Agora (Next.js SSG/SSR) |
|---|---|---|
| HTML inicial enviado ao Google | ❌ Vazio (JS renderiza) | ✅ HTML completo |
| `<title>` e `<meta>` por página | ❌ Estático / manual | ✅ `generateMetadata()` por rota |
| Open Graph por produto/loja | ❌ Ausente | ✅ Imagem, título e URL dinâmicos |
| JSON-LD (Schema.org) | ❌ Ausente | ✅ `Product` e `Store` schemas |
| Sitemap automático | ❌ Ausente | ✅ `/sitemap.xml` gerado automaticamente |
| `robots.txt` | ❌ Ausente | ✅ `/robots.txt` com regras correctas |
| Pré-renderização de produtos | ❌ Só no cliente | ✅ `generateStaticParams()` (SSG) |
| `next/image` com lazy loading | ❌ `<img>` normal | ✅ Optimizado, WebP automático |
| `next/link` com prefetch | ❌ `window.history.pushState` | ✅ Navegação instantânea |

### Arquitectura de componentes

- **Server Components** (padrão): `page.tsx`, `layout.tsx`, `Footer`, `StoreCard`, `SellPage` — renderizados no servidor, zero JS no cliente para conteúdo estático.
- **Client Components** (`'use client'`): tudo que usa estado interactivo — `Header`, `CartDrawer`, `ProductCard`, `CartContext`, filtros de marketplace, detalhe de produto.

### Routing

O router manual do Vite (`window.history.pushState` + `useState`) foi substituído pelo **App Router do Next.js**:

- `/` → `app/page.tsx`
- `/produtos` → `app/produtos/page.tsx`
- `/lojas` → `app/lojas/page.tsx`
- `/loja/[slug]` → `app/loja/[slug]/page.tsx`
- `/produto/[slug]` → `app/produto/[slug]/page.tsx`
- `/vender` → `app/vender/page.tsx`
- `/checkout` → `app/checkout/page.tsx`

### Notas

- O carrinho usa `localStorage` apenas no cliente (hidratado com `useEffect` para evitar erros de hidratação SSR).
- O checkout está marcado com `robots: { index: false }` — não precisa de indexação.
- O `next/image` requer que as imagens externas sejam declaradas em `next.config.ts` (já configurado com `remotePatterns: ['**']`).
