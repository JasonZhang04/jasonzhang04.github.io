/**
 * About portrait: a monochrome pixel illustration of the academic photo, drawn by
 * pixel-src/mono_portrait.py in the theme's ink. Hovering, focusing or tapping it fades
 * to the original photograph.
 */
export function MonoPortrait() {
  return (
    <div
      className="mono-portrait"
      tabIndex={0}
      role="img"
      aria-label="Portrait of Chenjia Zhang in a dark blazer, white shirt and striped tie, drawn as a monochrome pixel illustration that fades to the original photograph on hover or focus."
    >
      <img className="portrait-art portrait-for-light" src="/pixel/portrait-mono-light.png" width={176} height={237} alt="" />
      <img className="portrait-art portrait-for-dark" src="/pixel/portrait-mono-dark.png" width={176} height={237} alt="" />
      <span className="portrait-photo" aria-hidden="true"><img src="/profile.jpeg" width={533} height={612} alt="" loading="lazy" /></span>
    </div>
  );
}
