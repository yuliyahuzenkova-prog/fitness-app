// node qa/foot.js <id> <from> <to> <steps> [Right|Left] — per-step ankle move, foot/toe turn, foot-to-shin angle, ankle and toe height (v412)
const {chromium}=require('playwright');const AQ=require('path').resolve(__dirname,'..');
(async()=>{const [id,f0,f1,st,S='Right']=process.argv.slice(2);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage();
await p.route('http://app.test/',r=>r.fulfill({path:require('path').resolve(__dirname,'../../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:AQ+'/vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript(()=>{localStorage.setItem('liftbook-figure',JSON.stringify('chromeF'));localStorage.setItem('liftbook-figure-v','3')});
await p.goto('http://app.test/');await p.waitForTimeout(500);
const r=await p.evaluate(async([id,f0,f1,st,S])=>{glInit();glStyle();await proLoad();const T=THREE;const c=document.createElement('canvas');c.width=c.height=120;document.body.appendChild(c);const out=[];let pv=null;
 for(let i=0;i<=st;i++){const ph=f0+(f1-f0)*i/st;glDraw(c,id,ph,-30,[]);PRO.group.updateMatrixWorld(true);const bn=n=>PRO.bones.find(x=>x.name.replace('mixamorig:','')===n);const P=n=>bn(n).getWorldPosition(new T.Vector3()),Q=n=>bn(n).getWorldQuaternion(new T.Quaternion());
  const K=P(S+'Leg'),A=P(S+'Foot'),B=P(S+'ToeBase'),E=P(S+'Toe_End');const ang=(A.clone().sub(K)).angleTo(B.clone().sub(A))*180/Math.PI;const cur={A,qf:Q(S+'Foot'),qt:Q(S+'ToeBase')};
  if(pv)out.push(ph.toFixed(3)+' ankleMove '+A.distanceTo(pv.A).toFixed(2)+' footTurn '+(cur.qf.angleTo(pv.qf)*180/Math.PI).toFixed(1)+' toeTurn '+(cur.qt.angleTo(pv.qt)*180/Math.PI).toFixed(1)+' foot∠shin '+ang.toFixed(0)+' ankleY '+(A.y+140).toFixed(1)+' toeY '+(E.y+140).toFixed(1));pv=cur;}
 return out;},[id,+f0,+f1,+st,S]);console.log(r.join('\n'));await b.close();})();
