const attempts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, limit = 8, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const record = attempts.get(key)
  if (!record || record.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (record.count >= limit) return false
  record.count += 1
  return true
}
