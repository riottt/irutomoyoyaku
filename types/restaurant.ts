export type Cuisine =
  | 'japanese'
  | 'sushi'
  | 'ramen'
  | 'izakaya'
  | 'yakiniku'
  | 'tempura'
  | 'kaiseki'
  | 'udon'
  | 'soba'
  | 'tonkatsu'

export type PriceRange = 'cheap' | 'moderate' | 'expensive' | 'luxury'

export type Location =
  | 'shinjuku'
  | 'shibuya'
  | 'ginza'
  | 'roppongi'
  | 'ueno'
  | 'asakusa'
  | 'akihabara'
  | 'ikebukuro'
  | 'tsukiji'
  | 'harajuku'

export interface Restaurant {
  id: string
  name: string
  nameKo: string
  description: string
  descriptionKo: string
  cuisine: Cuisine
  priceRange: PriceRange
  location: Location
  address: string
  rating: number
  images: string[]
  features: string[]
  openingHours: {
    [key: string]: {
      open: string
      close: string
    }
  }
  coordinates: {
    latitude: number
    longitude: number
  }
  createdAt: string
  updatedAt: string
}
