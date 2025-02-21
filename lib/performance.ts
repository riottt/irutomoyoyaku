import { logger } from './logger'

interface PerformanceMetrics {
  FCP: number // First Contentful Paint
  LCP: number // Largest Contentful Paint
  FID: number // First Input Delay
  CLS: number // Cumulative Layout Shift
  TTFB: number // Time to First Byte
}

export function reportWebVitals(metric: any) {
  const { id, name, value, rating } = metric

  logger.info('Web Vitals Report', {
    metric: {
      id,
      name,
      value,
      rating,
    },
  })

  // 本番環境では Analytics に送信
  if (process.env.NODE_ENV === 'production') {
    // TODO: Analytics 実装
  }
}

export function measurePerformance() {
  if (typeof window === 'undefined') return

  const metrics: Partial<PerformanceMetrics> = {}

  // First Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    if (entries.length > 0) {
      metrics.FCP = entries[0].startTime
      logger.debug('FCP measured', { value: metrics.FCP })
    }
  }).observe({ type: 'paint', buffered: true })

  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1]
    metrics.LCP = lastEntry.startTime
    logger.debug('LCP measured', { value: metrics.LCP })
  }).observe({ type: 'largest-contentful-paint', buffered: true })

  // First Input Delay
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    entries.forEach((entry) => {
      metrics.FID = entry.processingStart - entry.startTime
      logger.debug('FID measured', { value: metrics.FID })
    })
  }).observe({ type: 'first-input', buffered: true })

  // Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    let cls = 0
    entryList.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cls += entry.value
      }
    })
    metrics.CLS = cls
    logger.debug('CLS measured', { value: metrics.CLS })
  }).observe({ type: 'layout-shift', buffered: true })

  // Time to First Byte
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (navigation) {
    metrics.TTFB = navigation.responseStart - navigation.requestStart
    logger.debug('TTFB measured', { value: metrics.TTFB })
  }

  return metrics
}
