# Builds the Relief mark (N2 "chest line"): a slim chest band over six abs blocks, on a 32-unit grid in a 1024 box.
# One gap between all forms, one corner system, the outer edges of the abs on one taper line, the top right block glows.
# Usage: python3 design/brand/build-mark.py   (then node design/brand/export-png.js for the PNG sizes)
import json, math, os
HERE = os.path.dirname(os.path.abspath(__file__))
U, CX, K = 32, 512, .5523
def rpoly(pts, radii):
    def towards(p, q, d):
        dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy); d = min(d, L / 2)
        return (p[0] + dx * d / L, p[1] + dy * d / L)
    n, d = len(pts), ""
    for i, P in enumerate(pts):
        a = towards(P, pts[i - 1], radii[i]); b = towards(P, pts[(i + 1) % n], radii[i])
        d += (f"M {a[0]:.1f} {a[1]:.1f}" if not i else f" L {a[0]:.1f} {a[1]:.1f}")
        d += f" C {a[0] + (P[0] - a[0]) * K:.1f} {a[1] + (P[1] - a[1]) * K:.1f} {b[0] + (P[0] - b[0]) * K:.1f} {b[1] + (P[1] - b[1]) * K:.1f} {b[0]:.1f} {b[1]:.1f}"
    return d + " Z"
def mirror(d):
    import re
    out, cmd, k = [], None, 0
    for t in re.findall(r"[MLCZ]|-?\d+\.?\d*", d):
        if t in "MLCZ": cmd = t; out.append(t); k = 0; continue
        v = float(t)
        if k % 2 == 0: v = 2 * CX - v
        out.append(f"{v:g}"); k += 1
    return " ".join(out)
def mark(gap=24):
    """The eight forms as [(name, path)], left then right; 'hot' is the glowing block. gap = the one groove (24 at full size)."""
    s = (gap - 24) / 2                      # wider grooves at small sizes: move the left forms left, the right ones right
    IN = CX - gap / 2
    band = (f"M {IN} 236 C {IN} 222 {IN - 8} 214 {IN - 22} 214 L {252 - s} 222 C {228 - s} 223 {214 - s} 240 {220 - s} 262 "
            f"C {228 - s} 292 {262 - s} 312 {320 - s} 318 C {390 - s} 326 {450 - s} 324 {IN - 18} 322 C {IN - 6} 321 {IN} 312 {IN} 300 Z")
    forms = [("band", band), ("band", mirror(band))]
    top, hs, w0, w1, r = 346 + (gap - 24) * .5, [4.4 * U, 4.4 * U, 4.6 * U], 5.75 * U, 4.9 * U, 1.1 * U
    total = sum(hs) + gap * (len(hs) - 1); y = top
    xo = lambda yy: IN - w0 + (yy - top) * (w0 - w1) / total
    for i, h in enumerate(hs):
        last = i == len(hs) - 1
        pts = [(IN, y), (xo(y), y), (xo(y + h), y + h), (IN, y + h)]; rad = [r, r, (2 * U if last else r), r]
        left = rpoly(pts, rad); right = rpoly([(2 * CX - x, yy) for x, yy in pts][::-1], rad[::-1])
        forms += [(f"abs{i}", left), ("hot" if i == 0 else f"abs{i}", right)]
        y += h + gap
    return forms
def place(k=.9, dy=10):  # the mark at 90 % of the tile, breathing room at the edge as icon grids ask; 10 px lower: the light band makes it look high
    return f'transform="translate({512 * (1 - k):.1f} {512 * (1 - k) + dy:.1f}) scale({k})"'
STAGE = '<radialGradient id="st" cx="50%" cy="34%" r="78%"><stop offset="0" stop-color="#3a3f48"/><stop offset=".6" stop-color="#1d2026"/><stop offset="1" stop-color="#131519"/></radialGradient>'
CHROME = '<linearGradient id="ch" gradientUnits="userSpaceOnUse" x1="0" y1="214" x2="0" y2="830"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".55" stop-color="#b8bdc6"/><stop offset="1" stop-color="#7a808a"/></linearGradient>'
EMBER = '<linearGradient id="em" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a6a"/><stop offset=".5" stop-color="#ff4a2a"/><stop offset="1" stop-color="#d63a1e"/></linearGradient>'
GLOW = '<filter id="gw" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="26"/></filter>'
HDR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">'
def paint(forms, fill, hot):
    return "".join(f'<path d="{d}" fill="{hot if n == "hot" else fill}"/>' for n, d in forms)
def files():
    F, S = mark(24), mark(48)
    hotd = next(d for n, d in F if n == "hot")
    glow = f'<path d="{hotd}" fill="#ff4a2a" opacity=".55" filter="url(#gw)"/>'
    out = {
      # app icon (iOS and Android round the corners themselves): graphite stage, chrome forms, the trained block glowing
      "relief-icon.svg": f'{HDR}<title>Relief</title><defs>{STAGE}{CHROME}{EMBER}{GLOW}</defs><rect width="1024" height="1024" fill="url(#st)"/><g {place()}>{glow}{paint(F, "url(#ch)", "url(#em)")}</g></svg>\n',
      # iOS 18 appearances: dark (the system's dark ground) and tinted (greyscale; the system adds the tint)
      "relief-icon-dark.svg": f'{HDR}<title>Relief (dark)</title><defs>{CHROME}{EMBER}</defs><rect width="1024" height="1024" fill="#000000"/><g {place()}>{paint(F, "url(#ch)", "url(#em)")}</g></svg>\n',
      "relief-icon-tinted.svg": f'{HDR}<title>Relief (tinted)</title><defs><linearGradient id="tg" gradientUnits="userSpaceOnUse" x1="0" y1="214" x2="0" y2="830"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#9a9a9a"/></linearGradient></defs><rect width="1024" height="1024" fill="#000000"/><g {place()}>{paint(F, "url(#tg)", "#ffffff")}</g></svg>\n',
      # alternate icon: the brand orange, white forms, the trained block in graphite
      "relief-icon-orange.svg": f'{HDR}<title>Relief (orange)</title><defs><linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a36"/><stop offset="1" stop-color="#d2381c"/></linearGradient></defs><rect width="1024" height="1024" fill="url(#og)"/><g {place()}>{paint(F, "#ffffff", "#1d2026")}</g></svg>\n',
      # 16–48 px: flat forms, wider grooves, on a rounded graphite tile
      "relief-favicon.svg": f'{HDR}<title>Relief</title><defs>{STAGE}</defs><rect width="1024" height="1024" rx="230" fill="url(#st)"/><g {place(.86)}>{paint(S, "#ffffff", "#ff4a2a")}</g></svg>\n',
      # the mark without a ground, for paper and screens
      "relief-mark.svg": f'{HDR}<title>Relief mark</title>{paint(F, "#0f1115", "#ff4a2a")}</svg>\n',
      "relief-mark-on-dark.svg": f'{HDR}<title>Relief mark</title>{paint(F, "#f3f4f6", "#ff4a2a")}</svg>\n',
    }
    paths = {"viewBox": 1024, "note": "N2 chest line: forms in order, 'hot' is the glowing block", "forms": [{"name": n, "d": d} for n, d in F], "small": [{"name": n, "d": d} for n, d in S]}
    return out, paths
if __name__ == "__main__":
    out, paths = files()
    for name, text in out.items(): open(os.path.join(HERE, name), "w").write(text)
    json.dump(paths, open(os.path.join(HERE, "paths.json"), "w"), indent=1)
    print("wrote", ", ".join(out), "and paths.json")
