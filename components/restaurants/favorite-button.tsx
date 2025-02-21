'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/components/auth/auth-provider'
import {
  addFavorite,
  removeFavorite,
  checkIsFavorite,
} from '@/services/favorite'
import { Button } from '@/components/ui/button'
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons'
import { useToast } from '@/components/ui/use-toast'

interface FavoriteButtonProps {
  restaurantId: string
}

export function FavoriteButton({ restaurantId }: FavoriteButtonProps) {
  const t = useTranslations()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      checkFavoriteStatus()
    } else {
      setIsLoading(false)
    }
  }, [user, restaurantId])

  async function checkFavoriteStatus() {
    try {
      const status = await checkIsFavorite(user!.id, restaurantId)
      setIsFavorite(status)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleFavorite() {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    try {
      if (isFavorite) {
        await removeFavorite(user.id, restaurantId)
        toast({
          description: t('favorites.removed'),
        })
      } else {
        await addFavorite(user.id, restaurantId)
        toast({
          description: t('favorites.added'),
        })
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        variant: 'destructive',
        description: t('favorites.error'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isLoading}
      onClick={handleToggleFavorite}
      className={isFavorite ? 'text-red-500' : ''}
    >
      {isFavorite ? (
        <HeartFilledIcon className="h-5 w-5" />
      ) : (
        <HeartIcon className="h-5 w-5" />
      )}
    </Button>
  )
}
