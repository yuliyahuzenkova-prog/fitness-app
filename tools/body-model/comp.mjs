import fs from 'fs';
const P = new Float32Array(fs.readFileSync('pos.f32').buffer.slice(0)), I = new Uint32Array(fs.readFileSync('idx.u32').buffer.slice(0));
const n = P.length/3, map = new Map(), remap = new Uint32Array(n), uniq = [];
for (let i=0;i<n;i++){const k=`${Math.round(P[i*3]*500)},${Math.round(P[i*3+1]*500)},${Math.round(P[i*3+2]*500)}`;let u=map.get(k);if(u===undefined){u=uniq.length/3;map.set(k,u);uniq.push(P[i*3],P[i*3+1],P[i*3+2]);}remap[i]=u;}
const nu = uniq.length/3, idx = Uint32Array.from(I, i=>remap[i]);
const par = new Int32Array(nu).map((_,i)=>i), f=(x)=>{while(par[x]!==x){par[x]=par[par[x]];x=par[x];}return x;};
for (let t=0;t<idx.length;t+=3){const a=f(idx[t]),b=f(idx[t+1]),c=f(idx[t+2]);par[b]=a;par[f(c)]=a;}
const comps=new Map(); for(let i=0;i<nu;i++){const r=f(i);let c=comps.get(r);if(!c){c={n:0,t:0,mn:[1e9,1e9,1e9],mx:[-1e9,-1e9,-1e9]};comps.set(r,c);}c.n++;for(let k=0;k<3;k++){c.mn[k]=Math.min(c.mn[k],uniq[i*3+k]);c.mx[k]=Math.max(c.mx[k],uniq[i*3+k]);}}
for(let t=0;t<idx.length;t+=3)comps.get(f(idx[t])).t++;
const list=[...comps.entries()].sort((a,b)=>b[1].n-a[1].n);
console.log('unique',nu,'tris',idx.length/3,'components',list.length);
list.slice(0,25).forEach(([r,c])=>console.log(r,c.n,c.t,c.mn.map(x=>x.toFixed(1)).join(','),'|',c.mx.map(x=>x.toFixed(1)).join(',')));
fs.writeFileSync('weld.json', JSON.stringify({}));
fs.writeFileSync('upos.f32', Buffer.from(Float32Array.from(uniq).buffer)); fs.writeFileSync('uidx.u32', Buffer.from(idx.buffer));
fs.writeFileSync('ucomp.i32', Buffer.from(Int32Array.from({length:nu},(_,i)=>f(i)).buffer));
