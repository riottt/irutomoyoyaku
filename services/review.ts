import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Review = Database['public']['Tables']['reviews']['Row']
type ReviewInsert = Database['public']['Tables']['reviews']['Insert']

export async function createReview(review: ReviewInsert) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()

  if (error) {
    console.error('Error creating review:', error)
    throw error
  }

  // レストランの評価を更新
  await updateRestaurantRating(review.restaurant_id)

  return data
}

export async function getRestaurantReviews(restaurantId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching restaurant reviews:', error)
    return []
  }

  return data
}

export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      restaurants (
        id,
        name,
        name_ko,
        images
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }

  return data
}

export async function updateReview(reviewId: string, updates: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', reviewId)
    .select()
    .single()

  if (error) {
    console.error('Error updating review:', error)
    throw error
  }

  // レストランの評価を更新
  await updateRestaurantRating(data.restaurant_id)

  return data
}

export async function deleteReview(reviewId: string, restaurantId: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) {
    console.error('Error deleting review:', error)
    throw error
  }

  // レストランの評価を更新
  await updateRestaurantRating(restaurantId)
}

async function updateRestaurantRating(restaurantId: string) {
  // レストランの全レビューの平均評価を計算
  const { data: reviews, error: reviewError } = await supabase
    .from('reviews')
    .select('rating')
    .eq('restaurant_id', restaurantId)

  if (reviewError) {
    console.error('Error fetching reviews for rating update:', reviewError)
    return
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  // レストランの評価を更新
  const { error: updateError } = await supabase
    .from('restaurants')
    .update({ rating: averageRating })
    .eq('id', restaurantId)

  if (updateError) {
    console.error('Error updating restaurant rating:', updateError)
  }
}
