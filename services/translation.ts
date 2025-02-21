import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/database.types'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DeepL APIのクライアント設定
const DEEPL_API_KEY = process.env.DEEPL_API_KEY
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

interface TranslationResponse {
  translations: {
    text: string
    detected_source_language: string
  }[]
}

export async function translateReview(reviewId: string) {
  try {
    // レビューを取得
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .single()

    if (reviewError || !review) {
      console.error('Error fetching review:', reviewError)
      return
    }

    // 翻訳が必要かチェック
    if (review.content_ko) {
      return // 既に翻訳済み
    }

    // DeepL APIで翻訳
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: review.content,
        source_lang: 'JA',
        target_lang: 'KO',
      }),
    })

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`)
    }

    const data: TranslationResponse = await response.json()
    const translatedText = data.translations[0].text

    // 翻訳をデータベースに保存
    await supabaseAdmin
      .from('reviews')
      .update({ content_ko: translatedText })
      .eq('id', reviewId)

    return translatedText
  } catch (error) {
    console.error('Error translating review:', error)
    throw error
  }
}

// バッチ処理で未翻訳のレビューを翻訳
export async function translatePendingReviews() {
  try {
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .is('content_ko', null)
      .limit(10) // 一度に処理する数を制限

    if (reviewsError) {
      console.error('Error fetching pending reviews:', reviewsError)
      return
    }

    for (const review of reviews) {
      await translateReview(review.id)
      // APIレート制限を考慮して少し待機
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  } catch (error) {
    console.error('Error in batch translation:', error)
  }
}
