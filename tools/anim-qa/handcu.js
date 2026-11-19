// Close-ups of the arms: node armcu.js ids phases yaws out.png [fig] [side: Left|Right|both]
// Each tile is cropped round the shoulder, elbow and hand of one arm (projected from the posed 3D model), so thin or twisted arms show clearly.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{const [ids,phs,yaws,outp,fig='chromeF',side='both']=process.argv.slice(2);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:800,height:800},deviceScaleFactor:3});
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||path.resolve(__dirname,'../../standalone/index.html')}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:path.resolve(__dirname,'vendor/package/build/three.min.js'),contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.addInitScript((v)=>{window.__SNIP=v},process.env.SNIP||'');
await p.goto('http://app.test/');await p.waitForTimeout(400);
const url=await p.evaluate(async([ids,phs,yaws,side])=>{glInit();glStyle();await proLoad();if(window.__SNIP)eval(window.__SNIP);
 const T=360,tiles=[];const sides=side==='both'?['Left','Right']:[side];
 for(const id of ids.split(','))for(const ph of phs.split(',').map(Number))for(const yw of yaws.split(',').map(Number))for(const L of sides){
  const c=document.createElement('canvas');c.className='anim big';c.width=1200;c.height=1200;c.style.cssText='width:600px;height:600px';document.body.appendChild(c);glDraw(c,id,ph,yw,[]);
  PRO.group.updateMatrixWorld(true);GL.cam.updateMatrixWorld();
  const pts=[L+'Hand',L+'HandMiddle1',L+'HandIndex4',L+'HandPinky4',L+'HandThumb4'].filter(n=>PRO.by[n]).map(n=>{const v=new THREE.Vector3().setFromMatrixPosition(PRO.by[n].matrixWorld).project(GL.cam);return [(v.x+1)/2*c.width,(1-v.y)/2*c.height];});
  const x0=Math.min(...pts.map(q=>q[0])),x1=Math.max(...pts.map(q=>q[0])),y0=Math.min(...pts.map(q=>q[1])),y1=Math.max(...pts.map(q=>q[1]));
  const s=Math.max(x1-x0,y1-y0)*1.5+c.width*.03;tiles.push({c,sx:(x0+x1)/2-s/2,sy:(y0+y1)/2-s/2,s,label:id+' '+ph+' '+yw+' '+L});}
 const cols=Math.min(tiles.length,4),rows=Math.ceil(tiles.length/cols),o=document.createElement('canvas');o.width=cols*T;o.height=rows*T;const g=o.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,o.width,o.height);
 tiles.forEach((t,i)=>{const x=(i%cols)*T,y=Math.floor(i/cols)*T;g.drawImage(t.c,t.sx,t.sy,t.s,t.s,x+1,y+1,T-2,T-2);g.fillStyle='#000';g.fillRect(x+1,y+1,T-2,18);g.fillStyle='#fff';g.font='12px sans-serif';g.fillText(t.label,x+6,y+14);});
 return o.toDataURL('image/png');},[ids,phs,yaws,side]);
fs.writeFileSync(outp,Buffer.from(url.split(',')[1],'base64'));await b.close();})();
