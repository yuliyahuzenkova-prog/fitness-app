const G = { db: "wrist" }, gob = (p) => ({ ...p, u: 30, f: 140, props: [...(p.props || []), G] }), withDb = (p) => ({ ...p, props: [...(p.props || []), G] });
const RL = ANIMS.reverse_lunge, DB = ANIMS.dead_bug, GM = ANIMS.good_morning, SS = ANIMS.split_squat;
module.exports = {
  goblet_sumo: { yaw: -40, fz: 11, hz: 3, goblet: true, A: pose({ u: 30, f: 140, props: [G] }), B: pose({ a: 84, b: -28, t: 26, u: 30, f: 140, props: [G] }) },
  split_squat_db: { noKneel: true, yaw: -40, A: withDb(SS.A), B: withDb(SS.B) },
  goblet_lunge: { noKneel: true, yaw: -40, hz: 3, goblet: true, A: gob(RL.A), M: gob(RL.M), B: gob(RL.B) },
  pushup_wide: { ...ANIMS.pushup, hz: 24 },
  knee_pushup_close: { ...ANIMS.knee_pushup, hz: 9, plantPole: [200, .3, 1, 0, 1] },
  dead_bug_legs: { ...DB, A: DB.A, B: { ...DB.B, u2: 180, f2: 180 } },
  dead_bug_arms: { ...DB, A: DB.A, B: { ...DB.B, a: 180, b: 90, fd: 90 } },
  db_deadlift: { yaw: -30, barHang: true, dbFront: true, barHug: true, barHalf: 12, A: pose({ at: [100, 140], u: 0, f: 0, props: [G] }), B: pose({ at: [100, 140], a: 62, b: -32, t: 52, u: 0, f: 0, props: [G] }) },
  goblet_gm: { yaw: -30, hz: 3, goblet: true, A: gob(GM.A), B: gob(GM.B) },
};
