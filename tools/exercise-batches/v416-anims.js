const DBW = { db: "wrist" }, gob = (p) => ({ ...p, u: 30, f: 140, props: [...(p.props || []).filter((q) => !q.db), DBW] }), dbs = (p) => ({ ...p, u: 0, f: 0, props: [...(p.props || []).filter((q) => !q.db), DBW] });
const mp = (an, f) => { const o = { ...an }; for (const k of ["A", "M", "B"]) if (o[k]) o[k] = f(o[k]); if (o.keys) o.keys = o.keys.map(f); if (o.glChrome) { o.glChrome = { ...o.glChrome }; for (const k of ["A", "M", "Mup", "B"]) if (o.glChrome[k]) o.glChrome[k] = f(o.glChrome[k]); } return o; };
const BD = ANIMS.bird_dog, LL = ANIMS.leg_lowers, TT = ANIMS.toe_taps;
module.exports = {
  goblet_split: { ...mp(ANIMS.split_squat, gob), hz: 3, goblet: true },
  goblet_stepup: { ...mp(ANIMS.step_up, gob), hz: 3, goblet: true },
  db_box_squat: mp(ANIMS.squat_box, dbs),
  goblet_bulgarian: { ...mp(ANIMS.bulgarian, gob), hz: 3, goblet: true },
  sl_rdl_db: mp(ANIMS.sl_rdl, (p) => ({ ...p, props: [...(p.props || []).filter((q) => !q.db), DBW] })),
  goblet_chair: { ...mp(ANIMS.squat_chair, gob), hz: 3, goblet: true },
  bridge_wide: { ...ANIMS.glute_bridge, fz: 10 },
  wide_rdl: { ...ANIMS.rdl, fz: 9 },
  farmer_march: { ...mp(ANIMS.stand_march, dbs), hz: 11 },
  pushup_close: { ...ANIMS.pushup, hz: 9, plantPole: [200, .3, 1, 0, 1] },
  knee_pushup_wide: { ...ANIMS.knee_pushup, hz: 24 },
  floor_press_close: { ...ANIMS.floor_press, hz: 8, flare: 0 },
  wall_pushup_wide: { ...ANIMS.wall_pushup, hz: 26 },
  wall_pushup_close: { ...ANIMS.wall_pushup, hz: 9 },
  db_row_under: { ...ANIMS.db_row, palmMid: false, palmUp: true },
  bird_arm: { ...BD, B: { ...BD.B, a2: 0, b2: -90, fd2: -90, a: 0, b: -90, fd: -90 }, glChrome: BD.glChrome && { ...BD.glChrome, B: { ...BD.glChrome.B, a: 0, b: -90, fd: -90 } } },
  bird_leg: { ...BD, B: { ...BD.B, u2: 0, f2: 0 }, glChrome: BD.glChrome && { ...BD.glChrome, B: { ...BD.glChrome.B, u2: 0, f2: 0 } } },
  toe_taps_double: { ...TT, alt: false, period: 4800, B: { ...TT.B, a: TT.B.a2, b: TT.B.b2, fd: TT.B.fd2 } },
  single_leg_lowers: { ...LL, alt: true, period: 8000, B: { ...LL.B, a2: LL.A.a, b2: LL.A.b, fd2: LL.A.fd } },
  plank_high_lift: { ...ANIMS.plank_high, alt: true, period: 5600, A: pose({ at: [38, 134], a: -64, b: -65, t: 64, u: 0, f: 0, fd: -60, a2: -64, b2: -65, fd2: -60 }), B: pose({ at: [38, 134], a: -64, b: -65, t: 64, u: 0, f: 0, fd: -60, a2: -80, b2: -84, fd2: -40 }) },
};
