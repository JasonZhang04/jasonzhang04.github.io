// The hero scene. The poster image and links are server-rendered, so the scene is
// complete without JavaScript. public/js/night-lab.js draws the live canvas on top.
const W = 180;
const H = 120;

const HOTSPOTS = [
  { href: '#research', label: 'Research', aria: 'ECG display: go to Research', rect: [10, 19, 58, 31] },
  { href: '#about', label: 'About', aria: 'Heart sign: go to About', rect: [94, 11, 28, 21] },
  { href: '#projects', label: 'Projects', aria: 'Lightbox on the shelf: go to Projects', rect: [90, 36, 25, 14] },
  { href: '#publications', label: 'Writing', aria: 'Binders on the shelf: go to Writing', rect: [91, 53, 24, 13] },
  { href: '#experience', label: 'Background', aria: 'Server rack: go to Education and experience', rect: [136, 32, 29, 62] },
] as const;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function NightLab({ caption }: { caption: string }) {
  return (
    <figure className="night-lab" data-night-lab suppressHydrationWarning>
      <div className="night-lab-stage">
        <img
          className="night-lab-poster"
          src="/pixel/night-lab.png"
          width={W}
          height={H}
          fetchPriority="high"
          alt="Pixel-art night scene of a small research lab: a figure typing at a desk under fluorescent tubes, a wall display showing an ECG trace, shelves with binders, a chest film on a lightbox and a heart model, a server rack with blinking lights, and small robots moving through the room."
        />
        <canvas className="night-lab-canvas" width={W} height={H} aria-hidden="true" />
        <nav className="night-lab-hotspots" aria-label="Scene shortcuts">
          {HOTSPOTS.map((h) => (
            <a
              key={h.href}
              className="hotspot"
              href={h.href}
              aria-label={h.aria}
              data-rect={h.rect.join(',')}
              style={{ left: pct(h.rect[0], W), top: pct(h.rect[1], H), width: pct(h.rect[2], W), height: pct(h.rect[3], H) }}
            >
              <span className="hotspot-label" aria-hidden="true">{h.label}</span>
            </a>
          ))}
        </nav>
        <button className="scene-hit scene-hit-avatar" type="button" aria-label="Avatar: say hello" data-avatar-hit suppressHydrationWarning />
        {[0, 1, 2].map((i) => (
          <button key={i} className="scene-hit scene-hit-agent" type="button" aria-label="Small robot: show a shortcut" data-agent-hit={i} suppressHydrationWarning />
        ))}
        <div className="scene-bubble" data-bubble aria-hidden="true" hidden suppressHydrationWarning />
        <div className="scene-bubble scene-bubble-link" data-link-bubble hidden suppressHydrationWarning />
      </div>
      <figcaption className="night-lab-caption">{caption}</figcaption>
    </figure>
  );
}
