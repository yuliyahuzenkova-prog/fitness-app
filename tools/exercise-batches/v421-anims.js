const DBW = { db: "wrist" }, gob = (p) => ({ ...p, u: 30, f: 140, props: [...(p.props || []).filter((q) => !q.db), DBW] }), dbs = (p) => ({ ...p, u: 0, f: 0, props: [...(p.props || []).filter((q) => !q.db), DBW] });
const mp = (an, f) => { const o = { ...an }; for (const k of ["A", "M", "B"]) if (o[k]) o[k] = f(o[k]); if (o.keys) o.keys = o.keys.map(f); if (o.glChrome) { o.glChrome = { ...o.glChrome }; for (const k of ["A", "M", "Mup", "B"]) if (o.glChrome[k]) o.glChrome[k] = f(o.glChrome[k]); } return o; };
const GB = { hz: 3, goblet: true, armsCrossed: false }, hold = (an) => ({ ...an, A: an.B, B: an.B, alt: false });
const YTW = ANIMS.prone_ytw, one = (i) => { const o = { ...YTW, period: 4200 }; delete o.seq; o.A = YTW.seq[i].A; o.B = YTW.seq[i].B; return o; };
const HH = ANIMS.hollow_hold, SM = ANIMS.superman_hold, TT = ANIMS.toe_taps, DB = ANIMS.dead_bug;
module.exports = {
  sumo_db: { ...mp(ANIMS.sumo_squat, dbs), armsCrossed: false, hz: 13 },
  goblet_calf: { ...mp(ANIMS.calf_raise, gob), ...GB },
  goblet_squat_hold: { ...mp(ANIMS.squat_hold, gob), ...GB },
  goblet_split_hold: { ...mp(ANIMS.split_hold, gob), ...GB },
  goblet_wall_sit: { ...mp(ANIMS.wall_sit, gob), ...GB },
  goblet_sit_stand: { ...mp(ANIMS.sit_to_stand, gob), ...GB },
  stair_db: mp(ANIMS.step_up_stair, dbs),
  goblet_stair: { ...mp(ANIMS.step_up_stair, gob), ...GB },
  goblet_box_high: { ...mp(ANIMS.squat_box_high, gob), ...GB },
  chair_squat_db: mp(ANIMS.squat_chair, dbs),
  goblet_lunge_short: { ...mp(ANIMS.reverse_lunge_short, gob), ...GB },
  lunge_short_db: mp(ANIMS.reverse_lunge_short, dbs),
  incline_wide: { ...ANIMS.incline_pushup, hz: 24, plantKeepZ: true },
  incline_close: { ...ANIMS.incline_pushup, hz: 9, plantKeepZ: true, plantPole: [40, .2, 1, -.8, 1] },
  incline_chair_wide: { ...ANIMS.incline_chair, hz: 24, plantKeepZ: true },
  incline_chair_close: { ...ANIMS.incline_chair, hz: 9, plantKeepZ: true, plantPole: [40, .2, .5, -1, 1] },
  pike_wide: { ...ANIMS.pike_pushup, hz: 22 },
  curl_reverse: { ...ANIMS.curl_db, palmUp: false, palmDown: true },
  row_wide: { ...ANIMS.db_row, hz: 22, hzk: 1, palmMid: false, palmDown: true },
  prone_t: one(1),
  prone_w: one(2),
  prone_t_hold: hold(one(1)),
  dead_bug_hold: { ...DB, A: DB.B, B: DB.B, alt: false },
  hollow_overhead: { ...HH, A: { ...HH.A, u: 180, f: 180 }, B: { ...HH.B, u: 180, f: 180 } },
  superman_sides: { ...SM, A: { ...SM.A, u: -82, f: -82 }, B: { ...SM.B, u: -82, f: -82 } },
  tabletop_hold: { ...TT, alt: false, A: TT.A, B: TT.A },
  sit_stand_db: { ...mp(ANIMS.sit_to_stand, dbs), armsCrossed: false },
  goblet_box: { ...mp(ANIMS.squat_box, gob), ...GB },
  prone_w_hold: hold(one(2)),
};
