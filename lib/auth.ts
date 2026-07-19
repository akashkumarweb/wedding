import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { timingSafeEqual, createHash } from 'node:crypto'
import { requireEnv } from './env'

export type SessionRole = 'photographer' | 'gallery'

const cookieNames: Record<SessionRole, string> = {
  photographer: 'akashmadhu_photographer',
  gallery: 'akashmadhu_gallery',
}

const maxAgeSeconds = 60 * 60 * 12

function secretKey() {
  return new TextEncoder().encode(requireEnv('AUTH_SESSION_SECRET'))
}

export async function createSession(role: SessionRole) {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds}s`)
    .sign(secretKey())

  const store = await cookies()
  store.set(cookieNames[role], token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  })
}

export async function clearSession(role: SessionRole) {
  const store = await cookies()
  store.delete(cookieNames[role])
}

export async function hasSession(role: SessionRole) {
  const store = await cookies()
  const token = store.get(cookieNames[role])?.value
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, secretKey())
    return payload.role === role
  } catch {
    return false
  }
}

export async function requireSession(role: SessionRole) {
  if (!(await hasSession(role))) {
    throw new Response('Unauthorized', { status: 401 })
  }
}

export function passwordMatches(input: string, expected: string) {
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}
