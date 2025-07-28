// Music related types
export interface Track {
  id: string
  title: string
  duration: number
  albumArt: string
  artist?: string
  audioUrl?: string
  releaseDate?: string
  isExplicit?: boolean
  category?: "original" | "licensed" | "beat"
  licenseType?: LicenseType
  price?: number
  bpm?: number
  key?: string
  genre?: string
  year?: number
  tags?: string[]
  trackoutIncluded?: boolean
  dittoReleaseId?: string
  isDistributed?: boolean
  waveformData?: number[]
  qualitySettings?: {
    bitrate: number
    sampleRate: number
    format: string
  }
}

export type LicenseType = "basic" | "premium" | "trackout" | "unlimited" | "exclusive"

export interface License {
  id: string
  type: LicenseType
  trackId: string
  customerId: string
  price: number
  purchaseDate: string
  expiryDate?: string
  usageRights: LicenseRights
  creditRequired: boolean
  isActive: boolean
  downloadCount: number
  streamCount: number
  contractTerms: string
}

export interface LicenseRights {
  streams: number | "unlimited"
  downloads: number | "unlimited"
  distribution: boolean
  commercialUse: boolean
  syncRights: boolean
  exclusivity: boolean
  modificationRights: boolean
  resaleRights: boolean
}

export interface LicenseTier {
  type: LicenseType
  name: string
  price: number
  description: string
  rights: LicenseRights
  leasePeriod?: string
  popular?: boolean
  features: string[]
}

export interface DittoRelease {
  id: string
  trackId: string
  releaseTitle: string
  artistName: string
  status: "pending" | "processing" | "live" | "failed"
  distributionDate?: string
  platforms: string[]
  analytics?: {
    streams: number
    revenue: number
    territories: string[]
  }
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
