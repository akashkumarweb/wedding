import { motion } from 'framer-motion'
import { contact, rsvp } from '../data/wedding'
import { Section } from './Section'
import { SectionHeading } from './ui/SectionHeading'

export function Rsvp() {
  return (
    <Section
      id="rsvp"
      className="relative overflow-hidden bg-gradient-to-b from-blush via-ivory to-sage-light/45 py-28 md:py-36"
    >
      <div className="relative mx-auto max-w-2xl text-center">
        <SectionHeading
          title="Kindly Respond"
          subtitle={rsvp.note}
          hindi="अनुमोदन"
        />

        <motion.a
          href={rsvp.url}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-body hover-glow-gold mt-12 inline-block rounded-full bg-sage-dark px-14 py-5 text-sm tracking-[0.3em] text-ivory uppercase shadow-xl"
        >
          {rsvp.label}
        </motion.a>

        <p className="font-body mt-10 text-sm text-maroon/65">
          Or message us on{' '}
          <a
            href={contact.whatsapp}
            className="border-b border-gold text-maroon transition-colors hover:text-gold-deep"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </Section>
  )
}
