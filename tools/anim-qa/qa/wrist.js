// node wrist.js ids phases [fig] [defs] — wrist bend (angle forearm→hand vs hand→middle knuckle), degrees
const {chromium}=require('playwright');const AQ=require('path').resolve(__dirname,'..');const fs=require('fs');
(async()=>{const [ids,phs,fig='chromeF',defs]=process.argv.slice(2);const defsSrc=defs?fs.readFileSync(defs,'utf8'):'module.exports={}';
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:400,height:400}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||require('path').resolve(__dirname,'../../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:AQ+'/vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
if(process.env.PRE)await p.addInitScript({content:"window.__PRE="+JSON.stringify(process.env.PRE)});
await p.goto('http://app.test/');await p.waitForTimeout(500);
const r=await p.evaluate(async([ids,phs,defsSrc])=>{const module={exports:{}};new Function('module','pose',defsSrc)(module,pose);for(const [k,d] of Object.entries(module.exports))ANIMS[k]=d;
 glInit();glStyle();await proLoad();if(window.__PRE)(0,eval)(window.__PRE);const T=THREE;const c=document.createElement('canvas');c.width=c.height=120;document.body.appendChild(c);const out=[];
 for(const id of ids.split(',')){const row=[id.padEnd(14)];for(const ph of phs.split(',').map(Number)){GL.frames={};PRO.plantCache={};glDraw(c,id,ph,ANIMS[id].yaw??-40,[]);PRO.group.updateMatrixWorld(true);
  const P=n=>PRO.bones.find(x=>x.name.replace('mixamorig:','')===n).getWorldPosition(new T.Vector3());
  const a=['Left','Right'].map(L=>{const E=P(L+'ForeArm'),W=P(L+'Hand'),M=P(L+'HandMiddle1');return Math.round(W.clone().sub(E).angleTo(M.clone().sub(W))*180/Math.PI)});row.push(ph+':'+a.join('/'));}
  out.push(row.join('  '));}return out;},[ids,phs,defsSrc]);console.log(r.join('\n'));await b.close();})();
