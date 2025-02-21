import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Favorite = Database['public']['Tables']['favorites']['Row']

export async function addFavorite(userId: string, restaurantId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      restaurant_id: restaurantId,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding favorite:', error)
    throw error
  }

  return data
}

export async function removeFavorite(userId: string, restaurantId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .match({
      user_id: userId,
      restaurant_id: restaurantId,
    })

  if (error) {
    console.error('Error removing favorite:', error)
    throw error
  }
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      restaurants (
        id,
        name,
        name_ko,
        cuisine,
        price_range,
        location,
        rating,
        images
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user favorites:', error)
    return []
  }

  return data
}

export async function checkIsFavorite(userId: string, restaurantId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .match({
      user_id: userId,
      restaurant_id: restaurantId,
    })
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // レコードが見つからない場合
      return false
    }
    console.error('Error checking favorite status:', error)
    throw error
  }

  return true
}
