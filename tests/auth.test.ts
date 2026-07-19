import { describe, expect, it } from 'vitest'
import { passwordMatches } from '../lib/auth'

describe('password matching', () => {
  it('accepts the correct photographer password value', () => {
    expect(passwordMatches('correct horse', 'correct horse')).toBe(true)
  })

  it('rejects an incorrect photographer password value', () => {
    expect(passwordMatches('wrong', 'correct horse')).toBe(false)
  })
})
