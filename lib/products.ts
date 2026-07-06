export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  images?: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: 'beat-license-basic',
    name: 'Beat License - Basic',
    description: 'Royalty-free beat license for personal use',
    priceInCents: 2999, // $29.99
  },
  {
    id: 'beat-license-premium',
    name: 'Beat License - Premium',
    description: 'Royalty-free beat license with unlimited streaming',
    priceInCents: 9999, // $99.99
  },
  {
    id: 'beat-license-exclusive',
    name: 'Beat License - Exclusive',
    description: 'Exclusive beat license with all rights',
    priceInCents: 29999, // $299.99
  },
  {
    id: 'merch-t-shirt',
    name: 'Limited Edition T-Shirt',
    description: 'Official merchandise t-shirt',
    priceInCents: 3999, // $39.99
  },
  {
    id: 'merch-hoodie',
    name: 'Premium Hoodie',
    description: 'Official merchandise premium hoodie',
    priceInCents: 5999, // $59.99
  },
  {
    id: 'album-digital',
    name: 'Digital Album',
    description: 'Complete digital album download',
    priceInCents: 1299, // $12.99
  },
]
