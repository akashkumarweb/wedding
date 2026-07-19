import path from 'node:path'
import { z } from 'zod'
import { env } from './env'

export const allowedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/tiff',
])

export const allowedVideoTypes = new Set(['video/mp4', 'video/quicktime', 'video/webm'])
export const allowedMimeTypes = new Set([...allowedImageTypes, ...allowedVideoTypes])

const allowedExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.heic',
  '.heif',
  '.tif',
  '.tiff',
  '.mp4',
  '.mov',
  '.webm',
])

const mimeTypesByExtension: Record<string, Set<string>> = {
  '.jpg': new Set(['image/jpeg']),
  '.jpeg': new Set(['image/jpeg']),
  '.png': new Set(['image/png']),
  '.webp': new Set(['image/webp']),
  '.avif': new Set(['image/avif']),
  '.heic': new Set(['image/heic', 'image/heif']),
  '.heif': new Set(['image/heif', 'image/heic']),
  '.tif': new Set(['image/tiff']),
  '.tiff': new Set(['image/tiff']),
  '.mp4': new Set(['video/mp4']),
  '.mov': new Set(['video/quicktime']),
  '.webm': new Set(['video/webm']),
}

export function sanitizeFilename(filename: string): string {
  const base = path.basename(filename).normalize('NFKC')
  const cleaned = base.replace(/[^\w .()+\-@]/g, '_').replace(/\s+/g, ' ').trim()
  const withoutTraversal = cleaned.replace(/\.\./g, '.')
  return withoutTraversal || 'upload'
}

export function assertSafeObjectKey(key: string) {
  if (!/^(originals|previews)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.()+@ -]+$/.test(key) || key.includes('..')) {
    throw new Error('Invalid object key')
  }
}

export function assertUploadAllowed(input: { filename: string; mimeType: string; fileSize: number }) {
  const ext = path.extname(input.filename).toLowerCase()
  if (!allowedExtensions.has(ext)) throw new Error('Unsupported file extension')
  if (!allowedMimeTypes.has(input.mimeType)) throw new Error('Unsupported file type')
  if (!mimeTypesByExtension[ext]?.has(input.mimeType)) throw new Error('File extension does not match file type')
  if (input.fileSize <= 0 || input.fileSize > env.MAX_UPLOAD_BYTES) throw new Error('File is too large')
}

export const albumInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional().default(''),
  eventDate: z.string().trim().max(30).optional().nullable(),
})

export const pendingUploadSchema = z.object({
  albumId: z.string().uuid(),
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  fileSize: z.number().int().positive(),
  width: z.number().int().nonnegative().optional().default(0),
  height: z.number().int().nonnegative().optional().default(0),
  folderPath: z.string().max(1000).optional().default(''),
  checksum: z.string().max(200).optional().default(''),
})
