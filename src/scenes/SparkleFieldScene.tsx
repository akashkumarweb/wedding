import { Sparkles, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

/** Lightweight 3D accent for section backgrounds */
export function SparkleFieldScene({ color = '#e8c547' }: { color?: string }) {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08
  })

  return (
    <group ref={group}>
      <Sparkles count={60} scale={6} size={2} speed={0.4} opacity={0.7} color={color} />
      <Float speed={1.5} floatIntensity={0.5}>
        <mesh rotation={[0.8, 0.4, 0]}>
          <torusGeometry args={[0.6, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#c9a227"
            metalness={1}
            roughness={0.2}
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>
      <Float speed={2} floatIntensity={0.8}>
        <mesh position={[0.4, 0.2, 0]} rotation={[0.5, 0.8, 0]}>
          <torusGeometry args={[0.35, 0.015, 12, 48]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={1}
            roughness={0.15}
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>
    </group>
  )
}
