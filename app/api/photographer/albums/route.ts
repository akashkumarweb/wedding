import { NextResponse } from 'next/server'
import { hasSession } from '../../../../lib/auth'
import { albumInputSchema } from '../../../../lib/validation'
import { createAlbum, listAlbums } from '../../../../lib/db'

export async function GET() {
  if (!(await hasSession('photographer'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ albums: await listAlbums({ includeHidden: true }) })
}

export async function POST(request: Request) {
  if (!(await hasSession('photographer'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const input = albumInputSchema.parse(await request.json())
  return NextResponse.json({ album: await createAlbum(input) })
}
