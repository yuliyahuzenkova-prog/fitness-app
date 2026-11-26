// v480: stretches for the cool-down — kneeling lat stretch with the elbows on a bench (palms together behind the head),
// standing upper-back stretch (hands clasped in front, pushed away, upper back rounded)
module.exports = {
  lat_bench: { yaw: -30, noKneel: true, hz: 1, palmMid: true, // (v484: elbows planted on the bench edge in both poses — the chest sinks by turning at the shoulders, not by sliding the elbows; the head drops in front of the bench, palms together; toes tucked under, heels up)
    A: { anchor: "hip", at: [70, 105], t: 93, h: 50, a: 8, b: -105, fd: -95, u: 100, f: -122, props: [{ box: [131, 105, 40, 35, 15] }] },
    B: { anchor: "hip", at: [71.8, 105.4], t: 99, h: 58, a: 12, b: -105, fd: -95, u: 112, f: -122, props: [{ box: [131, 105, 40, 35, 15] }] } },
  uback_stretch: { yaw: -40, hz: 2, closeGrip: true, tm: { up: 2.5, pause: 4, down: 2.5 }, period: 10000, // (v483: shows the move — hands clasped at the chest, then pushed forward with the upper back rounded and the chin down, knees soft; held, then back. Every key is in both poses: one only in B never blends in)
    A: pose({ at: [95, 140], t: 0, a: 5, b: -5, c: 0, h: 0, u: 28, f: 140 }),
    B: pose({ at: [95, 140], t: 6, a: 9, b: -9, c: 12, h: 28, u: 86, f: 90 }) },
};
