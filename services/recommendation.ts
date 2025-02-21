import { supabase } from '@/lib/supabase'
import { Restaurant } from '@/types/restaurant'

interface UserPreferences {
  favoriteCuisines: string[]
  favoriteLocations: string[]
  priceRanges: string[]
}

export async function getRecommendedRestaurants(userId: string, limit = 6) {
  try {
    // ユーザーの好みを分析
    const preferences = await analyzeUserPreferences(userId)
    
    // おすすめレストランを取得
    let query = supabase
      .from('restaurants')
      .select('*')
      .gt('rating', 4.0) // 高評価のレストランのみ

    if (preferences.favoriteCuisines.length > 0) {
      query = query.in('cuisine', preferences.favoriteCuisines)
    }

    if (preferences.favoriteLocations.length > 0) {
      query = query.in('location', preferences.favoriteLocations)
    }

    if (preferences.priceRanges.length > 0) {
      query = query.in('price_range', preferences.priceRanges)
    }

    const { data: restaurants, error } = await query
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recommended restaurants:', error)
      return []
    }

    return restaurants as Restaurant[]
  } catch (error) {
    console.error('Error in getRecommendedRestaurants:', error)
    return []
  }
}

async function analyzeUserPreferences(userId: string): Promise<UserPreferences> {
  const preferences: UserPreferences = {
    favoriteCuisines: [],
    favoriteLocations: [],
    priceRanges: [],
  }

  try {
    // お気に入りと予約履歴から好みを分析
    const [favorites, reservations, reviews] = await Promise.all([
      getFavoriteRestaurants(userId),
      getReservationHistory(userId),
      getUserReviews(userId),
    ])

    const allRestaurants = [...favorites, ...reservations, ...reviews]
    
    // cuisine の集計
    const cuisineCounts = allRestaurants.reduce((acc, restaurant) => {
      acc[restaurant.cuisine] = (acc[restaurant.cuisine] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // location の集計
    const locationCounts = allRestaurants.reduce((acc, restaurant) => {
      acc[restaurant.location] = (acc[restaurant.location] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // price_range の集計
    const priceRangeCounts = allRestaurants.reduce((acc, restaurant) => {
      acc[restaurant.price_range] = (acc[restaurant.price_range] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // 上位の好みを抽出
    preferences.favoriteCuisines = getTopPreferences(cuisineCounts, 3)
    preferences.favoriteLocations = getTopPreferences(locationCounts, 3)
    preferences.priceRanges = getTopPreferences(priceRangeCounts, 2)

    return preferences
  } catch (error) {
    console.error('Error analyzing user preferences:', error)
    return preferences
  }
}

async function getFavoriteRestaurants(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('restaurants (*)')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }

  return data.map(f => f.restaurants)
}

async function getReservationHistory(userId: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select('restaurants (*)')
    .eq('user_id', userId)
    .eq('status', 'confirmed')

  if (error) {
    console.error('Error fetching reservation history:', error)
    return []
  }

  return data.map(r => r.restaurants)
}

async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('restaurants (*)')
    .eq('user_id', userId)
    .gt('rating', 4) // 高評価のレビューのみ

  if (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }

  return data.map(r => r.restaurants)
}

function getTopPreferences(counts: Record<string, number>, limit: number) {
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([key]) => key)
}
