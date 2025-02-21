import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Reservation = Database['public']['Tables']['reservations']['Row']
type ReservationInsert = Database['public']['Tables']['reservations']['Insert']

export async function createReservation(reservation: ReservationInsert) {
  const { data, error } = await supabase
    .from('reservations')
    .insert(reservation)
    .select()
    .single()

  if (error) {
    console.error('Error creating reservation:', error)
    throw error
  }

  return data
}

export async function getUserReservations(userId: string) {
  const { data, error } = await supabase
    .from('reservations')
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
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching user reservations:', error)
    return []
  }

  return data
}

export async function updateReservationStatus(
  reservationId: string,
  status: 'pending' | 'confirmed' | 'cancelled'
) {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', reservationId)
    .select()
    .single()

  if (error) {
    console.error('Error updating reservation status:', error)
    throw error
  }

  return data
}

export async function deleteReservation(reservationId: string) {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId)

  if (error) {
    console.error('Error deleting reservation:', error)
    throw error
  }
}
