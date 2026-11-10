#!/usr/bin/env python3
"""Draw the academic portrait as a monochrome pixel illustration.

Usage (requires Pillow): python3 pixel-src/mono_portrait.py
Reads public/profile.jpeg (never modified) and writes two 176 x 237 images:
  public/pixel/portrait-mono-light.png   ink on a transparent background, for the light theme
  public/pixel/portrait-mono-dark.png    the same drawing in light ink, for the dark theme

There is no dithering, so the face has no scattered dots. Instead:
  - dark areas (hair, blazer) become solid ink;
  - facial features are traced where a pixel is clearly darker than its surroundings:
    strong contrast becomes ink, softer contrast a single flat mid tone;
  - small isolated specks of mid tone on the face are removed, since they read as blemishes.
The studio background is removed. Hovering the portrait on the site shows the original photo.
"""
from collections import Counter, deque
from PIL import Image, ImageFilter

SRC = 'public/profile.jpeg'
# Crop around the sitter in source pixels: left, top, right, bottom.
# components/mono-portrait.tsx lines the original photo up with this crop.
CROP = (88, 56, 456, 552)
WIDTH = 176

DARK = 70            # luminance below this is solid ink (hair, blazer)
RADIUS = 2.5         # neighbourhood for "darker than its surroundings"
INK_K, MID_K = 18, 7             # contrast needed for ink and for the mid tone
FACE_INK_K, FACE_MID_K = 20, 9   # the face asks for more, so only real features are drawn
MIN_SPECK = 6        # mid-tone clusters on the face smaller than this are dropped

INK, MID, PAPER = 0, 1, 2
THEMES = {
    # Light theme: ink is the page's text colour; paper is the page itself.
    'portrait-mono-light.png': {INK: (14, 25, 28), MID: (143, 158, 161), PAPER: None, 'rim': None},
    # Dark theme keeps the picture positive: light areas are drawn in light ink and dark
    # areas fall back to the page, with a 1px rim tracing the silhouette.
    'portrait-mono-dark.png': {INK: None, MID: (84, 104, 109), PAPER: (214, 223, 225), 'rim': (143, 162, 166)},
}

# The background is near white (251-255) but the shirt reaches 253, so the chest is fenced
# off from the flood fill. Bright fringe pixels next to the background also count as background.
BG_WHITE, FRINGE, GROW = 250, 196, 6
CHEST = (120, 225, 232, 496)


def figure_mask(img):
    w, h = img.size
    px = img.load()
    bg = [[False] * w for _ in range(h)]
    inside = lambda x, y: CHEST[0] <= x < CHEST[2] and CHEST[1] <= y < CHEST[3]
    q = deque([(x, 0) for x in range(w)] + [(x, y) for y in range(h) for x in (0, w - 1)])
    while q:
        x, y = q.popleft()
        if not (0 <= x < w and 0 <= y < h) or bg[y][x] or min(px[x, y]) < BG_WHITE or inside(x, y):
            continue
        bg[y][x] = True
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    for _ in range(GROW):
        grow = [(x, y) for y in range(h) for x in range(w)
                if not bg[y][x] and min(px[x, y]) >= FRINGE and not inside(x, y)
                and any(0 <= a < w and 0 <= b < h and bg[b][a] for a, b in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))]
        for x, y in grow:
            bg[y][x] = True
    mask = Image.new('L', (w, h))
    mask.putdata([0 if bg[y][x] else 255 for y in range(h) for x in range(w)])
    return mask


def skin_mask(img):
    """Rough skin detector, used only to apply the gentler face thresholds."""
    w, h = img.size
    px = img.load()
    mask = Image.new('L', (w, h))
    mask.putdata([255 if (r > 95 and r > g > b and r - b > 28 and max(r, g, b) < 250) else 0
                  for y in range(h) for x in range(w) for r, g, b in [px[x, y]]])
    return mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(3))


def majority(levels, opaque, w, h, passes=2):
    """Replace a pixel with the clear majority of its 3x3 neighbourhood. Smooths jagged edges."""
    for _ in range(passes):
        out = [row[:] for row in levels]
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                if not opaque[y][x]:
                    continue
                n = Counter(levels[b][a] for a in (x - 1, x, x + 1) for b in (y - 1, y, y + 1) if opaque[b][a])
                value, count = n.most_common(1)[0]
                if levels[y][x] != value and count >= 5:
                    out[y][x] = value
        levels = out
    return levels


def drop_specks(levels, face, w, h):
    seen = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if levels[y][x] != MID or seen[y][x]:
                continue
            stack, comp = [(x, y)], []
            seen[y][x] = True
            while stack:
                a, b = stack.pop()
                comp.append((a, b))
                for na, nb in ((a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)):
                    if 0 <= na < w and 0 <= nb < h and not seen[nb][na] and levels[nb][na] == MID:
                        seen[nb][na] = True
                        stack.append((na, nb))
            if len(comp) < MIN_SPECK and all(face[b][a] for a, b in comp):
                for a, b in comp:
                    levels[b][a] = PAPER
    return levels


def main():
    photo = Image.open(SRC).convert('RGB').crop(CROP)
    height = round(WIDTH * photo.height / photo.width)
    lum = photo.convert('L').filter(ImageFilter.MedianFilter(5)).resize((WIDTH, height), Image.BOX)
    fig = figure_mask(photo).resize((WIDTH, height), Image.BOX)
    skin = skin_mask(photo).resize((WIDTH, height), Image.BOX)
    opaque = [[fig.getpixel((x, y)) >= 128 for x in range(WIDTH)] for y in range(height)]
    face = [[skin.getpixel((x, y)) >= 128 and opaque[y][x] for x in range(WIDTH)] for y in range(height)]
    blur = lum.filter(ImageFilter.GaussianBlur(RADIUS))

    levels = []
    for y in range(height):
        row = []
        for x in range(WIDTH):
            if not opaque[y][x]:
                row.append(-1)
                continue
            v = lum.getpixel((x, y))
            contrast = blur.getpixel((x, y)) - v
            ink_k, mid_k = (FACE_INK_K, FACE_MID_K) if face[y][x] else (INK_K, MID_K)
            row.append(INK if v < DARK or contrast > ink_k else MID if contrast > mid_k else PAPER)
        levels.append(row)
    levels = drop_specks(majority(levels, opaque, WIDTH, height), face, WIDTH, height)

    for name, theme in THEMES.items():
        out = Image.new('RGBA', (WIDTH, height), (0, 0, 0, 0))
        for y in range(height):
            for x in range(WIDTH):
                if not opaque[y][x]:
                    continue
                colour = theme[levels[y][x]]
                edge = y < height - 1 and any(not (0 <= a < WIDTH and 0 <= b < height) or not opaque[b][a]
                                              for a, b in ((x - 1, y), (x + 1, y), (x, y - 1)))
                if theme['rim'] and edge:
                    colour = theme['rim']
                if colour:
                    out.putpixel((x, y), (*colour, 255))
        out.save(f'public/pixel/{name}', optimize=True)
        print(f'public/pixel/{name}', out.size)


if __name__ == '__main__':
    main()
