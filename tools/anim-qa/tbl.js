const {chromium}=require('playwright');
(async()=>{const id=process.argv[2],fig=process.argv[3]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();
await p.route('http://app.test/',r=>r.fulfill({path:'/home/user/fitness-app/standalone/index.html'}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:'vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript((g)=>{localStorage.setItem('liftbook-figure',JSON.stringify(g));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.goto('http://app.test/');await p.waitForTimeout(400);
console.log(await p.evaluate(async(id)=>{glInit();glStyle();await proLoad();const c=document.createElement('canvas');c.width=200;c.height=200;document.body.appendChild(c);const T=THREE,o=[];
 for(const ph of [0.02,0.15,0.25,0.35,0.5,0.7,0.9]){glDraw(c,id,ph,-30,[]);PRO.group.updateMatrixWorld(true);
  const boxes=GL.pool.box.filter(m=>m.visible).map(m=>{const bb=new T.Box3().setFromObject(m);return bb;});
  // count skinned vertices inside each box (excluding hands)
  const names=PRO.bones.map(b=>b.name.replace('mixamorig:',''));const v=new T.Vector3();const cnt=boxes.map(()=>0),parts=boxes.map(()=>({}));
  for(const m of PRO.meshes){const P=m.geometry.attributes.position,SI=m.geometry.attributes.skinIndex;for(let i=0;i<P.count;i+=2){const bn=names[SI.array[i*4]]||'';if(/Hand/.test(bn))continue;v.fromBufferAttribute(P,i);m.boneTransform?m.boneTransform(i,v):m.applyBoneTransform(i,v);m.localToWorld(v);
   boxes.forEach((bb,k)=>{if(bb.containsPoint(v)){cnt[k]++;parts[k][bn.replace(/Left|Right/,'')]=(parts[k][bn.replace(/Left|Right/,'')]||0)+1;}});}}
  o.push(ph+' '+boxes.map((bb,k)=>'['+bb.min.y.toFixed(0)+'..'+bb.max.y.toFixed(0)+'] in:'+cnt[k]+' '+JSON.stringify(parts[k])).join(' | '));}
 return o.join('\n');},id));await b.close();})();
