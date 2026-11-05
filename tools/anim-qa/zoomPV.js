// node zoom2.js ids phs yaws view out [fig]
const {chromium}=require('playwright');
(async()=>{const [ids,phs,yaws,view,outp,fig='chromeF']=process.argv.slice(2);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:3});
await p.route('http://app.test/',r=>r.fulfill({path:process.env.APPF||'/home/user/fitness-app/standalone/index.html'}));
await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:'vendor/package/build/three.min.js',contentType:'application/javascript'}));
await p.addInitScript((f)=>{localStorage.setItem('liftbook-figure',JSON.stringify(f));localStorage.setItem('liftbook-figure-v','3')},fig);
await p.addInitScript((v)=>{window.__P=v},process.env.PITCH?+process.env.PITCH:null);await p.addInitScript((v)=>{window.__SNIP=v},process.env.SNIP||'');await p.goto('http://app.test/');await p.waitForTimeout(500);
await p.evaluate(async([ids,phs,yaws,view])=>{glInit();glStyle();await proLoad();if(window.__SNIP)eval(window.__SNIP);document.querySelectorAll('header,main,nav').forEach(e=>e.remove());
 const ys=yaws.split(',').map(Number);document.body.insertAdjacentHTML('afterbegin',`<div id=g style="display:grid;grid-template-columns:repeat(${ys.length},400px);gap:4px;background:#fff"></div>`);const g=document.getElementById('g');
 for(const id of ids.split(','))for(const ph of phs.split(',').map(Number))for(const yw of ys){const c=document.createElement('canvas');c.className='anim big';c.width=1200;c.height=1200;c.style.cssText='width:400px;height:400px';g.appendChild(c);
  const an=ANIMS[id],old=an.glView;if(window.__P!=null)an.pitch=window.__P;if(view!=='-')an.glView=view;glDraw(c,id,ph,yw,[]);an.glView=old;}
},[ids,phs,yaws,view]);
await p.waitForTimeout(100);await p.screenshot({path:outp,fullPage:true});await b.close();})();
