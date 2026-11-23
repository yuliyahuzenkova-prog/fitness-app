// node qa/skinfloor.js <animId> [chromeF|chrome] ['[{"A":{...},"B":{...}}]'] [phase]
// How deep the model's skin goes into the floor, per bone (the lowest skinned vertex of each bone group, cm; negative = above
// the floor), plus knee/ankle/toe/hand/head bone heights. Each candidate overrides fields of the animation's A pose (and B, or A
// again if no B is given), so poses can be tried before editing liftbook.html. Lying face down, the chest more than ~2 cm into
// the floor shows as ragged "spikes" under the chest and shoulders (v399).
const {chromium}=require('playwright');const path=require('path');const AQ=path.resolve(__dirname,'..');
(async()=>{const [id,fig='chromeF',cj='[{"A":{}}]',ph='0']=process.argv.slice(2);const cands=JSON.parse(cj);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:400,height:400}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||path.resolve(__dirname,'../../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:AQ+'/vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.goto('http://app.test/');await p.waitForTimeout(500);
const r=await p.evaluate(async([id,cands,ph])=>{glInit();glStyle();await proLoad();const T=THREE;const c=document.createElement('canvas');c.width=c.height=120;document.body.appendChild(c);
 const an=ANIMS[id],A0={...an.A},B0={...an.B},out=[FIG_STYLE];const m=PRO.meshes[0],pos=m.geometry.attributes.position,si=m.geometry.attributes.skinIndex,sw=m.geometry.attributes.skinWeight,v=new T.Vector3(),fn=(m.applyBoneTransform||m.boneTransform).bind(m);
 const dom=[];for(let i=0;i<pos.count;i++){let best=-1,bw=0;for(let k=0;k<4;k++){const w=sw.array[i*4+k];if(w>bw){bw=w;best=si.array[i*4+k];}}dom.push(m.skeleton.bones[best].name.replace('mixamorig:',''));}
 for(const cd of cands){an.A={...A0,...cd.A};an.B={...B0,...(cd.B||cd.A)};GL.frames={};GL.frame=null;glDraw(c,id,+ph,0,[]);PRO.group.updateMatrixWorld(true);m.skeleton.update();
  const agg={};for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i);fn(i,v);v.applyMatrix4(m.matrixWorld);const d=-140-v.y;const k=dom[i].replace(/^(Left|Right)/,'');agg[k]=Math.max(agg[k]||-99,d);}
  const P=n=>PRO.bones.find(x=>x.name.replace('mixamorig:','')===n).getWorldPosition(new T.Vector3()).y+140;
  const sink=['Spine2','Spine1','Spine','Hips','UpLeg','Leg','Foot','ToeBase','Head','Arm','ForeArm','Hand'].map(k=>k+' '+(agg[k]??0).toFixed(1)).join(' ');
  out.push(JSON.stringify(cd)+'\n   lowest-skin-below-floor: '+sink+'\n   bones: knee '+P('LeftLeg').toFixed(1)+' ankle '+P('LeftFoot').toFixed(1)+' toe '+P('LeftToe_End').toFixed(1)+' hand '+P('LeftHand').toFixed(1)+' handMid '+P('LeftHandMiddle1').toFixed(1)+' head '+P('Head').toFixed(1));}
 return out;},[id,cands,ph]);console.log(r.join('\n'));await b.close();})();
