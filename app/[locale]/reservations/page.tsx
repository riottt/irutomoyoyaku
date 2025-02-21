'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from '@/components/auth/auth-provider'
import { getUserReservations } from '@/services/reservation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { ja, ko } from 'date-fns/locale'

export default function ReservationsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { user } = useAuth()
  const [reservations, setReservations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    async function loadReservations() {
      if (!user) return
      const data = await getUserReservations(user.id)
      setReservations(data)
      setIsLoading(false)
    }

    loadReservations()
  }, [user, router])

  function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'confirmed':
        return 'default'
      case 'cancelled':
        return 'destructive'
      case 'completed':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP', {
      locale: locale === 'ja' ? ja : ko,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t('reservations.title')}</h1>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                  <Image
                    src={reservation.restaurants.images[0]}
                    alt={
                      locale === 'ja'
                        ? reservation.restaurants.name
                        : reservation.restaurants.name_ko
                    }
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {locale === 'ja'
                          ? reservation.restaurants.name
                          : reservation.restaurants.name_ko}
                      </h3>
                      <p className="text-muted-foreground">
                        {formatDate(reservation.date)} {reservation.time}
                      </p>
                      <p className="text-sm">
                        {t('reservation.people', {
                          count: reservation.number_of_people,
                        })}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(reservation.status)}>
                      {t(`reservation.status.${reservation.status}`)}
                    </Badge>
                  </div>
                  {reservation.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {reservation.notes}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/restaurants/${reservation.restaurant_id}`)
                      }
                    >
                      {t('restaurant.details')}
                    </Button>
                    {reservation.status === 'pending' && (
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleCancelReservation(reservation.id)
                        }
                      >
                        {t('reservation.cancel')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {reservations.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              {t('reservations.empty')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
