// Renders the brand SVGs to the PNG sizes app stores, phones and browsers ask for (needs Playwright with Chromium)
// Usage: node design/brand/export-png.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const dir = __dirname;
const jobs = [['relief-icon.svg', [1024, 512, 192, 180]], ['relief-icon-dark.svg', [1024]], ['relief-icon-tinted.svg', [1024]], ['relief-icon-orange.svg', [1024]], ['relief-favicon.svg', [48, 32, 16]]];
(async () => { const b = await chromium.launch(), p = await b.newPage();
  for (const [f, sizes] of jobs) { const svg = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const s of sizes) { await p.setViewportSize({ width: s, height: s });
      await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('width="1024" height="1024"', `width="${s}" height="${s}"`)}</body></html>`);
      await p.screenshot({ path: path.join(dir, f.replace('.svg', `-${s}.png`)), omitBackground: true, clip: { x: 0, y: 0, width: s, height: s } }); } }
  await b.close(); console.log('exported PNGs'); })();
