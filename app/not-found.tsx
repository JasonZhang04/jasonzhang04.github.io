import { SiteHeader } from '@/components/site-header';
import { PixelIcon } from '@/components/pixel-icon';

export default function NotFound() {
  return <>
    <SiteHeader offHome />
    <main className="not-found wide">
      <p className="meta-label">404</p>
      <h1>Page not found</h1>
      <p>This page could not be found.</p>
      <a className="text-link" href="/"><PixelIcon name="arrow-left" /> Back to the academic profile</a>
    </main>
  </>;
}
