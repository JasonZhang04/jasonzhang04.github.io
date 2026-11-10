import { profile } from '@/lib/profile';
import { PixelIcon } from '@/components/pixel-icon';

const LINKS = [
  ['About', '#about'],
  ['Research', '#research'],
  ['Writing', '#publications'],
  ['Projects', '#projects'],
  ['Background', '#experience'],
] as const;

export function SiteHeader({ photography = false, offHome = false }: { photography?: boolean; offHome?: boolean }) {
  const base = photography || offHome ? '/' : '';
  return (
    <header className="site-nav" data-site-nav suppressHydrationWarning>
      <div className="site-nav-inner">
        <a className="wordmark" href="/" aria-label={`${profile.name}, home`}>{profile.name}</a>
        <button className="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-nav-toggle suppressHydrationWarning>
          <PixelIcon name="menu" />
          <span>Menu</span>
        </button>
        <nav id="site-menu" className="site-menu" aria-label="Main navigation" suppressHydrationWarning>
          {LINKS.map(([label, hash]) => <a key={hash} href={`${base}${hash}`}>{label}</a>)}
          <a href="/photography/" aria-current={photography ? 'page' : undefined}>Photos</a>
          <a href={`${base}#contact`}>Contact</a>
        </nav>
        <button className="theme-toggle" type="button" data-theme-toggle aria-label="Switch color theme" suppressHydrationWarning>
          <PixelIcon name="tube-on" className="icon-when-dark" />
          <PixelIcon name="tube-off" className="icon-when-light" />
        </button>
      </div>
    </header>
  );
}
