import { events } from '../data/wedding'
import { Section } from './Section'
import { EventCard } from './EventCard'
import { SectionHeading } from './ui/SectionHeading'

export function EventCardsGrid() {
  return (
    <Section
      id="events"
      className="boho-paper relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-champagne/50 via-linen to-ivory py-20 md:py-28"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute top-14 right-[6%] h-48 w-48 rounded-full border border-maroon/10" />
      <div className="absolute bottom-20 left-[5%] h-32 w-32 rounded-full border border-gold/30" />

      <SectionHeading
        title="The Festivities"
        subtitle="A Pinterest-style guide to each ceremony, filled with Hindu wedding rituals, warm colour, and handcrafted details."
        hindi="उत्सव"
        dividerLabel="3 — 5 July 2026"
      />

      <div className="relative mt-16 grid gap-8 lg:grid-cols-3 lg:items-start">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={index === 1 ? 'lg:mt-12' : index === 2 ? 'lg:mt-24' : ''}
          >
            <EventCard event={event} index={index} />
          </div>
        ))}
      </div>
    </Section>
  )
}
