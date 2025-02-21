import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { format } from 'date-fns'
import { ReservationForm } from '@/components/reservation-form'

// 予約フォームのバリデーションスキーマ
const reservationSchema = z.object({
  date: z.date({
    required_error: '予約日を選択してください',
  }),
  time: z.string().min(1, '予約時間を選択してください'),
  numberOfPeople: z.number()
    .min(1, '1名以上で予約してください')
    .max(10, '10名以上の予約は電話でお問い合わせください'),
  specialRequests: z.string().optional(),
})

interface Props {
  params: {
    id: string
  }
}

export default async function RestaurantPage({ params }: Props) {
  const supabase = createServerSupabaseClient()
  
  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !restaurant) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* レストラン情報 */}
        <div>
          {restaurant.image_urls && restaurant.image_urls[0] && (
            <div className="relative h-64 w-full mb-6">
              <img
                src={restaurant.image_urls[0]}
                alt={restaurant.name}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{restaurant.name}</span>
                <span className="text-sm font-normal">{restaurant.price_range}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p>{restaurant.description}</p>
                <div>
                  <h3 className="font-semibold mb-2">住所</h3>
                  <p>{restaurant.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">電話番号</h3>
                  <p>{restaurant.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">料理ジャンル</h3>
                  <p>{restaurant.cuisine_type}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 予約フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>予約</CardTitle>
          </CardHeader>
          <CardContent>
            <ReservationForm restaurantId={restaurant.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}