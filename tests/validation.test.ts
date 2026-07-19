import { describe, expect, it } from 'vitest'
import { assertUploadAllowed, sanitizeFilename } from '../lib/validation'

describe('upload validation', () => {
  it('preserves a safe original filename', () => {
    expect(sanitizeFilename('Akash Madhavi (1).JPG')).toBe('Akash Madhavi (1).JPG')
  })

  it('removes path traversal and unsafe path segments', () => {
    expect(sanitizeFilename('../../secret/IMG 1.jpg')).toBe('IMG 1.jpg')
  })

  it('rejects unsupported file types', () => {
    expect(() => assertUploadAllowed({ filename: 'notes.txt', mimeType: 'text/plain', fileSize: 10 })).toThrow()
  })

  it('rejects mismatched file extensions and mime types', () => {
    expect(() => assertUploadAllowed({ filename: 'photo.jpg', mimeType: 'image/png', fileSize: 10 })).toThrow()
  })

  it('rejects oversized uploads', () => {
    expect(() => assertUploadAllowed({ filename: 'photo.jpg', mimeType: 'image/jpeg', fileSize: 2 * 1024 * 1024 * 1024 })).toThrow()
  })

  it('accepts supported image uploads', () => {
    expect(() => assertUploadAllowed({ filename: 'photo.jpg', mimeType: 'image/jpeg', fileSize: 10 })).not.toThrow()
  })
})
