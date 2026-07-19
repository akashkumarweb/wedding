import pg from 'pg'
import { requireEnv } from './env'

const { Pool } = pg

let pool: pg.Pool | undefined

export function db() {
  if (!pool) {
    pool = new Pool({
      connectionString: requireEnv('DATABASE_URL'),
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    })
  }
  return pool
}

export type Album = {
  id: string
  title: string
  slug: string
  description: string
  coverImageId: string | null
  eventDate: string | null
  displayOrder: number
  published: boolean
  downloadEnabled: boolean
  photoCount: number
}

export type GalleryImage = {
  id: string
  albumId: string
  originalFilename: string
  originalObjectKey: string
  previewObjectKey: string
  mimeType: string
  fileSize: number
  width: number
  height: number
  uploadedAt: string
  displayOrder: number
  folderPath: string
  uploadStatus: string
  caption: string
  featured: boolean
  published: boolean
  checksum: string
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'album'
}

export async function listAlbums({ includeHidden = false } = {}) {
  const result = await db().query(
    `
    select a.*,
      count(i.id) filter (where i.upload_status = 'complete' and ($1::boolean or i.published))::int as photo_count
    from albums a
    left join images i on i.album_id = a.id
    where ($1::boolean or a.published)
    group by a.id
    order by a.display_order asc, a.created_at asc
    `,
    [includeHidden],
  )
  return result.rows.map(mapAlbum)
}

export async function createAlbum(input: { title: string; description?: string; eventDate?: string | null }) {
  const baseSlug = slugify(input.title)
  const result = await db().query(
    `
    insert into albums (title, slug, description, event_date, display_order)
    values ($1, $2 || '-' || substr(gen_random_uuid()::text, 1, 8), $3, $4,
      coalesce((select max(display_order) + 1 from albums), 0))
    returning *
    `,
    [input.title, baseSlug, input.description ?? '', input.eventDate || null],
  )
  return mapAlbum({ ...result.rows[0], photo_count: 0 })
}

export async function createPendingImage(input: {
  id: string
  albumId: string
  originalFilename: string
  originalObjectKey: string
  previewObjectKey: string
  mimeType: string
  fileSize: number
  width: number
  height: number
  folderPath: string
  checksum: string
}) {
  const result = await db().query(
    `
    insert into images (
      id, album_id, original_filename, original_object_key, preview_object_key, mime_type, file_size,
      width, height, folder_path, checksum, upload_status, published, display_order
    )
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending',false,
      coalesce((select max(display_order) + 1 from images where album_id = $2), 0))
    returning *
    `,
    [
      input.id,
      input.albumId,
      input.originalFilename,
      input.originalObjectKey,
      input.previewObjectKey,
      input.mimeType,
      input.fileSize,
      input.width,
      input.height,
      input.folderPath,
      input.checksum,
    ],
  )
  return mapImage(result.rows[0])
}

export async function completeImage(id: string) {
  const result = await db().query(
    `update images set upload_status = 'complete', published = true, uploaded_at = now() where id = $1 returning *`,
    [id],
  )
  return result.rows[0] ? mapImage(result.rows[0]) : null
}

export async function failImage(id: string) {
  await db().query(`update images set upload_status = 'failed', published = false where id = $1`, [id])
}

export async function listImages(input: { albumId?: string; cursor?: string; limit?: number; includeHidden?: boolean; search?: string }) {
  const limit = Math.min(input.limit ?? 40, 100)
  const result = await db().query(
    `
    select * from images
    where ($1::uuid is null or album_id = $1)
      and ($2::text is null or id > $2)
      and ($3::boolean or (published and upload_status = 'complete'))
      and ($4::text is null or original_filename ilike '%' || $4 || '%')
    order by id asc
    limit $5
    `,
    [input.albumId ?? null, input.cursor ?? null, input.includeHidden ?? false, input.search ?? null, limit + 1],
  )
  const rows = result.rows.map(mapImage)
  const hasMore = rows.length > limit
  return { items: rows.slice(0, limit), nextCursor: hasMore ? rows[limit - 1].id : null }
}

export async function getImage(id: string, publishedOnly = true) {
  const result = await db().query(
    `select * from images where id = $1 and ($2::boolean = false or (published and upload_status = 'complete'))`,
    [id, publishedOnly],
  )
  return result.rows[0] ? mapImage(result.rows[0]) : null
}

export async function deleteImageRecord(id: string) {
  const image = await getImage(id, false)
  if (!image) return null
  await db().query(`delete from images where id = $1`, [id])
  return image
}

function mapAlbum(row: Record<string, any>): Album {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? '',
    coverImageId: row.cover_image_id,
    eventDate: row.event_date,
    displayOrder: row.display_order,
    published: row.published,
    downloadEnabled: row.download_enabled,
    photoCount: row.photo_count ?? 0,
  }
}

function mapImage(row: Record<string, any>): GalleryImage {
  return {
    id: row.id,
    albumId: row.album_id,
    originalFilename: row.original_filename,
    originalObjectKey: row.original_object_key,
    previewObjectKey: row.preview_object_key,
    mimeType: row.mime_type,
    fileSize: Number(row.file_size),
    width: row.width,
    height: row.height,
    uploadedAt: row.uploaded_at,
    displayOrder: row.display_order,
    folderPath: row.folder_path ?? '',
    uploadStatus: row.upload_status,
    caption: row.caption ?? '',
    featured: row.featured,
    published: row.published,
    checksum: row.checksum ?? '',
  }
}
