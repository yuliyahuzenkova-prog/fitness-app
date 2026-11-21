const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
// App Store screenshots: node qa/storeshots.js en|uk (raw screens), then node qa/storeframes.js (captions → app/store/screenshots)
const RAW = require('path').resolve(__dirname, '../../../backups/store-raw') + '/'; require('fs').mkdirSync(RAW, { recursive: true }); // (backups/ is gitignored)
const OUT = path.resolve(__dirname, '../../../app/store/screenshots');
const CAP = {
  en: [['A plan built around you', 'Your goal, schedule and equipment'], ['Log every set in seconds', "Last time's numbers and a rest timer"], ['See the muscles you trained', 'And how recovered each one is'], ['24 weeks, step by step', 'Four phases that adapt as you go'], ['Watch your body change', 'Then and now, records and streaks'], ['Check your posture', 'Two photos, a few taps. Not a diagnosis.'], ['Every workout counts', 'Private, offline, no account']],
  uk: [['План, складений під тебе', 'Твоя мета, розклад та інвентар'], ['Записуй підходи за секунди', 'Минулі цифри й таймер відпочинку'], ["Бач натреновані м'язи", 'І наскільки відновився кожен'], ['24 тижні, крок за кроком', 'Чотири фази, що підлаштовуються'], ['Дивись, як змінюється тіло', 'Тоді й зараз, рекорди, тижні поспіль'], ['Перевір поставу', 'Два фото й кілька дотиків. Не діагноз.'], ['Кожне тренування рахується', 'Приватно, без інтернету й акаунта']],
};
const status = `<div class="sb"><b>9:41</b><svg viewBox="0 0 78 14" width="78" height="14"><g fill="#fff"><rect x="0" y="9" width="3" height="5" rx="1"/><rect x="5" y="6" width="3" height="8" rx="1"/><rect x="10" y="3" width="3" height="11" rx="1"/><rect x="15" y="0" width="3" height="14" rx="1"/><path d="M31 4.5a10 10 0 0 1 14 0l-1.6 1.6a7.7 7.7 0 0 0-10.8 0zM34 7.6a5.6 5.6 0 0 1 8 0L38 11.6z"/><rect x="52" y="1" width="22" height="12" rx="3.5" fill="none" stroke="#fff" stroke-opacity=".5"/><rect x="54" y="3" width="16" height="8" rx="2"/><rect x="75" y="5" width="2" height="4" rx="1" fill-opacity=".5"/></g></svg></div>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 3 });
  for (const lang of ['en', 'uk']) {
    fs.mkdirSync(path.join(OUT, lang), { recursive: true });
    for (let i = 1; i <= 7; i++) {
      const img = 'data:image/png;base64,' + fs.readFileSync(`${RAW}${lang}-${i}.png`).toString('base64');
      const [h, sub] = CAP[lang][i - 1];
      await p.setContent(`<html><head><style>
        *{margin:0;box-sizing:border-box}body{width:440px;height:956px;overflow:hidden;background:radial-gradient(120% 60% at 50% 0%,#3a3f48 0%,#1d2026 55%,#111317 100%);font-family:"Inter Display","Inter",sans-serif;color:#f3f4f6;text-align:center}
        h1{font-size:${h.length > 24 ? 33 : 36}px;font-weight:800;letter-spacing:-.025em;line-height:1.08;margin:58px 28px 10px;text-wrap:balance}
        p{font-family:"Inter",sans-serif;font-size:17px;color:#b8bdc6;margin:0 32px;text-wrap:balance}
        .phone{position:absolute;left:44px;top:206px;width:352px;border-radius:46px;padding:7px;background:#0b0c0e;box-shadow:0 30px 60px rgba(0,0,0,.55),0 0 0 1.5px #3a3f48}
        .screen{position:relative;border-radius:39px;overflow:hidden}.screen img{display:block;width:100%}
        .sb{position:absolute;top:0;left:0;right:0;height:42px;display:flex;align-items:center;justify-content:space-between;padding:6px 26px 0 34px;font:600 14px "Inter",sans-serif;color:#fff}
        .island{position:absolute;top:9px;left:50%;width:96px;height:28px;margin-left:-48px;border-radius:20px;background:#000}
        .glow{position:absolute;left:50%;top:240px;width:420px;height:420px;margin-left:-210px;border-radius:50%;background:radial-gradient(circle,rgba(255,74,42,.16),transparent 65%)}
      </style></head><body><div class="glow"></div><h1>${h}</h1><p>${sub}</p>
      <div class="phone"><div class="screen"><img src="${img}">${status}<div class="island"></div></div></div></body></html>`);
      await p.waitForTimeout(150);
      await p.screenshot({ path: path.join(OUT, lang, `0${i}.png`) });
    }
  }
  await b.close(); console.log('framed screenshots written');
})();
