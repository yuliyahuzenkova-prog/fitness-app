// node qa/smooth.js [ids|all] [defs.js] [steps]
// Smoothness check for exercise animations on both chrome figures: plays the whole loop in small steps (default 120, both sides
// of alternating exercises) and follows the joints people watch (hips, chest, head, knees, feet, toes, hands, elbows).
// Reports:
//  - jerk: a joint that suddenly moves much further in one step than in the steps around it (a jump / twitch);
//  - bounce: the hips going up and down more than once per rep (the body "hopping"), with how far.
//  - twist: a joint (foot, toes, shin, forearm, hand) that suddenly turns much further in one step than around it, even if it barely
//    moves (a foot can flick round on the spot).
// Optional defs.js (module.exports = { id: {...} }) is injected first, to check animations before they go into liftbook.html.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [idsArg = 'all', defsFile, stepsArg] = process.argv.slice(2);
  const defsSrc = defsFile && defsFile !== '-' ? fs.readFileSync(defsFile, 'utf8') : 'module.exports = {};';
  const N = +(stepsArg || 120);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const all = {};
  for (const fig of ['chromeF', 'chromeM']) {
    const p = await b.newPage({ viewport: { width: 400, height: 400 } });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.route('http://app.test/', (r) => r.fulfill({ path: path.resolve(__dirname, '../../../standalone/index.html'), contentType: 'text/html; charset=utf-8' }));
    await p.route('https://cdn.jsdelivr.net/**', (r) => r.fulfill({ path: path.resolve(__dirname, '../vendor/package/build/three.min.js'), contentType: 'application/javascript' }));
    await p.addInitScript((f) => { localStorage.setItem('liftbook-figure', JSON.stringify(f)); localStorage.setItem('liftbook-figure-v', '3'); }, fig);
    await p.goto('http://app.test/'); await p.waitForTimeout(500);
    const res = await p.evaluate(async ([defsSrc, idsArg, N]) => {
      const module = { exports: {} }; new Function('module', 'pose', defsSrc)(module, pose);
      for (const [id, d] of Object.entries(module.exports)) ANIMS[id] = d;
      glInit(); glStyle(); await proLoad();
      const T = THREE, c = document.createElement('canvas'); c.width = 120; c.height = 120; document.body.appendChild(c);
      const ids = idsArg === 'all' ? Object.keys(ANIMS).filter((id) => ANIMS[id].A || ANIMS[id].keys) : idsArg.split(',');
      const names = ['Hips', 'Spine2', 'Head', 'LeftLeg', 'RightLeg', 'LeftFoot', 'RightFoot', 'LeftToe_End', 'RightToe_End', 'LeftForeArm', 'RightForeArm', 'LeftHand', 'RightHand'];
      const out = {};
      for (const id of ids) {
        const an = ANIMS[id]; if (!an) continue;
        const bones = names.map((n) => PRO.bones.find((x) => x.name.replace('mixamorig:', '') === n));
        const track = names.map(() => []), rnames = ['LeftFoot', 'RightFoot', 'LeftToeBase', 'RightToeBase', 'LeftLeg', 'RightLeg', 'LeftHand', 'RightHand', 'LeftForeArm', 'RightForeArm'], rb = rnames.map((n) => PRO.bones.find((x) => x.name.replace('mixamorig:', '') === n)), rot = rnames.map(() => []);
        try {
          for (let i = 0; i < N; i++) {
            glDraw(c, id, i / N, an.yaw ?? -40, []); PRO.group.updateMatrixWorld(true);
            bones.forEach((bn, k) => track[k].push(bn ? bn.getWorldPosition(new T.Vector3()) : null));
            rb.forEach((bn, k) => rot[k].push(bn ? bn.getWorldQuaternion(new T.Quaternion()) : null));
          }
        } catch (e) { out[id] = { err: e.message }; continue; }
        let jerk = null;
        track.forEach((pts, k) => {
          if (!pts[0]) return;
          const d = pts.map((q, i) => q.distanceTo(pts[(i + 1) % N])); // step i → i+1 (the loop wraps round)
          for (let i = 0; i < N; i++) {
            const around = []; for (let j = -4; j <= 4; j++) if (Math.abs(j) > 1) around.push(d[(i + j + N) % N]);
            around.sort((x, y) => x - y); const typ = Math.max(.25, around[Math.floor(around.length / 2)]);
            const r = d[i] / typ;
            if (d[i] > 1.5 && r > 3 && (!jerk || r > jerk.r)) jerk = { r: +r.toFixed(1), d: +d[i].toFixed(1), joint: names[k], ph: +(i / N).toFixed(3) };
          }
        });
        let twist = null;
        rot.forEach((qs, k) => { if (!qs[0]) return;
          const d = qs.map((q, i) => q.angleTo(qs[(i + 1) % N]) * 180 / Math.PI);
          for (let i = 0; i < N; i++) { const around = []; for (let j = -4; j <= 4; j++) if (Math.abs(j) > 1) around.push(d[(i + j + N) % N]);
            around.sort((x, y) => x - y); const typ = Math.max(1.5, around[Math.floor(around.length / 2)]), r = d[i] / typ;
            const lim = /Foot|ToeBase|Hand$/.test(rnames[k]) ? Math.max(6, 1500 / N * 1.1) : 6; // (feet, toes and hands are speed-limited in the app to 1500° a loop: a turn within that is smooth by design)
            if (d[i] > lim && r > 3 && (!twist || r > twist.r)) twist = { r: +r.toFixed(1), d: +d[i].toFixed(1), joint: rnames[k], ph: +(i / N).toFixed(3) }; } });
        // hips going up and down: count the turns (up→down) bigger than 1 unit
        const hy = track[0].map((q) => q.y); let turns = 0, dir = 0, ext = hy[0], range = Math.max(...hy) - Math.min(...hy);
        for (let i = 1; i <= N; i++) { const y = hy[i % N]; if (dir >= 0 && y < ext - 1) { if (dir > 0) turns++; dir = -1; ext = y; } else if (dir <= 0 && y > ext + 1) { if (dir < 0) turns++; dir = 1; ext = y; } else if ((dir >= 0 && y > ext) || (dir <= 0 && y < ext)) ext = y; }
        const reps = an.alt ? 2 : 1, bounce = turns / 2 > reps ? { ups: Math.round(turns / 2), reps, range: +range.toFixed(1) } : null;
        if (jerk || bounce || twist) out[id] = { jerk, bounce, twist };
      }
      return out;
    }, [defsSrc, idsArg, N]);
    for (const [id, w] of Object.entries(res)) (all[id] = all[id] || {})[fig] = w;
    if (errs.length) console.log(fig, 'page errors', [...new Set(errs)].slice(0, 3));
    await p.close();
  }
  const rows = Object.entries(all);
  for (const [id, figs] of rows) console.log(id.padEnd(22), Object.entries(figs).map(([f, w]) => w.err ? `${f}: ERROR ${w.err}` : `${f}: ` + [w.jerk && `jerk ${w.jerk.joint} ${w.jerk.d} in one step (${w.jerk.r}× the steps around) @${w.jerk.ph}`, w.bounce && `hips go up ${w.bounce.ups}× in ${w.bounce.reps} rep(s), range ${w.bounce.range}`, w.twist && `twist ${w.twist.joint} ${w.twist.d}° in one step (${w.twist.r}× around) @${w.twist.ph}`].filter(Boolean).join(', ')).join(' | '));
  console.log(rows.length ? `${rows.length} animation(s) that jerk or bounce` : 'smooth');
  await b.close();
})();
