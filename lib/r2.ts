import { DeleteObjectsCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { requireEnv } from './env'

let client: S3Client | undefined

function cleanMetadata(metadata?: Record<string, string>) {
  const entries = Object.entries(metadata ?? {}).filter(([, value]) => value.length > 0)
  return entries.length ? Object.fromEntries(entries) : undefined
}

export function r2Client() {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: requireEnv('R2_ENDPOINT'),
      credentials: {
        accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
        secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
      },
    })
  }
  return client
}

export async function signedPutUrl(
  key: string,
  contentType: string,
  bytes: number,
  metadata?: Record<string, string>,
) {
  return getSignedUrl(
    r2Client(),
    new PutObjectCommand({
      Bucket: requireEnv('R2_BUCKET_NAME'),
      Key: key,
      ContentType: contentType,
      Metadata: cleanMetadata(metadata),
    }),
    { expiresIn: 60 * 10 },
  )
}

export async function signedDownloadUrl(key: string, filename: string) {
  return getSignedUrl(
    r2Client(),
    new GetObjectCommand({
      Bucket: requireEnv('R2_BUCKET_NAME'),
      Key: key,
      ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    }),
    { expiresIn: 60 * 5 },
  )
}

export async function signedReadUrl(key: string) {
  return getSignedUrl(
    r2Client(),
    new GetObjectCommand({
      Bucket: requireEnv('R2_BUCKET_NAME'),
      Key: key,
    }),
    { expiresIn: 60 * 15 },
  )
}

export async function deleteObjects(keys: string[]) {
  if (!keys.length) return
  await r2Client().send(
    new DeleteObjectsCommand({
      Bucket: requireEnv('R2_BUCKET_NAME'),
      Delete: { Objects: keys.map((Key) => ({ Key })) },
    }),
  )
}
