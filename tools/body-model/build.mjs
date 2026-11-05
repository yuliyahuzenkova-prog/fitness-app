import fs from 'fs'; import zlib from 'zlib'; import { loadX } from './xb.mjs';
const BODY = +(process.argv[2] || 17767), EXTRA = (process.argv[3] || '').split(',').filter(Boolean).map(Number);
const { meta, meshes: XM, world: XW } = loadX();
// Forearm twist bones: the lower half of each forearm turns half as much as the hand, so the palm can face any way without the skin twisting at the elbow or wrist
for (const s of ['Left', 'Right']) { const fa = meta.bones.findIndex((b) => b.n === s + 'ForeArm'); meta.bones.push({ n: s + 'ForeArmTwist', p: fa, t: [0, 0, 0] }); XW.push(XW[fa].slice()); }
const names = meta.bones.map(b => b.n), ix = Object.fromEntries(names.map((n, i) => [n, i]));
// --- Cena mesh: welded positions, components
const P = new Float32Array(fs.readFileSync('upos.f32').buffer.slice(0)), Cm = new Int32Array(fs.readFileSync('ucomp.i32').buffer.slice(0)), I = new Uint32Array(fs.readFileSync('uidx.u32').buffer.slice(0));
const MANQ = !!process.env.MANQ, FEM = !!process.env.FEM; const seam = [];
const keep = new Set([BODY, ...EXTRA]); const map = new Int32Array(Cm.length).fill(-1); const V = [];
const isEye = []; for (let i = 0; i < Cm.length; i++) if (keep.has(Cm[i])) { map[i] = V.length; isEye.push(Cm[i] !== BODY); V.push([P[i * 3], P[i * 3 + 1], P[i * 3 + 2]]); }
const T = []; for (let t = 0; t < I.length; t += 3) if (map[I[t]] >= 0) T.push(map[I[t]], map[I[t + 1]], map[I[t + 2]]);
const n = V.length; console.log('verts', n, 'tris', T.length / 3);
// smooth normals
const N = V.map(() => [0, 0, 0]);
for (let t = 0; t < T.length; t += 3) { const [a, b, c] = [V[T[t]], V[T[t + 1]], V[T[t + 2]]]; const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]; const f = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; for (const k of [T[t], T[t + 1], T[t + 2]]) for (let q = 0; q < 3; q++) N[k][q] += f[q]; }
N.forEach(v => { const l = Math.hypot(...v) || 1; v[0] /= l; v[1] /= l; v[2] /= l; });
// --- Fitted joints (left side given; mirrored)
const J0 = JSON.parse(fs.readFileSync('joints.json'));
const FG = JSON.parse(fs.readFileSync('fingers.json')); Object.assign(J0, FG.joints);
const GRIP = { Left: FG.grip, Right: [-FG.grip[0], FG.grip[1], FG.grip[2]] };
const CJ = {}; for (const [k, v] of Object.entries(J0)) { CJ[k] = v; if (k.startsWith('Left')) CJ['Right' + k.slice(4)] = [-v[0], v[1], v[2]]; }
for (const s of ['Left', 'Right']) CJ[s + 'ForeArmTwist'] = CJ[s + 'ForeArm'].map((v, k) => v + (CJ[s + 'Hand'][k] - v) * .5);
// vector helpers
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = (a) => Math.hypot(...a), norm = (a) => mul(a, 1 / (len(a) || 1)), cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function rotFromTo(a, b) { a = norm(a); b = norm(b); const v = cross(a, b), c = dot(a, b); if (c < -.9999) return (p) => mul(p, -1); const k = 1 / (1 + c);
  return (p) => { const vx = cross(v, p); const vvx = cross(v, vx); return add(add(p, vx), mul(vvx, k)); }; }
// Segments: [from, to] in both skeletons. Cena→X Bot similarity per segment.
const segs = [['Hips', 'Spine'], ['Spine', 'Spine1'], ['Spine1', 'Spine2'], ['Spine2', 'Neck'], ['Neck', 'Head'], ['Head', 'HeadTop_End']];
for (const s of ['Left', 'Right']) segs.push([s + 'Shoulder', s + 'Arm'], [s + 'Arm', s + 'ForeArm'], [s + 'ForeArm', s + 'Hand'], [s + 'Hand', s + 'HandMiddle1'], [s + 'UpLeg', s + 'Leg'], [s + 'Leg', s + 'Foot'], [s + 'Foot', s + 'ToeBase'], [s + 'ToeBase', s + 'Toe_End'], ['Hips', s + 'UpLeg']);
const X = (nm) => XW[ix[nm]];
const S = segs.map(([a, b]) => { const pa = CJ[a], pb = CJ[b], xa = X(a), xb = X(b), d = sub(pb, pa), xd = sub(xb, xa);
  const sc = len(xd) / len(d), R = rotFromTo(d, xd), Ri = rotFromTo(xd, d);
  return { a, b, pa, pb, d, L2: dot(d, d), fwd: (p) => add(xa, mul(R(sub(p, pa)), sc)), inv: (q) => add(pa, mul(Ri(sub(q, xa)), 1 / sc)) }; });
const segOf = Object.fromEntries(S.map(s => [s.b, s]));
// torso segments map with uniform-ish scale; fine.
const distSeg = (p, s) => { const t = Math.max(0, Math.min(1, dot(sub(p, s.pa), s.d) / s.L2)); return len(sub(p, add(s.pa, mul(s.d, t)))); };
// X Bot candidate vertices (cm)
const XV = []; for (const m of XM) for (let i = 0; i < m.n; i++) XV.push({ p: [m.pos[i * 3] / 100, m.pos[i * 3 + 1] / 100, m.pos[i * 3 + 2] / 100], nn: [m.nor[i * 3] / 127, m.nor[i * 3 + 1] / 127, m.nor[i * 3 + 2] / 127], ji: m.ji.slice(i * 4, i * 4 + 4), wi: m.wi.slice(i * 4, i * 4 + 4), reg: m.reg[i] });
// grid for nearest search
const G = new Map(), cell = 4, key = (p) => `${Math.floor(p[0] / cell)},${Math.floor(p[1] / cell)},${Math.floor(p[2] / cell)}`;
XV.forEach((v, i) => { const k = key(v.p); (G.get(k) || G.set(k, []).get(k)).push(i); });
function nearest(p, nrm) { let best = -1, bd = 1e9; const [cx, cy, cz] = p.map(q => Math.floor(q / cell));
  for (let r = 1; r <= 6 && (best < 0 || r <= 2); r++) for (let x = cx - r; x <= cx + r; x++) for (let y = cy - r; y <= cy + r; y++) for (let z = cz - r; z <= cz + r; z++) { const l = G.get(`${x},${y},${z}`); if (!l) continue;
    for (const i of l) { const v = XV[i], dd = len(sub(v.p, p)) + (dot(v.nn, nrm) < 0 ? 4 : 0); if (dd < bd) { bd = dd; best = i; } } }
  return [best, bd]; }
const pos = new Int16Array(n * 3), nor = new Int8Array(n * 3), ji = new Uint8Array(n * 4), wi = new Uint8Array(n * 4), reg = new Uint8Array(n); let far = 0;
for (let i = 0; i < n; i++) {
  const p = V[i]; let s = S[0], sd = 1e9;
  for (const q of S) { const d = distSeg(p, q); if (d < sd) { sd = d; s = q; } }
  // map the normal with the same rotation
  const xp = s.fwd(p), xn = norm(sub(s.fwd(add(p, N[i])), xp));
  const [b, bd] = nearest(xp, xn); if (bd > 6) far++;
  const v = XV[b]; ji.set(v.ji, i * 4); wi.set(v.wi, i * 4); reg[i] = v.reg;
  for (let k = 0; k < 3; k++) { pos[i * 3 + k] = Math.round(p[k] * 100); nor[i * 3 + k] = Math.round(N[i][k] * 127); }
}
console.log('far matches', far);
// Geometric weights: nearest bone segment, then smoothed over the surface so joints bend softly
{
  const GS = [['Hips', 'Spine', 'Hips', 13], ['Spine', 'Spine1', 'Spine', 14], ['Spine1', 'Spine2', 'Spine1', 15], ['Spine2', 'Neck', 'Spine2', 15], ['Neck', 'Head', 'Neck', 6], ['Head', 'HeadTop_End', 'Head', 9]];
  for (const s of ['Left', 'Right']) GS.push(['Hips', s + 'UpLeg', 'Hips', 12], [s + 'Shoulder', s + 'ClavEnd', s + 'Shoulder', +(process.env.CLR || 5)], [s + 'Arm', s + 'ForeArm', s + 'Arm', 5.5], [s + 'ForeArm', s + 'ForeArmTwist', s + 'ForeArm', 4], [s + 'ForeArmTwist', s + 'Hand', s + 'ForeArmTwist', 4], [s + 'Hand', s + 'HandTip', s + 'Hand', 3], [s + 'UpLeg', s + 'Leg', s + 'UpLeg', 8], [s + 'Leg', s + 'Foot', s + 'Leg', 5], [s + 'Foot', s + 'ToeBase', s + 'Foot', 4], [s + 'ToeBase', s + 'Toe_End', s + 'ToeBase', 3]);
  for (const s of ['Left', 'Right']) { const h = CJ[s + 'Hand'], m = CJ[s + 'HandMiddle1']; CJ[s + 'HandTip'] = add(m, mul(sub(m, h), 1.0)); CJ[s + 'ClavEnd'] = add(CJ[s + 'Shoulder'], mul(sub(CJ[s + 'Arm'], CJ[s + 'Shoulder']), +(process.env.CLE || .55))); }
  const segs2 = GS.map(([a, b, bone, r]) => { const pa = CJ[a], d = sub(CJ[b], pa); return { pa, d, L2: dot(d, d), bone: ix[bone], r }; });
  const nb = Array.from({ length: n }, () => new Set());
  for (let t = 0; t < T.length; t += 3) { const [a, b, c] = [T[t], T[t + 1], T[t + 2]]; nb[a].add(b).add(c); nb[b].add(a).add(c); nb[c].add(a).add(b); }
  let W = V.map((p, i) => { if (isEye[i]) return { [ix.Head]: 1 }; let best = 0, bd = 1e9; segs2.forEach((s, k) => { const d = distSeg(p, s) - s.r; if (d < bd) { bd = d; best = k; } }); return { [segs2[best].bone]: 1 }; });
  const ITER = +(process.env.ITER || 12);
  for (let it = 0; it < ITER; it++) {
    W = W.map((w, i) => { const o = {}; for (const [k, v] of Object.entries(w)) o[k] = v * .5; const nn = [...nb[i]], f = .5 / (nn.length || 1);
      if (!nn.length) return w; for (const j of nn) for (const [k, v] of Object.entries(W[j])) o[k] = (o[k] || 0) + v * f; return o; });
  }
  // Shoulders swing furthest from the rest pose: spread their weights wider to avoid creases
  const near = V.map((p, i) => !isEye[i] && ['LeftArm', 'RightArm'].some((nm) => len(sub(p, CJ[nm])) < +(process.env.SR || 15)));
  for (let it = 0; it < +(process.env.SITER || 30); it++) {
    W = W.map((w, i) => { if (!near[i]) return w; const o = {}; for (const [k, v] of Object.entries(w)) o[k] = v * .5; const nn = [...nb[i]], f = .5 / (nn.length || 1);
      for (const j of nn) for (const [k, v] of Object.entries(W[j])) o[k] = (o[k] || 0) + v * f; return o; });
  }
  const V0 = V.map((p) => p.slice()), N0 = N.map((p) => p.slice());
  // Armpit / side of the chest: skin that sits on the torso follows the collarbone (which rises with the arm) more than the
  // upper arm itself, so raising the arm overhead doesn't pull the torso up into a spike
  if (process.env.PIT) {
    const k = +process.env.PIT;
    W = W.map((w, i) => { if (isEye[i]) return w; const p = V[i];
      for (const sd of ['Left', 'Right']) { const a = ix[sd + 'Arm'], c = ix[sd + 'Shoulder'], wa = w[a] || 0; if (!wa) continue;
        const A = CJ[sd + 'Arm'], torsoSide = Math.abs(p[0]) < Math.abs(A[0]) - 1 && p[1] < A[1] + 2; if (!torsoSide) continue;
        const f = k * Math.min(1, (Math.abs(A[0]) - Math.abs(p[0])) / 6); const o = { ...w }; o[a] = wa * (1 - f); o[c] = (o[c] || 0) + wa * f; return o; }
      return w; });
  }
  // Fingers: skin near each finger's axis follows that finger's bones (so the hand can grip)
  const FINGERS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'], FR = { Thumb: 3.0, Index: 2.5, Middle: 2.5, Ring: 2.4, Pinky: 2.1 };
  const handFam = (nm) => /Hand/.test(nm);
  for (let i = 0; i < n; i++) {
    if (isEye[i]) continue; const sd = V[i][0] >= 0 ? 'Left' : 'Right', hb = ix[sd + 'Hand'], wh = W[i][hb]; if (!wh) continue;
    const p = V[i]; let best = null, bd = 1e9;
    for (const f of FINGERS) for (let k = 0; k < 3; k++) {
      const a = CJ[sd + 'Hand' + f + (k + 1)], b = CJ[sd + 'Hand' + f + (k + 2)], dv = sub(b, a), t = dot(sub(p, a), dv) / dot(dv, dv);
      if (k === 0 && t < (f === 'Thumb' ? -.1 : -.12)) continue; if (k === 2 && t > 1.6) continue;
      const tc = Math.max(0, Math.min(1, t)), dd = len(sub(p, add(a, mul(dv, tc)))) / FR[f];
      if (dd < bd) { bd = dd; best = ix[sd + 'Hand' + f + (k + 1)]; }
    }
    if (best != null && bd < 1) { const o = { ...W[i] }; delete o[hb]; o[best] = (o[best] || 0) + wh; W[i] = o; }
  }
  // soften the joints between finger bones a little
  for (let it = 0; it < 3; it++) W = W.map((w, i) => { if (!Object.keys(w).some((k) => handFam(names[+k]) && names[+k] !== 'LeftHand' && names[+k] !== 'RightHand')) return w;
    const o = {}; for (const [k, v] of Object.entries(w)) o[k] = v * .6; const nn = [...nb[i]], f = .4 / (nn.length || 1); for (const j of nn) for (const [k, v] of Object.entries(W[j])) o[k] = (o[k] || 0) + v * f; return o; });
  // Average build: slim the bodybuilder towards typical proportions (factor = how far from the bone the skin stays)
  if (!process.env.NOSLIM) {
    const F = FEM ? { Arm: .74, ForeArm: .8, ForeArmTwist: .8, Shoulder: .74, Neck: .78, UpLeg: .88, Leg: .9 } : MANQ ? (process.env.MUSC ? { Arm: .9, ForeArm: .9, ForeArmTwist: .9, Shoulder: .93, Neck: .9, UpLeg: .96, Leg: .98 } : { Arm: .73, ForeArm: .8, ForeArmTwist: .8, Shoulder: .8, Neck: .8, UpLeg: .83, Leg: .88 }) : { Arm: .76, ForeArm: .8, ForeArmTwist: .8, Shoulder: .84, Neck: .86, UpLeg: .88, Leg: .94 }, HANDS = +(process.env.HANDS || (MANQ ? (process.env.MUSC ? .78 : .72) : .82));
    const TORSO = FEM ? { Spine2: [.86, .9], Spine1: [.8, .88], Spine: [.86, .92] } : MANQ ? (process.env.MUSC ? { Spine2: [.96, 1], Spine1: [.95, .98], Spine: [.95, .97] } : { Spine2: [.8, .9], Spine1: [.86, .92], Spine: [.9, .94] }) : { Spine2: [.87, .95], Spine1: [.93, .96], Spine: [.96, .97] }; // [sideways, front-back]
    const fac = (bone) => { const nm = names[bone].replace(/^(Left|Right)/, ''); return F[nm] ? [F[nm], F[nm], F[nm]] : TORSO[nm] ? [TORSO[nm][0], 1, TORSO[nm][1]] : null; };
    const V2 = V.map((p, i) => {
      if (isEye[i]) return p; let out = [0, 0, 0], tot = 0;
      for (const [bk, wv] of Object.entries(W[i])) {
        const f = fac(+bk); let q = p;
        if (/Hand/.test(names[+bk])) { const w0 = CJ[(names[+bk].startsWith('Left') ? 'Left' : 'Right') + 'Hand']; q = add(w0, mul(sub(p, w0), HANDS)); }
        if (f) { let c = null, cd = 1e9; for (const sg of segs2) if (sg.bone === +bk) { const t = Math.max(0, Math.min(1, dot(sub(p, sg.pa), sg.d) / sg.L2)), cc = add(sg.pa, mul(sg.d, t)), dd = len(sub(p, cc)); if (dd < cd) { cd = dd; c = cc; } }
          if (c) { const r = sub(p, c); q = [c[0] + r[0] * f[0], c[1] + r[1] * f[1], c[2] + r[2] * f[2]]; } }
        out = add(out, mul(q, wv)); tot += wv;
      }
      return mul(out, 1 / tot);
    });
    V2.forEach((p, i) => (V[i] = p));
    if (MANQ) {
      const hb = ix.Head;
      // Feet like smooth shoes: melt the toes together (Taubin smoothing keeps the volume)
      const footMask = V.map((p, i) => { const w = W[i]; let f = 0; for (const [k, v] of Object.entries(w)) if (/ToeBase|Foot$/.test(names[+k])) f += v; return f > .5 && p[1] < 6; });
      for (let it = 0; it < 40; it++) for (const lam of [.5, -.53]) { const nv = V.map((p, i) => { if (!footMask[i]) return p; const nn = [...nb[i]]; if (!nn.length) return p; const m = [0, 0, 0]; for (const j of nn) for (let k = 0; k < 3; k++) m[k] += V[j][k] / nn.length; return p.map((x, k) => x + lam * (m[k] - x)); }); nv.forEach((p, i) => (V[i] = p)); }
    }
    if (FEM) {
      // Female figure from the same mesh and skeleton: narrower waist and upper chest, fuller hips and glutes,
      // breasts, a softer face and jaw, no Adam's apple
      const bump = (y, c, h) => { const t = (y - c) / h; return Math.abs(t) >= 1 ? 0 : (1 - t * t) ** 2; };
      const tW = V.map((p, i) => { let t = 0; for (const [k, v] of Object.entries(W[i])) if (/^(Hips|Spine|Spine1|Spine2)$/.test(names[+k])) t += v; return t; });
      const legW = V.map((p, i) => { let t = 0; for (const [k, v] of Object.entries(W[i])) if (/UpLeg$/.test(names[+k])) t += v; return t; });
      const headW = V.map((p, i) => { let t = 0; for (const [k, v] of Object.entries(W[i])) if (/^(Head|Neck)$/.test(names[+k])) t += v; return t; });
      for (let i = 0; i < n; i++) {
        if (isEye[i]) continue; const p = V[i], p0 = V0[i], y = p0[1];
        // waist in, upper chest a little narrower
        const sx = 1 - tW[i] * (.13 * bump(y, 120, 16) + .09 * bump(y, 152, 12));
        // hips and upper thighs out, glutes rounder and higher
        const hip = (tW[i] + legW[i] * .45) * bump(y, 97, 12);
        p[0] *= sx * (1 + .045 * hip);
        if (p0[2] < 2 && N0[i][2] < -.2) p[2] -= 2.6 * hip * Math.min(1, -N0[i][2] * 1.5);
        if (N0[i][2] > .2) p[2] -= 1.2 * tW[i] * bump(y, 118, 12); // flatter belly
      }
      // breasts: a smooth dome on each side of the chest, sitting slightly low
      for (const sd of [1, -1]) {
        const cx = 9.4 * sd, cy = 141.5; let cz = -1e9; for (let i = 0; i < n; i++) { const p = V[i]; if (!isEye[i] && Math.abs(p[0] - cx) < 2 && Math.abs(p[1] - cy) < 2 && N0[i][2] > .4) cz = Math.max(cz, p[2]); }
        for (let i = 0; i < n; i++) {
          if (isEye[i] || N0[i][2] < -.05 || tW[i] < .3) continue; const p = V[i];
          const dx = (p[0] - cx) / 10.5, dy = (p[1] - cy) / (p[1] > cy ? 11 : 8.5), d2 = dx * dx + dy * dy; if (d2 >= 1) continue;
          const a = 9 * (1 - d2) ** 1.5 * Math.min(1, (p[2] - cz + 9) / 6);
          p[2] += a * Math.max(.3, N0[i][2]); p[1] -= a * .18; p[0] += a * .12 * sd;
        }
      }
      // softer face and jaw, slimmer throat: smooth the head (keeping its volume) away from the eyes
      const eyeP = V.filter((p, i) => isEye[i]);
      const faceMask = V.map((p, i) => !isEye[i] && headW[i] > .5 && p[1] > CJ.Neck[1] - 4 && eyeP.every((e) => Math.hypot(e[0] - p[0], e[1] - p[1], e[2] - p[2]) > 2.2));
      for (let i = 0; i < n; i++) if (faceMask[i]) {
        const p = V[i], y = p[1], ax = Math.abs(p[0]), cl = (v) => Math.min(1, Math.max(0, v));
        p[0] *= 1 - .2 * bump(y, 179, 7.5);                                                  // a narrower, softer jaw and chin
        if (p[2] > 4 && y < 183.5) { const t = y > 175 ? (183.5 - y) / 8.5 : cl(1 - (175 - y) / 5); p[2] -= 2.3 * t * cl((p[2] - 4) / 6); } // the lower face tilted back from the mouth down, so the jaw and chin don't jut forward
        if (p[2] > 13.5) p[2] -= 1.0 * bump(y, 195.5, 3) * cl((p[2] - 13.5) / 3);            // a flatter brow ridge
        if (ax < 3.2 && y > 183 && y < 191.5 && p[2] > 14.5) { p[2] = 14.5 + (p[2] - 14.5) * .72; p[0] *= .85; } // a smaller nose
        if (ax < 3.6 && p[2] > 13.5) p[2] += .4 * bump(y, 183.3, 1.2) * (1 - ax / 3.6);       // a slightly fuller upper lip
        if (ax > 6 && y > 184 && y < 192 && p[2] > 6) p[0] += Math.sign(p[0]) * .5 * bump(y, 188, 4); // rounder cheeks
      }
      // a slimmer neck
      for (let i = 0; i < n; i++) { if (isEye[i] || headW[i] > .5) continue; const p = V[i], nw = (() => { let t = 0; for (const [k, v] of Object.entries(W[i])) if (names[+k] === 'Neck') t += v; return t; })(); if (nw < .2) continue;
        const f = 1 - .15 * nw * bump(p[1], 172, 9); p[0] *= f; p[2] = -1 + (p[2] + 1) * f; }
      for (let it = 0; it < 22; it++) for (const lam of [.45, -.47]) { const nv = V.map((p, i) => { if (!faceMask[i]) return p; const nn = [...nb[i]]; if (!nn.length) return p; const m = [0, 0, 0]; for (const j of nn) for (let k = 0; k < 3; k++) m[k] += V[j][k] / nn.length; return p.map((x, k) => x + lam * (m[k] - x)); }); nv.forEach((p, i) => (V[i] = p)); }
      // the crotch smooths out (it is under the briefs anyway)
      const crotch = V0.map((p, i) => !isEye[i] && Math.abs(p[0]) < 7 && p[1] > 82 && p[1] < 100 && p[2] > -2);
      for (let it = 0; it < 30; it++) for (const lam of [.5, -.52]) { const nv = V.map((p, i) => { if (!crotch[i]) return p; const nn = [...nb[i]]; if (!nn.length) return p; const m = [0, 0, 0]; for (const j of nn) for (let k = 0; k < 3; k++) m[k] += V[j][k] / nn.length; return p.map((x, k) => x + lam * (m[k] - x)); }); nv.forEach((p, i) => (V[i] = p)); }
      // and the whole torso gets a light overall smoothing so the reshaped parts blend in
      const torsoM = V.map((p, i) => !isEye[i] && tW[i] > .4);
      for (let it = 0; it < 4; it++) for (const lam of [.4, -.42]) { const nv = V.map((p, i) => { if (!torsoM[i]) return p; const nn = [...nb[i]]; if (!nn.length) return p; const m = [0, 0, 0]; for (const j of nn) for (let k = 0; k < 3; k++) m[k] += V[j][k] / nn.length; return p.map((x, k) => x + lam * (m[k] - x)); }); nv.forEach((p, i) => (V[i] = p)); }
    }
    for (const sd of ['Left', 'Right']) { const w0 = CJ[sd + 'Hand']; for (const k of Object.keys(CJ)) if (k.startsWith(sd + 'Hand') && k !== sd + 'Hand' && !k.endsWith('Tip')) CJ[k] = add(w0, mul(sub(CJ[k], w0), HANDS)); GRIP[sd] = add(w0, mul(sub(GRIP[sd], w0), HANDS)); }
    N.forEach((v) => v.fill(0));
    for (let t = 0; t < T.length; t += 3) { const [a, b, c] = [V[T[t]], V[T[t + 1]], V[T[t + 2]]]; const f = cross(sub(b, a), sub(c, a)); for (const k of [T[t], T[t + 1], T[t + 2]]) for (let q = 0; q < 3; q++) N[k][q] += f[q]; }
    N.forEach((v) => { const l = Math.hypot(...v) || 1; v[0] /= l; v[1] /= l; v[2] /= l; });
    for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { pos[i * 3 + k] = Math.round(V[i][k] * 100); nor[i * 3 + k] = Math.round(N[i][k] * 127); }
  }
  const PAIRS = [['Arm', 'ForeArm'], ['ForeArm', 'Hand'], ['ForeArmTwist', 'Hand'], ['UpLeg', 'Leg'], ['Leg', 'Foot'], ['Neck', 'Spine2'], ['Neck', 'Head'], ['Hips', 'UpLeg'], ['Spine', 'Spine1']];
  W.forEach((w, i) => { const top = Object.entries(w).sort((a, b) => b[1] - a[1]); if (top.length < 2) return; const s = top[1][1] / (top[0][1] + top[1][1]);
    const a = names[+top[0][0]].replace(/^(Left|Right)/, ''), b = names[+top[1][0]].replace(/^(Left|Right)/, '');
    if (s > (process.env.SEAM || .3) && PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x))) seam[i] = 1; });
  // The whole face and jaw move with the head (no stretching when the neck bends); the throat blends below the chin
  { const hy = CJ.Head[1], hz = CJ.Head[2], hb = String(ix.Head);
    W = W.map((w, i) => { const p = V0[i]; if (isEye[i]) return w;
      let t = 0; if (p[1] >= hy - 1 && p[2] > hz - 1) t = 1; else if (p[1] > hy - 7 && p[2] > hz + 5) t = (p[1] - (hy - 7)) / 6;
      if (t <= 0) return w; const o = {}; for (const [k, v] of Object.entries(w)) o[k] = v * (1 - t); o[hb] = (o[hb] || 0) + t; return o; }); }
  // Anatomical muscle map drawn directly on this body (rest pose, cm): every part of the body belongs to a muscle
  // group, with clean borders, so worked muscles show as whole shapes and the rest can be outlined
  if (!process.env.OLDREG) {
    const RG = meta.regions, R = (n) => RG.indexOf(n), dotp = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const seg = (p, a, b) => { const d = sub(CJ[b], CJ[a]); return Math.max(0, Math.min(1, dotp(sub(p, CJ[a]), d) / dotp(d, d))); };
    const ang = (p, a, b, sd) => { // angle around the limb: 0 = front, +90 = outer side, ±180 = back
      const A = CJ[a], d = norm(sub(CJ[b], A)), r = sub(p, A), rp = sub(r, mul(d, dotp(r, d))); let f = [0, 0, 1]; f = norm(sub(f, mul(d, dotp(f, d))));
      const o = norm(cross(d, f)); const out = dotp(o, [sd, 0, 0]) >= 0 ? o : mul(o, -1); return Math.atan2(dotp(rp, out), dotp(rp, f)) * 180 / Math.PI; };
    for (let i = 0; i < n; i++) {
      if (isEye[i]) continue;
      const w = W[i]; let bk = null, bw = -1; for (const [k, v] of Object.entries(w)) if (v > bw) { bw = v; bk = +k; }
      const nm = names[bk], sdn = nm.startsWith('Left') ? 'Left' : nm.startsWith('Right') ? 'Right' : '', b = nm.replace(/^(Left|Right)/, ''), sd = sdn === 'Right' ? -1 : 1;
      const p = V0[i], [x, y, z] = p, nn = N0[i], ax = Math.abs(x); let r = 'none';
      if (/^Hand|Toe|Head|Eye/.test(b) && b !== 'HandMiddle') r = b.startsWith('Toe') ? 'foot' : 'none';
      if (b === 'Foot' || b.startsWith('Toe')) r = 'foot';
      else if (b === 'UpLeg') { const t = seg(p, sdn + 'UpLeg', sdn + 'Leg'), a = ang(p, sdn + 'UpLeg', sdn + 'Leg', sd);
        r = Math.abs(a) > 115 ? (t < .18 ? 'glute' : 'ham') : t < .2 && a > 55 ? 'glutemed' : a < -70 ? (t < .35 ? 'hipflex' : 'quad') : 'quad'; if (t > .93) r = 'none'; }
      else if (b === 'Leg') { const t = seg(p, sdn + 'Leg', sdn + 'Foot'), a = ang(p, sdn + 'Leg', sdn + 'Foot', sd);
        r = t < .07 ? 'none' : Math.abs(a) > 95 ? (t < .72 ? 'calf' : 'none') : a > 5 && t < .85 ? 'tib' : 'none'; }
      else if (b === 'Arm') { const t = seg(p, sdn + 'Arm', sdn + 'ForeArm'), a = ang(p, sdn + 'Arm', sdn + 'ForeArm', sd);
        r = t < .32 ? 'delt' : t > .93 ? 'none' : Math.abs(a) < 95 ? 'bi' : 'tri'; }
      else if (b === 'ForeArm' || b === 'ForeArmTwist') { const t = seg(p, sdn + 'ForeArm', sdn + 'Hand'); r = t < .78 ? 'fore' : 'none'; }
      else if (b === 'Neck') r = nn[2] < -.15 ? 'uback' : 'neck';
      else if (b === 'Shoulder') r = nn[2] > .25 && y < 156 ? 'pec' : nn[2] < -.1 || nn[1] > .55 ? 'uback' : 'delt';
      else if (['Hips', 'Spine', 'Spine1', 'Spine2'].includes(b)) {
        const front = nn[2] > .3, back = nn[2] < -.3;
        if (y < 101) r = back ? 'glute' : Math.abs(nn[0]) > .6 ? 'glutemed' : front && ax > 6 ? 'hipflex' : 'none';
        else if (front) r = y > 136 ? (y < 157 && ax > 1.2 ? 'pec' : 'none') : ax < 8.5 ? (y > 103 ? 'abs' : 'none') : 'obl';
        else if (back) r = y > 141 ? 'uback' : ax < 5.5 ? 'erector' : y > 113 ? 'lat' : 'erector';
        else r = y > 136 ? (y > 150 ? 'delt' : 'lat') : y > 116 ? 'lat' : 'obl';
      }
      reg[i] = R(r) < 0 ? 0 : R(r);
    }
  }
  // Muscle zones must belong to the body part that carries them: no "triceps" on the torso next to the armpit
  { const RG = meta.regions; W.forEach((w, i) => { if (isEye[i]) return; const top = Object.entries(w).sort((a, b) => b[1] - a[1])[0]; if (!top) return;
      const bn = names[+top[0]].replace(/^(Left|Right)/, ''), r = RG[reg[i]]; const armB = /^(Arm|ForeArm|Hand)/.test(bn) || /^Hand/.test(bn);
      if (['bi', 'tri', 'fore'].includes(r) && !armB) reg[i] = RG.indexOf(N[i][2] < 0 ? 'lat' : 'none');
      if (r === 'delt' && /^Spine/.test(bn)) reg[i] = RG.indexOf('none');
      if (['lat', 'pec', 'obl', 'abs', 'erector', 'uback'].includes(r) && armB && top[1] > .7) reg[i] = RG.indexOf(N[i][2] > 0 ? 'bi' : 'tri'); }); }
  W.forEach((w, i) => { if (isEye[i]) w = { [ix.Head]: 1 }; const top = Object.entries(w).sort((a, b) => b[1] - a[1]).slice(0, 4), sum = top.reduce((a, b) => a + b[1], 0); let acc = 0;
    for (let k = 0; k < 4; k++) { const e = top[k]; ji[i * 4 + k] = e ? +e[0] : 0; const q = e ? (k < top.length - 1 ? Math.round(e[1] / sum * 255) : 255 - acc) : 0; wi[i * 4 + k] = Math.max(0, q); acc += q; } });
}
// Bones: Cena rest world positions; unfitted bones follow their segment's inverse map
const CW = names.map((nm, i) => { if (CJ[nm]) return CJ[nm];
  const par = names[meta.bones[i].p]; let s = nm.includes('Hand') ? segOf[nm.startsWith('Left') ? 'LeftHandMiddle1' : 'RightHandMiddle1'] : nm.endsWith('Eye') ? segOf.HeadTop_End : segOf[par] || segOf[nm];
  return s.inv(XW[i]); });
const bones = meta.bones.map((b, i) => ({ n: b.n, p: b.p, t: (b.p < 0 ? CW[i] : sub(CW[i], CW[b.p])).map(x => +x.toFixed(3)) }));
const ind = new Uint16Array(T);
// Smooth the muscle-region borders (majority of neighbours)
{ const nb2 = Array.from({ length: n }, () => []); for (let t = 0; t < T.length; t += 3) { const [a, b, c] = [T[t], T[t + 1], T[t + 2]]; nb2[a].push(b, c); nb2[b].push(a, c); nb2[c].push(a, b); }
  for (let it = 0; it < +(process.env.RSM || 4); it++) { const r2 = reg.slice(); for (let i = 0; i < n; i++) { if (isEye[i]) continue; const cnt = {}; cnt[reg[i]] = 2; for (const j of nb2[i]) cnt[reg[j]] = (cnt[reg[j]] || 0) + 1; let best = reg[i], bc = 0; for (const [k, c] of Object.entries(cnt)) if (c > bc) { bc = c; best = +k; } r2[i] = best; } reg.set(r2); } }
for (let i = 0; i < n; i++) if (seam[i]) reg[i] |= 64;
if (process.env.WEAR) {
  const wear = new Uint8Array(n), bn = (i) => { let b = ji[i * 4], bw = wi[i * 4]; for (let k = 1; k < 4; k++) if (wi[i * 4 + k] > bw) { bw = wi[i * 4 + k]; b = ji[i * 4 + k]; } return names[b].replace(/^(Left|Right)/, ''); };
  const V0w = V.map((p, i) => [pos[i * 3] / 100, pos[i * 3 + 1] / 100, pos[i * 3 + 2] / 100]);
  for (let i = 0; i < n; i++) {
    if (isEye[i]) continue; const b = bn(i); if (!/^(Hips|Spine|UpLeg)$/.test(b) && !(FEM && /^(Spine1|Spine2|Shoulder)$/.test(b))) continue;
    const [x, y, z] = V0w[i], ax = Math.abs(x);
    // briefs: waistband just below the navel; the legs cut higher at the sides for the female figure, lower (trunks) for the male one
    const side = Math.min(1, Math.max(0, (ax - 4) / 10)) * (z > -2 ? 1 : .6);
    const leg = FEM ? 86 + 9 * side : 78 + 2 * side, waist = FEM ? 99 - 2 * (1 - side) : 101;
    if (y < waist && y > leg && /^(Hips|Spine|UpLeg)$/.test(b)) wear[i] = 1;
    if (FEM) { // sports bra: band under the chest, cups, and a racerback
      const front = z > -3, chest = y > 131 && y < (front ? 150.5 - .12 * Math.max(0, 9 - Math.abs(ax - 9.4)) ** 2 * .2 : 147);
      const back = !front && y >= 147 && y < 161 && ax < 7.5 - (y - 147) * .25;
      const strap = front && y >= 148 && y < 163 && Math.abs(ax - 9.5 + (y - 148) * .18) < 2.3;
      if ((chest || back || strap) && /^(Spine|Spine1|Spine2|Shoulder)$/.test(b) && y > 130) wear[i] = 1;
    }
  }
  // tidy edges: majority of neighbours
  const nb3 = Array.from({ length: n }, () => []); for (let t = 0; t < T.length; t += 3) { const [a, b, c] = [T[t], T[t + 1], T[t + 2]]; nb3[a].push(b, c); nb3[b].push(a, c); nb3[c].push(a, b); }
  for (let it = 0; it < 2; it++) { const w2 = wear.slice(); for (let i = 0; i < n; i++) { const l = nb3[i]; if (!l.length) continue; const on = l.filter((j) => wear[j]).length / l.length; w2[i] = on > .5 ? 1 : on < .5 ? 0 : wear[i]; } wear.set(w2); }
  for (let i = 0; i < n; i++) if (wear[i]) reg[i] |= 128;
  console.log('wear verts', wear.reduce((a, b) => a + b, 0));
}
const regions = [...meta.regions, 'eye', 'iris']; for (let i = 0; i < n; i++) if (isEye[i]) reg[i] = N[i][2] > .9 ? 21 : 20;
// Curl axes: each finger bone bends towards the palm (palm side = -n of the hand frame); the thumb bends towards the grip
const curl = {};
for (const sd of ['Left', 'Right']) {
  const m = sd === 'Left' ? 1 : -1, nn = [FG.frame.n[0] * m, FG.frame.n[1], FG.frame.n[2]];
  for (const f of ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']) for (let k = 1; k <= 3; k++) {
    const a = CJ[sd + 'Hand' + f + k], b = CJ[sd + 'Hand' + f + (k + 1)], dv = norm(sub(b, a));
    const toward = f === 'Thumb' ? norm(sub(GRIP[sd], a)) : mul(nn, -1);
    curl[sd + 'Hand' + f + k] = norm(cross(dv, toward)).map((x) => +x.toFixed(4));
  }
}
const out = { bones, meshes: [{ name: 'Body', n, ni: ind.length }], regions, curl, grip: { Left: GRIP.Left.map((x) => +x.toFixed(3)), Right: GRIP.Right.map((x) => +x.toFixed(3)) } };
const json = Buffer.from(JSON.stringify(out)); const parts = []; const head = Buffer.alloc(4); head.writeUInt32LE(json.length); parts.push(head, json);
let off = 4 + json.length; const pad = () => { const p = (4 - (off % 4)) % 4; if (p) { parts.push(Buffer.alloc(p)); off += p; } };
for (const b of [pos, nor, ji, wi, reg, ind]) { pad(); const buf = Buffer.from(b.buffer, b.byteOffset, b.byteLength); parts.push(buf); off += buf.length; }
const gz = zlib.gzipSync(Buffer.concat(parts), { level: 9 }); fs.writeFileSync(process.env.OUT || 'body.bin.gz.b64', gz.toString('base64'));
const st = {}; reg.forEach(r => st[meta.regions[r]] = (st[meta.regions[r]] || 0) + 1); console.log(st, 'b64', gz.toString('base64').length);
