import { z } from 'zod'

const envSchema = z.object({
  PHOTOGRAPHER_PASSWORD: z.string().optional(),
  GALLERY_PASSWORD: z.string().optional(),
  AUTH_SESSION_SECRET: z.string().min(32).optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_ENDPOINT: z.string().optional(),
  MAX_UPLOAD_BYTES: z.coerce.number().int().positive().default(1024 * 1024 * 1024),
  DATABASE_URL: z.string().optional(),
})

export const env = envSchema.parse(process.env)

export function requireEnv(name: keyof typeof env): string {
  const value = env[name]
  if (!value || typeof value !== 'string') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}
