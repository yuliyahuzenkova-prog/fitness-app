// v497: gym machines — seated hip abduction/adduction (legSpread), leg extension and seated leg curl (legPad rollers), pec deck and reverse fly (armH), chest and shoulder press (machArms levers)
const SEAT = [{ box: [62, 116, 40, 24] }, { slab: [62, 115, 58, 80, 5, 34] }, { column: [40, 0, 60, 1, 0] }];
const seat = (o) => ({ anchor: "hip", at: [84, 110], t: 0, a: 90, b: 0, fd: 0, u: 2, f: 4, ...o, props: [...SEAT, ...(o.props || [])] });
const SG = { yaw: -40, seatGrip: true, hipStay: true, hz: 17.8, hzk: .5 };
const AR = { yaw: -40, hipStay: true, fz: 6, palmMid: true };
const SEAT2 = [{ box: [62, 116, 40, 24] }, { slab: [62, 115, 58, 76, 5, 34] }, { column: [40, 0, 60, 1, 0] }];
const seat2 = (o) => ({ anchor: "hip", at: [84, 110], t: -4, a: 88, b: 0, fd: 0, ...o, props: [...SEAT2, ...(o.props || [])] });
module.exports = {
  hip_abd: { ...SG, fz: 3, A: seat({ legSpread: 4, props: [{ legPad: "out" }] }), B: seat({ legSpread: 30, props: [{ legPad: "out" }] }) },
  hip_add: { ...SG, fz: 3, A: seat({ legSpread: 30, props: [{ legPad: "in" }] }), B: seat({ legSpread: 4, props: [{ legPad: "in" }] }) },
  leg_ext_m: { ...SG, fz: 3, ankle: 85, A: seat({ b: -5, fd: -5, props: [{ legPad: "shinFront" }] }), B: seat({ b: 78, fd: 100, props: [{ legPad: "shinFront" }] }) },
  leg_curl_m: { ...SG, fz: 3, ankle: 70, A: seat({ at: [84, 108.4], t: -3, b: 75, fd: 100, props: [{ legPad: "shinBack" }, { legPad: "thighTop" }] }), B: seat({ at: [84, 108.4], t: -3, b: -5, fd: 20, props: [{ legPad: "shinBack" }, { legPad: "thighTop" }] }) },
pec_deck: { ...AR, A: seat2({ armH: 80, armBend: 14, props: [{ machArms: [34, -8, 6] }] }), B: seat2({ armH: 8, armBend: 14, props: [{ machArms: [34, -8, 6] }] }) },
  rev_fly: { ...AR, A: { anchor: "hip", at: [84, 110], t: 8, a: 88, b: 0, fd: 0, armH: 6, armBend: 6, props: [{ box: [62, 116, 40, 24] }, { box: [105, 76, 5, 23, 14] }, { column: [146, 0, 60, -1, 0] }, { machArms: [32, 18, 6] }] }, B: { anchor: "hip", at: [84, 110], t: 8, a: 88, b: 0, fd: 0, armH: 88, armBend: 6, props: [{ box: [62, 116, 40, 24] }, { box: [105, 76, 5, 23, 14] }, { column: [146, 0, 60, -1, 0] }, { machArms: [32, 18, 6] }] } },
  chest_press_m: { ...AR, hz: 22, hzk: 1, A: seat2({ u: -60, f: 90, props: [{ machArms: [30, -14, 6] }] }), B: seat2({ u: 84, f: 88, props: [{ machArms: [30, -14, 6] }] }) },
  shoulder_press_m: { ...AR, palmMid: false, palmFwd: true, hz: 26, hzk: 1, A: seat2({ u: 30, f: 170, props: [{ machArms: [12, -24, 6] }] }), B: seat2({ u: 172, f: 178, props: [{ machArms: [12, -24, 6] }] }) }
};
