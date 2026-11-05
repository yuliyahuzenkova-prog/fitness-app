const {chromium}=require('playwright');
(async()=>{const f=process.argv[2],id=process.argv[3],fig=process.argv[4]||'chromeF',N=+(process.argv[5]||400);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();
await p.route('http://app.test/',r=>r.fulfill({path:f}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:'vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript((g)=>{localStorage.setItem('liftbook-figure',JSON.stringify(g));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.addInitScript(v=>{window.__B=v},process.env.BN||'');await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async([id,N])=>{glInit();glStyle();await proLoad();const c=document.createElement('canvas');c.width=200;c.height=200;document.body.appendChild(c);const T=THREE,o=[];
 let prev=null;const all=[];
 for(let i=0;i<=N;i++){const ph=i/N;glDraw(c,id,ph,30,[]);const qs=(window.__B||'LeftFoot,RightFoot,LeftToeBase,RightToeBase').split(',').map(n=>PRO.by[n].getWorldQuaternion(new T.Quaternion()));
  if(prev){const d=qs.map((q,j)=>2*Math.acos(Math.min(1,Math.abs(q.dot(prev[j]))))*57.3);all.push([ph,...d]);}prev=qs;}
 const s=all.map(r=>Math.max(...r.slice(1))).sort((a,b)=>a-b),med=s[s.length>>1];
 return 'median deg/step '+med.toFixed(2)+'\n'+all.filter(r=>Math.max(...r.slice(1))>Math.max(3,med*5)).map(r=>r[0].toFixed(4)+' '+r.slice(1).map(v=>v.toFixed(1)).join(' ')).join('\n');},[id,N]));await b.close();})();
