const {chromium,devices}=require('playwright');
const APP=require('path').resolve(__dirname,'../../../standalone/index.html');
function hist(weeks=6){const out=[];const ex=[['Goblet squat','weight',[[12,10],[12,10],[14,8]]],['Dumbbell bench press','weight',[[10,10],[10,9]]],['Front plank','time',[[0,30],[0,35]]],['Seated cable row','weight',[[30,12],[32,10]]]];
 let id=1;for(let w=weeks;w>=0;w--)for(const d of [0,2,4]){const dt=new Date(Date.now()-(w*7+ (6-d))*864e5);if(dt>new Date())continue;out.push({id:'w'+(id++),date:dt.toISOString(),routine:'plan',day:1,unit:'kg',title:'Full body A',exercises:ex.map(([n,t,s])=>({name:n,type:t,unit:'kg',sets:s.map(([a,b])=>({w:a+(weeks-w),r:b}))}))});}
 return out;}
const INTAKE={done:true,name:'Оля',age:34,sex:'Female',height:165,weight:61,goal:'Build muscle',experience:'Under 6 months',days:'3',minutes:'45 min',place:'Gym',equipment:['Dumbbells','Machines and cables','Bench']};
const PROFILES={
 fresh:()=>null,
 empty:()=>({unit:'kg',intake:INTAKE,workouts:[],plan:{start:new Date(Date.now()-864e5*((new Date().getDay()+6)%7)).toISOString()}}),
 hist:()=>({unit:'kg',intake:INTAKE,workouts:hist(6),plan:{start:new Date(Date.now()-864e5*(42+(new Date().getDay()+6)%7)).toISOString()},bw:[{date:new Date(Date.now()-30*864e5).toISOString(),v:62,unit:'kg'},{date:new Date().toISOString(),v:61,unit:'kg'}]}),
};
async function open({profile='fresh',lang='uk',width=390,height=844,figure='chromeF',theme,gl=true,init}={}){
 const b=await chromium.launch({args:gl?['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']:[]});
 const ctx=await b.newContext({...devices['iPhone 13'],viewport:{width,height},acceptDownloads:true});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push('pageerror: '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push('console: '+m.text().slice(0,200));});
 await p.route('http://app.test/',r=>r.fulfill({path:APP}));
 await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({path:require('path').resolve(__dirname,'../vendor/package/build/three.min.js'),contentType:'application/javascript'}));
 const data=PROFILES[profile]();
 await p.addInitScript(([lang,data,figure,theme])=>{if(sessionStorage.getItem('qa-init'))return;sessionStorage.setItem('qa-init','1');localStorage.setItem('liftbook-lang',JSON.stringify(lang));localStorage.setItem('liftbook-figure',JSON.stringify(figure));localStorage.setItem('liftbook-figure-v','3');if(theme)localStorage.setItem('liftbook-theme',JSON.stringify(theme));if(data)localStorage.setItem('liftbook-data',JSON.stringify(data));},[lang,data,figure,theme]);
 if(init)await p.addInitScript(init);
 await p.goto('http://app.test/');await p.waitForTimeout(1200);
 return {b,p,errs};
}
module.exports={open,hist,INTAKE};
