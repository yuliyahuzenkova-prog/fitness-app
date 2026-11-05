const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.setContent('<body>'+fs.readFileSync('/home/user/fitness-app/liftbook.html','utf8')+'</body>');
const miss=await p.evaluate(()=>{const all=new Set();
 const walk=(o)=>{if(typeof o==='string')all.add(o);else if(Array.isArray(o))o.forEach(walk);else if(o&&typeof o==='object')Object.values(o).forEach(walk);};
 walk(LIB);walk(PREHAB);walk(GUIDES);walk(SAFETY);walk(WEEK_FOCUS);walk(PHASE_INFO('Lose fat'));walk(STEPS.map(s=>[s.title,s.intro,(s.fields||[]).map(f=>[f.label,f.hint,f.placeholder,f.options,f.none,f.groups&&Object.keys(f.groups),f.groups&&Object.values(f.groups)])]));
 walk(CI_BODY.map(x=>x[1]));walk(CI_FEEL);walk(PAIN_AREAS);walk(MUSCLES);walk(Object.values(H_METRICS).map(x=>x[0]));walk(BADGES.map(x=>x[0]));walk(MEASURES);
 for(const r of Object.values(ROUTINES)){all.add(r.name);all.add(r.note);for(const d of Object.values(r.days))d.forEach(e=>all.add(e.name));}
 for(const k of Object.keys(TEMPLATES))all.add(TEMPLATES[k].title);
 return [...all].filter(s=>/[A-Za-z]{2}/.test(s)&&!/^(weight|reps|time|min|squat|hinge|pushH|pullH|pushV|pullV|lunge|core2?|gym|home|knee|back|neck|feet|w|len|text|num|long|one|many|height|acthours|basic|posture|homeBar)$/.test(s)&&tr2(s)==null);
 function tr2(s){return trCore(s);} });
console.log(miss.length);console.log(miss.join('\n'));await b.close();})();
