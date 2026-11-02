#!/usr/bin/env python3
"""Paints the site's images into static/img/: the aurora wallpaper, the display
picture and the project thumbnails. Run from the repo root: python3 tools/art.py
Sources are in tools/src. Everything here is generated, nothing is borrowed.
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = "static/img"
SRC = "tools/src"


def glow(img, radius):
    return np.asarray(Image.fromarray(np.uint8(np.clip(img, 0, 1) * 255)).filter(ImageFilter.GaussianBlur(radius)),
                      np.float32) / 255


def wallpaper(w=1920, h=1200, seed=2007):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = x / w, y / h

    # bright cyan-green at the top left down to deep teal-blue at the bottom right
    top = np.array([0.05, 0.78, 0.70])
    mid = np.array([0.02, 0.50, 0.62])
    low = np.array([0.02, 0.20, 0.45])
    t = np.clip(0.55 * v + 0.45 * u, 0, 1)[..., None]
    img = np.where(t < 0.5, top + (mid - top) * (t / 0.5), mid + (low - mid) * ((t - 0.5) / 0.5))

    for cx, cy, r, k in ((0.18, 0.12, 0.45, 0.25), (0.8, 0.3, 0.35, 0.15), (0.5, 0.95, 0.5, 0.18)):
        d = ((u - cx) / r) ** 2 + ((v - cy) / (r * 0.7)) ** 2
        img += np.exp(-d)[..., None] * k * np.array([0.3, 1.0, 0.95])

    # aurora ribbons: bundles of thin curves sweeping up from the bottom left
    ribbons = np.zeros((h, w), np.float32)
    for i in range(60):
        phase = rng.uniform(0, 6.28)
        amp = 0.18 + 0.004 * i
        base = 0.86 - 0.0028 * i
        curve = base - amp * np.sin(np.pi * u * 0.9 + 0.4) + 0.02 * np.sin(u * 7 + phase)
        width = 0.0012 + 0.0009 * rng.random()
        ribbons += np.exp(-((v - curve) / width) ** 2) * (0.10 + 0.05 * rng.random()) * np.clip(1.2 - u, 0, 1)
    ribbons = np.clip(ribbons, 0, 1.2)
    img += glow(ribbons, 6)[..., None] * np.array([0.4, 0.95, 1.0]) * 0.9
    img += ribbons[..., None] * np.array([0.7, 1.0, 1.0]) * 0.55

    curve = 0.98 - 0.3 * np.sin(np.pi * u * 0.85 + 0.2)
    band = np.exp(-((v - curve) / 0.012) ** 2)
    img += glow(band, 14)[..., None] * np.array([0.5, 0.95, 1.0]) * 0.8 + band[..., None] * 0.35

    # bokeh and sparkle dust
    dots = np.zeros((h, w), np.float32)
    for _ in range(70):
        cx, cy = rng.uniform(0, w), rng.uniform(0, h * 0.75)
        r = rng.uniform(6, 28)
        d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        dots += np.clip(1 - d / r, 0, 1) ** 0.6 * rng.uniform(0.04, 0.14)
    img += glow(dots, 2)[..., None] * np.array([0.7, 1.0, 1.0])
    dust = (rng.random((h, w)) > 0.9993).astype(np.float32) * rng.random((h, w))
    img += glow(dust, 1.2)[..., None] * 2.5 + dust[..., None] * 0.6

    Image.fromarray(np.uint8(np.clip(img, 0, 1) * 255)).save(
        os.path.join(OUT, "wallpaper.jpg"), quality=86, optimize=True, progressive=True)


def fit(img, w, h):
    s = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))


def pictures():
    fit(Image.open(os.path.join(SRC, "lattice.webp")).convert("RGB"), 240, 240).save(
        os.path.join(OUT, "dp.webp"), quality=85)
    for name, src, crop in (("saddle", "saddle.png", None), ("lattice", "lattice-wide.png", None),
                            ("gpu-node", "gpu-node.jpg", (0, 0.02, 0.8, 1))):
        img = Image.open(os.path.join(SRC, src)).convert("RGB")
        if crop:
            l, t, r, b = crop
            img = img.crop((int(l * img.width), int(t * img.height), int(r * img.width), int(b * img.height)))
        fit(img, 480, 300).save(os.path.join(OUT, name + ".webp"), quality=82)


def favicon(size, name):
    """The aqua orb with an M, drawn big and scaled down, for browsers that
    want a PNG (Safari, iOS home screens). static/favicon.svg is the same."""
    S = 512
    y, x = np.mgrid[0:S, 0:S].astype(np.float32) / S
    r = np.sqrt((x - 0.5) ** 2 + (y - 0.28) ** 2) / 0.8
    stops = np.array([[0.77, 0.98, 1.0], [0.1, 0.71, 0.93], [0.04, 0.33, 0.66]])
    rgb = np.stack([np.interp(r, [0, 0.5, 1], stops[:, c]) for c in range(3)], -1)
    img = Image.fromarray(np.uint8(rgb * 255)).convert("RGBA")
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).ellipse((10, 10, S - 10, S - 10), fill=255)
    d = ImageDraw.Draw(img)
    pts = [(140, 360), (140, 168), (256, 292), (372, 168), (372, 360)]
    d.line([(px, py + 12) for px, py in pts], fill=(6, 56, 110, 90), width=56, joint="curve")
    d.line(pts, fill=(255, 255, 255, 255), width=48, joint="curve")
    for px, py in (pts[0], pts[-1]):
        d.ellipse((px - 24, py - 24, px + 24, py + 24), fill=(255, 255, 255, 255))
    gloss = Image.new("RGBA", (S, S), (255, 255, 255, 0))
    gm = Image.new("L", (S, S), 0)
    ImageDraw.Draw(gm).ellipse((88, 44, S - 88, 230), fill=255)
    fade = np.linspace(0.85, 0.05, S)[:, None] * np.asarray(gm, np.float32)
    gloss.putalpha(Image.fromarray(np.uint8(fade)))
    img = Image.alpha_composite(img, Image.composite(gloss, Image.new("RGBA", (S, S), 0), gm))
    ring = ImageDraw.Draw(img)
    ring.ellipse((10, 10, S - 10, S - 10), outline=(255, 255, 255, 255), width=20)
    out = Image.new("RGBA", (S, S), 0)
    out.paste(img, mask=mask)
    out.resize((size, size), Image.LANCZOS).save(os.path.join("static", name))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    wallpaper()
    pictures()
    favicon(32, "favicon-32.png")
    favicon(180, "apple-touch-icon.png")
    print("art written to", OUT)
