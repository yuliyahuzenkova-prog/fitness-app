// node qa/skinbox.js <id> <phases> [chromeF|chrome] [defs.js] — skin (not just bones) inside props such as a chair seat or bench: deepest cm per bone (v406)
const {chromium}=require('playwright');const AQ=require('path').resolve(__dirname,'..');const fs=require('fs');
(async()=>{const [id,phs,fig='chromeF',defs]=process.argv.slice(2);const defsSrc=defs?fs.readFileSync(defs,'utf8'):'module.exports={}';
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:400,height:400}});
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||require('path').resolve(__dirname,'../../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:AQ+'/vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.goto('http://app.test/');await p.waitForTimeout(500);
const r=await p.evaluate(async([id,phs,defsSrc])=>{const module={exports:{}};new Function('module','pose',defsSrc)(module,pose);for(const [k,d] of Object.entries(module.exports))ANIMS[k]=d;
 glInit();glStyle();await proLoad();const T=THREE;const c=document.createElement('canvas');c.width=c.height=120;document.body.appendChild(c);
 const m=PRO.meshes[0],pos=m.geometry.attributes.position,si=m.geometry.attributes.skinIndex,sw=m.geometry.attributes.skinWeight,v=new T.Vector3(),fn=(m.applyBoneTransform||m.boneTransform).bind(m);
 const dom=[];for(let i=0;i<pos.count;i++){let best=-1,bw=0;for(let k=0;k<4;k++){const w=sw.array[i*4+k];if(w>bw){bw=w;best=si.array[i*4+k];}}dom.push(m.skeleton.bones[best].name.replace('mixamorig:','').replace(/^(Left|Right)/,''));}
 const out=[];for(const ph of phs.split(',').map(Number)){GL.frames={};PRO.plantCache={};glDraw(c,id,ph,0,[]);GL.scene.updateMatrixWorld(true);m.skeleton.update();
  const boxes=[];for(const [key,list] of Object.entries(GL.pool||{}))if(key==='box')for(const mm of list.slice(0,(GL.used||{})[key]||0)){if(!mm.visible)continue;const bb=new T.Box3().setFromObject(mm);if(!bb.isEmpty())boxes.push(bb);}
  const agg={};for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i);fn(i,v);v.applyMatrix4(m.matrixWorld);for(const bb of boxes){if(!bb.containsPoint(v))continue;const d=Math.min(v.x-bb.min.x,bb.max.x-v.x,v.y-bb.min.y,bb.max.y-v.y,v.z-bb.min.z,bb.max.z-v.z);agg[dom[i]]=Math.max(agg[dom[i]]||0,d);}}
  out.push('ph '+ph+': '+(Object.entries(agg).map(([k,d])=>k+' '+d.toFixed(1)).join(' ')||'clear'));}
 return out;},[id,phs,defsSrc]);console.log(r.join('\n'));await b.close();})();
