const {chromium}=require('playwright');
(async()=>{const f=process.argv[2],fig=process.argv[3]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();
await p.route('http://app.test/',r=>r.fulfill({path:f}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:'vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript((g)=>{localStorage.setItem('liftbook-figure',JSON.stringify(g));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async()=>{glInit();glStyle();await proLoad();const c=document.createElement('canvas');c.width=200;c.height=200;document.body.appendChild(c);const T=THREE,wp=n=>new T.Vector3().setFromMatrixPosition(PRO.by[n].matrixWorld),o=[];
 for(const id of ['pullup','pull_neg','pull_band','dead_hang']){const r=[];for(const ph of [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]){glDraw(c,id,ph,145,[]);const L=wp('LeftHandMiddle2'),R=wp('RightHandMiddle2');r.push(L.distanceTo(R).toFixed(0)+'@'+L.y.toFixed(0));}o.push(id+': '+r.join(' '));}
 return o.join('\n');}));await b.close();})();
