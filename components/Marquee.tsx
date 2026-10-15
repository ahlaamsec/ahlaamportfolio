export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
  return (
    <div className="marquee">
      <div className="marquee__track">{row(false)}{row(true)}</div>
    </div>
  );
}
