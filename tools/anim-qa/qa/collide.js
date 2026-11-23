// node qa/collide.js [ids|all] [defs.js]
// Collision check for exercise animations on both chrome figures: poses every animation through its whole rep (11 phases;
// alternating ones through both sides) and reports any body point (bone: fingertips, hands, feet, toes, knees, head...) that
// goes into the floor or into a prop (wall, box, bench, chair...). Optional defs.js (module.exports = { id: {...} }) is
// injected first, so new animations can be checked before they are added to liftbook.html.
// Output: one line per animation with a problem — the deepest point, how deep (cm-ish units), at which phase, into what.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [idsArg = 'all', defsFile] = process.argv.slice(2);
  const defsSrc = defsFile ? fs.readFileSync(defsFile, 'utf8') : 'module.exports = {};';
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const all = {};
  for (const fig of ['chromeF', 'chromeM']) {
    const p = await b.newPage({ viewport: { width: 400, height: 400 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.route('http://app.test/', (r) => r.fulfill({ path: path.resolve(__dirname, '../../../standalone/index.html'), contentType: 'text/html; charset=utf-8' }));
    await p.route('https://cdn.jsdelivr.net/**', (r) => r.fulfill({ path: path.resolve(__dirname, '../vendor/package/build/three.min.js'), contentType: 'application/javascript' }));
    await p.addInitScript((f) => { localStorage.setItem('liftbook-figure', JSON.stringify(f)); localStorage.setItem('liftbook-figure-v', '3'); }, fig);
    await p.goto('http://app.test/'); await p.waitForTimeout(500);
    const res = await p.evaluate(async ([defsSrc, idsArg]) => {
      const module = { exports: {} }; new Function('module', 'pose', defsSrc)(module, pose);
      for (const [id, d] of Object.entries(module.exports)) ANIMS[id] = d;
      glInit(); glStyle(); await proLoad();
      const T = THREE, c = document.createElement('canvas'); c.width = 120; c.height = 120; document.body.appendChild(c);
      const ids = idsArg === 'all' ? Object.keys(ANIMS).filter((id) => ANIMS[id].A || ANIMS[id].keys) : idsArg.split(',');
      const out = {}, FLOOR = -140, TOL = 1.2; // (a bone this far past a surface is a real pass-through, not skin resting on it)
      // bones checked: the ends people see go through things (the spine's own bones sit deep inside the body)
      const pick = /(Hand(Index|Middle|Ring|Pinky|Thumb)?[0-9]?|ForeArm|Foot|ToeBase|Toe_End|Leg|Head|HeadTop_End)$/;
      for (const id of ids) {
        const an = ANIMS[id]; if (!an) continue;
        let worst = null;
        for (let i = 0; i <= 10; i++) {
          const ph = i / 10;
          try { glDraw(c, id, ph, an.yaw ?? -40, []); } catch (e) { worst = { err: e.message }; break; }
          GL.scene.updateMatrixWorld(true); PRO.group.updateMatrixWorld(true);
          // props: every visible pooled box (walls, benches, boxes, chairs, steps...)
          const boxes = [];
          for (const [key, list] of Object.entries(GL.pool || {})) for (const m of list.slice(0, (GL.used || {})[key] || 0)) {
            if (!m.visible || key !== 'box') continue; const bb = new T.Box3().setFromObject(m); if (bb.isEmpty()) continue;
            const sz = bb.getSize(new T.Vector3()); if (Math.min(sz.x, sz.y, sz.z) < .3) continue; boxes.push(bb);
          }
          for (const bone of PRO.bones) {
            const n = bone.name.replace('mixamorig:', ''); if (!pick.test(n)) continue;
            const w = bone.getWorldPosition(new T.Vector3());
            const fl = FLOOR - w.y; if (fl > TOL && (!worst || fl > worst.d)) worst = { d: +fl.toFixed(1), ph, bone: n, what: 'floor' };
            // props: the limb segment from the parent joint to this one. Thin walls get crossed right through, so a point test
            // misses them: measure how much of the segment lies past where it enters the box (all of the rest, if it comes out)
            if (!bone.parent || !bone.parent.isBone) continue;
            const a = bone.parent.getWorldPosition(new T.Vector3()), len = a.distanceTo(w); if (len < 1e-3) continue;
            const ray = new T.Ray(a, w.clone().sub(a).normalize());
            for (const bb of boxes) {
              if (bb.containsPoint(a)) continue; // (starts inside: e.g. a bench under the hips — the parent joint is the one to look at)
              const hit = ray.intersectBox(bb, new T.Vector3()); if (!hit) continue;
              const t0 = hit.distanceTo(a); if (t0 > len) continue;
              const d = len - t0; // (from where it enters to the joint; if it passes through, the whole rest counts)
              if (d > TOL && (!worst || d > worst.d)) worst = { d: +d.toFixed(1), ph, bone: n, what: 'prop' };
            }
          }
        }
        if (worst) out[id] = worst;
      }
      return out;
    }, [defsSrc, idsArg]);
    for (const [id, w] of Object.entries(res)) (all[id] = all[id] || {})[fig] = w;
    if (errs.length) console.log(fig, 'page errors', [...new Set(errs)].slice(0, 3));
    await p.close();
  }
  const rows = Object.entries(all).sort((a, b) => Math.max(...Object.values(b[1]).map((w) => w.d || 0)) - Math.max(...Object.values(a[1]).map((w) => w.d || 0)));
  for (const [id, figs] of rows) console.log(id.padEnd(22), Object.entries(figs).map(([f, w]) => w.err ? `${f}: ERROR ${w.err}` : `${f}: ${w.bone} ${w.d} into ${w.what} @${w.ph}`).join(' | '));
  console.log(rows.length ? `${rows.length} animation(s) with a body point through the floor or a prop` : 'no collisions');
  await b.close();
})();
