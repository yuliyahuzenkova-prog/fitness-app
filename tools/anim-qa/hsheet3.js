// node sheet.js ids out [fig] [tile]
const {chromium}=require('playwright');
(async()=>{const [ids,outp,fig='chromeF',tile='300',yw='']=process.argv.slice(2);const T=+tile;
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:T*4+20,height:900}});
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||'/home/user/fitness-app/standalone/index.html',contentType:'text/html'}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:'vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.goto('http://app.test/');await p.waitForTimeout(500);
await p.evaluate(async([ids,T,yw])=>{glInit();glStyle();await proLoad();document.querySelectorAll('header,main,nav').forEach(e=>e.remove());
 document.body.insertAdjacentHTML('afterbegin',`<div id=g style="display:grid;grid-template-columns:repeat(4,${T}px);gap:4px;background:#fff"></div>`);const g=document.getElementById('g');
 for(const id of ids.split(','))for(const k of [0,1]){const d=document.createElement('div');d.innerHTML=`<div style="font:12px sans-serif">${id} ${k}</div><canvas class="anim big" width=${T*2} height=${T*2} style="width:${T}px;height:${T}px"></canvas>`;g.appendChild(d);
  const c=d.querySelector('canvas');const an=ANIMS[id];let ph=k?0.5:0.01;
  if(!an.bike&&!an.seq){if(k===1){for(let i=0;i<=400;i++){if(tempo(i/400,id).seg===1){ph=i/400;break;}}}}
  glDraw(c,id,ph,(yw!==''?+yw:(an.yaw??-35)),[]);const wp=n=>new THREE.Vector3().setFromMatrixPosition(PRO.by[n].matrixWorld);const a=wp("LeftHand"),bb=wp("RightHand"),m=a.clone().add(bb).multiplyScalar(.5),w=Math.max(40,a.distanceTo(bb)*.9+24);const old=an.glView;an.glView=`${m.x+100-w/2} ${-m.y-2-w/2} ${w} ${w}`;glDraw(c,id,ph,(yw!==''?+yw:(an.yaw??-35)),[]);an.glView=old;}
},[ids,T,yw]);
await p.waitForTimeout(100);await p.screenshot({path:outp,fullPage:true});await b.close();})();
