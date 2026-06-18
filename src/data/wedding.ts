export const couple = {
  groom: 'Akash',
  bride: 'Madhavi',
} as const

export const weddingDate = '2026-07-05'

export const contact = {
  email: 'akash.madhavi.wedding@example.com',
  phone: '+91 00000 00000',
  whatsapp: 'https://wa.me/910000000000',
}

export const rsvp = {
  label: 'RSVP',
  url: import.meta.env.VITE_RSVP_URL ?? '#rsvp',
  note: 'Kindly confirm your attendance by 15 June 2026',
}

export const venue = {
  name: 'Pushpanil Bhavan',
  address:
    'Phase 2, Gopal Nagar Rd, Machabollaram, Secunderabad, Telangana 500010, India',
  note: 'Mehndi, Haldi and Puja Matkor venue',
  mapEmbed:
    'https://www.google.com/maps?q=Pushpanil%20Bhavan%2C%20phase%202%2C%20Gopal%20Nagar%20Rd%2C%20Machabollaram%2C%20Secunderabad%2C%20Telangana%20500010%2C%20India&output=embed',
  directionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Pushpanil%20Bhavan%2C%20Phase%202%2C%20Gopal%20Nagar%20Rd%2C%20Machabollaram%2C%20Secunderabad%2C%20Telangana%20500010%2C%20India',
}

export const weddingVenue = {
  name: 'PSR Convention Center',
  address:
    'GFHQ+733, Kompally, NH 44, Opposite Asian Cineplanet Multiplex, Secunderabad, Telangana 500100, India',
  note: 'Wedding ceremony venue',
  mapEmbed:
    'https://www.google.com/maps?q=PSR%20Convention%20Center%2C%20GFHQ%2B733%2C%20Kompally%2C%20NH%2044%2C%20Opposite%20Asian%20Cineplanet%20Multiplex%2C%20Secunderabad%2C%20Telangana%20500100%2C%20India&output=embed',
  directionsUrl:
    'https://www.google.com/maps/search/?api=1&query=PSR%20Convention%20Center%2C%20GFHQ%2B733%2C%20Kompally%2C%20NH%2044%2C%20Opposite%20Asian%20Cineplanet%20Multiplex%2C%20Secunderabad%2C%20Telangana%20500100%2C%20India',
}

export type WeddingEvent = {
  id: string
  date: string
  displayDate: string
  title: string
  titleHindi: string
  subtitle: string
  time: string
  venue: string
  dressNote: string
  backgroundImage: string
  icon: 'mehndi' | 'haldi' | 'wedding'
}

export const events: WeddingEvent[] = [
  {
    id: 'mehndi',
    date: '2026-07-03',
    displayDate: 'Friday, 3 July 2026',
    title: 'Mehndi',
    titleHindi: 'मेहंदी',
    subtitle: 'An evening of henna, music, and celebration',
    time: '4:00 PM',
    venue: 'Pushpanil Bhavan',
    dressNote: 'Bright festive colours welcome',
    backgroundImage: '/assets/boho-mehndi.jpg',
    icon: 'mehndi',
  },
  {
    id: 'haldi',
    date: '2026-07-04',
    displayDate: 'Saturday, 4 July 2026',
    title: 'Haldi & Puja Matkor',
    titleHindi: 'हल्दी · पूजा मटकोर',
    subtitle: 'Sacred turmeric ceremony and Matkor rituals',
    time: 'Haldi at 4:00 PM · Puja Matkor at 7:00 PM',
    venue: 'Pushpanil Bhavan',
    dressNote: 'Traditional yellow or pastel attire',
    backgroundImage: '/assets/boho-haldi.jpg',
    icon: 'haldi',
  },
  {
    id: 'wedding',
    date: '2026-07-05',
    displayDate: 'Sunday, 5 July 2026',
    title: 'Wedding',
    titleHindi: 'विवाह',
    subtitle: 'Akash & Madhavi unite in matrimony',
    time: 'Ceremony — muhurat TBA',
    venue: 'PSR Convention Center',
    dressNote: 'Indian formal / traditional attire',
    backgroundImage: '/assets/boho-wedding.jpg',
    icon: 'wedding',
  },
]

export const galleryPlaceholders = [
  { id: 1, label: 'Engagement photo' },
  { id: 2, label: 'Pre-wedding' },
  { id: 3, label: 'Family moment' },
  { id: 4, label: 'Celebration' },
  { id: 5, label: 'Together' },
  { id: 6, label: 'Memories' },
]

export const story = {
  heading: 'Our Story',
  paragraphs: [
    'Two hearts, countless memories, and a promise to walk every path together.',
    'We invite you to witness the beginning of our forever — surrounded by the love of family and friends.',
  ],
}
