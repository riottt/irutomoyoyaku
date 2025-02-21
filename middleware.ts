import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware({
  locales: ['ja', 'ko'],
  defaultLocale: 'ja',
})

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Supabase認証
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()

  // セキュリティヘッダー
  const headers = res.headers
  headers.set('X-DNS-Prefetch-Control', 'on')
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  headers.set('X-Frame-Options', 'SAMEORIGIN')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'origin-when-cross-origin')
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // Content Security Policy
  if (process.env.NODE_ENV === 'production') {
    headers.set(
      'Content-Security-Policy',
      `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://*.supabase.co;
        font-src 'self';
        connect-src 'self' https://*.supabase.co wss://*.supabase.co;
        frame-ancestors 'none';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim()
    )
  }

  // Rate Limiting
  const ip = req.ip ?? '127.0.0.1'
  const rateLimit = await getRateLimit(ip)
  
  if (rateLimit.remaining <= 0) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // 多言語化
  const intlResponse = await intlMiddleware(req)
  
  // レスポンスヘッダーをマージ
  intlResponse.headers.forEach((value, key) => {
    headers.set(key, value)
  })

  return res
}

// Rate Limiting用のユーティリティ
async function getRateLimit(ip: string) {
  // TODO: Redis実装
  return { remaining: 100 }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
