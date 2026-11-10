import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PixelIcon } from '@/components/pixel-icon';
import { Photograph } from '@/components/photograph';
import { photographs, type Photo } from '@/lib/photography';

import { absolute } from '@/lib/site';
export const metadata: Metadata = {
  title: 'Photography | Chenjia Zhang',
  description: 'A selection of photographs by Chenjia Zhang, including Noir, Forever Hoop, Kyoto Time, Dusk, and Shenandoah.',
  openGraph: {
    title: 'Photography | Chenjia Zhang',
    description: 'A selection of photographs by Chenjia Zhang.',
    url: absolute('/photography/'), type: 'website',
    images: [{ url: absolute(photographs[0].src), width: photographs[0].width, height: photographs[0].height, alt: photographs[0].alt }],
  },
  twitter: {
    card: 'summary_large_image', title: 'Photography | Chenjia Zhang',
    description: 'A selection of photographs by Chenjia Zhang.',
    images: [absolute(photographs[0].src)],
  },
};

/** Consecutive `pair` photographs share one row. */
function rows(list: Photo[]) {
  const out: Photo[][] = [];
  list.forEach((p) => {
    const last = out[out.length - 1];
    if (p.layout === 'pair' && last && last[0].layout === 'pair' && last.length < 2) last.push(p);
    else out.push([p]);
  });
  return out;
}

export default function PhotographyPage() {
  return <>
    <a className="skip-link" href="#photography-main">Skip to photographs</a>
    <SiteHeader photography />
    <main id="photography-main" className="gallery wide">
      <section className="gallery-intro" aria-labelledby="photography-title">
        <div>
          <p className="meta-label">Beyond research / Selected photographs</p>
          <h1 id="photography-title">Photography<span className="accent">.</span></h1>
          <p className="gallery-subtitle">Light, place, and the spaces between.</p>
        </div>
        <div className="gallery-note">
          <p>Photographs by Chenjia Zhang<br />Mostly black &amp; white, some color</p>
          <a className="text-link" href="#noir">View the collection <PixelIcon name="arrow-down" /></a>
        </div>
      </section>
      <div className="gallery-collection" aria-label="Selected photographs">
        {rows(photographs).map((row) => row.length === 2
          ? (
            <div className="photo-pair" key={row[0].id}>
              {row.map((photo) => (
                <Photograph key={photo.id} photo={photo} number={photographs.indexOf(photo) + 1} total={photographs.length} sizes="(max-width: 760px) 100vw, 560px" />
              ))}
            </div>
          )
          : <Photograph key={row[0].id} photo={row[0]} number={photographs.indexOf(row[0]) + 1} total={photographs.length} />)}
      </div>
      <section className="gallery-end">
        <p className="meta-label">End of this collection</p>
        <a className="text-link" href="/#beyond"><PixelIcon name="arrow-left" /> Back to the academic profile</a>
      </section>
    </main>
    <div className="wide"><SiteFooter note="© 2026 Chenjia Zhang · All photographs by me." /></div>
  </>;
}
