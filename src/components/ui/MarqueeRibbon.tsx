const items = [
  'Akash & Madhavi',
  'शुभ विवाह',
  '3 July Mehndi',
  '4 July Haldi',
  '5 July Wedding',
  'With love',
]

export function MarqueeRibbon() {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-gold/25 bg-sage-dark py-3">
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {doubled.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="font-body text-xs tracking-[0.4em] text-ivory/90 uppercase"
          >
            {text}
            <span className="mx-6 text-gold-light">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
