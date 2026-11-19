// Elbow bend over the rep: node elbowcurve.js [fig] (IDS, N) — prints the left elbow's bend (degrees) at N+1 steps, and counts
// how often the bend turns from straightening to bending (a smooth rep turns twice: at the top and the bottom)
const {chromium}=require('playwright'),path=require('path');
(async()=>{const fig=process.argv[2]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||path.resolve(__dirname,'../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:path.resolve(__dirname,'vendor/package/build/three.min.js'),contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.addInitScript((v)=>{window.__SNIP=v},process.env.SNIP||'');
await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async([ids,N])=>{glInit();glStyle();await proLoad();if(window.__SNIP)eval(window.__SNIP);const T=THREE,c=document.createElement('canvas');c.width=60;c.height=60;document.body.appendChild(c);const out=[];
 const wp=n=>new T.Vector3().setFromMatrixPosition(PRO.by[n].matrixWorld);
 for(const id of ids.split(',')){const v=[];for(let i=0;i<=N;i++){glDraw(c,id,i/N,0,[]);const s=wp('LeftArm'),e=wp('LeftForeArm'),h=wp('LeftHand');v.push(Math.acos(Math.max(-1,Math.min(1,e.clone().sub(s).normalize().dot(h.clone().sub(e).normalize()))))*180/Math.PI);}
  let turns=0,sg=0;for(let i=1;i<v.length;i++){const d=v[i]-v[i-1];if(Math.abs(d)<.05)continue;const s2=Math.sign(d);if(sg&&s2!==sg)turns++;sg=s2;}
  out.push(id+' turns '+turns+' | '+v.map(x=>x.toFixed(1)).join(' '));}
 return out.join('\n');},[process.env.IDS||'rdl',+(process.env.N||60)]));
await b.close();})();
