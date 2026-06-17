import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { WeddingRingsScene } from '../scenes/WeddingRingsScene'

export function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <WeddingRingsScene />
      </Suspense>
    </Canvas>
  )
}
