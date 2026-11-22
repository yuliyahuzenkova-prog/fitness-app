// node qa/newanim.js defs.js ids out.png [phases] [yaws]
// defs.js: module.exports = { id: { ...ANIMS-style definition incl. 3D options } } (evaluated in the page)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [defsFile, ids, outp, phs = '0,0.5,1', yawsArg = ''] = process.argv.slice(2);
  const defsSrc = fs.readFileSync(defsFile, 'utf8');
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const shots = [];
  for (const fig of ['chromeF', 'chromeM']) {
    const p = await b.newPage({ viewport: { width: 1700, height: 1200 }, deviceScaleFactor: +(process.env.DSF || 1) });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.route('http://app.test/', (r) => r.fulfill({ path: path.resolve(__dirname, '../../../standalone/index.html'), contentType: 'text/html; charset=utf-8' }));
    await p.route('https://cdn.jsdelivr.net/**', (r) => r.fulfill({ path: path.resolve(__dirname, '../vendor/package/build/three.min.js'), contentType: 'application/javascript' }));
    await p.addInitScript((f) => { localStorage.setItem('liftbook-figure', JSON.stringify(f)); localStorage.setItem('liftbook-figure-v', '3'); }, fig);
    await p.goto('http://app.test/'); await p.waitForTimeout(500);
    await p.evaluate(async ([defsSrc, ids, phs, yawsArg]) => {
      const module = { exports: {} }; new Function('module', 'pose', defsSrc)(module, pose);
      for (const [id, d] of Object.entries(module.exports)) ANIMS[id] = d;
      glInit(); glStyle(); await proLoad(); document.querySelectorAll('header,main,nav').forEach((e) => e.remove());
      const list = ids.split(','), phases = phs.split(',').map(Number);
      document.body.insertAdjacentHTML('afterbegin', `<div id=g style="display:grid;grid-template-columns:repeat(${phases.length * 3},300px);gap:2px;background:#fff"></div>`);
      const g = document.getElementById('g');
      for (const id of list) {
        const an = ANIMS[id], y0 = an.yaw ?? -40, ys = yawsArg ? yawsArg.split(',').map(Number) : [y0, -90, y0 + 90];
        for (const yw of ys) for (const ph of phases) { const c = document.createElement('canvas'); c.className = 'anim big'; c.width = 600; c.height = 600; c.style.cssText = 'width:300px;height:300px'; g.appendChild(c); glDraw(c, id, ph, yw, []); }
      }
    }, [defsSrc, ids, phs, yawsArg]);
    await p.waitForTimeout(150);
    const f = outp.replace('.png', `-${fig}.png`); await p.screenshot({ path: f, fullPage: true }); shots.push(f);
    if (errs.length) console.log(fig, 'errors', errs.slice(0, 3));
    await p.close();
  }
  console.log(shots.join('\n')); await b.close();
})();
