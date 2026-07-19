import { NextRequest, NextResponse } from 'next/server'
import { createSession, clearSession, passwordMatches } from '../../../../lib/auth'
import { requireEnv } from '../../../../lib/env'
import { checkRateLimit } from '../../../../lib/rateLimit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local'
  if (!checkRateLimit(`gallery:${ip}`)) {
    return NextResponse.json({ error: 'Unable to sign in' }, { status: 429 })
  }
  const { password } = await request.json().catch(() => ({ password: '' }))
  if (typeof password !== 'string' || !passwordMatches(password, requireEnv('GALLERY_PASSWORD'))) {
    return NextResponse.json({ error: 'Unable to sign in' }, { status: 401 })
  }
  await createSession('gallery')
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearSession('gallery')
  return NextResponse.json({ ok: true })
}
