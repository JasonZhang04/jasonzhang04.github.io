#!/usr/bin/env python3
"""Compose public/og.png: name, research line, portrait sprite and a crop of the night lab.

Usage (requires Pillow, fonttools, brotli): python3 pixel-src/make_og.py
Run after `npm run pixel`. Uses only the fonts in public/fonts.
"""
import io
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (0x0E, 0x19, 0x1C)
TEXT = (0xE4, 0xEA, 0xEB)
MUTED = (0x8F, 0xA2, 0xA6)
ACCENT = (0x59, 0xC0, 0xCA)


def font(path, size, variation=None):
    f = TTFont(path)
    f.flavor = None
    buf = io.BytesIO()
    f.save(buf)
    buf.seek(0)
    pil = ImageFont.truetype(buf, size)
    if variation:
        pil.set_variation_by_axes(variation)
    return pil


def main():
    card = Image.new('RGB', (W, H), BG)
    # The room dissolves into the card background: same colour as the vignette edge.
    scene = Image.open('public/pixel/night-lab.png').convert('RGB')
    k = 4
    room = scene.resize((scene.width * k, scene.height * k), Image.NEAREST)
    card.paste(room, (W - room.width + 24, (H - room.height) // 2))

    # Keep type on an unbroken field to the left.
    draw = ImageDraw.Draw(card)
    # 3px pixel cell: font size is 3 / 0.038 so every glyph edge lands on a whole pixel.
    pixel = font('public/fonts/GeistPixel-Square.woff2', 3 / 0.038)
    draw.fontmode = '1'
    draw.text((64, 120), 'Chenjia', font=pixel, fill=TEXT)
    draw.text((64, 204), 'Zhang', font=pixel, fill=TEXT)
    draw.fontmode = 'L'
    sans = font('public/fonts/Geist-Variable.woff2', 25, [400])
    mono = font('public/fonts/GeistMono-Variable.woff2', 18, [400])
    draw.text((66, 316), 'Machine learning for healthcare', font=sans, fill=TEXT)
    draw.text((66, 350), 'Multi-agent systems', font=sans, fill=TEXT)
    draw.text((66, 408), 'JOHNS HOPKINS UNIVERSITY', font=mono, fill=ACCENT)

    # Portrait sprite at integer scale, standing on the lower edge of the card.
    sprite = Image.open('public/pixel/portrait.png').convert('RGBA').crop((0, 32, 32, 64))
    big = sprite.resize((32 * 4, 32 * 4), Image.NEAREST)
    card.paste(big, (66, H - big.height), big)

    card = card.convert('P', palette=Image.ADAPTIVE, colors=64)
    card.save('public/og.png', optimize=True)
    print('public/og.png', W, H)


if __name__ == '__main__':
    main()
