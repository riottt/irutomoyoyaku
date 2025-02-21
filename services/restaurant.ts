import { supabase } from '@/lib/supabase'
import { Restaurant, Cuisine, PriceRange, Location } from '@/types/restaurant'

interface SearchParams {
  query?: string
  cuisine?: Cuisine
  priceRange?: PriceRange
  location?: Location
  limit?: number
  offset?: number
}

export async function searchRestaurants({
  query,
  cuisine,
  priceRange,
  location,
  limit = 10,
  offset = 0,
}: SearchParams) {
  let queryBuilder = supabase
    .from('restaurants')
    .select('*')

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,name_ko.ilike.%${query}%,description.ilike.%${query}%,description_ko.ilike.%${query}%`)
  }

  if (cuisine) {
    queryBuilder = queryBuilder.eq('cuisine', cuisine)
  }

  if (priceRange) {
    queryBuilder = queryBuilder.eq('price_range', priceRange)
  }

  if (location) {
    queryBuilder = queryBuilder.eq('location', location)
  }

  const { data, error } = await queryBuilder
    .range(offset, offset + limit - 1)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching restaurants:', error)
    return []
  }

  return data as Restaurant[]
}

export async function getRestaurantById(id: string) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching restaurant:', error)
    return null
  }

  return data as Restaurant
}

export async function getPopularRestaurants(limit = 6) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching popular restaurants:', error)
    return []
  }

  return data as Restaurant[]
}
