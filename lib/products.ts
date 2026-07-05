export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: 'merch' | 'license' | 'beats' | 'dj'
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
  {
    id: 'bb-dj-local',
    name: 'Local DJ Service',
    description: 'Up to 4 hours — lounge, bar, or private event (within 30 miles)',
    priceInCents: 50000,
    category: 'dj',
    cryptoPrice: 0.215,
  },
  {
    id: 'bb-dj-regional',
    name: 'Regional DJ Service',
    description: 'Up to 6 hours — regional venue or event (30–150 miles)',
    priceInCents: 100000,
    category: 'dj',
    cryptoPrice: 0.43,
  },
  {
    id: 'bb-dj-destination',
    name: 'Destination DJ Service',
    description: 'Up to 8 hours — anywhere in North America, travel included',
    priceInCents: 250000,
    category: 'dj',
    cryptoPrice: 1.075,
  },
]
