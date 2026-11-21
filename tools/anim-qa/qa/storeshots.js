const { open } = require('./common');
// App Store screenshots: node qa/storeshots.js en|uk (raw screens), then node qa/storeframes.js (captions → app/store/screenshots)
const RAW = require('path').resolve(__dirname, '../../../backups/store-raw') + '/'; require('fs').mkdirSync(RAW, { recursive: true }); // (backups/ is gitignored)
const lang = process.argv[2];
(async () => {
  const { b, p, errs } = await open({ profile: 'hist', lang, width: 440, height: 956, figure: 'chromeF' });
  await p.addStyleTag({ content: ':root{padding-top:54px!important;padding-bottom:24px!important} .tabbar{bottom:20px!important} .scanwrap{padding-top:56px!important}' });
  await p.evaluate((lang) => { if (lang === 'en') S.intake.name = 'Anna'; render(); }, lang);
  const shot = async (n) => { await p.waitForTimeout(2600); await p.screenshot({ path: `${RAW}${lang}-${n}.png` }); };
  const go = async (f) => { await p.evaluate(f); await p.evaluate(() => scrollTo(0, 0)); };
  await go(() => { S.scan = null; S.session = null; S.tab = 'today'; render(); }); await shot(1);
  await go(() => { startSession(Object.keys(ROUTINES[S.routine].days)[0]); }); await p.waitForTimeout(800);
  const checks = await p.$$('.excard.cur .setgrid.set .check');
  for (const c of checks.slice(0, 2)) { await c.click(); await p.waitForTimeout(400); }
  await p.evaluate(() => scrollTo(0, 0)); await shot(2);
  await go(() => { stopRest(); S.session = null; S.tab = 'body'; S.bodyTab = 'body'; render(); }); await shot(3);
  await go(() => { S.tab = 'plan'; render(); }); await shot(4);
  await go(() => { S.tab = 'progress'; S.bodyTab = 'progress'; render(); }); await shot(5);
  await go(() => { S.scan = { step: 'intro', photo: {}, dim: {}, pts: {}, feet: null }; render(); }); await shot(6);
  await go(() => {
    S.scan = null; S.tab = 'today'; startSession(Object.keys(ROUTINES[S.routine].days)[0]);
    S.session.exercises.forEach((e) => { e.feel = e.feel || 'good'; e.sets.forEach((x) => { if (e.type === 'weight' && (x.w === '' || x.w == null)) x.w = '10'; if (!x.r) x.r = '10'; x.done = true; }); });
    render();
  });
  await p.evaluate(() => { stopRest(); return finishSession(true); }); await p.waitForTimeout(600);
  const ask = await p.$('[data-act="typook"],[data-act="finishok"]'); if (ask) await ask.click();
  await p.evaluate(() => scrollTo(0, 0)); await shot(7);
  console.log(lang, 'state', await p.evaluate(() => ({ summary: !!S.summary, session: !!S.session, tab: S.tab })), errs.slice(0, 3));
  await b.close();
})();
