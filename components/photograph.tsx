'use client';

import { Expand, X } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type PhotographProps = {
  photo: { id: string; title: string; src: string; width: number; height: number; alt: string; layout: string };
  number: number;
  total: number;
};

export function Photograph({ photo, number, total }: PhotographProps) {
  return (
    <figure id={photo.id} className={`photograph photograph-${photo.layout}`}>
      <Dialog>
        <DialogTrigger className="photo-trigger" aria-label={`View ${photo.title} enlarged`}>
          <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt}
            loading={number === 1 ? 'eager' : 'lazy'} fetchPriority={number === 1 ? 'high' : 'auto'} decoding="async" />
          <span className="photo-expand" aria-hidden="true"><Expand size={15} /> View photograph</span>
        </DialogTrigger>
        <DialogContent className="photo-dialog" showCloseButton={false}>
          <div className="photo-dialog-heading">
            <DialogTitle>{photo.title}</DialogTitle>
            <DialogClose render={<Button variant="ghost" size="icon" aria-label="Close photograph" />}><X size={19} /></DialogClose>
          </div>
          <img className="photo-enlarged" src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} />
          <DialogDescription className="photo-dialog-caption">Photograph {String(number).padStart(2, '0')} / {String(total).padStart(2, '0')} · Chenjia Zhang</DialogDescription>
        </DialogContent>
      </Dialog>
      <figcaption><span className="photo-caption-title">{photo.title}</span><span className="photo-index">{String(number).padStart(2, '0')} / {String(total).padStart(2, '0')}</span></figcaption>
    </figure>
  );
}
