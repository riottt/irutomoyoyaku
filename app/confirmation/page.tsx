import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'

interface Props {
  searchParams: {
    id: string
  }
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const supabase = createServerSupabaseClient()
  
  const { data: reservation, error } = await supabase
    .from('reservations')
    .select(`
      *,
      restaurants (
        name,
        address,
        phone
      )
    `)
    .eq('id', searchParams.id)
    .single()

  if (error || !reservation) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>予約が完了しました</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">予約内容</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">レストラン</p>
                  <p>{(reservation.restaurants as any).name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">予約日時</p>
                  <p>
                    {format(new Date(reservation.reservation_date), 'yyyy年MM月dd日')}
                    {' '}
                    {reservation.reservation_time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">人数</p>
                  <p>{reservation.number_of_people}名</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">予約番号</p>
                  <p>{reservation.id}</p>
                </div>
              </div>
            </div>

            {reservation.special_requests && (
              <div>
                <h3 className="font-semibold mb-2">特別リクエスト</h3>
                <p>{reservation.special_requests}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">レストラン情報</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-sm text-gray-500">住所：</span>
                  {(reservation.restaurants as any).address}
                </p>
                <p>
                  <span className="text-sm text-gray-500">電話番号：</span>
                  {(reservation.restaurants as any).phone}
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <Button asChild variant="outline">
                <Link href="/restaurants">
                  レストラン一覧に戻る
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/payment?reservation=${reservation.id}`}>
                  支払いに進む
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}