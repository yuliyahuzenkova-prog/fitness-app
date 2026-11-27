// v498: more machines — Smith squat/calf (smith rails), seated calf (thigh pad), lying leg curl (prone, roller), cable chest fly (crossCables), chest-supported row (machArms), cable kickback (ankleCable), kneeling cable crunch (rope), T-bar row (landmine)
const noRack = (q) => ({ ...q, props: [...(q.props || []).filter((x) => !x.squatrack), { smith: [-14] }] });
const SQ = ANIMS.squat_bar, BC = ANIMS.bb_calf, SC = ANIMS.seated_calf, KB = ANIMS.kickback_stand, RB = ANIMS.row_barbell;
const COL = (x, yP) => ({ column: [x, 0, yP, -1, 0] });
const fly = (h) => pose({ at: [95, 140], t: 2, a: 3, b: -3, armH: h, armBend: 16, props: [{ column: [95, 78, 42, 0, -1] }, { column: [95, -78, 42, 0, 1] }, { crossCables: [42, 78] }] });
const prone = (b, fd) => ({ anchor: "hip", at: [85, 86.5], t: 90, h: 20, a: -88, b, fd, u: 22, f: 95, props: [{ box: [58, 99, 68, 41, 13] }, { legPad: "shinBack" }, { handle: 1 }] });
const crunch = (t, c, h) => ({ anchor: "hip", at: [92, 104], t, c, h, a: 2, b: -90, fd: 180, u: 140 + (t - 10), f: -100 + (t - 10), props: [COL(166, 6), { cable: [163, 6] }] });
module.exports = {
  smith_squat: { ...SQ, glChrome: undefined, A: noRack(SQ.A), B: noRack(SQ.B) },
  smith_calf: { ...BC, A: { ...BC.A, props: [...(BC.A.props || []), { smith: [-14] }] }, B: { ...BC.B, props: [...(BC.B.props || []), { smith: [-14] }] } },
  seated_calf_m: { ...SC, A: { ...SC.A, props: [...SC.A.props, { legPad: "thighTop" }] }, B: { ...SC.B, props: [...SC.B.props, { legPad: "thighTop" }] } },
  lying_leg_curl: { yaw: 35, noKneel: true, ankle: 60, hz: 16, hzk: 1, palmDown: true, A: prone(-90, 180), B: prone(-178, 100) },
  cable_fly: { yaw: -30, palmMid: true, A: fly(86), B: fly(6) },
  machine_row: { yaw: -40, hipStay: true, fz: 6, palmMid: true, hz: 12, hzk: 1,
    A: { anchor: "hip", at: [84, 110], t: 10, a: 88, b: 0, fd: 0, u: 82, f: 86, props: [{ box: [62, 116, 40, 24] }, { box: [106, 84, 5, 16, 11] }, COL(150, 60), { machArms: [26, 30, 6] }] },
    B: { anchor: "hip", at: [84, 110], t: 10, a: 88, b: 0, fd: 0, u: -12, f: 88, props: [{ box: [62, 116, 40, 24] }, { box: [106, 84, 5, 16, 11] }, COL(150, 60), { machArms: [26, 30, 6] }] } },
  cable_kickback: { ...KB, wallHands: undefined, openHand: false, hz: 14, A: { ...KB.A, u: 76, f: 84, props: [COL(150, 130), { ankleCable: [147, 130] }] }, B: { ...KB.B, u: 76, f: 84, props: [COL(150, 130), { ankleCable: [147, 130] }] } },
  cable_crunch: { yaw: -40, noKneel: true, rope: true, closeGrip: true, palmMid: true, hz: 10, A: crunch(10, 0, 0), B: crunch(62, 16, 20) },
  tbar_row: { ...RB, palmMid: true, closeGrip: true, hz: 6, A: { ...RB.A, props: [{ landmine: [10] }] }, M: { ...RB.M, props: [{ landmine: [10] }] }, B: { ...RB.B, u: -66, f: 22, props: [{ landmine: [10] }] } },
};
