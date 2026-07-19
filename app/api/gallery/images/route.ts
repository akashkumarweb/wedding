import { NextRequest, NextResponse } from 'next/server'
import { hasSession } from '../../../../lib/auth'
import { listImages } from '../../../../lib/db'
import { signedReadUrl } from '../../../../lib/r2'

export async function GET(request: NextRequest) {
  if (!(await hasSession('gallery'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = request.nextUrl
  const page = await listImages({
      albumId: searchParams.get('albumId') ?? undefined,
      cursor: searchParams.get('cursor') ?? undefined,
      includeHidden: false,
      limit: Number(searchParams.get('limit') ?? 40),
    })
  const items = await Promise.all(page.items.map(async (image) => ({ ...image, previewUrl: await signedReadUrl(image.previewObjectKey) })))
  return NextResponse.json({ ...page, items })
}
