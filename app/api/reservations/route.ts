import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // セッションの確認
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const {
      restaurantId,
      date,
      time,
      numberOfPeople,
      specialRequests,
    } = json

    // 予約データの作成
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        user_id: session.user.id,
        restaurant_id: restaurantId,
        reservation_date: date,
        reservation_time: time,
        number_of_people: numberOfPeople,
        special_requests: specialRequests,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating reservation:', error)
      return NextResponse.json(
        { error: '予約の作成に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
