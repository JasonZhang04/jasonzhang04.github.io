import { OBJECT_INDEX, OBJECT_COUNT, type ObjectName } from '@/lib/site-art';

/** One object from the sprite atlas. Hover animation is CSS only, so it needs no script. */
export function PixelObject({ name, label }: { name: ObjectName; label: string }) {
  return (
    <span
      className="pixel-object"
      role="img"
      aria-label={label}
      style={{ '--row': OBJECT_INDEX[name], '--atlas-count': OBJECT_COUNT } as React.CSSProperties}
    />
  );
}
