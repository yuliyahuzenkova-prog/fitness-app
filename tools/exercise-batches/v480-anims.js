// v480: stretches for the cool-down — kneeling lat stretch with the elbows on a bench (palms together behind the head),
// standing upper-back stretch (hands clasped in front, pushed away, upper back rounded)
module.exports = {
  lat_bench: { yaw: -30, noKneel: true, hz: 1,
    A: { anchor: "hip", at: [72, 104], t: 95, h: 35, a: 5, b: -90, fd: 180, u: 95, f: -122, props: [{ box: [132, 108, 40, 32, 15] }] },
    B: { anchor: "hip", at: [68, 106], t: 99, h: 35, a: 12, b: -90, fd: 180, u: 99, f: -121, props: [{ box: [132, 108, 40, 32, 15] }] } },
  uback_stretch: { yaw: -40, hz: 2, closeGrip: true, tm: { up: 2.5, pause: 4, down: 2.5 }, period: 10000, // (v483: shows the move — hands clasped at the chest, then pushed forward with the upper back rounded and the chin down, knees soft; held, then back. Every key is in both poses: one only in B never blends in)
    A: pose({ at: [95, 140], t: 0, a: 5, b: -5, c: 0, h: 0, u: 28, f: 140 }),
    B: pose({ at: [95, 140], t: 6, a: 9, b: -9, c: 12, h: 28, u: 86, f: 90 }) },
};
