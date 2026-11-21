// Builds the public pages the App Store needs, from the same texts the app shows:
//   standalone/privacy/index.html   (Privacy Policy URL)
//   standalone/terms/index.html     (terms of use)
//   standalone/support/index.html   (Support URL)
// Usage: python3 build-standalone.py && python3 build-app.py && node tools/build-site-pages.js
// It loads app/www (the native-app build) in a headless browser with a stand-in for Capacitor, so the
// texts are the app's own wording (IN_APP), in English and Ukrainian. Upload the whole standalone/ folder to Netlify.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, ".."), WWW = path.join(ROOT, "app", "www"), OUT = path.join(ROOT, "standalone");
const SITE = "https://better-fit-you.netlify.app";

const CSS = `:root{--bg:#111317;--surface:#1a1c21;--ink:#f3f4f6;--muted:#a3a9b3;--accent:#ff6a45;--line:#2a2e36;color-scheme:dark}
@media (prefers-color-scheme: light){:root{--bg:#f2f3f5;--surface:#fff;--ink:#0f1115;--muted:#5d636d;--accent:#c2361a;--line:#e2e4e8;color-scheme:light}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;-webkit-text-size-adjust:100%}
main{max-width:680px;margin:0 auto;padding:32px 16px 64px}header{display:flex;align-items:center;gap:12px;margin-bottom:28px}
header img{width:40px;height:40px;border-radius:10px}header b{font-size:20px}nav{margin-left:auto;display:flex;gap:14px;font-size:15px}
a{color:var(--accent)}h1{font-size:34px;line-height:1.15;letter-spacing:-.02em;margin:0 0 6px}h2{font-size:22px;margin:40px 0 8px}
h3{font-size:17px;margin:24px 0 4px}p{margin:0 0 10px}.hint{color:var(--muted);font-size:15px}.lang{display:flex;gap:10px;font-size:15px;margin:0 0 20px}
section+section{border-top:1px solid var(--line);margin-top:40px;padding-top:8px}.card{background:var(--surface);border-radius:16px;padding:16px 18px;margin:16px 0}
footer{margin-top:48px;color:var(--muted);font-size:13px}`;

function page(title, desc, body, uk) {
  const icon = "data:image/png;base64," + fs.readFileSync(path.join(ROOT, "design", "brand", "relief-icon-180.png")).toString("base64");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Relief</title>
<meta name="description" content="${desc}">
<link rel="icon" href="${icon}">
<style>${CSS}</style>
</head>
<body><main>
<header><img src="${icon}" alt=""><b>Relief</b><nav><a href="/support/">Support</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></header>
<p class="lang"><a href="#en">English</a><a href="#uk">Українською</a></p>
<section id="en" lang="en">${body}</section>
<section id="uk" lang="uk">${uk}</section>
<footer>Relief · ${SITE.replace("https://", "")}</footer>
</main></body>
</html>
`;
}

(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  await p.route("http://app.test/**", (r) => { const f = r.request().url().replace("http://app.test/", "") || "index.html"; r.fulfill({ path: path.join(WWW, f), contentType: f.endsWith(".js") ? "text/javascript" : "text/html; charset=utf-8" }); });
  await p.addInitScript(() => { window.Capacitor = { isNativePlatform: () => true, Plugins: {} }; });
  await p.goto("http://app.test/"); await p.waitForTimeout(1500);
  const doc = (id, lang) => p.evaluate(([id, lang]) => {
    LANG_PREF = lang; LANG = lang; applyLang();
    const box = document.createElement("div"); box.innerHTML = docHtml(id, true); document.body.appendChild(box); translateDom(box);
    const a = box.querySelector("article"); const t = a.querySelector("h2"); const h = `<h1>${t.innerHTML}</h1>`; t.remove();
    const out = h + a.innerHTML; box.remove(); return out;
  }, [id, lang]);
  const contact = await p.evaluate(() => [APP_OWNER, APP_CONTACT, APP_VERSION]);
  if (!contact[0] || !contact[1]) throw new Error("APP_OWNER / APP_CONTACT are empty in liftbook.html");
  for (const id of ["privacy", "terms"]) {
    const en = await doc(id, "en"), uk = await doc(id, "uk");
    fs.mkdirSync(path.join(OUT, id), { recursive: true });
    fs.writeFileSync(path.join(OUT, id, "index.html"), page(id === "privacy" ? "Privacy policy" : "Terms of use", id === "privacy" ? "How the Relief app handles your data: it stays on your device." : "Terms of use for the Relief app.", en, uk));
  }
  const health = { en: await doc("health", "en"), uk: await doc("health", "uk") };
  const [owner, email, ver] = contact;
  const supEn = `<h1>Support</h1><p class="hint">Relief ${ver} · iPhone (iOS 16.4 or later) and Android</p>
<div class="card"><p><b>Write to us:</b> <a href="mailto:${email}">${email}</a></p><p class="hint">Questions, problems, ideas. Please include your phone model and what you were doing when something went wrong. ${owner}.</p></div>
<h2>Common questions</h2>
<h3>Where is my data?</h3><p>Only on your phone, inside the app. Relief has no account, no server and no tracking. See the <a href="/privacy/">privacy policy</a>.</p>
<h3>How do I move to a new phone?</h3><p>In <b>Me → Backup and restore</b>, tap <b>Save a backup</b> and keep the file (for example in Files or iCloud Drive). On the new phone, install Relief and tap <b>I have a backup to restore</b>, then pick the file.</p>
<h3>How do I delete my data?</h3><p>In <b>Me</b>, tap <b>Delete all my data</b>. Deleting the app also removes everything.</p>
<h3>Is the posture check a diagnosis?</h3><p>No. It's a rough posture check from photos, not a medical diagnosis. For pain that lasts or gets worse, see a doctor or physiotherapist.</p>
<h3>The 3D figure doesn't appear</h3><p>Relief needs iOS 16.4 or later. Update iOS in Settings → General → Software Update, then open Relief again.</p>
<h2>Health notice</h2>${health.en.replace(/<h1>.*?<\/h1>/, "")}`;
  const supUk = `<h1>Підтримка</h1><p class="hint">Relief ${ver} · iPhone (iOS 16.4 або новіша) і Android</p>
<div class="card"><p><b>Напиши нам:</b> <a href="mailto:${email}">${email}</a></p><p class="hint">Питання, проблеми, ідеї. Вкажи модель телефона і що відбувалося, коли щось пішло не так. ${owner}.</p></div>
<h2>Часті питання</h2>
<h3>Де зберігаються мої дані?</h3><p>Лише на твоєму телефоні, у застосунку. У Relief немає акаунта, сервера й стеження. Див. <a href="/privacy/#uk">політику конфіденційності</a>.</p>
<h3>Як перенести дані на новий телефон?</h3><p>У <b>«Я» → «Резервна копія та відновлення»</b> натисни <b>«Зберегти копію»</b> і збережи файл (наприклад, у «Файли» чи iCloud Drive). На новому телефоні встанови Relief, натисни <b>«У мене є резервна копія»</b> і вибери файл.</p>
<h3>Як видалити мої дані?</h3><p>У вкладці <b>«Я»</b> натисни <b>«Видалити всі мої дані»</b>. Видалення застосунку теж усе стирає.</p>
<h3>Оцінка постави — це діагноз?</h3><p>Ні. Це орієнтовна оцінка постави за фото, а не медичний діагноз. Якщо біль не минає або посилюється, звернися до лікаря чи фізіотерапевта.</p>
<h3>Не з'являється 3D-фігура</h3><p>Relief потребує iOS 16.4 або новішої. Онови iOS: Параметри → Загальні → Оновлення ПЗ, і відкрий Relief знову.</p>
<h2>Застереження щодо здоров'я</h2>${health.uk.replace(/<h1>.*?<\/h1>/, "")}`;
  fs.mkdirSync(path.join(OUT, "support"), { recursive: true });
  fs.writeFileSync(path.join(OUT, "support", "index.html"), page("Support", "Help and contact for the Relief app.", supEn, supUk));
  await b.close();
  console.log("wrote standalone/privacy/, standalone/terms/, standalone/support/");
})();
