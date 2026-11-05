const {chromium}=require('playwright');
async function run(file){const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:400,height:400}});p.on('pageerror',e=>console.log('PE',String(e).slice(0,200)));
await p.route('http://app.test/',r=>r.fulfill({path:file}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:'vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript(()=>{localStorage.setItem('liftbook-figure','"chromeF"');localStorage.setItem('liftbook-figure-v','3')});
await p.goto('http://app.test/');await p.waitForTimeout(500);
const r=await p.evaluate(async()=>{glInit();glStyle();await proLoad();const c=document.createElement('canvas');c.width=200;c.height=200;document.body.appendChild(c);const out={};
 for(const id of Object.keys(ANIMS)){for(const ph of [0.15,0.6]){try{glDraw(c,id,ph,-35,[]);}catch(e){continue;}
  out[id+'@'+ph]=['Left','Right'].map(L=>PRO.by[L+'Foot'].getWorldQuaternion(new THREE.Quaternion()).toArray());}}return out;});await b.close();return r;}
(async()=>{const a=await run(process.argv[2]),b=await run(process.argv[3]);const res=[];
 for(const k in a){if(!b[k])continue;for(let i=0;i<2;i++){const d=2*Math.acos(Math.min(1,Math.abs(a[k][i].reduce((s,v,j)=>s+v*b[k][i][j],0))))*180/Math.PI;if(d>3)res.push(k+' '+['L','R'][i]+' '+d.toFixed(0)+'°');}}
 console.log(Object.keys(a).length+' poses; changed: '+res.length);console.log(res.join('\n'));})();
