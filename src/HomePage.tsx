'use client'

import { Navbar } from './components/Navbar'
import { Hero3D } from './components/Hero3D'
import { SaveTheDate } from './components/SaveTheDate'
import { EventCardsGrid } from './components/EventSections'
import { OurStory } from './components/OurStory'
import { Venue } from './components/Venue'
import { Footer } from './components/Footer'
import { GrainOverlay } from './components/ui/GrainOverlay'
import { MarqueeRibbon } from './components/ui/MarqueeRibbon'

export function HomePage() {
  return (
    <div>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero3D />
        <MarqueeRibbon />
        <SaveTheDate />
        <EventCardsGrid />
        <OurStory />
        <MarqueeRibbon />
        <Venue />
      </main>
      <Footer />
    </div>
  )
}
