import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import type { Group } from 'three'

export function MandalaScene() {
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)

  useFrame((_, delta) => {
    if (outer.current) outer.current.rotation.z += delta * 0.15
    if (inner.current) inner.current.rotation.z -= delta * 0.25
  })

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[2, 2, 2]} intensity={1.5} color="#ffd89b" />
      <Sparkles count={40} scale={3} size={1.5} speed={0.3} color="#e8c547" />
      <group ref={outer}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
            <torusGeometry args={[1.1, 0.012, 8, 48]} />
            <meshStandardMaterial
              color="#c9a227"
              metalness={1}
              roughness={0.25}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      <group ref={inner}>
        <Float speed={2} floatIntensity={0.4}>
          <mesh>
            <icosahedronGeometry args={[0.35, 0]} />
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.4}
              chromaticAberration={0.15}
              anisotropy={0.3}
              distortion={0.2}
              distortionScale={0.15}
              temporalDistortion={0.1}
              color="#f5c6cb"
            />
          </mesh>
        </Float>
      </group>
    </>
  )
}
