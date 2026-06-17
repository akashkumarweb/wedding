import { lazy, Suspense } from 'react'
import type { ComponentProps } from 'react'

const SectionCanvas3D = lazy(() =>
  import('./SectionCanvas3D').then((m) => ({ default: m.SectionCanvas3D })),
)

export function LazySection3D({ active = true, ...props }: ComponentProps<typeof SectionCanvas3D> & { active?: boolean }) {
  if (!active) return null
  return (
    <Suspense fallback={null}>
      <SectionCanvas3D {...props} />
    </Suspense>
  )
}
