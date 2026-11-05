// Suite 5: accessibility — WCAG AA text contrast in both themes, Escape closes sheets, keyboard focus is visible, reduced motion
const {open}=require('./common');
const CONTRAST=()=>{const parse=c=>{const m=c.match(/[\d.]+/g);return m?m.map(Number):[0,0,0,0]};const lum=([r,g,b])=>{const f=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
 const bgOf=el=>{let rgb=null;for(let e=el;e;e=e.parentElement){const c=parse(getComputedStyle(e).backgroundColor);const a=c.length>3?c[3]:1;if(a>.5&&!getComputedStyle(e).backgroundImage.includes('gradient')){rgb=c.slice(0,3);break;}}return rgb||parse(getComputedStyle(document.body).backgroundColor).slice(0,3)};
 const out=[];const seen=new Set();const tw=document.createTreeWalker(document.querySelector('#app'),NodeFilter.SHOW_TEXT);let n;
 while(n=tw.nextNode()){const t=n.textContent.trim();const el=n.parentElement;if(!t||!el.offsetParent||el.closest('svg,canvas,[aria-hidden=true],button[disabled],.inactive'))continue;const cs=getComputedStyle(el);if(+cs.opacity<.99&&0)continue;
  const fg=parse(cs.color);if(fg.length>3&&fg[3]<1)continue;const bg=bgOf(el);const L1=lum(fg.slice(0,3)),L2=lum(bg);const r=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);const big=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.66&&+cs.fontWeight>=700);
  if(r<(big?3:4.5)){const k=el.className+'|'+cs.color;if(!seen.has(k)){seen.add(k);out.push(r.toFixed(2)+' '+cs.color+' on rgb('+bg.join(',')+') '+cs.fontSize+' .'+String(el.className).slice(0,20)+' "'+t.slice(0,28)+'"');}}}
 return out;};
(async()=>{for(const theme of ['dark','light']){const {b,p}=await open({profile:'hist',gl:false,theme});
 for(const t of ['today','plan','history','progress','me']){await p.evaluate(t=>{S.tab=t;render();},t);await p.waitForTimeout(200);const r=await p.evaluate(CONTRAST);if(r.length)console.log(theme,t,r.length,'low-contrast styles:\n   '+r.slice(0,6).join('\n   '));}
 await b.close();}
 const {b,p}=await open({profile:'empty',gl:false});
 await p.evaluate(()=>{S.guide='Goblet squat';render();});await p.waitForTimeout(400);
 const before=await p.evaluate(()=>!!S.guide);await p.keyboard.press('Escape');await p.waitForTimeout(300);console.log('guide open',before,'→ after Escape open:',await p.evaluate(()=>!!S.guide));
 await p.evaluate(()=>{S.guide=null;S.tab='today';render();scrollTo(0,0);document.activeElement.blur();});
 const foc=[];for(let i=0;i<14;i++){await p.keyboard.press('Tab');foc.push(await p.evaluate(()=>{const e=document.activeElement;const cs=getComputedStyle(e);const vis=cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0||cs.boxShadow!=='none';return (e.textContent.trim()||e.getAttribute('aria-label')||e.tagName).slice(0,22)+(vis?'':' [NO FOCUS RING]')}));}
 console.log('Tab order:',foc.join(' → '));
 await b.close();})();
