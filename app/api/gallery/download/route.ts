import { NextRequest, NextResponse } from 'next/server'
import { hasSession } from '../../../../lib/auth'
import { getImage } from '../../../../lib/db'
import { signedDownloadUrl } from '../../../../lib/r2'

export async function GET(request: NextRequest) {
  if (!(await hasSession('gallery'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Invalid image' }, { status: 400 })
  const image = await getImage(id, true)
  if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ url: await signedDownloadUrl(image.originalObjectKey, image.originalFilename) })
}
