import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'nike-air-force-1-07-white',
    storeId: 'store-1',
    storeName: 'Kix Maputo',
    storeSlug: 'kix-maputo',
    storeLocation: 'Maputo',
    name: 'Nike Air Force 1 \'07 Triple White',
    price: 6500,
    originalPrice: 7500,
    category: 'Calçado & Moda',
    subcategory: 'Ténis',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80'
    ],
    description: 'O brilho vive no Nike Air Force 1 \'07, o ícone do basquetebol que dá um toque renovado àquilo que conheces melhor: pele fresca, cores simples e a quantidade perfeita de brilho para te fazer sobressair.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [{ name: 'Branco', hex: '#ffffff' }],
    inStock: true,
    featured: true,
    createdAt: '2025-02-20'
  },
  {
    id: 'prod-2',
    slug: 'adidas-samba-og-black-white',
    storeId: 'store-1',
    storeName: 'Kix Maputo',
    storeSlug: 'kix-maputo',
    storeLocation: 'Maputo',
    name: 'Adidas Samba OG Core Black / White',
    price: 5800,
    category: 'Calçado & Moda',
    subcategory: 'Ténis',
    image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    ],
    description: 'Nascido nos campos de futebol indoor dos anos 50, o clássico Samba conquistou as ruas mundiais. Cabedal em couro macio com sobreposições em camurça e sola de borracha gum retro.',
    sizes: ['38', '39', '40', '41', '42'],
    colors: [{ name: 'Preto/Branco', hex: '#111827' }],
    inStock: true,
    featured: true,
    createdAt: '2025-02-19'
  },
  {
    id: 'prod-3',
    slug: 'airpods-pro-2-usb-c',
    storeId: 'store-3',
    storeName: 'TechZone Matola',
    storeSlug: 'techzone-matola',
    storeLocation: 'Matola',
    name: 'Apple AirPods Pro 2ª Geração (MagSafe USB-C)',
    price: 14500,
    originalPrice: 16000,
    category: 'Tecnologia',
    subcategory: 'Áudio',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
    ],
    description: 'Cancelamento Ativo de Ruído até 2x melhorado, Modo Ambiente Adaptativo e Áudio Espacial personalizado com acompanhamento dinâmico da cabeça.',
    inStock: true,
    featured: true,
    createdAt: '2025-02-22'
  },
  {
    id: 'prod-4',
    slug: 'vestido-capulana-kimono-zambezia',
    storeId: 'store-4',
    storeName: 'Capulana Chic',
    storeSlug: 'capulana-chic',
    storeLocation: 'Maputo',
    name: 'Quimono Capulana Premium Estampa Zambézia',
    price: 3200,
    category: 'Moda & Artesanato',
    subcategory: 'Moda Feminina',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
    ],
    description: 'Quimono longo unissexo confeccionado em tecido 100% algodão de capulana moçambicana encorpada. Acabamento impecável com costura dupla. Ótimo para usar sobre vestidos, calças ou na praia.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Laranja/Dourado', hex: '#ea580c' }, { name: 'Azul Turquesa', hex: '#0284c7' }],
    inStock: true,
    featured: true,
    createdAt: '2025-02-15'
  },
  {
    id: 'prod-5',
    slug: 'serum-vitamina-c-la-roche-posay',
    storeId: 'store-5',
    storeName: 'Glow Cosmetics MZ',
    storeSlug: 'glow-cosmetics-mz',
    storeLocation: 'Maputo',
    name: 'Sérum Facial Vitamina C Pura 10% La Roche-Posay (30ml)',
    price: 2900,
    originalPrice: 3400,
    category: 'Beleza & Saúde',
    subcategory: 'Skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-0e6d5c9a69ef?w=800&q=80'
    ],
    description: 'Sérum anti-envelhecimento e iluminador com 10% de vitamina C pura, ácido salicílico e neurosensine. Reduz rugas, melhora a textura e restaura o brilho natural da pele.',
    inStock: true,
    featured: true,
    createdAt: '2025-02-14'
  },
  {
    id: 'prod-6',
    slug: 'conjunto-linho-masculino-safari',
    storeId: 'store-2',
    storeName: 'Urban Style MZ',
    storeSlug: 'urban-style-mz',
    storeLocation: 'Matola',
    name: 'Conjunto Camisa + Calções Linho Safari Bege',
    price: 2450,
    category: 'Moda',
    subcategory: 'Moda Masculina',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'
    ],
    description: 'Conjunto fresco em linho misto de alta qualidade. Camisa de manga curta com gola cubana e calções com cordão ajustável na cintura. Ideal para os dias quentes de fim de semana.',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Bege Areia', hex: '#d6d3d1' }, { name: 'Verde Musgo', hex: '#365314' }],
    inStock: true,
    featured: false,
    createdAt: '2025-02-10'
  },
  {
    id: 'prod-7',
    slug: 'luminaria-mesa-led-nordica-touch',
    storeId: 'store-6',
    storeName: 'Casa & Decor Beira',
    storeSlug: 'casa-decor-beira',
    storeLocation: 'Beira',
    name: 'Luminária de Mesa Nórdica LED Recarregável Touch',
    price: 1850,
    category: 'Casa & Decoração',
    subcategory: 'Iluminação',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'
    ],
    description: 'Candeeiro de mesa com design minimalista em metal escovado. 3 temperaturas de cor (quente, neutro e frio) controladas por toque. Bateria interna recarregável via USB com autonomia de 12 horas.',
    colors: [{ name: 'Dourado Mate', hex: '#ca8a04' }, { name: 'Preto Carbono', hex: '#18181b' }],
    inStock: true,
    featured: true,
    createdAt: '2025-02-08'
  },
  {
    id: 'prod-8',
    slug: 'smartwatch-ultra-s9-amoloed',
    storeId: 'store-3',
    storeName: 'TechZone Matola',
    storeSlug: 'techzone-matola',
    storeLocation: 'Matola',
    name: 'Smartwatch Ultra S9 Pro AMOLED + 3 Braceletes',
    price: 2800,
    originalPrice: 3500,
    category: 'Tecnologia',
    subcategory: 'Smartwatches',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
    ],
    description: 'Ecrã infinito AMOLED de 2.2 polegadas, chamadas Bluetooth, monitorização de batimentos cardíacos, pressão arterial e mais de 100 modos desportivos. Compatível com Android e iPhone.',
    colors: [{ name: 'Titânio Laranja', hex: '#f97316' }, { name: 'Preto Total', hex: '#0f172a' }],
    inStock: true,
    featured: true,
    createdAt: '2025-02-18'
  },
  {
    id: 'prod-9',
    slug: 'tapete-ioga-tpe-antiderrapante-6mm',
    storeId: 'store-7',
    storeName: 'Fitness Pro MZ',
    storeSlug: 'fitness-pro-mz',
    storeLocation: 'Maputo',
    name: 'Tapete de Ioga TPE Antiderrapante Premium 6mm + Alça',
    price: 1600,
    category: 'Desporto & Lazer',
    subcategory: 'Acessórios Treino',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'
    ],
    description: 'Feito em material ecológico TPE reciclável. Amortecimento confortável para articulações e textura dupla face anti-escorregamento mesmo com suor intenso. Inclui alça de transporte gratuita.',
    colors: [{ name: 'Roxo Lavanda', hex: '#a855f7' }, { name: 'Azul Marinho', hex: '#1e3a8a' }],
    inStock: true,
    featured: false,
    createdAt: '2025-02-12'
  },
  {
    id: 'prod-10',
    slug: 'teclado-mecanico-gamer-rgb-blue-switch',
    storeId: 'store-8',
    storeName: 'Gamerz Nampula',
    storeSlug: 'gamerz-nampula',
    storeLocation: 'Nampula',
    name: 'Teclado Mecânico Compacto 60% RGB (Switch Blue)',
    price: 3100,
    originalPrice: 3800,
    category: 'Tecnologia',
    subcategory: 'Gaming',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
    ],
    description: 'Formato 60% ultra compacto que deixa mais espaço na mesa para movimentos do rato. Switches mecânicos azuis com clique tátil audível e 20 modos de retroiluminação RGB colorida.',
    inStock: true,
    featured: false,
    createdAt: '2025-01-28'
  },
  {
    id: 'prod-11',
    slug: 'new-balance-550-white-green',
    storeId: 'store-1',
    storeName: 'Kix Maputo',
    storeSlug: 'kix-maputo',
    storeLocation: 'Maputo',
    name: 'New Balance 550 White / Pine Green',
    price: 7200,
    category: 'Calçado & Moda',
    subcategory: 'Ténis',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80'
    ],
    description: 'O regresso de uma lenda do basquetebol de 1989. O New Balance 550 apresenta uma silhueta limpa e clássica de cano baixo que presta homenagem aos jogadores profissionais dos anos 80.',
    sizes: ['40', '41', '42', '43'],
    colors: [{ name: 'Branco/Verde', hex: '#15803d' }],
    inStock: true,
    featured: true,
    createdAt: '2025-02-21'
  },
  {
    id: 'prod-12',
    slug: 'bolsa-palha-capulana-praia',
    storeId: 'store-4',
    storeName: 'Capulana Chic',
    storeSlug: 'capulana-chic',
    storeLocation: 'Maputo',
    name: 'Bolsa Artesanal de Vime com Forro Capulana',
    price: 1950,
    category: 'Moda & Artesanato',
    subcategory: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
    ],
    description: 'Bolsa redonda tecida à mão por artesãos locais. Interior totalmente forrado com capulana de cores vivas e bolso interno com fecho éclair.',
    inStock: true,
    featured: false,
    createdAt: '2025-01-20'
  }
];
