// Arm jerk audit: node jerk.js [fig] (IDS=ids, N=steps): over the rep in N steps, the biggest change between neighbouring steps of
// each arm bone's world orientation (degrees) — a smooth rep stays small (a few degrees); a spike means a jerk
const {chromium}=require('playwright'),path=require('path');
(async()=>{const fig=process.argv[2]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||path.resolve(__dirname,'../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:path.resolve(__dirname,'vendor/package/build/three.min.js'),contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.addInitScript((v)=>{window.__SNIP=v},process.env.SNIP||'');
await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async([ids,N])=>{glInit();glStyle();await proLoad();if(window.__SNIP)eval(window.__SNIP);const T=THREE,c=document.createElement('canvas');c.width=60;c.height=60;document.body.appendChild(c);const out=[];
 const bones=['Arm','ForeArm','ForeArmTwist','Hand'];
 for(const id of ids.split(',')){let prev=null,worst=0,at='';const series=[];
  for(let i=0;i<=N;i++){const ph=i/N;glDraw(c,id,ph,0,[]);const cur={};for(const L of ['Left','Right'])for(const bn of bones){const b=PRO.by[L+bn];if(!b)continue;const q=new T.Quaternion();b.getWorldQuaternion(q);cur[L+bn]=q;}
   if(prev)for(const k in cur){const d=2*Math.acos(Math.min(1,Math.abs(cur[k].dot(prev[k]))))*180/Math.PI;if(d>worst){worst=d;at=k+'@'+ph.toFixed(3);}}
   prev=cur;}
  out.push(id+' maxStep '+worst.toFixed(1)+'° '+at);}
 return out.join('\n');},[process.env.IDS||'rdl',+(process.env.N||100)]));
await b.close();})();
