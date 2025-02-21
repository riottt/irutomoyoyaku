'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Restaurant } from '@/types/restaurant'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StarIcon, ClockIcon } from '@radix-ui/react-icons'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface RestaurantPageProps {
  params: {
    id: string
  }
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const t = useTranslations()
  const locale = useLocale()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedPeople, setSelectedPeople] = useState<string>('')

  // TODO: Implement actual data fetching with Supabase
  const restaurant: Restaurant | null = null

  if (!restaurant) {
    return <div>Loading...</div>
  }

  const times = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
  const people = ['1', '2', '3', '4', '5', '6', '7', '8']

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={restaurant.images[0]}
              alt={locale === 'ja' ? restaurant.name : restaurant.nameKo}
              fill
              className="object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {locale === 'ja' ? restaurant.name : restaurant.nameKo}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <Badge variant="secondary">{restaurant.cuisine}</Badge>
              <Badge variant="outline">{restaurant.priceRange}</Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPinIcon className="h-4 w-4" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <ClockIcon className="h-4 w-4" />
              <span>{`${restaurant.openingHours.mon.open} - ${restaurant.openingHours.mon.close}`}</span>
            </div>
            <p className="text-lg">
              {locale === 'ja' ? restaurant.description : restaurant.descriptionKo}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {restaurant.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${restaurant.name} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t('reservation.title')}</h2>
              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('reservation.time')} />
                  </SelectTrigger>
                  <SelectContent>
                    {times.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPeople} onValueChange={setSelectedPeople}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('reservation.people')} />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map((num) => (
                      <SelectItem key={num} value={num}>
                        {num}人
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="w-full" size="lg">
                  {t('reservation.submit')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
