import { NextResponse } from 'next/server'
import { hasSession } from '../../../../lib/auth'
import { listAlbums } from '../../../../lib/db'

export async function GET() {
  if (!(await hasSession('gallery'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ albums: await listAlbums() })
}
