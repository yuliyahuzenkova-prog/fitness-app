// node qa/plantiles.js — Plan tab phase tiles and the phase details at phone widths in three languages: nothing spills out of its box
const {open}=require('./common');
(async()=>{for(const [lang,w] of [['en',430],['uk',390],['de',360]]){const {b,p,errs}=await open({profile:'hist',lang,width:w,gl:false});
 await p.evaluate(()=>{S.tab='plan';render();});await p.waitForTimeout(400);
 const el=await p.$('.timeline'); await el.evaluate(e=>e.parentElement.scrollIntoView()); await p.waitForTimeout(200);
 const box=await (await p.$('.timeline')).boundingBox(); const kv=await (await p.$('.kv')).boundingBox();
 await p.screenshot({path:`/tmp/claude-0/-home-user-fitness-app/fcbe2a66-92ab-5c34-8ba9-f7833139c6ed/scratchpad/plan-${lang}.png`,clip:{x:0,y:box.y-50,width:w,height:Math.min(900,kv.y+kv.height-box.y+70)}});
 const over=await p.evaluate(()=>[...document.querySelectorAll('.phase, .phase *, .kv dt, .kv dd')].filter(e=>e.scrollWidth>e.clientWidth+1||e.getBoundingClientRect().right>(e.closest('.phase')||e.parentElement).getBoundingClientRect().right+1).map(e=>e.className||e.tagName));
 console.log(lang,w,'overflow:',over,errs);await b.close();}})();
