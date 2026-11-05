import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer'; import fs from 'fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read('cena.glb');
const node = doc.getRoot().listNodes().find(n=>n.getMesh()), prim = node.getMesh().listPrimitives()[0];
const P = prim.getAttribute('POSITION'), I = prim.getIndices(), s = node.getScale()[0], t = node.getTranslation();
const n = P.getCount(), pos = new Float32Array(n*3), v=[];
for (let i=0;i<n;i++){P.getElement(i,v);for(let k=0;k<3;k++)pos[i*3+k]=v[k]*s+t[k];}
fs.writeFileSync('pos.f32', Buffer.from(pos.buffer)); fs.writeFileSync('idx.u32', Buffer.from(Uint32Array.from(I.getArray()).buffer));
console.log(n, I.getCount());
