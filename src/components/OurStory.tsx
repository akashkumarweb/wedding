import { motion } from 'framer-motion'
import { story } from '../data/wedding'
import { OptimizedImage } from './OptimizedImage'
import { Section } from './Section'
import { SectionHeading } from './ui/SectionHeading'

export function OurStory() {
  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-ivory via-blush/25 to-linen py-20 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 56, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-2 lg:order-1"
        >
          <div className="hover-glow-gold relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-gold/35 bg-ivory shadow-[0_28px_80px_rgba(52,23,22,0.17)]">
            <OptimizedImage
              src="/assets/boho-wedding.jpg"
              alt="Indian Hindu wedding ceremony with mandap, flowers, and sacred fire"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/62 via-transparent to-transparent" />
            <div className="absolute right-5 bottom-5 left-5 rounded-[1.25rem] border border-ivory/35 bg-ivory/14 p-5 text-ivory backdrop-blur-sm">
              <p className="font-body text-[0.62rem] tracking-[0.3em] text-gold-light uppercase">
                Bride & groom moment
              </p>
              <p className="font-heading mt-2 text-3xl leading-none">A sacred beginning</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2"
        >
          <SectionHeading title={story.heading} hindi="हमारी कहानी" align="left" />
          {story.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: 0.18 + i * 0.14, duration: 0.85 }}
              className="font-body mt-6 text-lg leading-[1.85] text-maroon/80 first:mt-10"
            >
              {p}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
