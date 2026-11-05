// Visits every screen/state in Ukrainian and lists text that is still English.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:900}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('http://app.test/',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}</style></head><body>'+fs.readFileSync('/home/user/fitness-app/liftbook.html','utf8')+'</body></html>'}));
await p.goto('http://app.test/');await p.evaluate(()=>{localStorage.clear();localStorage.setItem('liftbook-lang',JSON.stringify('uk'));});await p.reload();await p.waitForTimeout(300);
const found=await p.evaluate(async()=>{
 const out=new Map();const toasts=[];
 const origToast=window.toast;
 const collect=(where)=>{
  for (const root of [document.querySelector('header'),document.getElementById('app'),document.getElementById('restbar')]){
   const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   while(w.nextNode()){const n=w.currentNode;const par=n.parentElement;if(!par||/^(SCRIPT|STYLE|TEXTAREA)$/.test(par.tagName)||par.closest('[data-notr]'))continue;
    const t=n.nodeValue.trim();if(/[A-Za-z]/.test(t)&&!out.has(t))out.set(t,where);}
   root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{for(const at of ['placeholder','aria-label','title']){const v=el.getAttribute(at);if(v&&/[A-Za-z]/.test(v)&&!out.has(v.trim()))out.set(v.trim(),where+'@'+at);}});
  }
 };
 const R=(where)=>{render();collect(where);};
 const full={name:'Sam',age:30,sex:'Female',height:168,weight:72,work:'Desk job, mostly sitting',activities:['Salsa','Yoga'],activityOther:'Roller skating',actHours:{Salsa:'1–3 h'},sleep:'6–7 h',
  goal:'Lose fat',support:['Better posture'],areas:['Legs'],target:65,why:'x',experience:'Never trained',days:'4',minutes:'45 min',place:'Both',equipment:['Dumbbells','Pull-up bar'],likes:'x',
  parq:['A doctor has said I have a heart condition or high blood pressure'],pain:['Knees','Lower back','Neck'],posture:['Flat feet or low arches','Forward head (neck juts forward)'],notes:'x',measure:{waist:80}};
 // fresh screens
 for (const t of ['today','plan','history','progress','me']){S.tab=t;R('fresh-'+t);}
 // wizard steps
 S.tab='me';S.intake=JSON.parse(JSON.stringify(full));S.intake.done=false;
 for(let i=0;i<STEPS.length;i++){S.step=i;R('wiz'+i);}
 S.intake.done=true;S.editing=true;S.step=1;R('edit');S.editing=false;
 // profile variants
 S.intake.age=16;S.planState={kcalAdj:-150};R('profile');S.intake.age=30;delete S.intake.work;R('profile-missing');S.intake.work='Desk job, mostly sitting';
 S.restore={name:'b.json',data:{app:'liftbook',created:'2026-10-01',workouts:[{}],checkins:{entries:{a:{}}},bw:[1],health:{days:{a:1}},intake:{done:true},plan:{start:'x'},photos:[1]}};S.confirmDel='restore';S.bkPhotos=true;R('backup');S.restore=null;S.confirmDel=null;
 // plans for every goal
 const goals=['Lose fat','Build muscle','Get stronger','Get fitter and healthier','Improve endurance'];
 S.tab='plan';S.planState=null;
 for(const g of goals){S.intake.goal=g;S.planPhase=null;R('plan-'+g);for(let ph=0;ph<4;ph++){S.planPhase=ph;R('plan-ph');}}
 S.intake.goal='Lose fat';S.editDay=2;R('plan-edit');S.editDay=null;
 for (const pl of ['Gym','Home']){S.intake.place=pl;R('plan-'+pl);}
 const mon=weekStart(new Date());const start=new Date(mon);start.setDate(start.getDate()-14);
 S.planState={start:start.toISOString(),weeks:{w2:['A','A','rest','rest','rest','rest','rest']}};S.planPhase=null;S.planWeek=null;R('plan-started');S.editDay=1;R('plan-started-edit');S.editDay=null;
 S.planState.start=new Date(+mon-200*864e5).toISOString();R('plan-done');S.planState={start:start.toISOString()};
 // today variants + workouts history
 const now=Date.now();const mkw=(d,feel,pain,name='Goblet squat to a box')=>({id:'w'+d,date:new Date(now-d*864e5).toISOString(),routine:'plan',day:'A',title:'Full body A',unit:'kg',feel,pain,exercises:[{name,type:'weight',unit:'kg',sets:[{w:20+d,r:12},{w:20,r:12}]},{name:'Plank',type:'time',unit:'kg',sets:[{w:0,r:30}]},{name:'Push-up',type:'reps',unit:'kg',sets:[{w:0,r:10}]},{name:'Bike intervals',type:'min',unit:'kg',sets:[{w:0,r:8}]}]});
 S.workouts=[mkw(0.1,'hard',['Knees']),mkw(2,'easy'),mkw(4,'right'),mkw(9,null)];
 S.health={days:{}};const d0=new Date();for(let i=0;i<16;i++){const d=new Date(+d0-i*864e5);S.health.days[localKey(d)]={steps:7000,sleep:i?7.5:5,rhr:i?60:70,kcal:400};}
 S.tab='today';R('today-plan');S.workouts=S.workouts.slice(1);R('today-plan2');
 S.health.days[localKey(d0)].sleep=8;S.health.days[localKey(d0)].rhr=60;R('today-good');
 S.planState.ackMiss=null;R('today-miss');
 S.intake.done=false;R('today-noprofile');S.intake.done=true;
 S.planState=null;R('today-noplan');S.planState={start:start.toISOString()};
 // sessions
 const P=buildPlan(S.intake);
 for (const mode of ['gym','home']){S.planState.modes={A:mode,B:mode,C:mode,U1:mode,L1:mode,U2:mode,L2:mode};for(const k of P.keys){startPlanSession(k);collect('sess'+k+mode);S.swapOpen=0;R('swap');S.swapOpen=null;}}
 S.session.exercises[0].sets[0].done=true;R('sess-done');
 S.session=null;S.tab='today';startSession('A');collect('routine');S.routine='home';startSession('B');collect('routine-home');S.session=null;S.routine='barbell';
 // summary
 S.summary={id:'x',title:'Full body A',mins:30,sets:12,volume:1200,prs:[{name:'Goblet squat',text:'Heaviest yet: 24 kg × 12'}],badges:['First workout'],feel:'easy',pain:['Knees'],noPain:false};R('summary');
 for(const f of ['right','hard']){S.summary.feel=f;R('summary-'+f);}S.summary.volume=0;S.summary.prs=[];R('summary-bw');S.summary=null;
 // log & stats
 S.tab='history';R('log');S.tab='progress';R('stats');S.trend='count';R('stats-count');S.trend='volume';
 for(const m of Object.keys(H_METRICS)){S.hMetric=m;R('stats-h');}
 S.importMsg='Reading Apple Health export… 40%';R('import');S.importMsg=null;
 // check-in advice variants
 const ck=(weights,extra={},goal='Lose fat',waists)=>{const e={};const ks=[];for(let i=weights.length-1;i>=0;i--){const d=new Date(mon);d.setDate(d.getDate()-7*i);ks.push(localKey(d));}
  ks.forEach((k,i)=>{e[k]={weight:weights[i]};if(waists)e[k].waist=waists[i];});Object.assign(e[ks[ks.length-1]],extra);S.checkins={entries:e,params:[{id:'c_1',name:'Max push-ups',unit:'reps'}]};S.intake.goal=goal;S.planState={start:new Date(+mon-21*864e5).toISOString()};R('ci-'+goal);};
 ck([80,80,80]);ck([80,80,80],{},'Lose fat',[90,89,88]);ck([80,79,78]);ck([80,79.7,79.4]);ck([80,80,80],{},'Build muscle');ck([80,81,82],{},'Build muscle');ck([80,80.2,80.4],{},'Build muscle');ck([80,82,84],{},'Get stronger');ck([80]);ck([80,80]);
 ck([80,80,80],{energy:1,sleepQ:1,stress:5,soreness:5,motivation:1,pain:7,painAreas:['Knees'],hunger:5});ck([80,80,80],{pain:5});
 S.ciSel='energy';R('ci-sel');S.ciSel='c_1';S.checkins.entries[Object.keys(S.checkins.entries)[0]].custom={c_1:10};S.checkins.entries[Object.keys(S.checkins.entries).pop()].custom={c_1:12};R('ci-custom');
 S.ciDraft={pain:4,painAreas:['Knees'],custom:{}};R('ci-form');S.confirmDel='c_1';R('ci-form-del');S.confirmDel=null;S.ciDraft=null;
 // guides for every exercise
 const names=new Set();for(const slot of Object.keys(LIB))libItems(slot).forEach(x=>names.add(x[0]));
 for(const l of Object.values(PREHAB))l.forEach(x=>(Array.isArray(x)?[x]:Object.values(x)).forEach(y=>names.add(y[0])));
 for(const r of Object.values(ROUTINES))for(const d of Object.values(r.days))d.forEach(e=>names.add(e.name));
 ['Bike intervals','Rower or bike intervals','Brisk walk or marching in place','Bodyweight circuit'].forEach(n=>names.add(n));
 S.intake.pain=['Knees','Lower back','Neck','Feet (arch or heel)'];
 for(const n of names){S.guide=n;R('guide');}S.guide=null;
 // rest timer
 startRest(90);drawRest();collect('rest');stopRest();
 return [...out.entries()];
});
fs.writeFileSync(__dirname+'/missing.json',JSON.stringify(found,null,0));
console.log('untranslated strings:',found.length,'errors:',errs.slice(0,5));await b.close();})();
