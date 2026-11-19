// Dumbbell audit (chrome): node dbaudit.js [fig] — how deep (cm) any dumbbell head or handle goes into the body over the rep (0 = clear)
const {chromium}=require('playwright'),path=require('path');
(async()=>{const fig=process.argv[2]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||path.resolve(__dirname,'../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:path.resolve(__dirname,'vendor/package/build/three.min.js'),contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.addInitScript((v)=>{window.__SNIP=v},process.env.SNIP||'');
await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async(only)=>{glInit();glStyle();await proLoad();if(window.__SNIP)eval(window.__SNIP);const T=THREE,c=document.createElement('canvas');c.width=80;c.height=80;document.body.appendChild(c);const out=[];
 const ids=only?only.split(','):Object.keys(ANIMS).filter(id=>{const an=ANIMS[id];return [...(an.A&&an.A.props||[]),...(an.glChrome&&an.glChrome.A&&an.glChrome.A.props||[])].some(q=>q.db)});
 const segD=(q,a,b)=>{const ab=b.clone().sub(a),t=Math.max(0,Math.min(1,q.clone().sub(a).dot(ab)/ab.lengthSq()));return q.distanceTo(a.clone().add(ab.multiplyScalar(t)));};
 for(const id of ids){let worst=0,wph=0,wside='';const far=[...(ANIMS[id].A.props||[])].some(q=>q.db==='far');
  for(let i=0;i<16;i++){glDraw(c,id,i/16,0,[]);if(!PRO.group.visible)continue;const pts=proBodyPts(PRO);
   const sides=['Left','Right'];const gs=sides.map(L=>proHandGrip(L));const together=gs[0].p.distanceTo(gs[1].p)<12;
   const dbs=together?[{c:gs[0].p.clone().add(gs[1].p).multiplyScalar(.5).sub(new T.Vector3(0,6,0)),a:new T.Vector3(0,1,0),s:'both'}]:gs.map((g,k)=>({c:g.p,a:g.kn,s:sides[k]}));
   for(const db of dbs){const parts=[[-6,6,1.1],[-8.1,-4.9,4.4],[4.9,8.1,4.4]];
    for(const q of pts){if(q.distanceTo(db.c)>14)continue;for(const [u0,u1,r] of parts){const d=r-segD(q,db.c.clone().add(db.a.clone().multiplyScalar(u0)),db.c.clone().add(db.a.clone().multiplyScalar(u1)));if(d>worst){worst=d;wph=i/16;wside=db.s;}}}}}
  out.push(id+' depth '+worst.toFixed(1)+' @'+wph+' '+wside);}
 return out.join('\n');},process.env.ONLY||''));
await b.close();})();
