import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { weddingDate } from '../data/wedding'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function Countdown() {
  const target = useMemo(() => new Date(`${weddingDate}T09:00:00`), [])
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => getTimeLeft(target))

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!timeLeft) return null

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-5">
      {units.map((u, i) => (
        <motion.div
          key={u.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.8 }}
          className="glass-luxury hover-glow-gold relative min-w-[5rem] overflow-hidden rounded-2xl px-5 py-6 text-center md:min-w-[6.5rem] md:px-6 md:py-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <span className="font-heading block text-4xl font-light text-maroon md:text-5xl">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="font-body mt-2 block text-[0.6rem] tracking-[0.35em] text-gold-deep uppercase">
            {u.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
