// Arm twist audit: node armtwist.js [fig] (ONLY=ids): max twist of upper arm, forearm, hand about their length, and the biggest jump between phases
const {chromium}=require('playwright');
(async()=>{const fig=process.argv[2]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||require('path').resolve(__dirname,'../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:require('path').resolve(__dirname,'vendor/package/build/three.min.js'),contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.goto('http://app.test/');await p.waitForTimeout(400);
const r=await p.evaluate(async(only)=>{glInit();glStyle();await proLoad();const c=document.createElement('canvas');c.width=100;c.height=100;document.body.appendChild(c);const res=[];
 const ids=only?only.split(','):Object.keys(ANIMS);
 for(const id of ids){const rows=[];for(const ph of [0,.125,.25,.375,.5,.625,.75,.875]){try{glDraw(c,id,ph,0,[]);}catch(e){continue}if(!PRO.group.visible)continue;
   const o={ph};for(const L of ['Left','Right']){o[L]=[boneTwist(PRO,L+'Arm'),boneTwist(PRO,L+'ForeArm'),boneTwist(PRO,L+'Hand')].map(x=>Math.round(x));}rows.push(o);}
  if(!rows.length)continue;let mx={A:0,F:0,H:0},jump=0;
  for(const L of ['Left','Right'])rows.forEach((o,i)=>{mx.A=Math.max(mx.A,Math.abs(o[L][0]));mx.F=Math.max(mx.F,Math.abs(o[L][1]));mx.H=Math.max(mx.H,Math.abs(o[L][2]));if(i){const q=rows[i-1][L];for(let k=0;k<3;k++){let d=Math.abs(o[L][k]-q[k]);d=Math.min(d,360-d);jump=Math.max(jump,d);}}});
  res.push([id,mx.A,mx.F,mx.H,jump]);}
 return res;},process.env.ONLY||'');
r.sort((a,b)=>Math.max(b[2],b[3])-Math.max(a[2],a[3]));
console.log('id armTwist foreTwist handTwist maxJumpBetweenPhases');for(const x of r)console.log(x.join(' '));
await b.close();})();
