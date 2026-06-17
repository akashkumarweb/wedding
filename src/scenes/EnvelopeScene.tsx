import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Text, Sparkles, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { couple } from '../data/wedding'

interface EnvelopeSceneProps {
  introState: 'closed' | 'opening' | 'opened' | 'exiting' | 'completed'
  onStateChange: (state: 'closed' | 'opening' | 'opened' | 'exiting' | 'completed') => void
  onCardClick: () => void
}

const COLOR_MAROON = '#5c1524'
const COLOR_MAROON_DARK = '#3a0d18'
const COLOR_GOLD = '#c9a227'
const COLOR_GOLD_BRIGHT = '#e8c547'
const COLOR_IVORY = '#fff9f2'

export function EnvelopeScene({ introState, onStateChange, onCardClick }: EnvelopeSceneProps) {
  // Refs for 3D elements
  const envelopeGroupRef = useRef<THREE.Group>(null)
  const flapGroupRef = useRef<THREE.Group>(null)
  const sealGroupRef = useRef<THREE.Group>(null)
  const cardGroupRef = useRef<THREE.Group>(null)
  const ringsGroupRef = useRef<THREE.Group>(null)

  // Responsive scaling based on viewport size
  const envelopeScale = useMemo(() => {
    const width = window.innerWidth
    if (width < 480) return 0.85 // Mobile portrait
    if (width < 768) return 1.0  // Tablet
    return 1.15                 // Desktop
  }, [])

  // 1. Shapes for flaps
  const flapShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-1.6, 0)
    s.lineTo(1.6, 0)
    s.lineTo(0, -2.8)
    s.closePath()
    return s
  }, [])

  const pocketShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-1.6, -2.3)
    s.lineTo(1.6, -2.3)
    s.lineTo(1.6, 0.6)
    s.lineTo(0, -0.2)
    s.lineTo(-1.6, 0.6)
    s.closePath()
    return s
  }, [])

  // 2. Parallax tilt effect based on mouse/touch pointer
  useFrame((state, delta) => {
    if (!envelopeGroupRef.current) return

    // Gentle rotating animation of the interlocking rings inside the wax seal
    if (ringsGroupRef.current && introState === 'closed') {
      ringsGroupRef.current.rotation.y += delta * 0.5
    }

    if (introState === 'closed') {
      // Tilt envelope slightly in response to pointer
      const targetRotationX = state.pointer.y * 0.25
      const targetRotationY = state.pointer.x * 0.25

      envelopeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.x,
        targetRotationX,
        0.05
      )
      envelopeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.y,
        targetRotationY,
        0.05
      )
    } else if (introState === 'opening') {
      // Return envelope to face forward during opening
      envelopeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.x,
        0,
        0.08
      )
      envelopeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.y,
        0,
        0.08
      )
    } else if (introState === 'opened') {
      // Hover the card slightly in 3D space
      const time = state.clock.getElapsedTime()
      if (cardGroupRef.current) {
        cardGroupRef.current.position.y = 3.6 + Math.sin(time * 1.5) * 0.05
        cardGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.04
      }
      
      // Keep envelope tilted slightly back to show depth
      envelopeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.x,
        -0.2,
        0.05
      )
      envelopeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        envelopeGroupRef.current.rotation.y,
        state.pointer.x * 0.1,
        0.05
      )
    } else if (introState === 'exiting') {
      // Zoom card/camera or scale up card to cover view
      if (cardGroupRef.current) {
        cardGroupRef.current.scale.x = THREE.MathUtils.lerp(cardGroupRef.current.scale.x, 3.0, 0.05)
        cardGroupRef.current.scale.y = THREE.MathUtils.lerp(cardGroupRef.current.scale.y, 3.0, 0.05)
        cardGroupRef.current.position.z = THREE.MathUtils.lerp(cardGroupRef.current.position.z, 2.5, 0.05)
        cardGroupRef.current.position.y = THREE.MathUtils.lerp(cardGroupRef.current.position.y, 1.0, 0.05)
      }
    }
  })

  // Trigger opening animation
  const triggerOpening = () => {
    if (introState !== 'closed') return
    onStateChange('opening')

    const timeline = gsap.timeline({
      onComplete: () => {
        onStateChange('opened')
      }
    })

    // 1. Pop and fade out the wax seal
    if (sealGroupRef.current) {
      timeline.to(sealGroupRef.current.position, {
        z: 0.8,
        y: 0.2, // Pops slightly up and forward
        duration: 0.5,
        ease: 'back.out(1.5)'
      })
      timeline.to(sealGroupRef.current.rotation, {
        x: 1.5,
        y: 2,
        z: 1,
        duration: 0.5,
      }, '<')
      timeline.to(sealGroupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.4,
        ease: 'power2.in'
      }, '<+0.1')
    }

    // 2. Swing the top flap open (rotate X around the hinge)
    if (flapGroupRef.current) {
      timeline.to(flapGroupRef.current.rotation, {
        x: -Math.PI * 0.95, // Swing all the way up and back
        duration: 0.9,
        ease: 'power2.inOut'
      }, '-=0.2')
    }

    // 3. Slide the card up and slightly forward
    if (cardGroupRef.current) {
      timeline.to(cardGroupRef.current.position, {
        y: 3.2, // slides up out of envelope pocket (well-proportioned)
        z: 0.25, // pops in front of pocket
        duration: 1.1,
        ease: 'power3.out'
      }, '-=0.4')
      
      timeline.to(cardGroupRef.current.rotation, {
        x: 0.02,
        duration: 1.1,
        ease: 'power3.out'
      }, '<')
    }
  }

  // Handle clicking the wax seal
  const handleSealClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    triggerOpening()
  }

  return (
    <>
      {/* Lights tailored to highlight the texture, gold borders and wax seal */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 4]} intensity={1.5} color="#fffaf0" castShadow />
      <directionalLight position={[-5, 3, 2]} intensity={0.6} color={COLOR_GOLD_BRIGHT} />
      <pointLight position={[0, -2, 3]} intensity={0.8} color="#ffd89b" />
      <spotLight
        position={[0, 8, 2]}
        angle={0.3}
        penumbra={0.7}
        intensity={1.2}
        color="#ffffff"
      />

      <Sparkles count={50} scale={[8, 8, 8]} size={1.8} speed={0.4} color={COLOR_GOLD_BRIGHT} opacity={0.6} />

      {/* Main interactive envelope group */}
      <group ref={envelopeGroupRef} scale={envelopeScale}>
        
        {/* Envelope Back Plate (Thick cardboard box texture) */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 4.6, 0.02]} />
          <meshStandardMaterial
            color={COLOR_MAROON}
            roughness={0.75}
            metalness={0.05}
          />
        </mesh>

        {/* Envelope Inside Lining Background (Visible behind the card) */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[3.12, 4.52]} />
          <meshStandardMaterial
            color={COLOR_GOLD}
            metalness={0.7}
            roughness={0.35}
          />
        </mesh>

        {/* Closed Pocket Side/Bottom Boundaries (Fakes a hollow physical pocket) */}
        {/* Left wall */}
        <mesh position={[-1.575, 0, 0.015]}>
          <boxGeometry args={[0.05, 4.6, 0.02]} />
          <meshStandardMaterial color={COLOR_MAROON_DARK} roughness={0.8} />
        </mesh>
        {/* Right wall */}
        <mesh position={[1.575, 0, 0.015]}>
          <boxGeometry args={[0.05, 4.6, 0.02]} />
          <meshStandardMaterial color={COLOR_MAROON_DARK} roughness={0.8} />
        </mesh>
        {/* Bottom wall */}
        <mesh position={[0, -2.275, 0.015]}>
          <boxGeometry args={[3.2, 0.05, 0.02]} />
          <meshStandardMaterial color={COLOR_MAROON_DARK} roughness={0.8} />
        </mesh>

        {/* INVITATION CARD (Starts hidden inside the pocket, slides out) */}
        <group ref={cardGroupRef} position={[0, 0, 0.013]} rotation={[0, 0, 0]}>
          {/* Card Gold Foil Border Base */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[2.98, 4.36, 0.015]} />
            <meshStandardMaterial
              color={COLOR_GOLD}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          {/* Card Ivory Paper Top Layer (Slightly smaller, creates a gold edge) */}
          <mesh position={[0, 0, 0.009]}>
            <planeGeometry args={[2.9, 4.28]} />
            <meshStandardMaterial
              color={COLOR_IVORY}
              roughness={0.85}
              metalness={0.05}
            />
          </mesh>

          {/* Invitation Content (Renders on the card face using Drei text) */}
          <group position={[0, 0, 0.011]}>
            <Text
              position={[0, 1.6, 0]}
              color={COLOR_MAROON_DARK}
              fontSize={0.14}
              font="/fonts/josefin.ttf"
              letterSpacing={0.3}
            >
              YOU ARE INVITED TO
            </Text>

            <Text
              position={[0, 1.35, 0]}
              color={COLOR_GOLD}
              fontSize={0.11}
              font="/fonts/josefin.ttf"
              letterSpacing={0.2}
            >
              CELEBRATE THE WEDDING OF
            </Text>

            {/* Groom Name */}
            <Text
              position={[0, 0.75, 0]}
              color={COLOR_MAROON}
              fontSize={0.48}
              font="/fonts/herrvon.ttf"
            >
              {couple.groom}
            </Text>

            {/* Ampersand */}
            <Text
              position={[0, 0.25, 0]}
              color={COLOR_GOLD}
              fontSize={0.26}
              font="/fonts/cormorant.ttf"
              fontStyle="italic"
            >
              &
            </Text>

            {/* Bride Name */}
            <Text
              position={[0, -0.25, 0]}
              color={COLOR_MAROON}
              fontSize={0.48}
              font="/fonts/herrvon.ttf"
            >
              {couple.bride}
            </Text>

            {/* Horizontal Gold Line divider */}
            <mesh position={[0, -0.7, 0]}>
              <planeGeometry args={[1.5, 0.01]} />
              <meshBasicMaterial color={COLOR_GOLD} />
            </mesh>

            {/* Date Details */}
            <Text
              position={[0, -1.05, 0]}
              color={COLOR_MAROON_DARK}
              fontSize={0.2}
              font="/fonts/cormorant.ttf"
              letterSpacing={0.15}
            >
              JULY 05, 2026
            </Text>

            <Text
              position={[0, -1.35, 0]}
              color={COLOR_MAROON_DARK}
              fontSize={0.11}
              font="/fonts/josefin.ttf"
              letterSpacing={0.25}
            >
              PATNA, BIHAR
            </Text>

            <Text
              position={[0, -1.75, 0]}
              color={COLOR_GOLD}
              fontSize={0.11}
              font="/fonts/josefin.ttf"
              letterSpacing={0.15}
              onClick={(e) => {
                e.stopPropagation()
                onCardClick()
              }}
            >
              [ CLICK TO ENTER CELEBRATION ]
            </Text>
          </group>
        </group>

        {/* Envelope Front Pocket (Lower portion covering the card) */}
        <mesh position={[0, 0, 0.025]} castShadow receiveShadow>
          <shapeGeometry args={[pocketShape]} />
          <meshStandardMaterial
            color={COLOR_MAROON}
            roughness={0.7}
            metalness={0.05}
          />
          <Edges color={COLOR_GOLD} threshold={15} lineWidth={2.5} />
        </mesh>

        {/* TOP FLAP (Anchored at Y = 2.3 - folds down over the pocket) */}
        <group ref={flapGroupRef} position={[0, 2.3, 0.026]}>
          
          {/* Flap Outer (Burgundy color, facing front when closed) */}
          <mesh position={[0, 0, 0]} castShadow>
            <shapeGeometry args={[flapShape]} />
            <meshStandardMaterial
              color={COLOR_MAROON}
              roughness={0.7}
              metalness={0.05}
              side={THREE.DoubleSide}
            />
            <Edges color={COLOR_GOLD} threshold={15} lineWidth={2.5} />
          </mesh>

          {/* Flap Inner Lining (Metallic gold silk lining, visible when flipped open) */}
          <mesh position={[0, 0, -0.002]}>
            <shapeGeometry args={[flapShape]} />
            <meshStandardMaterial
              color={COLOR_GOLD}
              metalness={0.8}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
            <Edges color={COLOR_GOLD_BRIGHT} threshold={15} lineWidth={1.5} />
          </mesh>
        </group>

        {/* 3D WAX SEAL (STAMP) */}
        {/* Sits at the tip of the flap (Y = -0.35). Triggers opening on click. */}
        <group
          ref={sealGroupRef}
          position={[0, -0.35, 0.038]}
          onClick={handleSealClick}
        >
          {/* wax pool base disk */}
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.32, 0.04, 32]} />
            <meshStandardMaterial
              color={COLOR_GOLD}
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          {/* wax seal outer rim */}
          <mesh position={[0, 0, 0.02]}>
            <torusGeometry args={[0.23, 0.035, 16, 48]} />
            <meshStandardMaterial
              color={COLOR_GOLD_BRIGHT}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Interlocking Wedding Rings (3D stamped design in center) */}
          <group ref={ringsGroupRef} position={[0, 0, 0.025]} scale={0.24}>
            <mesh position={[-0.15, 0, 0]} rotation={[0.2, 0.3, 0]}>
              <torusGeometry args={[0.35, 0.07, 8, 24]} />
              <meshPhysicalMaterial
                color={COLOR_GOLD_BRIGHT}
                metalness={1.0}
                roughness={0.1}
                clearcoat={1}
              />
            </mesh>
            <mesh position={[0.15, 0, 0.02]} rotation={[-0.2, -0.3, 0]}>
              <torusGeometry args={[0.35, 0.07, 8, 24]} />
              <meshPhysicalMaterial
                color={COLOR_GOLD_BRIGHT}
                metalness={1.0}
                roughness={0.1}
                clearcoat={1}
              />
            </mesh>
          </group>

          {/* Invisible larger click target for easier mobile tapping */}
          <mesh position={[0, 0, 0]} visible={false}>
            <sphereGeometry args={[0.5, 16, 16]} />
          </mesh>
        </group>

      </group>
    </>
  )
}
