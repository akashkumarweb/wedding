import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { SparkleFieldScene } from '../scenes/SparkleFieldScene'
import { MandalaScene } from '../scenes/MandalaScene'

type Variant = 'sparkles' | 'mandala'

type SectionCanvas3DProps = {
  variant?: Variant
  className?: string
  sparkleColor?: string
}

export function SectionCanvas3D({
  variant = 'sparkles',
  className = '',
  sparkleColor,
}: SectionCanvas3DProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {variant === 'mandala' ? (
            <MandalaScene />
          ) : (
            <SparkleFieldScene color={sparkleColor} />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
