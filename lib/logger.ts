type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

class Logger {
  private static instance: Logger
  private isProd = process.env.NODE_ENV === 'production'

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }
  }

  private log(entry: LogEntry) {
    if (this.isProd) {
      // 本番環境では外部のロギングサービスに送信
      // TODO: 外部ロギングサービスの実装
      console.log(JSON.stringify(entry))
    } else {
      const { timestamp, level, message, data } = entry
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`)
      if (data) console.log(data)
    }
  }

  debug(message: string, data?: any) {
    if (!this.isProd) {
      this.log(this.formatMessage('debug', message, data))
    }
  }

  info(message: string, data?: any) {
    this.log(this.formatMessage('info', message, data))
  }

  warn(message: string, data?: any) {
    this.log(this.formatMessage('warn', message, data))
  }

  error(message: string, error?: any) {
    this.log(this.formatMessage('error', message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    }))
  }
}

export const logger = Logger.getInstance()
