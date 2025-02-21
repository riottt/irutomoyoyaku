'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Restaurant } from '@/types/restaurant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarIcon } from '@radix-ui/react-icons'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter()
  const locale = useLocale()

  const handleClick = () => {
    router.push(`/restaurants/${restaurant.id}`)
  }

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleClick}>
      <div className="aspect-video relative">
        <Image
          src={restaurant.images[0]}
          alt={locale === 'ja' ? restaurant.name : restaurant.nameKo}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">
            {locale === 'ja' ? restaurant.name : restaurant.nameKo}
          </CardTitle>
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">{restaurant.rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{restaurant.cuisine}</Badge>
          <Badge variant="outline">{restaurant.location}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {locale === 'ja' ? restaurant.description : restaurant.descriptionKo}
        </p>
        <div className="mt-4">
          <Button variant="secondary" className="w-full">
            詳細を見る
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
