// Suite 1: smoke matrix — every tab × profile × language × width: JS errors, horizontal overflow, untranslated text, a11y basics
const {open}=require('./common');
(async()=>{const rows=[];
for(const profile of ['fresh','empty','hist'])for(const lang of ['uk','en'])for(const width of [320,390]){
 const {b,p,errs}=await open({profile,lang,width,gl:width===390});
 for(const tab of ['today','plan','history','progress','me']){
  await p.evaluate(t=>{S.tab=t;S.guide=null;render();scrollTo(0,0);},tab);await p.waitForTimeout(250);
  const r=await p.evaluate((lang)=>{const de=document.documentElement,o={};o.overflow=de.scrollWidth-de.clientWidth;
   const wide=[...document.querySelectorAll('#app *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('.hscroll,.wheel,.chips,[style*=overflow]')}).slice(0,3).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,30)+':'+(e.textContent||'').trim().slice(0,30));o.wide=wide;
   o.noname=[...document.querySelectorAll('button,a,[role=button]')].filter(e=>e.offsetParent&&!(e.textContent.trim()||e.getAttribute('aria-label')||e.title)).map(e=>e.outerHTML.slice(0,80));
   o.nolabel=[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(e=>e.offsetParent&&!(e.labels&&e.labels.length)&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')&&!e.title).map(e=>e.outerHTML.slice(0,90));
   o.small=[...document.querySelectorAll('#app button,#app a')].filter(e=>{const r=e.getBoundingClientRect();return e.offsetParent&&r.width&&(r.height<28||r.width<28)}).map(e=>(e.textContent.trim()||e.getAttribute('aria-label')||'').slice(0,20)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height));
   if(lang==='uk'){const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const en=new Set();let n;while(n=tw.nextNode()){const t=n.textContent.trim();const el=n.parentElement;if(!t||!el||!el.offsetParent||el.closest('script,style,[data-notr-ok]'))continue;if(/[A-Za-z]{3,}\s+[A-Za-z]{2,}/.test(t)&&!/Relief|Claude|Netlify|Apple|Google|Pro 3D|Mixamo|Whoop|Garmin|Fitbit|Oura|CSV|JSON|PNG|iPhone|Android/.test(t))en.add(t.slice(0,60));}o.english=[...en].slice(0,8);}
   return o;},lang);
  rows.push({profile,lang,width,tab,...r});
 }
 rows.push({profile,lang,width,tab:'ERRORS',errs:[...new Set(errs)]});await b.close();}
for(const r of rows){const issues=[];if(r.errs&&r.errs.length)issues.push('ERR '+r.errs.join(' | '));if(r.overflow>0)issues.push('overflow '+r.overflow+'px '+JSON.stringify(r.wide));if(r.noname&&r.noname.length)issues.push('noname '+r.noname.length+' '+r.noname[0]);if(r.nolabel&&r.nolabel.length)issues.push('nolabel '+r.nolabel.length+' '+r.nolabel[0]);if(r.small&&r.small.length)issues.push('small '+r.small.length+' '+r.small.slice(0,3).join(', '));if(r.english&&r.english.length)issues.push('EN '+JSON.stringify(r.english));
 if(issues.length)console.log(`[${r.profile}/${r.lang}/${r.width}/${r.tab}] `+issues.join(' || '));}
console.log('done');})();
