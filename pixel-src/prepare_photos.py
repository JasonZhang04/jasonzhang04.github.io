#!/usr/bin/env python3
"""Make web copies of gallery photographs.

Usage (requires Pillow): python3 pixel-src/prepare_photos.py

- Full-resolution originals live in photo-originals/ (git-ignored, never modified).
  Each becomes public/photos/<slug>.jpg (2000px long edge) and <slug>-800.jpg for phones,
  converted to sRGB with orientation applied. Prints the entry fields for lib/photography.ts.
- The four earlier photos in public/photo_*.jpeg are already web-sized; they get an
  800px phone copy alongside them.
"""
import glob
import io
import os
import re
import unicodedata
from PIL import Image, ImageCms, ImageOps

LARGE, SMALL = 2000, 800
SRGB = ImageCms.createProfile('sRGB')


def slugify(name):
    s = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def to_srgb(img):
    icc = img.info.get('icc_profile')
    img = ImageOps.exif_transpose(img)
    if icc:
        src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        img = ImageCms.profileToProfile(img.convert('RGB'), src, SRGB, outputMode='RGB')
    return img.convert('RGB')


def save(img, path, edge):
    w, h = img.size
    k = edge / max(w, h)
    out = img.resize((round(w * k), round(h * k)), Image.LANCZOS) if k < 1 else img
    out.save(path, quality=84, optimize=True, progressive=True)
    return out.size


for path in sorted(glob.glob('photo-originals/*.jp*g')):
    title = os.path.splitext(os.path.basename(path))[0]
    slug = slugify(title)
    img = to_srgb(Image.open(path))
    size = save(img, f'public/photos/{slug}.jpg', LARGE)
    save(img, f'public/photos/{slug}-800.jpg', SMALL)
    kb = os.path.getsize(f'public/photos/{slug}.jpg') // 1024
    print(f"{title!r}: id '{slug}', src '/photos/{slug}.jpg', small '/photos/{slug}-800.jpg', {size[0]} x {size[1]}, {kb} KB")

for path in sorted(glob.glob('public/photo_*.jpeg')):
    if path.endswith('_800.jpeg'):
        continue
    img = to_srgb(Image.open(path))
    save(img, path.replace('.jpeg', '_800.jpeg'), SMALL)
