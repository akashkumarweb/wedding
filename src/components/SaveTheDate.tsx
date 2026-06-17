import { Section } from './Section'
import { OptimizedImage } from './OptimizedImage'
import { SectionHeading } from './ui/SectionHeading'
import { couple } from '../data/wedding'

export function SaveTheDate() {
  return (
    <Section
      id="save-the-date"
      className="boho-paper relative overflow-hidden bg-gradient-to-b from-linen via-ivory to-champagne/45 py-28 md:py-36"
    >
      <SectionHeading
        title="Save the Date"
        subtitle="We joyfully invite you to celebrate with us"
        hindi="आप सादर आमंत्रित हैं"
        dividerLabel="3 — 5 July 2026"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="hover-glow-gold relative mt-12 overflow-hidden rounded-[2rem] border border-gold/45 shadow-[0_24px_80px_rgba(52,23,22,0.16)]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-maroon-dark/88 via-maroon/32 to-transparent" />
          <div className="relative aspect-[4/5] md:aspect-[21/10]">
            <OptimizedImage
              src="/assets/boho-hero.jpg"
              alt="Boho Hindu wedding decor"
              className="h-full w-full scale-105 object-cover transition-transform duration-[2s] hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end px-6 pb-12 text-center text-ivory md:pb-16">
            <p className="font-body text-[0.65rem] tracking-[0.5em] text-gold-light uppercase">
              The union of
            </p>
            <h2 className="font-display mt-3 text-5xl text-champagne md:text-7xl lg:text-8xl">
              {couple.groom} & {couple.bride}
            </h2>
            <p className="font-heading mt-6 text-xl font-light md:text-3xl">3 — 5 July 2026</p>
            <ul className="font-body mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs tracking-widest uppercase md:text-sm">
              <li>3 Jul · Mehndi</li>
              <li className="text-gold">◆</li>
              <li>4 Jul · Haldi & Matkor</li>
              <li className="text-gold">◆</li>
              <li>5 Jul · Wedding</li>
            </ul>
          </div>
          <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-gold-light/40" />
        </div>
      </div>
    </Section>
  )
}
