import pg from 'pg'

const { DATABASE_URL } = process.env
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
})

await client.connect()
await client.query(`create extension if not exists pgcrypto`)
await client.query(`
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_image_id uuid,
  event_date text,
  display_order integer not null default 0,
  published boolean not null default true,
  download_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
`)
await client.query(`
create table if not exists images (
  id uuid primary key,
  album_id uuid not null references albums(id) on delete cascade,
  original_filename text not null,
  original_object_key text not null unique,
  preview_object_key text not null,
  mime_type text not null,
  file_size bigint not null,
  width integer not null default 0,
  height integer not null default 0,
  uploaded_at timestamptz not null default now(),
  display_order integer not null default 0,
  folder_path text not null default '',
  upload_status text not null default 'pending',
  caption text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  checksum text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
`)
await client.query(`create index if not exists albums_published_order_idx on albums (published, display_order, created_at)`)
await client.query(`create index if not exists images_album_status_order_idx on images (album_id, upload_status, published, display_order, uploaded_at)`)
await client.query(`create index if not exists images_uploaded_idx on images (uploaded_at)`)
await client.query(`create index if not exists images_checksum_idx on images (checksum)`)
await client.end()
console.log('Database migration complete')
