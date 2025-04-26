// Music related types
export interface Track {
  id: string
  title: string
  duration: number
  albumArt: string
  artist?: string
  releaseDate?: string
  isExplicit?: boolean
}

export interface Single extends Track {
  releaseYear: number
}

export interface Album {
  id: string
  title: string
  year: number
  tracks: number
  cover: string
  artist?: string
  type: "album" | "ep" | "single"
  trackList?: Track[]
}

export interface TourDate {
  id: string
  date: string
  venue: string
  city: string
  country: string
  ticketLink: string
  status?: "upcoming" | "soldout" | "cancelled" | "rescheduled"
  price?: {
    general: number
    vip?: number
  }
  description?: string
  image?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface GearItem {
  id: string
  name: string
  category: string
  image: string
  link: string
  affiliateLink?: string
  description?: string
  price?: number
  features?: string[]
  personalNotes?: string
  rating?: number
  yearPurchased?: number
  isSponsored?: boolean
  alternativeOptions?: {
    budget?: string
    premium?: string
  }
  videoReviewLink?: string
}

export interface SetupItem {
  id: string
  title: string
  description: string
  image: string
  gearIncluded: string[]
}

export interface MerchItem {
  id: string
  name: string
  price: number
  image: string
  cryptoPrice: number
  description?: string
  category?: MerchCategory
  sizes?: string[]
  colors?: string[]
  inStock?: boolean
  releaseDate?: string
  relatedAlbum?: string
  relatedTour?: string
  isLimited?: boolean
  isFeatured?: boolean
  discountPercentage?: number
  images?: string[]
  tags?: string[]
}

export type MerchCategory =
  | "clothing"
  | "accessories"
  | "vinyl"
  | "digital"
  | "poster"
  | "tour"
  | "limited"
  | "collection"

export interface CartItem extends MerchItem {
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export type PaymentMethod = "usd" | "crypto"

