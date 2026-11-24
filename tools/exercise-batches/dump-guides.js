const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.route('http://app.test/',r=>r.fulfill({path:'/home/user/fitness-app/standalone/index.html'}));await p.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({body:'',contentType:'application/javascript'}));
await p.goto('http://app.test/');await p.waitForTimeout(400);
const r=await p.evaluate(()=>({G:GUIDES,M:GUIDE_MUSCLES}));require('fs').writeFileSync(process.argv[2],JSON.stringify(r));await b.close();})();
