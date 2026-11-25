TECH.cable_pushdown = { lab: ["Straighten your arms", "Return slowly"] };
const PL = { plate: "wrist" }, SHB = { plate: "sh" }, DBW = { db: "wrist" };
const swapP = (p, f) => ({ ...p, props: (p.props || []).map(f) });
const mp = (an, f) => { const o = { ...an }; for (const k of ["A", "M", "B"]) if (o[k]) o[k] = f(o[k]); if (o.keys) o.keys = o.keys.map(f); return o; };
const toBar = (p) => swapP(p, (q) => (q.db ? PL : q));
const BBS = { barHalf: ANIMS.squat_bar.barHalf, barUp: ANIMS.squat_bar.barUp, barHug: ANIMS.squat_bar.barHug, hz: 20, fz: 5 };
const backBar = (p) => ({ ...p, u: -45, f: 150, props: [...(p.props || []).filter((q) => !q.db), SHB] });
const gobT = (p) => ({ ...p, u: 30 + (p.t || 0), f: 140 + (p.t || 0) });
const ang = (v) => Math.atan2(v[0], v[1]) * 180 / Math.PI;
const reach = (p, tgt, out = 1) => { const P = sidePoints(p), s = P.sh, dx = tgt[0] - s[0], dy = tgt[1] - s[1], d = Math.min(Math.hypot(dx, dy), SEG.upper + SEG.fore - .5), a1 = Math.acos((SEG.upper * SEG.upper + d * d - SEG.fore * SEG.fore) / (2 * SEG.upper * d)), base = Math.atan2(dx, dy), u = base + out * a1, e = [s[0] + Math.sin(u) * SEG.upper, s[1] + Math.cos(u) * SEG.upper]; return { ...p, u: u * 180 / Math.PI, f: ang([tgt[0] - e[0], tgt[1] - e[1]]) }; };
// 45° back-extension bench: thighs on an angled pad, heels under a roller
const HX = { anchor: "hip", at: [100, 78], a: -45, b: -45, fd: -45 };
const hxProps = [{ slab: [80, 107, 104, 83, 7, 30] }, { box: [44, 110, 9, 8, 12] }, { box: [32, 126, 32, 4, 20] }];
const HYP = { yaw: -20, armsCrossed: true, noKneel: true, A: { ...HX, t: 150, h: 0, u: 0, f: 0, props: hxProps }, B: { ...HX, t: 45, h: 0, u: 0, f: 0, props: hxProps } };
// reverse hyper: chest on a high bench, legs hang and lift
const rhProps = [{ box: [82, 86, 50, 7] }, { benchlegs: [94, 93, 34] }];
const RH = { yaw: -20, noKneel: true, hz: 24, hzk: 1, A: { anchor: "hip", at: [80, 77], t: 90, h: 0, a: -10, b: -6, fd: 20, u: 4, f: 4, props: rhProps }, B: { anchor: "hip", at: [80, 77], t: 90, h: 0, a: -84, b: -86, fd: -60, u: 4, f: 4, props: rhProps } };
const gc = (an) => { const g = an.glChrome; if (!g) return an; const o = { ...an, ...(g.set || {}) }; for (const k of ["A", "M", "B"]) if (g[k]) o[k] = g[k]; delete o.glChrome; return o; };
const LP = ANIMS.leg_press, lpA = LP.A, lpB = LP.B;
const PU = ANIMS.pullup, DH = ANIMS.dead_hang, HB = { hbar: [110, -30] };
const chinB = { anchor: "hand", at: [110, -30], t: -10, u: 25, f: 166, a: 14, b: 0, fd: -60, props: [HB] };
const LPD = ANIMS.lat_pulldown, lpdBox = LPD.A.props;
const col = (x, y) => [{ cable: [x - 3, y] }, { column: [x, 0, y, -1, 0] }];
const BB = gc(ANIMS.bench_bar), BP = gc(ANIMS.bench_press), PP = gc(ANIMS.press_bar), RC = gc(ANIMS.row_cable), PN = gc(ANIMS.pull_neg);
const incl = (o) => ({ ...o, anchor: "hip", at: [84, 110], t: -40, a: 90, b: 0, fd: 0, props: [...(o.props || []).filter((q) => !q.box && !q.benchlegs && !q.benchrack), { box: [62, 116, 40, 24] }, { slab: [60, 108, 38, 80, 5, 30] }] });
const HT = ANIMS.hip_thrust;
const CRW = { ...RC, palmIn: false, closeGrip: false, palmDown: true, hz: 22, A: { ...RC.A, props: [{ cable: [190, 112] }, { handle: 1 }] }, B: { ...RC.B, u: -20, f: 85, props: [{ cable: [190, 112] }, { handle: 1 }] } };
const EXTRA = {}; { const E = EXTRA, HTS = ANIMS.hip_thrust_single, HTM = ANIMS.hip_thrust_machine, GB2 = ANIMS.glute_bridge, TO = ANIMS.tri_overhead;
  const onHip = (p, dy = -9) => { const P = sidePoints(p); return reach({ ...p, props: [...(p.props || []), PL] }, [P.hip[0] + 2, P.hip[1] + dy], -1); };
  E.incline_bb = { ...BB, hz: 22, A: incl({ ...BB.A, u: 115, f: 217 }), B: incl({ ...BB.B, u: 190, f: 190 }) };
  const sit = (o) => ({ ...o, anchor: "hip", at: [84, 110], t: 0, a: 90, b: 0, fd: 0, props: [...(o.props || []), { box: [62, 116, 40, 24] }, { slab: [66, 115, 66, 84, 5, 34] }] });
  E.seated_bb_press = { ...PP, A: sit(PP.A), B: sit(PP.B) };
  E.bb_stepup = { ...mp(ANIMS.step_up_db, backBar), ...BBS };
  E.ht_machine_single = { ...HTM, A: { ...HTM.A, a2: HTS.A.a2, b2: HTS.A.b2, fd2: HTS.A.fd2 }, B: { ...HTM.B, a2: HTS.B.a2, b2: HTS.B.b2, fd2: HTS.B.fd2 } };
  E.bb_glute_bridge = { ...GB2, plantAll: false, plantPole: undefined, plantSlide: 0, hz: 20, A: onHip(GB2.A, -10), B: onHip(GB2.B, -10) };
  E.bb_hipthrust = { ...HT, hz: 20, A: onHip(HT.A), B: onHip(HT.B) };
  E.cable_oh_tri = { ...TO, rope: true, hz: 14, hzk: 1 /* (v443: the rope ends apart, elbows beside the head — at 4 the arms folded into each other) */, A: { ...TO.A, t: 12, props: [{ cable: [28, 70] }, { column: [25, 0, 70, 1, 0] }] }, B: { ...TO.B, t: 12, props: [{ cable: [28, 70] }, { column: [25, 0, 70, 1, 0] }] } };
  E.cable_row_under = { ...CRW, palmDown: false, palmUp: true, hz: 15 };
  E.leg_press_wide = { ...LP, fz: 13 };
}
module.exports = {
  hyperext: HYP,
  hyperext_weight: { ...HYP, A: { ...HYP.A, t: 135, props: [...hxProps, DBW] }, B: { ...HYP.B, props: [...hxProps, DBW] } },
  reverse_hyper: RH,
  bb_row_under: { ...ANIMS.row_barbell, palmUp: true, hz: 17 },
  bb_goodmorning: { ...ANIMS.squat_bar, barBack: true, A: backBar(pose({})), B: backBar(pose({ a: 15, b: -8, t: 68 })) },
  sumo_dl: { ...ANIMS.deadlift, fz: 14, hz: 9, A: pose({ at: [100, 140], a: 55, b: -22, t: 42, u: 0, f: 0, props: [PL] }), M: pose({ at: [100, 140], a: 30, b: -8, t: 22, u: 8, f: 8, props: [PL] }), B: pose({ at: [100, 140], u: 6, f: 8, props: [PL] }) },
  leg_press_full: { ...LP, A: { ...lpA, a: 160, b: 50 } },
  leg_press_high: { ...LP, A: { ...lpA, a: 165, b: 72 }, B: { ...lpB, a: 128, b: 112 } },
  leg_press_narrow: { ...LP, fz: 1 },
  leg_press_calf: { ...LP, A: { ...lpB, fd: 70 }, B: { ...lpB, fd: 118 } },
  bb_box_squat: { ...ANIMS.squat_box, ...BBS, A: backBar(ANIMS.squat_box.A), B: backBar(ANIMS.squat_box.B) },
  bb_reverse_lunge: { ...mp(ANIMS.reverse_lunge_db, backBar), ...BBS },
  bb_split_squat: { ...mp(ANIMS.split_squat_db, backBar), ...BBS },
  bb_calf: { ...mp(ANIMS.calf_db, backBar), palmMid: false, ...BBS },
  bb_bulgarian: { ...mp(ANIMS.bulgarian, backBar), ...BBS },
  bench_close: { ...BB, hz: 11 },
  bench_wide: { ...BB, hz: 31 },
  incline_db: { ...BP, A: incl({ ...BP.A, u: 115, f: 217 }), B: incl({ ...BP.B, u: 190, f: 190 }) },
  db_bench_neutral: { ...BP, palmMid: true, flare: .2 },
  db_pullover: { ...BP, closeGrip: true, hz: 3, palmMid: true, flare: 0, A: { ...BP.A, u: 178, f: 182 }, B: { ...BP.A, u: 250, f: 262 } },
  bb_floor_press: { ...mp(ANIMS.floor_press, toBar), hz: 22, barPalm: ANIMS.bench_bar.barPalm, barHug: ANIMS.bench_bar.barHug },
  push_press: { ...PP, M: { ...PP.A, a: 18, b: -18 } },
  bb_front_raise: { ...mp(ANIMS.front_raise, toBar), hz: 12 },
  bb_curl: { ...mp(ANIMS.curl_db, toBar), hz: 16, barPalm: "curl" },
  bb_reverse_curl: { ...mp(ANIMS.curl_db, toBar), hz: 16, palmUp: false, palmDown: true, barPalm: "rcurl" },
  cable_curl: { ...ANIMS.curl_db, hz: 14, A: { ...ANIMS.curl_db.A, props: [...col(150, 134), { handle: 1 }] }, B: { ...ANIMS.curl_db.B, props: [...col(150, 134), { handle: 1 }] } },
  pushdown: { yaw: -40, palmAway: true, closeGrip: true, hz: 8, hzk: 1, A: pose({ t: 12, u: 6, f: 100, props: [...col(140, 8), { handle: 1 }] }), B: pose({ t: 12, u: 6, f: 30, props: [...col(140, 8), { handle: 1 }] }) }, /* (v447: the bar stays in front of the thighs at the bottom, hands close, a slight lean) */
  rope_pushdown: { yaw: -40, palmMid: true, rope: true, hz: 5, A: pose({ t: 12, u: 6, f: 100, props: col(140, 8) }), B: pose({ t: 12, u: 6, f: 22, hz: 14, props: col(140, 8) }) },
  lying_tri_bench: { ...BP, palmMid: true, flare: 0, A: { ...BP.A, u: 190, f: 190 }, B: { ...BP.A, u: 195, f: 298 } },
  bb_skull: { ...BB, hz: 9, palmDown: true, A: { ...BB.A, u: 190, f: 190 }, B: { ...BB.A, u: 195, f: 298 } },
  pulldown_close: { ...LPD, frontArms: false, wideBar: false, palmFwd: false, palmMid: true, hz: 7, A: { ...LPD.A, u: 175, f: 178 }, B: { ...LPD.B, t: -12, u: 8, f: 158 } },
  pulldown_under: { ...LPD, frontArms: false, wideBar: false, palmFwd: false, palmUp: true, palmUpFront: true, bendHand: "old", hz: 14, A: { ...LPD.A, u: 175, f: 178 }, B: { ...LPD.B, t: -12, u: 8, f: 158 } },
  straight_pd: { yaw: -40, palmDown: true, hz: 14, A: pose({ a: 10, b: -6, t: 22, u: 150, f: 152, props: [...col(185, 10), { handle: 1 }] }), B: pose({ a: 10, b: -6, t: 22, u: 4, f: 6, props: [...col(185, 10), { handle: 1 }] }) },
  cable_row_wide: CRW,
  chinup: { ...PU, frontArms: false, palmFwd: false, palmUp: true, palmUpFront: true, bendHand: undefined, hz: 13, A: { ...PU.A, u: 180, f: 180 }, B: chinB },
  chinup_neg: { ...PN, frontArms: false, palmFwd: false, palmUp: true, palmUpFront: true, bendHand: undefined, hz: 13 },
  hang_knee: { ...DH, A: DH.A, B: { ...DH.A, t: -6, a: 96, b: 2 } },
  hang_leg: { ...DH, A: DH.A, B: { ...DH.A, t: -14, a: 86, b: 84 } },
  flexed_hang: { ...PU, frontArms: false, palmFwd: false, palmUp: true, palmUpFront: true, bendHand: undefined, hz: 13, A: chinB, B: chinB },
  ...EXTRA,
};
