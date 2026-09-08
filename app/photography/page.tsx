import type { Metadata } from 'next';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { Photograph } from '@/components/photograph';
import { photographs } from '@/lib/photography';

const origin = 'https://chenjia-zhang.jhu.chatgpt.site';
export const metadata: Metadata = {
  title: 'Photography | Chenjia Zhang',
  description: 'A selection of black-and-white photographs by Chenjia Zhang: Noir, Kyoto Time, Golden Age, and Shenandoah.',
  openGraph: {
    title: 'Photography | Chenjia Zhang',
    description: 'A selection of black-and-white photographs by Chenjia Zhang.',
    url: `${origin}/photography/`, type: 'website',
    images: [{ url: `${origin}${photographs[0].src}`, width: photographs[0].width, height: photographs[0].height, alt: photographs[0].alt }],
  },
  twitter: {
    card: 'summary_large_image', title: 'Photography | Chenjia Zhang',
    description: 'A selection of black-and-white photographs by Chenjia Zhang.',
    images: [`${origin}${photographs[0].src}`],
  },
};

export default function PhotographyPage() {
  return <>
    <a className="skip-link" href="#photography-main">Skip to photographs</a>
    <SiteHeader photography />
    <main id="photography-main" className="photography-page">
      <section className="photography-intro" aria-labelledby="photography-title">
        <div><p className="eyebrow">BEYOND RESEARCH / SELECTED PHOTOGRAPHS</p>
          <h1 id="photography-title">Photography<span className="photography-period">.</span></h1>
          <p className="photography-subtitle">Light, place, and the spaces between.</p>
        </div>
        <div className="photography-intro-note"><p>Photographs by Chenjia Zhang<br />A study in black & white</p>
          <a className="text-link" href="#noir">View the collection <ArrowDown size={14} aria-hidden="true" /></a>
        </div>
      </section>
      <div className="photography-collection" aria-label="Selected photographs">
        {photographs.map((photo, index) => <Photograph key={photo.id} photo={photo} number={index + 1} total={photographs.length} />)}
      </div>
      <section className="photography-end"><span className="end-mark" aria-hidden="true">—</span><p>End of this collection</p>
        <a className="text-link" href="/#beyond"><ArrowLeft size={14} aria-hidden="true" /> Back to the academic profile</a>
      </section>
      <footer><span>© 2026 Chenjia Zhang · All photographs by me.</span><a href="#photography-main">Back to top ↑</a></footer>
    </main>
  </>;
}
