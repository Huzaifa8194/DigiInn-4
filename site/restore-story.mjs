import fs from 'node:fs';
let p=fs.readFileSync('src/pages/index.astro','utf8');p=p.replace('<section class="hero">','<div class="security-story"><section class="hero">');p=p.replace('</section>\n<section class="expertise-strip"',`</section>
<div class="security-chapters">
${[
['01 / DISCOVER','See your exposure.','Every system has a perimeter. Understand your assets, connections and vulnerabilities before a threat finds its way in.','ASSESS'],
['02 / TEST','Open the layers.','Look beneath the surface. Penetration testing and security audits reveal where your defenses need attention.','INSPECT'],
['03 / PROTECT','Build your defense.','Network protection, endpoint security and access controls form connected layers around your business.','DEFEND'],
['04 / ENABLE','Strengthen the core.','Bring your people into the picture. Practical training turns awareness into everyday security habits.','ENABLE'],
['05 / EVOLVE','Ready for what’s next.','Bring secure software, informed people and stronger systems together. One complete perspective on your digital future.','360°']
].map(([n,t,d,c])=>`<article class="security-chapter"><p class="section-kicker">${n}</p><h2>${t}</h2><p>${d}</p><div class="story-code">${c}</div></article>`).join('')}
</div></div>
<section class="expertise-strip"`);fs.writeFileSync('src/pages/index.astro',p);
let s=fs.readFileSync('src/motion/security-core.ts','utf8');s=s.replace("import { gsap } from 'gsap';","import { gsap } from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\ngsap.registerPlugin(ScrollTrigger);");s=s.replace('let visible=true,paused=false;',`const state={progress:0};
const story=document.querySelector('.security-story');
if(story){
ScrollTrigger.create({trigger:host.parentElement,start:'top 80px',endTrigger:story,end:'bottom bottom',pin:host.parentElement,pinSpacing:false,invalidateOnRefresh:true});
gsap.to(state,{progress:5,ease:'none',scrollTrigger:{trigger:story,start:'top top',end:'bottom bottom',scrub:1,invalidateOnRefresh:true}});
document.querySelectorAll('.security-chapter').forEach((chapter)=>{gsap.fromTo(chapter,{opacity:.15,y:70},{opacity:1,y:0,scrollTrigger:{trigger:chapter,start:'top 85%',end:'top 40%',scrub:true}});});
}
let visible=true,paused=false;`);
s=s.replace('rings.forEach((r,i)=>{r.rotation.z=.4+clock*(i%2?-.07:.06);r.rotation.y=i*.75-.5+Math.sin(clock*.15+i)*.18;});core.position.y=Math.sin(clock*.7)*.06;',`const p=state.progress;
const opening=Math.sin(Math.min(p,3)/3*Math.PI);
rings.forEach((r,i)=>{r.rotation.z=.4+clock*(i%2?-.07:.06)+p*(i%2?-1.2:1.1);r.rotation.y=i*.75-.5+Math.sin(clock*.15+i)*.18+p*.7;r.position.x=(i-1)*opening*1.65;r.position.z=opening*(i-1)*1.2;r.scale.setScalar(1+opening*.12);});
core.rotation.y=-.28+p*Math.PI*1.6;core.rotation.z=Math.sin(p)*.15;core.scale.setScalar(1+Math.sin(p/5*Math.PI)*.18);core.position.y=Math.sin(clock*.7)*.06;
assembly.position.x=Math.sin(p*Math.PI/2)*.25;
checkMat.emissiveIntensity=.8+Math.max(0,p-3)*.6;`);fs.writeFileSync('src/motion/security-core.ts',s);
