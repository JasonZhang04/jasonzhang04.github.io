import { PixelIcon } from '@/components/pixel-icon';

import type { Photo } from '@/lib/photography';

type PhotographProps = { photo: Photo; number: number; total: number; sizes?: string };

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The trigger is an ordinary link to the original file, so it still works without
 * JavaScript. public/js/site.js upgrades it to open a native modal dialog.
 */
export function Photograph({ photo, number, total, sizes = '(max-width: 760px) 100vw, 1120px' }: PhotographProps) {
  const dialogId = `photo-dialog-${photo.id}`;
  return (
    <figure id={photo.id} className={`photograph photograph-${photo.layout}`} style={{ '--ratio': photo.width / photo.height } as React.CSSProperties}>
      <a className="photo-trigger" href={photo.src} data-photo-dialog={dialogId} aria-label={`View ${photo.title} enlarged`}>
        <img
          src={photo.src}
          srcSet={photo.small ? `${photo.small} 800w, ${photo.src} ${photo.width}w` : undefined}
          sizes={photo.small ? sizes : undefined}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading={number === 1 ? 'eager' : 'lazy'}
          fetchPriority={number === 1 ? 'high' : 'auto'}
          decoding="async"
        />
        <span className="photo-expand" aria-hidden="true"><PixelIcon name="expand" /> View photograph</span>
      </a>
      <figcaption>
        <span className="photo-caption-title">{photo.title}</span>
        <span className="photo-index">{pad(number)} / {pad(total)}</span>
      </figcaption>
      <dialog id={dialogId} className="photo-dialog" aria-label={photo.title}>
        <div className="photo-dialog-heading">
          <span className="photo-dialog-title">{photo.title}</span>
          <form method="dialog"><button className="icon-button" aria-label="Close photograph"><PixelIcon name="close" /></button></form>
        </div>
        <img className="photo-enlarged" src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" />
        <p className="photo-dialog-caption">Photograph {pad(number)} / {pad(total)} · Chenjia Zhang</p>
      </dialog>
    </figure>
  );
}
