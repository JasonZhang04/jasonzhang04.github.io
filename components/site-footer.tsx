import { PixelIcon } from '@/components/pixel-icon';

export function SiteFooter({ note, top = '#top' }: { note: string; top?: string }) {
  return (
    <footer className="site-footer">
      <span>{note}</span>
      <a href={top}>Back to top <PixelIcon name="arrow-up" /></a>
    </footer>
  );
}
