import { motion } from 'framer-motion'
import { venue, weddingVenue } from '../data/wedding'
import { Section } from './Section'
import { SectionHeading } from './ui/SectionHeading'

const venueCards = [
  {
    eyebrow: 'Mehndi · Haldi · Puja Matkor',
    venue,
    schedule: [
      ['Mehndi', '3 July 2026 · 4:00 PM'],
      ['Haldi', '4 July 2026 · 4:00 PM'],
      ['Puja Matkor', '4 July 2026 · 7:00 PM'],
    ],
  },
  {
    eyebrow: 'Wedding',
    venue: weddingVenue,
    schedule: [['Vivah', '5 July 2026 · Muhurat TBA']],
  },
] as const

export function Venue() {
  return (
    <Section
      id="venue"
      className="relative overflow-hidden bg-maroon py-24 text-ivory md:py-32"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(52,23,22,0.92),rgba(98,38,38,0.88)),url('/assets/boho-hero.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(219,203,151,0.2),transparent_58%)]" />
      <div className="absolute top-10 left-[7%] hidden h-48 w-48 rounded-full border border-gold/20 md:block float-soft" />
      <div className="absolute right-[8%] bottom-10 hidden h-28 w-28 rotate-45 border border-champagne/20 md:block float-soft-delayed" />

      <SectionHeading
        title="Venue"
        subtitle="Exact Google locations for each celebration"
        hindi="स्थान"
        light
        dividerLabel="Ceremony locations"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-14 grid gap-8 lg:grid-cols-2"
      >
        {venueCards.map((item, index) => (
          <motion.article
            key={item.venue.name}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[2rem] border border-gold/30 bg-ivory/95 p-3 text-maroon-dark shadow-[0_28px_90px_rgba(22,8,8,0.28)]"
          >
            <div className="p-5 md:p-6">
              <p className="font-body text-[0.64rem] tracking-[0.32em] text-gold-deep uppercase">
                {item.eyebrow}
              </p>
              <h3 className="font-heading mt-4 text-4xl leading-tight md:text-5xl">
                {item.venue.name}
              </h3>
              <p className="font-body mt-4 text-sm leading-7 text-maroon-dark/70">
                {item.venue.address}
              </p>

              <div className="mt-6 grid gap-3 rounded-2xl bg-champagne/30 p-5 ring-1 ring-gold/20">
                {item.schedule.map(([label, value], scheduleIndex) => (
                  <div
                    key={label}
                    className={
                      scheduleIndex === item.schedule.length - 1
                        ? 'flex items-start justify-between gap-5'
                        : 'flex items-start justify-between gap-5 border-b border-gold/20 pb-3'
                    }
                  >
                    <span className="font-body text-[0.65rem] tracking-[0.24em] text-gold-deep uppercase">
                      {label}
                    </span>
                    <span className="font-body text-right text-sm text-maroon-dark/82">{value}</span>
                  </div>
                ))}
              </div>

              <a
                href={item.venue.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body mt-6 inline-flex rounded-full bg-maroon px-6 py-3 text-[0.68rem] tracking-[0.24em] text-ivory uppercase transition-all hover:bg-maroon-dark hover:shadow-[0_16px_35px_rgba(98,38,38,0.25)]"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="hover-glow-gold overflow-hidden rounded-[1.5rem] border border-gold/30">
              <iframe
                title={`${item.venue.name} map`}
                src={item.venue.mapEmbed}
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  )
}
