import { couple, venue, weddingVenue } from '../data/wedding'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/30 bg-maroon-dark px-4 py-14 text-ivory md:px-8 md:py-18">
      <div className="absolute inset-0 boho-paper opacity-10" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="absolute -top-20 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="font-body text-[0.68rem] tracking-[0.42em] text-gold-light/80 uppercase">
            With love and gratitude
          </p>
          <p className="font-display mt-4 text-6xl leading-none text-gold-light md:text-8xl">
            {couple.groom} & {couple.bride}
          </p>
          <div className="ornate-rule mt-7 max-w-sm md:mx-0 [&_span]:text-ivory/55">
            <span className="font-body">July 2026</span>
          </div>
          <p className="mt-7 max-w-xl text-sm leading-7 text-ivory/68">
            Thank you for joining our families for the Mehndi, Haldi, Puja Matkor and wedding
            celebrations.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-gold/25 bg-ivory/[0.07] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur">
          <p className="font-body text-[0.65rem] tracking-[0.32em] text-gold-light uppercase">
            Locations
          </p>
          <div className="mt-4 space-y-5">
            <div>
              <h3 className="font-heading text-3xl text-ivory">{venue.name}</h3>
              <p className="mt-2 text-sm leading-7 text-ivory/68">Mehndi, Haldi and Puja Matkor</p>
              <a
                href={venue.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body mt-3 inline-flex text-[0.65rem] tracking-[0.24em] text-gold-light uppercase transition hover:text-ivory"
              >
                See on Google Map
              </a>
            </div>
            <div className="border-t border-gold/20 pt-5">
              <h3 className="font-heading text-3xl text-ivory">{weddingVenue.name}</h3>
              <p className="mt-2 text-sm leading-7 text-ivory/68">Wedding ceremony</p>
              <a
                href={weddingVenue.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body mt-3 inline-flex text-[0.65rem] tracking-[0.24em] text-gold-light uppercase transition hover:text-ivory"
              >
                See on Google Map
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-6xl flex-col gap-4 border-t border-gold/20 pt-6 text-xs text-ivory/45 md:flex-row md:items-center md:justify-between">
        <span>Made for Akash & Madhavi</span>
      </div>
    </footer>
  )
}
