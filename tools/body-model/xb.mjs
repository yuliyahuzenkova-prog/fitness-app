import fs from 'fs'; import zlib from 'zlib';
export function loadX(){
const buf = zlib.gunzipSync(Buffer.from(fs.readFileSync('../model/xbot.bin.gz.b64','utf8'),'base64'));
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset+buf.length), dv=new DataView(ab), jl=dv.getUint32(0,true), meta=JSON.parse(Buffer.from(ab,4,jl).toString());
let off=4+jl; const take=(T,c)=>{off+=(4-(off%4))%4;const a=new T(ab,off,c);off+=a.byteLength;return a;};
const meshes=meta.meshes.map(m=>({name:m.name,n:m.n,pos:take(Int16Array,m.n*3),nor:take(Int8Array,m.n*3),ji:take(Uint8Array,m.n*4),wi:take(Uint8Array,m.n*4),reg:take(Uint8Array,m.n),ind:take(Uint16Array,m.ni)}));
const world=[]; meta.bones.forEach((b,i)=>{world[i]=b.p<0?b.t.slice():b.t.map((x,k)=>x+world[b.p][k]);});
return {meta,meshes,world};
}
if (process.argv[2]==='show'){const {meta,meshes,world}=loadX();
meta.bones.forEach((b,i)=>console.log(i,b.n,b.p,world[i].map(x=>x.toFixed(1)).join(',')));
meshes.forEach(m=>{let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let i=0;i<m.n;i++)for(let k=0;k<3;k++){const v=m.pos[i*3+k]/100;mn[k]=Math.min(mn[k],v);mx[k]=Math.max(mx[k],v);}console.log(m.name,m.n,mn,mx);});}
