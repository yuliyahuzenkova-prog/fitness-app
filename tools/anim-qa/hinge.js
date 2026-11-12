// Elbow/knee hinge audit: node hinge.js [chromeF|chromeM] (ONLY=ids). Error = angle between the joint's bend plane and the model's own hinge; ~14 is the natural carrying angle, much more means the elbow bends sideways or backwards
const {chromium}=require('playwright');
(async()=>{const fig=process.argv[2]||'chromeF';const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||require('path').resolve(__dirname,'../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:require('path').resolve(__dirname,'vendor/package/build/three.min.js'),contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.goto('http://app.test/');await p.waitForTimeout(400);
const r=await p.evaluate(async(only)=>{glInit();glStyle();await proLoad();const T=THREE,c=document.createElement('canvas');c.width=100;c.height=100;document.body.appendChild(c);const res=[];
 const R=PRO.rest,wq=(n)=>{const q=new T.Quaternion();PRO.by[n].getWorldQuaternion(q);return q},wp=(n)=>new T.Vector3().setFromMatrixPosition(PRO.by[n].matrixWorld);
 // bind (rest) world quats
 PRO.group.updateMatrixWorld(true);
 const sk=PRO.meshes.find(m=>m.skeleton).skeleton,bind={};sk.bones.forEach((bn,k)=>{const q=new T.Quaternion();sk.boneInverses[k].clone().invert().decompose(new T.Vector3(),q,new T.Vector3());bind[bn.name.replace('mixamorig:','')]=q;});
 const J=[['Arm','ForeArm','Hand'],['UpLeg','Leg','Foot']];
 // rest bend plane normal (in the parent bone's bind frame): cross(parent dir, child dir)
 const restN={};for(const S of ['Left','Right'])for(const [a,bb,cc] of J){const u=R[S+bb].clone().sub(R[S+a]).normalize(),f=R[S+cc].clone().sub(R[S+bb]).normalize();let n=a==='UpLeg'?u.clone().cross(new T.Vector3(0,0,-1)):u.clone().cross(f);if(n.length()<.05){n=null}else n.normalize().applyQuaternion(bind[S+a].clone().invert());restN[S+a]={n,u:u.applyQuaternion(bind[S+a].clone().invert()),f:f.applyQuaternion(bind[S+a].clone().invert())};}
 const ids=only?only.split(','):Object.keys(ANIMS);
 for(const id of ids){let worst={e:0},worstK={e:0};for(let i=0;i<16;i++){const ph=i/16;try{glDraw(c,id,ph,0,[]);}catch(e){continue}if(!PRO.group.visible)continue;PRO.group.updateMatrixWorld(true);
   for(const S of ['Left','Right'])for(const [a,bb,cc] of J){const rn=restN[S+a];
    const u=wp(S+bb).sub(wp(S+a)).normalize(),f=wp(S+cc).sub(wp(S+bb)).normalize(),bend=Math.acos(Math.max(-1,Math.min(1,u.dot(f))))*180/Math.PI;if(bend<25)continue;
    // posed bend normal in the parent's bone frame
    const n=u.clone().cross(f).normalize().applyQuaternion(wq(S+a).invert().multiply(bind[S+a]) .invert()); 
    // compare: express via bone-local: n_local = inv(world_q_bone) * n ; rest uses inv(bind_q) — both bone-local
    const nl=u.clone().cross(f).normalize().applyQuaternion(wq(S+a).invert()).applyQuaternion(new T.Quaternion()); // bone local using current world
    // rest normal in bone-local: rn.n is in bind frame == bone local
    let err=rn.n?Math.acos(Math.max(-1,Math.min(1,nl.dot(rn.n))))*180/Math.PI:0;
    const o={e:Math.round(err),bend:Math.round(bend),ph,S};if(a==='Arm'){if(err>worst.e)worst=o}else{if(err>worstK.e)worstK=o}}}
  res.push([id,worst.e,worst.bend,worst.ph,worst.S,worstK.e,worstK.bend,worstK.ph,worstK.S]);}
 return res;},process.env.ONLY||'');
r.sort((a,b)=>b[1]-a[1]);console.log('id elbowErr bend ph side | kneeErr bend ph side');for(const x of r)console.log(x.slice(0,5).join(' ')+' | '+x.slice(5).join(' '));
await b.close();})();
