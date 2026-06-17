import { events } from '../data/wedding'
import { motion } from 'framer-motion'

export function Timeline() {
  return (
    <div className="relative mt-16">
      <div className="absolute top-0 bottom-0 left-[1.125rem] w-px bg-gradient-to-b from-transparent via-gold to-transparent md:left-1/2 md:-translate-x-px" />

      <ol className="space-y-16 md:space-y-24">
        {events.map((event, index) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`relative md:flex md:w-full md:items-center ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className="absolute left-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold bg-ivory shadow-[0_0_24px_rgba(201,162,39,0.45)] md:left-1/2 md:-translate-x-1/2">
              <span className="font-body text-[0.55rem] font-semibold text-maroon">
                {index + 1}
              </span>
            </div>

            <div
              className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
              }`}
            >
              <div className="glass-luxury hover-glow-gold rounded-2xl p-6 md:p-8">
                <time className="font-body text-[0.65rem] tracking-[0.3em] text-gold uppercase">
                  {event.displayDate}
                </time>
                <h3 className="font-heading mt-2 text-2xl font-light text-maroon md:text-3xl">
                  {event.title}
                </h3>
                <p className="font-hindi text-base text-maroon-rich/70">{event.titleHindi}</p>
                <p className="font-body mt-3 text-sm leading-relaxed text-maroon/70">
                  {event.subtitle}
                </p>
              </div>
            </div>

            <div className="hidden md:block md:w-[calc(50%-2rem)]" />
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
