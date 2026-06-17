import { motion } from 'framer-motion'
import type { WeddingEvent } from '../data/wedding'

const ceremonyTone = {
  mehndi: {
    tag: 'Henna night',
    accent: 'text-maroon',
    wash: 'from-maroon/82',
  },
  haldi: {
    tag: 'Sacred ritual',
    accent: 'text-gold-deep',
    wash: 'from-gold/82',
  },
  wedding: {
    tag: 'The ceremony',
    accent: 'text-maroon-rich',
    wash: 'from-blush/86',
  },
} as const

type EventCardProps = {
  event: WeddingEvent
  index: number
}

export function EventCard({ event, index }: EventCardProps) {
  const tone = ceremonyTone[event.icon]

  return (
    <motion.article
      initial={{ opacity: 0, y: 48, scale: 0.95, rotate: index % 2 ? -1.2 : 1.2 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-gold/35 bg-ivory shadow-[0_22px_60px_rgba(52,23,22,0.12)] transition duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-[0_28px_82px_rgba(52,23,22,0.18)]"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="relative h-72 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-[1.6s] group-hover:scale-105 motion-safe:animate-[image-breathe_9s_ease-in-out_infinite]"
          style={{ backgroundImage: `url(${event.backgroundImage})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${tone.wash} via-transparent to-maroon-dark/8 opacity-75`} />
        <div className="absolute inset-4 rounded-[1.25rem] border border-ivory/35" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <span className="font-body rounded-full bg-ivory/88 px-4 py-2 text-[0.58rem] tracking-[0.28em] text-maroon-dark uppercase shadow-sm backdrop-blur">
            {tone.tag}
          </span>
          <span className="font-heading text-6xl leading-none text-ivory drop-shadow-md">
            0{index + 1}
          </span>
        </div>
      </div>

      <div className="relative p-7 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gold/35" />
          <span className="h-2 w-2 rotate-45 bg-gold" />
          <span className="h-px flex-1 bg-gold/35" />
        </div>

        <p className="font-body text-[0.68rem] tracking-[0.26em] text-gold-deep uppercase">
          {event.displayDate}
        </p>

        <div className="mt-4 min-h-[8.25rem]">
          <h3 className="font-heading text-[2.65rem] font-light leading-none text-maroon-dark">
            {event.title}
          </h3>
          <p className={`font-hindi mt-2 text-xl ${tone.accent}`}>{event.titleHindi}</p>
          <p className="font-body mt-5 text-base leading-7 text-maroon-dark/74">
            {event.subtitle}
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl bg-champagne/28 p-5 ring-1 ring-gold/20">
          {[
            ['Time', event.time],
            ['Venue', event.venue],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[4.5rem_1fr] gap-4 text-sm">
              <span className="font-body tracking-[0.18em] text-gold-deep uppercase">
                {label}
              </span>
              <span className="font-body leading-6 text-maroon-dark/82">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  )
}
