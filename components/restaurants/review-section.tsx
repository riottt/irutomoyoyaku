'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from '@/components/auth/auth-provider'
import { createReview, getRestaurantReviews } from '@/services/review'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { ja, ko } from 'date-fns/locale'

interface ReviewSectionProps {
  restaurantId: string
}

export function ReviewSection({ restaurantId }: ReviewSectionProps) {
  const t = useTranslations()
  const locale = useLocale()
  const { user } = useAuth()
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newReview, setNewReview] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [restaurantId])

  async function loadReviews() {
    const data = await getRestaurantReviews(restaurantId)
    setReviews(data)
    setIsLoading(false)
  }

  async function handleSubmitReview() {
    if (!user || !rating || !newReview.trim()) return

    setIsSubmitting(true)
    try {
      await createReview({
        user_id: user.id,
        restaurant_id: restaurantId,
        rating,
        content: newReview,
        images: [],
      })

      setNewReview('')
      setRating(0)
      await loadReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPP', {
      locale: locale === 'ja' ? ja : ko,
    })
  }

  return (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle>{t('reviews.title')}</CardTitle>
      </CardHeader>

      {user && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`h-6 w-6 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder={t('reviews.placeholder')}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={handleSubmitReview}
                disabled={!rating || !newReview.trim() || isSubmitting}
              >
                {isSubmitting ? t('reviews.submitting') : t('reviews.submit')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.profiles.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{review.profiles.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <p className="mt-2">
                    {locale === 'ja' ? review.content : review.content_ko || review.content}
                  </p>
                  {review.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {review.images.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square relative rounded-lg overflow-hidden"
                        >
                          <Image
                            src={image}
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
