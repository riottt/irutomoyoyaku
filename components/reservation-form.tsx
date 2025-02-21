'use client'

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
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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

interface ReservationFormProps {
  restaurantId: string
}

export function ReservationForm({ restaurantId }: ReservationFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      numberOfPeople: 2,
      specialRequests: '',
    },
  })

  async function onSubmit(values: z.infer<typeof reservationSchema>) {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          ...values,
          date: format(values.date, 'yyyy-MM-dd'),
        }),
      })

      if (!response.ok) {
        throw new Error('予約に失敗しました')
      }

      const data = await response.json()
      toast.success('予約リクエストを受け付けました')
      router.push(`/confirmation?id=${data.id}`)
    } catch (error) {
      console.error('Error:', error)
      toast.error('予約に失敗しました。もう一度お試しください。')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>予約日</FormLabel>
              <FormControl>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>予約時間</FormLabel>
              <FormControl>
                <select
                  className="w-full p-2 border rounded-md"
                  {...field}
                >
                  <option value="">選択してください</option>
                  <option value="17:00">17:00</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfPeople"
          render={({ field }) => (
            <FormItem>
              <FormLabel>人数</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>特別リクエスト</FormLabel>
              <FormControl>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="アレルギーや特別なご要望があればご記入ください"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          予約する
        </Button>
      </form>
    </Form>
  )
}
