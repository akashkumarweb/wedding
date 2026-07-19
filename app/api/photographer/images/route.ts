import { NextRequest, NextResponse } from 'next/server'
import { hasSession } from '../../../../lib/auth'
import { deleteImageRecord, listImages } from '../../../../lib/db'
import { deleteObjects, signedReadUrl } from '../../../../lib/r2'

export async function GET(request: NextRequest) {
  if (!(await hasSession('photographer'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = request.nextUrl
  const data = await listImages({
    albumId: searchParams.get('albumId') ?? undefined,
    cursor: searchParams.get('cursor') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    includeHidden: true,
  })
  const items = await Promise.all(data.items.map(async (image) => ({ ...image, previewUrl: await signedReadUrl(image.previewObjectKey) })))
  return NextResponse.json({ ...data, items })
}

export async function DELETE(request: NextRequest) {
  if (!(await hasSession('photographer'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Invalid image' }, { status: 400 })
  const image = await deleteImageRecord(id)
  if (image) await deleteObjects([image.originalObjectKey, image.previewObjectKey])
  return NextResponse.json({ ok: true })
}
