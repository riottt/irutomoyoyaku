'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Restaurant, Cuisine, PriceRange, Location } from '@/types/restaurant'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

const cuisines: { value: Cuisine; label: string }[] = [
  { value: 'japanese', label: '和食' },
  { value: 'sushi', label: '寿司' },
  { value: 'ramen', label: 'ラーメン' },
  { value: 'izakaya', label: '居酒屋' },
  { value: 'yakiniku', label: '焼肉' },
  { value: 'tempura', label: '天ぷら' },
  { value: 'kaiseki', label: '懐石料理' },
  { value: 'udon', label: 'うどん' },
  { value: 'soba', label: 'そば' },
  { value: 'tonkatsu', label: 'とんかつ' },
]

const priceRanges: { value: PriceRange; label: string }[] = [
  { value: 'cheap', label: '~¥3,000' },
  { value: 'moderate', label: '¥3,000~¥8,000' },
  { value: 'expensive', label: '¥8,000~¥15,000' },
  { value: 'luxury', label: '¥15,000~' },
]

const locations: { value: Location; label: string }[] = [
  { value: 'shinjuku', label: '新宿' },
  { value: 'shibuya', label: '渋谷' },
  { value: 'ginza', label: '銀座' },
  { value: 'roppongi', label: '六本木' },
  { value: 'ueno', label: '上野' },
  { value: 'asakusa', label: '浅草' },
  { value: 'akihabara', label: '秋葉原' },
  { value: 'ikebukuro', label: '池袋' },
  { value: 'tsukiji', label: '築地' },
  { value: 'harajuku', label: '原宿' },
]

export default function RestaurantsPage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | ''>('')
  const [selectedPrice, setSelectedPrice] = useState<PriceRange | ''>('')
  const [selectedLocation, setSelectedLocation] = useState<Location | ''>('')

  // TODO: Implement actual search logic with Supabase
  const restaurants: Restaurant[] = []

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input
            placeholder={t('restaurants.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-1/3"
          />
          <Select value={selectedCuisine} onValueChange={(value) => setSelectedCuisine(value as Cuisine)}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder={t('restaurants.filters.cuisine')} />
            </SelectTrigger>
            <SelectContent>
              {cuisines.map((cuisine) => (
                <SelectItem key={cuisine.value} value={cuisine.value}>
                  {cuisine.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPrice} onValueChange={(value) => setSelectedPrice(value as PriceRange)}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder={t('restaurants.filters.price')} />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((price) => (
                <SelectItem key={price.value} value={price.value}>
                  {price.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={(value) => setSelectedLocation(value as Location)}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder={t('restaurants.filters.location')} />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  {/* TODO: Add Image component */}
                  <div className="absolute inset-0 bg-gray-200" />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{restaurant.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{restaurant.cuisine}</Badge>
                    <Badge variant="outline">{restaurant.priceRange}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {restaurant.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
