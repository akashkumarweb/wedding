import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { hasSession } from '../../../../lib/auth'
import { createPendingImage, completeImage, failImage } from '../../../../lib/db'
import { signedPutUrl } from '../../../../lib/r2'
import { assertUploadAllowed, pendingUploadSchema, sanitizeFilename } from '../../../../lib/validation'

export async function POST(request: Request) {
  if (!(await hasSession('photographer'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const input = pendingUploadSchema.parse(await request.json())
  assertUploadAllowed(input)

  const id = randomUUID()
  const safeFilename = sanitizeFilename(input.filename)
  const originalObjectKey = `originals/${input.albumId}/${id}_${safeFilename}`
  const previewObjectKey = `previews/${input.albumId}/${id}.webp`

  const image = await createPendingImage({
    id,
    albumId: input.albumId,
    originalFilename: safeFilename,
    originalObjectKey,
    previewObjectKey,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
    width: input.width,
    height: input.height,
    folderPath: input.folderPath,
    checksum: input.checksum,
  })

  const [originalUrl, previewUrl] = await Promise.all([
    signedPutUrl(originalObjectKey, input.mimeType, input.fileSize, {
      originalFilename: safeFilename,
      checksum: input.checksum,
      folderPath: input.folderPath,
    }),
    signedPutUrl(previewObjectKey, 'image/webp', 10 * 1024 * 1024),
  ])

  return NextResponse.json({ image, originalUrl, previewUrl })
}

export async function PATCH(request: Request) {
  if (!(await hasSession('photographer'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await request.json()
  if (typeof id !== 'string') return NextResponse.json({ error: 'Invalid upload' }, { status: 400 })
  if (status === 'complete') return NextResponse.json({ image: await completeImage(id) })
  if (status === 'failed') {
    await failImage(id)
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
}
