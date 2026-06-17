import { motion } from 'framer-motion'
import { LuxuryDivider } from './LuxuryDivider'

type SectionHeadingProps = {
  title: string
  subtitle?: string
  hindi?: string
  align?: 'center' | 'left'
  dividerLabel?: string
  light?: boolean
}

export function SectionHeading({
  title,
  subtitle,
  hindi,
  align = 'center',
  dividerLabel,
  light = false,
}: SectionHeadingProps) {
  const text = light ? 'text-ivory' : 'text-maroon'
  const sub = light ? 'text-ivory/75' : 'text-maroon/65'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={align === 'center' ? 'text-center' : 'text-left'}
    >
      {hindi && (
        <p className={`font-hindi mb-2 text-lg ${light ? 'text-gold-light/90' : 'text-gold-deep'}`}>
          {hindi}
        </p>
      )}
      <h2
        className={`font-heading text-4xl font-light tracking-tight md:text-6xl lg:text-7xl ${text}`}
      >
        <span className={light ? 'text-gold-light' : 'text-gold-shimmer'}>{title}</span>
      </h2>
      {subtitle && (
        <p className={`font-body mt-4 max-w-2xl text-base tracking-wide md:text-lg ${sub} ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
      {dividerLabel && <LuxuryDivider label={dividerLabel} />}
    </motion.div>
  )
}
