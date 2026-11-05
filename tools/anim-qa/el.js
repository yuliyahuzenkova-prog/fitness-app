const {chromium}=require('playwright');
(async()=>{const id=process.argv[2];const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();
await p.route('http://app.test/',r=>r.fulfill({path:'/home/user/fitness-app/standalone/index.html'}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:'vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript(()=>{localStorage.setItem('liftbook-figure','"chromeF"');localStorage.setItem('liftbook-figure-v','3')});
await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async(id)=>{glInit();glStyle();await proLoad();const c=document.createElement('canvas');c.width=80;c.height=80;document.body.appendChild(c);const T=THREE,o=[];const wp=n=>new T.Vector3().setFromMatrixPosition(PRO.by[n].matrixWorld);
 let pe=null;for(let i=0;i<=100;i++){const ph=i/100;glDraw(c,id,ph,145,[]);const e=wp('LeftArm').sub(wp('LeftForeArm')).angleTo(wp('LeftHand').sub(wp('LeftForeArm')))*57.3,h=wp('LeftHand');o.push(ph.toFixed(2)+' '+e.toFixed(0)+' d'+(pe==null?0:e-pe).toFixed(1)+' hand '+h.toArray().map(v=>v.toFixed(0)));pe=e;}
 return o.join('\n');},id));await b.close();})();
