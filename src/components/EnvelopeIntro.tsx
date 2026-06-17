import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeScene } from '../scenes/EnvelopeScene'

interface EnvelopeIntroProps {
  onComplete: () => void
}

type IntroState = 'closed' | 'opening' | 'opened' | 'exiting' | 'completed'

export function EnvelopeIntro({ onComplete }: EnvelopeIntroProps) {
  const [introState, setIntroState] = useState<IntroState>('closed')
  const [showHint, setShowHint] = useState(true)

  // Hide the "Tap to Open" hint once opening starts
  useEffect(() => {
    if (introState !== 'closed') {
      setShowHint(false)
    }
  }, [introState])

  const handleCardClick = () => {
    if (introState !== 'opened') return
    setIntroState('exiting')
    
    // Allow the 3D card scale-up zoom animation to play before completing
    setTimeout(() => {
      setIntroState('completed')
      onComplete()
    }, 1000)
  };
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-envelope-radial">
      {/* Decorative luxury elements in background */}
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M54 48c-2 0-3 1-4 2v4c1 1 2 2 4 2s3-1 4-2v-4c-1-1-2-2-4-2zm-24 0c-2 0-3 1-4 2v4c1 1 2 2 4 2s3-1 4-2v-4c-1-1-2-2-4-2zm-24 0c-2 0-3 1-4 2v4c1 1 2 2 4 2s3-1 4-2v-4c-1-1-2-2-4-2zm36-24c-2 0-3 1-4 2v4c1 1 2 2 4 2s3-1 4-2v-4c-1-1-2-2-4-2zm-24 0c-2 0-3 1-4 2v4c1 1 2 2 4 2s3-1 4-2v-4c-1-1-2-2-4-2z%22 fill=%22%23c9a227%22 fill-opacity=%220.03%22 fill-rule=%22evenodd%22/%3E%3C/svg%3E')] opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      
      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-10 h-full w-full">
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <EnvelopeScene
              introState={introState}
              onStateChange={setIntroState}
              onCardClick={handleCardClick}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML Overlay Controls */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-between py-12 px-6">
        
        {/* Title/Top Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="font-hindi text-gold-shimmer text-xl tracking-[0.3em] mb-1">शुभ विवाह</p>
          <h2 className="font-heading text-xs tracking-[0.4em] text-gold-light uppercase">
            Wedding Invitation
          </h2>
        </motion.div>

        {/* Dynamic Instructional Guides based on state */}
        <div className="w-full flex flex-col items-center gap-6">
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="text-center flex flex-col items-center gap-2"
              >
                <p className="font-body text-xs tracking-[0.35em] text-gold-light/80 uppercase animate-pulse">
                  Tap Wax Seal to Open
                </p>
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="absolute w-6 h-6 border border-gold-bright/30 rounded-full animate-ping" />
                  <svg 
                    className="w-4 h-4 text-gold-bright animate-bounce" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {introState === 'opened' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
                className="pointer-events-auto mt-4"
              >
                <button
                  onClick={handleCardClick}
                  className="px-8 py-3 bg-gradient-to-r from-gold-deep via-gold to-gold-deep border border-gold-light text-maroon-dark font-heading text-sm tracking-[0.25em] font-semibold uppercase rounded-full shadow-[0_4px_20px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_30px_rgba(232,197,71,0.5)] active:scale-95 transition-all duration-300 pointer-events-auto cursor-pointer"
                >
                  Enter Celebration
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Credit / Decorative Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-center"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-2" />
          <p className="font-body text-[0.55rem] tracking-[0.5em] text-gold-light uppercase">
            Akash & Madhavi · 2026
          </p>
        </motion.div>

      </div>
    </div>
  )
}
