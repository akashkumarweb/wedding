# Akash & Madhavi Wedding Gallery

Permanent private wedding photography gallery for `akashmadhu.co.uk`, built with Next.js, React, Tailwind CSS, Cloudflare R2, and PostgreSQL metadata storage.

## Development

```bash
npm install
npm run dev
```

The original wedding invitation homepage remains at `/`. The protected photographer uploader is at `/photographer`; the protected family gallery is at `/gallery`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_RSVP_URL=
PHOTOGRAPHER_PASSWORD=
GALLERY_PASSWORD=
AUTH_SESSION_SECRET=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
MAX_UPLOAD_BYTES=1073741824
DATABASE_URL=
```

`AUTH_SESSION_SECRET` must be at least 32 characters. Never prefix passwords, R2 secrets, or `DATABASE_URL` with `NEXT_PUBLIC_`.

## Cloudflare R2 Setup

1. Create a Cloudflare R2 bucket for the wedding photographs.
2. Create restricted R2 API credentials scoped to that bucket. The app needs object read, write, and delete permissions for originals and previews.
3. Set `R2_BUCKET_NAME` to the bucket name.
4. Set `R2_ENDPOINT` to `https://<account-id>.r2.cloudflarestorage.com`.
5. Set `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` from the restricted credential.
6. Configure bucket CORS for direct browser uploads:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://www.akashmadhu.co.uk",
      "https://akashmadhu.co.uk"
    ],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["content-type", "x-amz-meta-*"],
    "ExposeHeaders": ["etag"],
    "MaxAgeSeconds": 3600
  }
]
```

Add the production Vercel preview/production domain only if it is used directly. Do not use wildcard origins in production unless there is no alternative.

## Database Setup

Use a Vercel-compatible PostgreSQL provider such as Neon or Supabase Postgres. SQLite is not supported for production.

```bash
DATABASE_URL="postgres://..." npm run db:migrate
```

The migration creates `albums` and `images`, plus indexes for published albums, album image pagination, upload date, and checksum lookup.

## Upload Flow

1. Photographer signs in at `/photographer`.
2. Password is validated only on the server against `PHOTOGRAPHER_PASSWORD`.
3. A signed, secure, HTTP-only cookie is created for 12 hours.
4. Photographer creates or chooses an album.
5. Browser requests a pending upload record and presigned R2 URLs.
6. Original file uploads directly from the browser to R2 unchanged.
7. Browser generates a separate WebP preview and uploads it to R2.
8. Browser confirms completion; only completed records appear in the family gallery.

Original files are stored as:

```text
originals/{albumId}/{uniqueId}_{safeOriginalFilename}
```

Previews are stored as:

```text
previews/{albumId}/{uniqueId}.webp
```

## Testing

```bash
npm run test
npm run lint
npm run build
```

Manual checks:

1. Sign in to `/photographer` with the correct password.
2. Confirm a wrong photographer password returns only a generic error.
3. Create an album.
4. Upload several JPEG/PNG images and confirm originals appear in R2 under `originals/`.
5. Confirm previews appear in R2 under `previews/`.
6. Sign out of `/photographer` and confirm protected APIs return unauthorized.
7. Sign in to `/gallery` with `GALLERY_PASSWORD`.
8. Open an album and confirm only preview images load in the grid/lightbox.
9. Click Download Original and confirm the downloaded file uses the original filename.
10. Confirm direct `/api/gallery/download?id=...` without a gallery session is unauthorized.

## Vercel Deployment

1. Set the Vercel framework preset to Next.js.
2. Build command: `npm run build`.
3. Add all environment variables from `.env.example`.
4. Run the database migration against the production database before first upload.
5. Deploy.
6. Test `/photographer/login`, `/gallery/login`, upload, gallery browsing, and original downloads on the production URL.

## Security Notes

- Photographer and family gallery sessions use separate signed HTTP-only cookies.
- Passwords and R2 credentials are server-only.
- Upload and download APIs enforce server-side session checks.
- Original files are never proxied through Vercel and are never recompressed.
- Public gallery views use preview objects, not originals.
- Original downloads use short-lived signed R2 URLs.
- Private routes and APIs are blocked in `robots.txt`; protected layouts also emit noindex metadata.
- The R2 bucket must not be publicly writable.

## Known Limitations

- Multipart upload for very large single files is not yet implemented; set `MAX_UPLOAD_BYTES` conservatively until that is added.
- Album ZIP generation is intentionally omitted to avoid Vercel memory and timeout limits.
- Preview generation happens in the browser main thread in this first version; it is bounded but can be moved to a Web Worker later.
- Photographer management currently covers album creation, upload queueing, retry-by-requeue, and deletion API support. Full rename/reorder/hide/move UI can be layered onto the existing metadata endpoints.
