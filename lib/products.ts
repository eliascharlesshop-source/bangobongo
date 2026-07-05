export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: 'merch' | 'license' | 'beats'
  cryptoPrice?: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'bb-tee',
    name: 'BangoBongo Tee',
    description: 'Official BangoBongo logo tee — heavyweight cotton',
    priceInCents: 3500,
    category: 'merch',
    cryptoPrice: 0.015,
  },
  {
    id: 'bb-hoodie',
    name: 'BangoBongo Hoodie',
    description: 'Chrome Hearts limited edition hoodie',
    priceInCents: 6500,
    category: 'merch',
    cryptoPrice: 0.028,
  },
  {
    id: 'bb-cap',
    name: 'BangoBongo Cap',
    description: 'Structured snapback in midnight navy',
    priceInCents: 2800,
    category: 'merch',
    cryptoPrice: 0.012,
  },
  {
    id: 'bb-vinyl',
    name: 'Chrome Hearts Vinyl',
    description: '180g limited edition vinyl — Chrome Hearts album',
    priceInCents: 4500,
    category: 'merch',
    cryptoPrice: 0.019,
  },
  {
    id: 'bb-license-basic',
    name: 'Basic Beat License',
    description: 'Non-exclusive license — 50k streams, non-commercial',
    priceInCents: 2999,
    category: 'license',
    cryptoPrice: 0.013,
  },
  {
    id: 'bb-license-premium',
    name: 'Premium Beat License',
    description: 'Non-exclusive — unlimited streams, commercial use',
    priceInCents: 9999,
    category: 'license',
    cryptoPrice: 0.043,
  },
  {
    id: 'bb-license-exclusive',
    name: 'Exclusive Beat License',
    description: 'Full exclusive ownership with all rights transferred',
    priceInCents: 49900,
    category: 'license',
    cryptoPrice: 0.215,
  },
]
