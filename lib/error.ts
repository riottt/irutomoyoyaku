export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400,
    public data?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      data: error.data,
    }
  }

  console.error('Unexpected error:', error)
  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    status: 500,
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export function createErrorMessage(locale: string, code: string) {
  const messages = {
    ja: {
      UNAUTHORIZED: '認証が必要です',
      FORBIDDEN: 'アクセスが拒否されました',
      NOT_FOUND: 'リソースが見つかりません',
      VALIDATION_ERROR: '入力内容に誤りがあります',
      RATE_LIMIT_EXCEEDED: 'リクエストが制限を超えました',
      INTERNAL_ERROR: 'システムエラーが発生しました',
    },
    ko: {
      UNAUTHORIZED: '인증이 필요합니다',
      FORBIDDEN: '접근이 거부되었습니다',
      NOT_FOUND: '리소스를 찾을 수 없습니다',
      VALIDATION_ERROR: '입력 내용에 오류가 있습니다',
      RATE_LIMIT_EXCEEDED: '요청이 제한을 초과했습니다',
      INTERNAL_ERROR: '시스템 오류가 발생했습니다',
    },
  }

  return messages[locale as keyof typeof messages][code as keyof typeof ErrorCodes] || messages[locale as keyof typeof messages].INTERNAL_ERROR
}
