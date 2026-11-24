const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.route('http://app.test/',r=>r.fulfill({path:'/home/user/fitness-app/standalone/index.html'}));await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({body:'',contentType:'application/javascript'}));
await p.goto('http://app.test/');await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const uk={...I18N.uk.d};for(const [id,g] of Object.entries(GUIDES)){const u=GUIDES_UK[id];if(!u)continue;const en=[g.feel,g.setup,...g.steps,g.breathe,...g.mistakes,g.easier,g.harder],ua=[u[0],u[1],...u[2],u[3],...u[4],u[5],u[6]];if(en.length===ua.length)en.forEach((e,i)=>{if(!uk[e])uk[e]=ua[i]});}
 return {keys:I18N_KEYS,uk,es:I18N.es.d,de:I18N.de.d,fr:I18N.fr.d,pt:I18N.pt.d,pl:I18N.pl.d};});
require('fs').writeFileSync(process.argv[2],JSON.stringify(r));await b.close();})();
