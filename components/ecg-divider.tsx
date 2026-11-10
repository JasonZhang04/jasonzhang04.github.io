const BEAT = ['0', '0', '0', '-1', '-1', '0', '0', '0', '0', '1', '-2', '-6', '-9', '-3', '3', '1', '0', '0', '0', '-1', '-2', '-2', '-1', '0', '0', '0'].map(Number);
const HEIGHT = 14;
const BASE = 10;

function beatPath() {
  let d = '';
  let prev = BEAT[0];
  BEAT.forEach((v, x) => {
    const top = Math.min(prev, v);
    const bottom = Math.max(prev, v);
    d += `M${x} ${BASE + top}h1v${bottom - top + 1}h-1z`;
    prev = v;
  });
  return d;
}

/** Section divider: a flat trace with a single beat. Draws once when scrolled into view. */
export function EcgDivider({ at = 18 }: { at?: number }) {
  return (
    <div className="ecg-divider" aria-hidden="true" data-reveal suppressHydrationWarning>
      <span className="ecg-flat" style={{ flexGrow: at }} />
      <svg className="ecg-beat" viewBox={`0 0 ${BEAT.length} ${HEIGHT}`} shapeRendering="crispEdges">
        <path d={beatPath()} fill="currentColor" />
      </svg>
      <span className="ecg-flat" style={{ flexGrow: 100 - at }} />
    </div>
  );
}
