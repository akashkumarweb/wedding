import type { Metadata } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'Akash & Madhavi',
  description: 'Akash and Madhavi wedding gallery',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
