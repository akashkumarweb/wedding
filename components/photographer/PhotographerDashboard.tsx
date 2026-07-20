'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Album = { id: string; title: string; photoCount: number }
type QueueItem = {
  id: string
  file: File
  path: string
  status: 'pending' | 'uploading' | 'complete' | 'failed'
  progress: number
  error?: string
}

const uploadConcurrency = 5
const checksumMaxBytes = 64 * 1024 * 1024
const queueRenderLimit = 250
const previewMaxWidth = 1600

export function PhotographerDashboard() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [albumId, setAlbumId] = useState('')
  const [title, setTitle] = useState('')
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const progressUpdatesRef = useRef<Map<string, number>>(new Map())
  const progressFrameRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (progressFrameRef.current !== null) cancelAnimationFrame(progressFrameRef.current)
    }
  }, [])

  useEffect(() => {
    fetch('/api/photographer/albums').then((r) => r.json()).then((d) => {
      setAlbums(d.albums ?? [])
      setAlbumId(d.albums?.[0]?.id ?? '')
    })
  }, [])

  const totals = useMemo(() => {
    const bytes = queue.reduce((sum, item) => sum + item.file.size, 0)
    const uploadedBytes = queue.reduce((sum, item) => {
      if (item.status === 'complete') return sum + item.file.size
      return sum + item.file.size * (item.progress / 100)
    }, 0)
    return {
      bytes,
      pending: queue.filter((i) => i.status === 'pending').length,
      uploading: queue.filter((i) => i.status === 'uploading').length,
      complete: queue.filter((i) => i.status === 'complete').length,
      failed: queue.filter((i) => i.status === 'failed').length,
      overallProgress: bytes ? Math.round((uploadedBytes / bytes) * 100) : 0,
    }
  }, [queue])

  const visibleQueue = useMemo(() => queue.slice(0, queueRenderLimit), [queue])

  async function createAlbum() {
    if (!title.trim()) return
    const response = await fetch('/api/photographer/albums', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    const data = await response.json()
    setAlbums((items) => [...items, data.album])
    setAlbumId(data.album.id)
    setTitle('')
  }

  function addFiles(files: FileList | File[]) {
    const existing = new Set(queue.map((item) => `${item.path}:${item.file.size}:${item.file.lastModified}`))
    const next: QueueItem[] = []
    Array.from(files).forEach((file) => {
      const path = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name
      const key = `${path}:${file.size}:${file.lastModified}`
      if (!existing.has(key)) {
        existing.add(key)
        next.push({ id: crypto.randomUUID(), file, path, status: 'pending', progress: 0 })
      }
    })
    setQueue((items) => [...items, ...next])
  }

  async function uploadAll() {
    if (!albumId) return
    setUploading(true)
    const pending = queue.filter((candidate) => candidate.status === 'pending')
    const workers = Array.from({ length: Math.min(uploadConcurrency, pending.length) }, async () => {
      while (true) {
        const item = pending.shift()
        if (!item) return
        setQueue((items) => items.map((i) => i.id === item.id ? { ...i, status: 'uploading', progress: 2 } : i))
        await uploadOne(item)
      }
    })
    await Promise.all(workers)
    setUploading(false)
  }

  async function uploadOne(item: QueueItem) {
    try {
      const folderPath = item.path.includes('/') ? item.path.split('/').slice(0, -1).join('/') : ''
      const previewTask = createPreview(item.file)
      const [{ width, height }, checksum] = await Promise.all([
        readDimensions(item.file).catch(() => ({ width: 0, height: 0 })),
        maybeSha256(item.file).catch(() => ''),
      ])
      const start = await fetch('/api/photographer/uploads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          albumId,
          filename: item.file.name,
          mimeType: item.file.type || 'application/octet-stream',
          fileSize: item.file.size,
          width,
          height,
          folderPath,
          checksum,
        }),
      })
      if (!start.ok) throw new Error('Upload rejected')
      const { image, originalUrl, previewUrl } = await start.json()
      let originalProgress = 0
      let previewProgress = 0
      const syncProgress = () => updateProgress(item.id, 6 + originalProgress * 82 + previewProgress * 12)
      await Promise.all([
        putFile(originalUrl, item.file, item.file.type || 'application/octet-stream', (progress) => {
          originalProgress = progress
          syncProgress()
        }),
        previewTask.then((preview) => putFile(previewUrl, preview, 'image/webp', (progress) => {
          previewProgress = progress
          syncProgress()
        })),
      ])
      const confirm = await fetch('/api/photographer/uploads', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: image.id, status: 'complete' }),
      })
      if (!confirm.ok) throw new Error('Upload confirmation failed')
      setQueue((items) => items.map((i) => i.id === item.id ? { ...i, status: 'complete', progress: 100 } : i))
    } catch {
      setQueue((items) => items.map((i) => i.id === item.id ? { ...i, status: 'failed', error: 'Failed', progress: 0 } : i))
    }
  }

  function updateProgress(id: string, progress: number) {
    progressUpdatesRef.current.set(id, Math.max(0, Math.min(100, Math.round(progress))))
    if (progressFrameRef.current !== null) return
    progressFrameRef.current = requestAnimationFrame(() => {
      const updates = new Map(progressUpdatesRef.current)
      progressUpdatesRef.current.clear()
      progressFrameRef.current = null
      setQueue((items) => items.map((item) => {
        const nextProgress = updates.get(item.id)
        return nextProgress === undefined ? item : { ...item, progress: nextProgress }
      }))
    })
  }

  function retryFailed() {
    setQueue((items) => items.map((item) => (
      item.status === 'failed' ? { ...item, status: 'pending', progress: 0, error: undefined } : item
    )))
  }

  function removeFromQueue(id: string) {
    setQueue((items) => items.filter((item) => item.id !== id || item.status === 'uploading'))
  }

  async function logout() {
    await fetch('/api/auth/photographer', { method: 'DELETE' })
    window.location.href = '/photographer/login'
  }

  return (
    <main className="boho-paper min-h-screen px-4 py-24 text-maroon-dark md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-[0.35em] text-sage-dark uppercase">Akash & Madhavi</p>
            <h1 className="font-heading mt-3 text-5xl">Photographer Dashboard</h1>
          </div>
          <button onClick={logout} className="rounded-full border border-maroon/30 px-5 py-2 text-xs tracking-[0.2em] uppercase">Logout</button>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-[1fr_1fr]">
          <div className="glass-luxury rounded-[1.25rem] p-6">
            <h2 className="font-heading text-3xl">Albums</h2>
            <div className="mt-5 flex gap-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Album title" className="min-w-0 flex-1 rounded-full border border-gold/30 bg-ivory px-4 py-3" />
              <button onClick={createAlbum} className="rounded-full bg-maroon px-5 py-3 text-xs tracking-[0.18em] text-ivory uppercase">Create</button>
            </div>
            <select value={albumId} onChange={(e) => setAlbumId(e.target.value)} className="mt-5 w-full rounded-full border border-gold/30 bg-ivory px-4 py-3">
              <option value="">Choose album</option>
              {albums.map((album) => <option key={album.id} value={album.id}>{album.title} ({album.photoCount})</option>)}
            </select>
          </div>

          <div className="glass-luxury rounded-[1.25rem] p-6" aria-live="polite">
            <h2 className="font-heading text-3xl">Upload Queue</h2>
            <p className="mt-3 text-sm text-maroon-dark/70">{queue.length} files, {formatBytes(totals.bytes)} selected. {totals.complete} complete, {totals.failed} failed, {totals.uploading} uploading, {totals.pending} pending.</p>
            {queue.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs tracking-[0.14em] text-sage-dark uppercase">
                  <span>Overall progress</span>
                  <span>{totals.overallProgress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gold/20">
                  <div className="h-full bg-maroon transition-all" style={{ width: `${totals.overallProgress}%` }} />
                </div>
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} accept="image/*,video/mp4,video/quicktime,video/webm" />
              <input type="file" multiple className="hidden" id="folder-upload" onChange={(e) => e.target.files && addFiles(e.target.files)} {...{ webkitdirectory: '' }} />
              <button onClick={() => inputRef.current?.click()} className="rounded-full border border-gold/40 px-5 py-3 text-xs tracking-[0.18em] uppercase">Select files</button>
              <label htmlFor="folder-upload" className="cursor-pointer rounded-full border border-gold/40 px-5 py-3 text-xs tracking-[0.18em] uppercase">Select folder</label>
              <button disabled={!albumId || uploading} onClick={uploadAll} className="rounded-full bg-maroon px-5 py-3 text-xs tracking-[0.18em] text-ivory uppercase disabled:opacity-50">Upload</button>
              <button disabled={!totals.failed || uploading} onClick={retryFailed} className="rounded-full border border-maroon/30 px-5 py-3 text-xs tracking-[0.18em] uppercase disabled:opacity-50">Retry failed</button>
            </div>
          </div>
        </section>

        <section onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }} onDragOver={(e) => e.preventDefault()} className="glass-luxury mt-6 min-h-64 rounded-[1.25rem] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-3xl">Files</h2>
            <button onClick={() => setQueue((items) => items.filter((i) => i.status !== 'complete'))} className="text-xs tracking-[0.18em] uppercase">Clear complete</button>
          </div>
          <div className="grid gap-3">
            {visibleQueue.map((item) => (
              <div key={item.id} className="rounded-xl border border-gold/20 bg-ivory/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="min-w-0 truncate text-sm">{item.path}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <p className="text-xs uppercase text-sage-dark">{item.status}</p>
                    {item.status !== 'uploading' && (
                      <button onClick={() => removeFromQueue(item.id)} className="text-xs tracking-[0.14em] text-maroon uppercase">Remove</button>
                    )}
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gold/20"><div className="h-full bg-maroon" style={{ width: `${item.progress}%` }} /></div>
              </div>
            ))}
            {queue.length > queueRenderLimit && <p className="rounded-xl border border-gold/20 bg-ivory/70 p-4 text-center text-sm text-maroon-dark/65">Showing first {queueRenderLimit} files while uploading {queue.length} selected files.</p>}
            {!queue.length && <p className="rounded-xl border border-dashed border-gold/40 p-10 text-center text-maroon-dark/60">Drag photographs here or choose files above.</p>}
          </div>
        </section>
      </div>
    </main>
  )
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`
}

async function sha256(file: File) {
  const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function maybeSha256(file: File) {
  if (file.size > checksumMaxBytes) return ''
  return sha256(file)
}

function putFile(
  url: string,
  file: Blob,
  contentType: string,
  onProgress: (progress: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.setRequestHeader('content-type', contentType)
    xhr.upload.onprogress = (event) => event.lengthComputable && onProgress(event.loaded / event.total)
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Upload failed')))
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.send(file)
  })
}

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return resolve({ width: 0, height: 0 })
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Unable to read image dimensions'))
    }
    img.src = url
  })
}

async function createPreview(file: File) {
  try {
    if (file.type.startsWith('video/')) return createVideoPreview(file)
    if (!file.type.startsWith('image/')) return createFallbackPreview()
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, previewMaxWidth / bitmap.width)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    return canvasToWebp(canvas)
  } catch {
    return createFallbackPreview()
  }
}

function createVideoPreview(file: File) {
  return new Promise<Blob>((resolve) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)
    let settled = false
    const cleanup = () => {
      URL.revokeObjectURL(url)
      video.removeAttribute('src')
      video.load()
    }
    const finish = (blob: Blob) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      cleanup()
      resolve(blob)
    }
    const fail = () => {
      createFallbackPreview().then(finish)
    }
    const capture = () => {
      const width = video.videoWidth || 1
      const height = video.videoHeight || 1
      const scale = Math.min(1, previewMaxWidth / width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvasToWebp(canvas).then(finish)
    }
    const timeout = window.setTimeout(fail, 6000)
    video.muted = true
    video.preload = 'metadata'
    video.playsInline = true
    video.onloadedmetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return capture()
      video.currentTime = Math.min(0.2, Math.max(0, video.duration / 20))
    }
    video.onloadeddata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) capture()
    }
    video.onseeked = capture
    video.onerror = fail
    video.src = url
    video.load()
  })
}

function createFallbackPreview() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvasToWebp(canvas)
}

function canvasToWebp(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? new Blob([], { type: 'image/webp' })), 'image/webp', 0.82)
  })
}
