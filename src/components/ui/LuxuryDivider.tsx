export function LuxuryDivider({ label = 'Celebration' }: { label?: string }) {
  return (
    <div className="ornate-rule my-10 md:my-14">
      <span className="font-body">{label}</span>
    </div>
  )
}
