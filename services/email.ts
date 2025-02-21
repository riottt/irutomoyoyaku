import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'
import { format } from 'date-fns'
import { ja, ko } from 'date-fns/locale'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface EmailTemplate {
  ja: {
    subject: string
    body: string
  }
  ko: {
    subject: string
    body: string
  }
}

export async function sendReservationReminder(
  userId: string,
  reservationId: string,
  locale: string = 'ja'
) {
  // 予約情報を取得
  const { data: reservation, error: reservationError } = await supabaseAdmin
    .from('reservations')
    .select(`
      *,
      restaurants (
        name,
        name_ko,
        address
      ),
      profiles:user_id (
        email,
        name,
        preferred_language
      )
    `)
    .eq('id', reservationId)
    .single()

  if (reservationError || !reservation) {
    console.error('Error fetching reservation:', reservationError)
    return
  }

  const userLocale = reservation.profiles.preferred_language || locale
  const restaurantName =
    userLocale === 'ja' ? reservation.restaurants.name : reservation.restaurants.name_ko

  const template: EmailTemplate = {
    ja: {
      subject: `【リマインダー】${restaurantName}のご予約（明日）`,
      body: `
        ${reservation.profiles.name}様

        明日のご予約の確認です。

        予約内容：
        レストラン：${restaurantName}
        日時：${format(new Date(reservation.date), 'PPP', { locale: ja })} ${
        reservation.time
      }
        人数：${reservation.number_of_people}名
        場所：${reservation.restaurants.address}

        ご来店をお待ちしております。
        キャンセルや変更がある場合は、お早めにご連絡ください。

        いるとも予約
      `,
    },
    ko: {
      subject: `[알림] ${restaurantName} 예약 (내일)`,
      body: `
        ${reservation.profiles.name}님

        내일 예약 확인 안내드립니다.

        예약 내용:
        레스토랑: ${restaurantName}
        일시: ${format(new Date(reservation.date), 'PPP', { locale: ko })} ${
        reservation.time
      }
        인원: ${reservation.number_of_people}명
        장소: ${reservation.restaurants.address}

        방문을 기다리고 있겠습니다.
        취소나 변경이 있으시면 미리 연락 부탁드립니다.

        있어도 예약
      `,
    },
  }

  // メール送信
  const { error: emailError } = await supabaseAdmin.auth.admin.sendEmail(
    reservation.profiles.email,
    {
      subject: template[userLocale as keyof EmailTemplate].subject,
      template_data: {
        content: template[userLocale as keyof EmailTemplate].body,
      },
    }
  )

  if (emailError) {
    console.error('Error sending reminder email:', emailError)
    return
  }

  // リマインダー送信記録を更新
  await supabaseAdmin
    .from('reservations')
    .update({ reminder_sent: true })
    .eq('id', reservationId)
}
