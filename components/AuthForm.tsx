'use client'

import { useState } from 'react'

export function AuthForm({ title, subtitle, endpoint }: { title: string; subtitle: string; endpoint: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (response.ok) {
      window.location.href = endpoint.includes('photographer') ? '/photographer' : '/gallery'
      return
    }
    setError('Unable to sign in')
  }

  return (
    <main className="boho-paper flex min-h-screen items-center justify-center px-5 py-24">
      <form onSubmit={submit} className="glass-luxury w-full max-w-md rounded-[1.5rem] p-8">
        <p className="font-body text-xs tracking-[0.35em] text-sage-dark uppercase">Private access</p>
        <h1 className="font-heading mt-4 text-4xl text-maroon-dark">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-maroon-dark/70">{subtitle}</p>
        <label className="mt-8 block text-sm tracking-[0.15em] text-maroon uppercase" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-3 w-full rounded-full border border-gold/35 bg-ivory px-5 py-3 text-maroon-dark outline-none focus:border-maroon focus:ring-2 focus:ring-gold/40"
        />
        {error && <p className="mt-4 text-sm text-maroon" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-full bg-maroon px-6 py-3 text-sm tracking-[0.2em] text-ivory uppercase transition hover:bg-maroon-rich focus:outline-none focus:ring-2 focus:ring-gold"
        >
          {loading ? 'Signing in' : 'Enter'}
        </button>
      </form>
    </main>
  )
}
