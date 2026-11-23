// node qa/swipe.js — swipe-to-delete on a set row (workout screen, phone width): a short swipe opens Delete, a tap deletes,
// a long swipe deletes straight away; the last remaining set can't be swiped away
const { open } = require('./common');
const OUT = process.env.OUT || '/tmp';
(async () => {
  const { b, p, errs } = await open({ profile: 'hist', lang: 'uk', width: 390 });
  await p.evaluate(() => { S.tab = 'today'; render(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { const P = buildPlan(S.intake), pos = planPos(); startPlanSession(P.phases[pos.phase].workouts[0].key); render(); }); await p.waitForTimeout(600);
  const n0 = await p.evaluate(() => S.session && S.session.exercises[0].sets.length);
  for (let k = 0; k < 2; k++) { await p.evaluate(() => document.querySelector('[data-act="addset"]').click()); await p.waitForTimeout(300); }
  const n1 = await p.evaluate(() => S.session.exercises[0].sets.length);
  const touch = (type, x, y) => p.evaluate(([type, x, y]) => {
    const el = document.elementFromPoint(x, y), t = new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
    el.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches: type === 'touchend' ? [] : [t], changedTouches: [t] }));
  }, [type, x, y]);
  const lastRow = async () => { const all = await p.$$('.setswipe[data-ex="0"]'); const l = all[all.length - 1]; await l.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(200); return [l, await l.boundingBox()]; };
  let [last, bb] = await lastRow(); let y = bb.y + bb.height / 2, x0 = bb.x + bb.width - 150;
  await touch('touchstart', x0, y); for (let k = 1; k <= 6; k++) await touch('touchmove', x0 - k * 20, y); await touch('touchend', x0 - 120, y); await p.waitForTimeout(400);
  const opened = await p.evaluate(() => document.querySelectorAll('.setswipe.open').length);
  await last.screenshot({ path: OUT + '/swipe-open.png' });
  await p.evaluate(() => document.querySelector('.setswipe.open .setdel').click()); await p.waitForTimeout(300);
  const n2 = await p.evaluate(() => S.session.exercises[0].sets.length);
  [last, bb] = await lastRow(); y = bb.y + bb.height / 2; const xs = bb.x + bb.width - 20;
  await touch('touchstart', xs, y); for (let k = 1; k <= 12; k++) await touch('touchmove', xs - k * 25, y); await touch('touchend', xs - 300, y); await p.waitForTimeout(600);
  const n3 = await p.evaluate(() => S.session.exercises[0].sets.length);
  const swipesLeft = await p.evaluate(() => document.querySelectorAll('.setswipe[data-ex="0"]').length);
  await p.screenshot({ path: OUT + '/swipe-after.png' });
  console.log({ swipeRowsWhenOneSetLeft: swipesLeft, start: n0, afterAdd: n1, openedAfterShortSwipe: opened, afterTapDelete: n2, afterLongSwipe: n3, errors: errs });
  await b.close();
})();
