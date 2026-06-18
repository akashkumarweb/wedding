import { couple, venue, weddingVenue } from '../data/wedding'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/25 bg-maroon-dark px-4 py-12 text-maroon-dark md:px-8">
      <img
        src="/assets/boho-wedding.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,247,234,0.78),rgba(255,243,234,0.58)_34%,rgba(247,223,216,0.44)_62%,rgba(76,69,45,0.18)),linear-gradient(180deg,rgba(255,247,234,0.36),rgba(216,208,164,0.34))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/65 to-transparent" />

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="font-body text-[0.62rem] tracking-[0.34em] text-sage-dark/70 uppercase">
            With love and gratitude
          </p>
          <p className="font-display text-6xl leading-none text-maroon md:text-7xl">
            {couple.groom} & {couple.bride}
          </p>
          <div className="h-px w-28 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="font-heading text-xl text-sage-dark md:text-2xl">3-5 July 2026</p>

          <div className="flex flex-col items-center gap-2 text-sm leading-6 text-maroon-dark/62 md:flex-row md:gap-4">
            <a
              href={venue.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-gold-deep"
            >
              {venue.name}
            </a>
            <span className="hidden h-1 w-1 rounded-full bg-gold md:block" />
            <a
              href={weddingVenue.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-gold-deep"
            >
              {weddingVenue.name}
            </a>
          </div>

          <p className="pt-3 text-xs tracking-[0.18em] text-sage-dark/55 uppercase">
            Made for {couple.groom} & {couple.bride}
          </p>
        </div>
      </div>
    </footer>
  )
}
