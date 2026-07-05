export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  category: 'merch' | 'license' | 'beats' | 'dj'
  cryptoPrice?: number
  isDJ?: boolean
}

export const PRODUCTS: Product[] = [
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
    id: 'bb-dj-online-2hr',
    name: 'Online DJ Session (2 Hours)',
    description: 'Virtual DJ set via Zoom, Discord, or custom stream',
    priceInCents: 30000,
    category: 'dj',
    cryptoPrice: 0.129,
    isDJ: true,
  },
  {
    id: 'bb-dj-online-4hr',
    name: 'Online DJ Session (4 Hours)',
    description: 'Extended virtual DJ set with custom requests and interaction',
    priceInCents: 50000,
    category: 'dj',
    cryptoPrice: 0.215,
    isDJ: true,
  },
  {
    id: 'bb-dj-local',
    name: 'Local In-Person DJ',
    description: 'Up to 4 hours — lounge, bar, or private event (within 30 miles)',
    priceInCents: 50000,
    category: 'dj',
    cryptoPrice: 0.215,
    isDJ: true,
  },
  {
    id: 'bb-dj-regional',
    name: 'Regional In-Person DJ',
    description: 'Up to 6 hours — regional venue or event (30–150 miles)',
    priceInCents: 100000,
    category: 'dj',
    cryptoPrice: 0.43,
    isDJ: true,
  },
  {
    id: 'bb-dj-destination',
    name: 'Destination In-Person DJ',
    description: 'Up to 8 hours — anywhere in North America, travel included',
    priceInCents: 250000,
    category: 'dj',
    cryptoPrice: 1.075,
    isDJ: true,
  },
]
