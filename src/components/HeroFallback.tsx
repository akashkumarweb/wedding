import { OptimizedImage } from './OptimizedImage'

export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <OptimizedImage
        src="/assets/golden-rings.jpg"
        alt="Golden wedding rings"
        className="h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blush/40 via-blush/20 to-ivory/90" />
    </div>
  )
}
