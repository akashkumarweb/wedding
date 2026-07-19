import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { couple } from '../data/wedding'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#save-the-date', label: 'Invitation' },
  { href: '#events', label: 'Events' },
  { href: '#venue', label: 'Venue' },
  { href: '/gallery', label: 'Gallery' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-700 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div
        className={`mx-4 rounded-full border transition-all duration-700 md:mx-8 ${
          scrolled
            ? 'glass-luxury border-sage/25 shadow-lg'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="flex max-w-6xl items-center justify-between px-5 py-3 md:mx-auto md:px-8">
          <a href="#home" className="group flex flex-col">
            <span className="font-display text-2xl text-maroon-dark transition-colors group-hover:text-sage-dark md:text-3xl">
              {couple.groom}
              <span className="text-gold-deep"> & </span>
              {couple.bride}
            </span>
            <span className="font-body text-[0.55rem] tracking-[0.35em] text-sage-dark/65 uppercase">
              July 2026
            </span>
          </a>

          <ul className="hidden gap-1 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group font-body relative px-4 py-2 text-[0.65rem] tracking-[0.2em] text-maroon-dark/75 uppercase transition-colors hover:text-sage-dark"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-sage transition-all duration-500 group-hover:w-3/4" />
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <span className={`h-px w-6 bg-maroon transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-px w-6 bg-maroon transition ${open ? 'opacity-0' : ''}`} />
            <span className={`h-px w-6 bg-maroon transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-luxury mx-4 mt-2 rounded-2xl border border-gold/30 p-6 md:hidden"
          >
            <ul className="flex flex-col gap-4">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body block text-sm tracking-[0.25em] text-maroon uppercase"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
