#!/usr/bin/env python3
"""Builds public/models/hero.splat from the hero photo.

Single photo -> coloured point cloud, without a neural net:
  1. GrabCut cuts the subject out of the background.
  2. Depth is a rounded relief (distance transform) with extra pull for the
     face, hands and camera; the back side is the mirrored, dimmed front.
  3. Pixels are sampled into points; a sparse grass disc grounds the figure.
Output (little-endian, 10 bytes/point): int16 x,y,z (units 1/4096), u8 r,g,b, u8 size.
Usage: python3 scripts/generate-hero-splat.py [--debug DIR]
"""
import sys, struct
import cv2, numpy as np

SRC = "src/assets/images/alex/alex-sitting-in-gras-with-camera.png"
OUT = "public/models/hero.splat"
rng = np.random.default_rng(7)

img = cv2.imread(SRC)
H, W = img.shape[:2]
# rough subject polygon (fractions of width/height), refined by GrabCut
poly = np.array([[.30,.98],[.275,.78],[.33,.62],[.335,.46],[.38,.37],[.405,.30],[.415,.22],
                 [.43,.16],[.46,.12],[.50,.11],[.53,.14],[.545,.25],[.55,.37],[.57,.45],
                 [.585,.50],[.585,.62],[.565,.72],[.555,.98]]) * [W, H]
rough = np.zeros((H, W), np.uint8)
cv2.fillPoly(rough, [poly.astype(np.int32)], 1)
gc = np.full((H, W), cv2.GC_BGD, np.uint8)
gc[cv2.dilate(rough, np.ones((41, 41)))>0] = cv2.GC_PR_BGD
gc[rough>0] = cv2.GC_PR_FGD
gc[cv2.erode(rough, np.ones((61, 61)))>0] = cv2.GC_FGD
bgd = np.zeros((1,65)); fgd = np.zeros((1,65))
cv2.grabCut(img, gc, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
mask = ((gc==cv2.GC_FGD)|(gc==cv2.GC_PR_FGD)).astype(np.uint8)
b, g_, r_ = [img[..., i].astype(int) for i in range(3)]
mask[(g_ > r_*1.25) & (g_ > 70) & (g_ > b*1.3)] = 0     # drop foreground grass blades
mask[:int(H*.205)] = 0                                   # drop leaf spike above the head
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((7,7)))
n, lab, st, _ = cv2.connectedComponentsWithStats(mask)
mask = (lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
mask = cv2.GaussianBlur(mask*255, (0,0), 2) > 127

if "--debug" in sys.argv:
    d = sys.argv[sys.argv.index("--debug")+1]
    dbg = img.copy(); dbg[~mask] = (dbg[~mask]*.25).astype(np.uint8)
    cv2.imwrite(d+"/mask.png", dbg)

# ---- depth (relief) for the subject
dist = cv2.distanceTransform(mask.astype(np.uint8), cv2.DIST_L2, 5)
dist = cv2.GaussianBlur(dist, (0,0), 3)
body = np.sqrt(np.clip(dist/ dist.max(), 0, 1))           # rounded 0..1
ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
def blob(cx, cy, r, amp):
    return amp*np.exp(-(((xs/W-cx)**2+(ys/H-cy)**2)/(2*r*r)))
front = body*0.55 + blob(.50,.33,.05,.22) + blob(.555,.55,.035,.18) + blob(.44,.58,.04,.10)
front = front*mask
# ---- colour, slightly lifted so points glow on the dark section background
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

S = 1.0/H*1.6    # world units per pixel: figure height ~1.6
pts, cols, sizes = [], [], []
def sample(m, count):
    yy, xx = np.nonzero(m)
    idx = rng.choice(len(yy), min(count, len(yy)), replace=False)
    return yy[idx], xx[idx]

cx0, cy0 = W*.44, H*.55
yy, xx = sample(mask, 26000)
for back in (False, True):
    sel = slice(None) if not back else rng.random(len(yy)) < .8
    y, x = yy[sel], xx[sel]
    z = front[y, x]*0.9 * (-1 if back else 1)
    c = rgb[y, x].astype(np.float32)
    if back: c = c*0.55 + 12            # unseen side: dimmed copy
    jit = rng.normal(0, 0.0012, (len(y),3))
    P = np.stack([(x-cx0)*S, -(y-cy0)*S, z*0.5], 1) + jit
    pts.append(P); cols.append(c); sizes.append(np.full(len(y), 1.0 if not back else 1.15))
# interior fill so the volume doesn't look hollow when rotated
yy2, xx2 = sample(mask & (dist > 14), 5000)
t = rng.uniform(-1, 1, len(yy2))*front[yy2, xx2]*0.9
pts.append(np.stack([(xx2-cx0)*S, -(yy2-cy0)*S, t*0.5], 1)); cols.append(rgb[yy2, xx2]*0.7); sizes.append(np.full(len(yy2), 1.2))
# grass disc around the feet (round, sparse, front-facing colours)
g = (~mask) & (ys > H*.62) & (rgb[...,1] > rgb[...,0]*1.1)
gy, gx = sample(g, 9000)
ang = rng.uniform(0, 2*np.pi, len(gy)); rad = np.sqrt(rng.uniform(0, 1, len(gy)))*0.9
gz = np.cos(ang)*rad*.55; gxx = np.sin(ang)*rad*.75
pts.append(np.stack([gxx, -0.62+rng.normal(0,.008,len(gy)), gz], 1)); cols.append(rgb[gy, gx]*1.0); sizes.append(np.full(len(gy), 0.8))

P = np.concatenate(pts).astype(np.float32); C = np.clip(np.concatenate(cols), 0, 255).astype(np.uint8)
Z = (np.concatenate(sizes)*100).astype(np.uint8)
import os; os.makedirs("public/models", exist_ok=True)
q = np.clip(np.round(P*4096), -32767, 32767).astype("<i2")
buf = bytearray()
for i in range(len(P)):
    buf += q[i].tobytes() + C[i].tobytes() + bytes([Z[i]])
open(OUT, "wb").write(buf)
print(len(P), "points", len(buf)//1024, "KB", "bounds", P.min(0), P.max(0))
