import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'
import { sendReservationReminder } from '@/services/email'
import { translatePendingReviews } from '@/services/translation'
import { addDays, isTomorrow, parseISO } from 'date-fns'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendReservationReminders() {
  try {
    // 明日の予約を取得
    const tomorrow = addDays(new Date(), 1)
    const { data: reservations, error } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .eq('status', 'confirmed')
      .is('reminder_sent', false)

    if (error) {
      console.error('Error fetching reservations:', error)
      return
    }

    // 明日の予約にリマインダーを送信
    for (const reservation of reservations) {
      if (isTomorrow(parseISO(reservation.date))) {
        await sendReservationReminder(
          reservation.user_id,
          reservation.id,
          reservation.profiles?.preferred_language
        )
        console.log(`Reminder sent for reservation: ${reservation.id}`)
      }
    }
  } catch (error) {
    console.error('Error in sendReservationReminders:', error)
  }
}

async function processReviewTranslations() {
  try {
    await translatePendingReviews()
    console.log('Processed pending review translations')
  } catch (error) {
    console.error('Error in processReviewTranslations:', error)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const task = args[0]

  switch (task) {
    case 'reminders':
      await sendReservationReminders()
      break
    case 'translations':
      await processReviewTranslations()
      break
    default:
      console.log('Available tasks: reminders, translations')
  }

  process.exit(0)
}

main()
