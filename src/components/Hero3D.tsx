import { motion } from 'framer-motion'
import { couple, weddingDate } from '../data/wedding'
import { LuxuryDivider } from './ui/LuxuryDivider'

export function Hero3D() {
  const weddingDisplay = new Date(weddingDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header
      id="home"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-maroon-dark"
    >
      <div className="absolute inset-0 bg-[url('/assets/boho-hero.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(52,23,22,0.7),rgba(255,247,234,0.5)_38%,rgba(255,247,234,0.78)_50%,rgba(255,247,234,0.48)_64%,rgba(52,23,22,0.56))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,247,234,0.42),rgba(255,247,234,0.08)_42%,rgba(52,23,22,0.34)_100%)]" />
      <div className="absolute top-[16%] left-5 h-24 w-24 rounded-full border border-gold/30 mobile-orbit md:left-[12%]" />
      <div className="absolute right-6 bottom-[18%] h-16 w-16 rotate-45 border border-maroon/20 float-soft-delayed md:right-[14%]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-linen to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full max-w-5xl flex-col items-center px-5 pt-28 pb-32 text-center"
      >
        <p className="font-hindi mb-5 text-xl text-maroon md:text-2xl">शुभ विवाह</p>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.22, duration: 0.8 }}
          className="font-body mb-6 text-[0.68rem] tracking-[0.48em] text-gold-deep uppercase"
        >
          The wedding celebration of
        </motion.p>

        <h1 className="font-heading text-6xl font-light leading-none text-maroon-dark drop-shadow-sm md:text-8xl lg:text-[7.25rem]">
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {couple.groom}
          </motion.span>
          <span className="font-display my-1 block text-6xl leading-none text-gold-deep md:text-7xl">
            &
          </span>
          <motion.span
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {couple.bride}
          </motion.span>
        </h1>

        <div className="mt-9 w-full max-w-sm">
          <LuxuryDivider label="Save the date" />
        </div>

        <p className="font-heading mt-7 text-2xl font-light italic text-maroon-dark md:text-3xl">
          {weddingDisplay}
        </p>

        <p className="font-body mt-4 max-w-xl text-sm leading-7 tracking-[0.18em] text-maroon/85 uppercase md:text-base">
          Mehndi · Haldi · Vivah
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#events"
            className="font-body rounded-full bg-maroon px-9 py-4 text-xs tracking-[0.28em] text-ivory uppercase shadow-[0_18px_40px_rgba(52,23,22,0.22)] transition hover:bg-maroon-dark"
          >
            View Events
          </a>
        </div>
      </motion.div>

      <a
        href="#save-the-date"
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-sage-dark/70"
        aria-label="Scroll to save the date"
      >
        <span className="font-body text-[0.6rem] tracking-[0.4em] uppercase">Discover</span>
        <span className="scroll-line block h-12 w-px origin-top bg-gradient-to-b from-sage to-transparent" />
      </a>
    </header>
  )
}
