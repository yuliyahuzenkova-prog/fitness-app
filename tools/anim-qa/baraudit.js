// Barbell audit (chrome): node baraudit.js [fig] — per animation, over the rep: the closest skin to the bar between the hands
// (cm from the bar's axis: below ~1.1 the bar is in the body) and how far each hand's grip is from the bar (should be ~0)
const {chromium}=require('playwright'),path=require('path');
(async()=>{const fig=process.argv[2]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||path.resolve(__dirname,'../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:path.resolve(__dirname,'vendor/package/build/three.min.js'),contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async(ids)=>{glInit();glStyle();await proLoad();const c=document.createElement('canvas');c.width=80;c.height=80;document.body.appendChild(c);const out=[];
 for(const id of ids){let minD=1e9,maxG=0,ph0=0;for(let i=0;i<16;i++){glDraw(c,id,i/16,0,[]);if(!PRO.bar)continue;const {c:bc,a}=PRO.bar;
  const hl=PRO.by.LeftHand?new THREE.Vector3().setFromMatrixPosition(PRO.by.LeftHand.matrixWorld):null,hr=new THREE.Vector3().setFromMatrixPosition(PRO.by.RightHand.matrixWorld);
  const span=Math.min(Math.abs(hl.clone().sub(bc).dot(a)),Math.abs(hr.clone().sub(bc).dot(a)))-5;
  for(const q of proBodyPts(PRO)){const r=q.clone().sub(bc);if(Math.abs(r.dot(a))>span)continue;const dd=r.clone().sub(a.clone().multiplyScalar(r.dot(a))).length();if(dd<minD){minD=dd;ph0=i/16;}}
  for(const L of ['Left','Right']){const h=new THREE.Vector3().setFromMatrixPosition(PRO.by[L+'Hand'].matrixWorld),m=new THREE.Vector3().setFromMatrixPosition(PRO.by[L+'HandMiddle1'].matrixWorld);const r=m.clone().sub(bc);const dd=r.clone().sub(a.clone().multiplyScalar(r.dot(a))).length();maxG=Math.max(maxG,dd);}}
  out.push(id+' closestSkin '+minD.toFixed(1)+' @'+ph0+' | knuckles-to-bar max '+maxG.toFixed(1));}
 return out.join('\n');},['squat_bar','deadlift','rdl_bar','row_barbell','press_bar','bench_bar']));
await b.close();})();
