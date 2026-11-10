import { chromium } from 'playwright';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
for(const [name,width,height,reduced] of [['desktop',1440,1000,false],['mobile',390,844,false],['reduced',1440,1000,true]]){
const page=await browser.newPage({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});let errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'});await page.waitForTimeout(1200);
await page.screenshot({path:`.shots/${name}.png`,fullPage:true});
await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
const a11y=await page.evaluate(async()=>{const r=await axe.run();return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
await page.locator('summary').first().click();const faq=await page.locator('details').first().getAttribute('open')!==null;
if(!reduced){await page.locator('#motion-toggle').click();if(await page.locator('#motion-toggle').getAttribute('aria-pressed')!=='true')errors.push('pause failed');}
results.push({name,errors,overflow,a11y,faq});await page.close();
}
for(const route of ['about','services','404.html']){const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto(`http://127.0.0.1:4322/${route}`);await page.screenshot({path:`.shots/${route}.png`,fullPage:true});await page.close();}
fs.writeFileSync('.shots/report.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();

