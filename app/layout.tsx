import type { Metadata } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'Akash & Madhavi',
  description: 'Akash and Madhavi wedding gallery',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
