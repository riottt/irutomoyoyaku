'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { getRecommendedRestaurants } from '@/services/recommendation'
import { Restaurant } from '@/types/restaurant'
import { RestaurantCard } from './restaurant-card'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'

export function RecommendedSection() {
  const t = useTranslations()
  const { user } = useAuth()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadRecommendations()
    } else {
      setIsLoading(false)
    }
  }, [user])

  async function loadRecommendations() {
    try {
      const recommended = await getRecommendedRestaurants(user!.id)
      setRestaurants(recommended)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t('recommendations.title')}</h2>
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-[300px] flex-none">
              <CardContent className="p-0">
                <Skeleton className="h-[200px] rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user || restaurants.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('recommendations.title')}</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max gap-4 p-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="w-[300px] flex-none">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
