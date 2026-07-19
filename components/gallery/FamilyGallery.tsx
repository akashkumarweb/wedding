'use client'

import { useEffect, useMemo, useState } from 'react'

type Album = { id: string; title: string; description: string; eventDate: string | null; photoCount: number }
type ImageItem = {
  id: string
  albumId: string
  originalFilename: string
  previewUrl: string
  width: number
  height: number
  caption: string
}

export function FamilyGallery() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [albumId, setAlbumId] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/gallery/albums').then((r) => r.json()).then((d) => setAlbums(d.albums ?? []))
  }, [])

  const album = useMemo(() => albums.find((item) => item.id === albumId), [albums, albumId])

  async function openAlbum(id: string) {
    setAlbumId(id)
    setImages([])
    setCursor(null)
    await loadImages(id, null, true)
  }

  async function loadImages(id = albumId, next = cursor, replace = false) {
    if (!id || loading) return
    setLoading(true)
    const response = await fetch(`/api/gallery/images?albumId=${id}&limit=40${next ? `&cursor=${next}` : ''}`)
    const data = await response.json()
    setImages((items) => replace ? data.items : [...items, ...data.items])
    setCursor(data.nextCursor)
    setLoading(false)
  }

  async function downloadOriginal(image: ImageItem) {
    const response = await fetch(`/api/gallery/download?id=${image.id}`)
    if (!response.ok) return
    const { url } = await response.json()
    window.location.href = url
  }

  async function logout() {
    await fetch('/api/auth/gallery', { method: 'DELETE' })
    window.location.href = '/gallery/login'
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (active === null) return
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((value) => Math.min((value ?? 0) + 1, images.length - 1))
      if (event.key === 'ArrowLeft') setActive((value) => Math.max((value ?? 0) - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, images.length])

  return (
    <main className="boho-paper min-h-screen px-4 py-20 text-maroon-dark md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-[0.35em] text-sage-dark uppercase">Akash & Madhavi</p>
            <h1 className="font-heading mt-3 text-5xl md:text-7xl">Wedding Gallery</h1>
          </div>
          <button onClick={logout} className="rounded-full border border-maroon/30 px-5 py-2 text-xs tracking-[0.2em] uppercase">Logout</button>
        </header>

        {!albumId && (
          <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((item) => (
              <button key={item.id} onClick={() => openAlbum(item.id)} className="glass-luxury group min-h-56 rounded-[1.25rem] p-6 text-left transition hover:-translate-y-1">
                <p className="text-xs tracking-[0.3em] text-sage-dark uppercase">{item.eventDate || 'Wedding memories'}</p>
                <h2 className="font-heading mt-8 text-4xl text-maroon">{item.title}</h2>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-maroon-dark/70">{item.description}</p>
                <p className="mt-8 text-xs tracking-[0.2em] text-gold-deep uppercase">{item.photoCount} photographs</p>
              </button>
            ))}
            {!albums.length && <p className="glass-luxury rounded-[1.25rem] p-8">No published albums yet.</p>}
          </section>
        )}

        {albumId && (
          <>
            <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <button onClick={() => setAlbumId('')} className="text-xs tracking-[0.2em] uppercase text-sage-dark">Back to albums</button>
                <h2 className="font-heading mt-3 text-5xl">{album?.title}</h2>
              </div>
              <p className="text-sm text-maroon-dark/65">{images.length} loaded</p>
            </div>
            <section className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {images.map((image, index) => (
                <button key={image.id} onClick={() => setActive(index)} className="mb-4 block w-full overflow-hidden rounded-xl bg-gold/15 text-left focus:outline-none focus:ring-2 focus:ring-maroon">
                  <img loading="lazy" src={image.previewUrl} alt={image.caption || image.originalFilename} className="h-auto w-full transition duration-700 hover:scale-[1.02]" />
                </button>
              ))}
            </section>
            {cursor && <button disabled={loading} onClick={() => loadImages()} className="mx-auto mt-8 block rounded-full bg-maroon px-6 py-3 text-xs tracking-[0.2em] text-ivory uppercase">Load more</button>}
          </>
        )}
      </div>

      {active !== null && images[active] && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-maroon-dark/95 p-4">
          <button aria-label="Close" onClick={() => setActive(null)} className="absolute right-5 top-5 rounded-full border border-ivory/40 px-4 py-2 text-ivory">Close</button>
          <button aria-label="Previous photograph" onClick={() => setActive(Math.max(active - 1, 0))} className="absolute left-4 top-1/2 rounded-full border border-ivory/30 px-4 py-3 text-ivory">Prev</button>
          <button aria-label="Next photograph" onClick={() => setActive(Math.min(active + 1, images.length - 1))} className="absolute right-4 top-1/2 rounded-full border border-ivory/30 px-4 py-3 text-ivory">Next</button>
          <div className="max-h-[90vh] max-w-6xl">
            <img src={images[active].previewUrl} alt={images[active].caption || images[active].originalFilename} className="max-h-[78vh] w-auto rounded-lg object-contain" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-ivory">
              <p>{active + 1} / {images.length}</p>
              <button onClick={() => downloadOriginal(images[active])} className="rounded-full bg-ivory px-5 py-3 text-xs tracking-[0.2em] text-maroon uppercase">Download Original</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
