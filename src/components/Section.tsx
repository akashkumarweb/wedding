import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  className?: string
  children: ReactNode
}

export function Section({ id, className = '', children }: SectionProps) {
  return (
    <section id={id} className={`relative px-4 py-20 md:px-8 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}
