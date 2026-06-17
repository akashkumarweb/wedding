import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Float,
  MeshDistortMaterial,
  Sparkles,
  Stars,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

const GOLD = '#d4af37'
const ROSE_GOLD = '#e8b4b8'

function GoldRing({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: number
}) {
  const ref = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.06
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <torusGeometry args={[0.85, 0.14, 48, 128]} />
      <meshPhysicalMaterial
        color={GOLD}
        metalness={1}
        roughness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1.8}
      />
    </mesh>
  )
}

function DiamondAccent() {
  return (
    <Float speed={2} floatIntensity={0.6}>
      <mesh position={[0, 0.15, 0.3]} rotation={[0.4, 0.6, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshPhysicalMaterial
          color="#fff8f0"
          metalness={0.3}
          roughness={0}
          transmission={0.6}
          thickness={0.5}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  )
}

function MandalaRings() {
  const ref = useRef<Group>(null)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.03
  })

  return (
    <group ref={ref} position={[0, 0, -1.2]} scale={1.8}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
        >
          <torusGeometry args={[1.4, 0.008, 8, 64]} />
          <meshStandardMaterial
            color={GOLD}
            metalness={1}
            roughness={0.3}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  )
}

function Petals() {
  const petals = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        Math.random() * 5 + 0.5,
        (Math.random() - 0.5) * 5,
      ] as [number, number, number],
      scale: 0.06 + Math.random() * 0.08,
      speed: 0.15 + Math.random() * 0.35,
      offset: i * 0.25,
      hue: Math.random() > 0.5 ? ROSE_GOLD : '#f4c4c8',
    }))
  }, [])

  const groupRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      const p = petals[i]
      child.position.y = p.position[1] - ((t * p.speed + p.offset) % 6)
      child.rotation.z = t * 0.4 + i
      child.position.x = p.position[0] + Math.sin(t * 0.3 + i) * 0.15
    })
  })

  return (
    <group ref={groupRef}>
      {petals.map((p, i) => (
        <mesh key={i} position={p.position} scale={p.scale}>
          <circleGeometry args={[1, 6]} />
          <meshStandardMaterial
            color={p.hue}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

function GoldOrbs() {
  const orbs = useMemo(
    () =>
      Array.from({ length: 20 }, () => ({
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4 - 0.5,
        ] as [number, number, number],
        scale: 0.03 + Math.random() * 0.1,
      })),
    [],
  )

  return (
    <>
      {orbs.map((o, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.3}
          floatIntensity={1}
        >
          <mesh position={o.position}>
            <sphereGeometry args={[o.scale, 24, 24]} />
            <meshPhysicalMaterial
              color={GOLD}
              metalness={1}
              roughness={0.08}
              envMapIntensity={2}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

function CenterGlow() {
  return (
    <mesh position={[0, 0, -2.5]}>
      <sphereGeometry args={[3, 48, 48]} />
      <MeshDistortMaterial
        color="#fce8ec"
        transparent
        opacity={0.4}
        distort={0.35}
        speed={2}
      />
    </mesh>
  )
}

function SceneRig() {
  const group = useRef<Group>(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.35,
      0.05,
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * 0.12,
      0.05,
    )
  })

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
        <group rotation={[0.45, 0.25, 0.08]}>
          <GoldRing position={[-0.38, 0, 0]} rotation={[Math.PI / 2.15, 0, 0.45]} />
          <GoldRing position={[0.38, 0, 0]} rotation={[Math.PI / 2.15, 0, -0.45]} />
          <DiamondAccent />
        </group>
      </Float>
    </group>
  )
}

export function WeddingRingsScene() {
  return (
    <>
      <color attach="background" args={['#f8ecef']} />
      <fog attach="fog" args={['#e8d0d5', 5, 16]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 4]} intensity={1.4} color="#fff8f0" />
      <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#c9a227" />
      <pointLight position={[0, 2, 3]} intensity={1.2} color="#ffd89b" distance={12} />
      <spotLight
        position={[0, 5, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.8}
        color="#fff5e6"
      />
      <Environment preset="city" />
      <Stars radius={80} depth={40} count={1200} factor={3} saturation={0.2} fade speed={0.3} />
      <Sparkles
        count={120}
        scale={[10, 6, 8]}
        size={2.5}
        speed={0.35}
        opacity={0.55}
        color="#e8c547"
      />
      <MandalaRings />
      <CenterGlow />
      <SceneRig />
      <Petals />
      <GoldOrbs />
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.55}
          luminanceSmoothing={0.9}
          intensity={0.85}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.12} darkness={0.45} />
      </EffectComposer>
    </>
  )
}
