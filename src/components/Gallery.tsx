import { motion } from 'framer-motion'
import { galleryPlaceholders } from '../data/wedding'
import { Section } from './Section'
import { SectionHeading } from './ui/SectionHeading'

export function Gallery() {
  return (
    <Section id="gallery" className="bg-ivory py-28 md:py-36">
      <SectionHeading
        title="Gallery"
        subtitle="Moments we hold close — yours to fill with memories"
        hindi="यादें"
      />

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {galleryPlaceholders.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.9 }}
            className={`hover-glow-gold group relative overflow-hidden rounded-2xl border border-gold/25 ${
              i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[320px]' : 'aspect-square'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blush-deep via-maroon/5 to-gold/10 transition-transform duration-700 group-hover:scale-105" />
            <div className="relative flex h-full min-h-[140px] flex-col items-center justify-center p-6">
              <span className="font-display text-5xl text-gold/30 transition-colors group-hover:text-gold/50">
                ♥
              </span>
              <p className="font-body mt-3 text-center text-[0.65rem] tracking-[0.25em] text-maroon/50 uppercase">
                {item.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
