// Whole-body jerk audit: node bodyjerk.js [fig] (IDS, N): over the rep, the biggest change between neighbouring steps of each
// bone's world orientation (degrees) and of the hips' position (cm), with where it happens
const {chromium}=require('playwright'),path=require('path');
(async()=>{const fig=process.argv[2]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||path.resolve(__dirname,'../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:path.resolve(__dirname,'vendor/package/build/three.min.js'),contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.addInitScript((v)=>{window.__SNIP=v},process.env.SNIP||'');
await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async([ids,N])=>{glInit();glStyle();await proLoad();if(window.__SNIP)eval(window.__SNIP);const T=THREE,c=document.createElement('canvas');c.width=60;c.height=60;document.body.appendChild(c);const out=[];
 const bones=['Hips','Spine','Spine1','Spine2','Neck','Head','LeftUpLeg','LeftLeg','LeftFoot','RightUpLeg','RightLeg','RightFoot','LeftArm','LeftForeArm','LeftHand','RightArm','RightForeArm','RightHand','LeftShoulder','RightShoulder'];
 for(const id of ids.split(',')){let prev=null,pp=null,worst=[],wpos=0,wposAt='';
  for(let i=0;i<=N;i++){glDraw(c,id,i/N,0,[]);const cur={};for(const n of bones){const bn=PRO.by[n];if(!bn)continue;const q=new T.Quaternion();bn.getWorldQuaternion(q);cur[n]=q;}
   const hp=new T.Vector3().setFromMatrixPosition(PRO.by.Hips.matrixWorld);
   if(prev){for(const k in cur){const d=2*Math.acos(Math.min(1,Math.abs(cur[k].dot(prev[k]))))*180/Math.PI;worst.push([d,k,(i/N).toFixed(3)]);}const dp=hp.distanceTo(pp);if(dp>wpos){wpos=dp;wposAt=(i/N).toFixed(3);}}
   prev=cur;pp=hp;}
  worst.sort((a,b)=>b[0]-a[0]);out.push(id+' top: '+worst.slice(0,6).map(w=>w[1]+' '+w[0].toFixed(1)+'°@'+w[2]).join(', ')+' | hips move max '+wpos.toFixed(2)+'cm@'+wposAt);}
 return out.join('\n');},[process.env.IDS||'glute_bridge',+(process.env.N||120)]));
await b.close();})();
