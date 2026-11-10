export function SectionHeading({ label, title, note, id }: { label: string; title: string; note?: string; id?: string }) {
  return (
    <header className="section-heading">
      <p className="meta-label">{label}</p>
      <div className="section-heading-row">
        <h2 id={id}>{title}</h2>
        {note && <span className="section-note">{note}</span>}
      </div>
    </header>
  );
}
