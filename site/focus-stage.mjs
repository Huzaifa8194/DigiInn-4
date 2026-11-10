import fs from 'node:fs';
const file='src/motion/security-core.ts';let s=fs.readFileSync(file,'utf8');
s=s.replace("gsap.to(state,{p:5,ease:'none',scrollTrigger:{trigger:story,start:'top top',end:'bottom bottom',scrub:1.3,invalidateOnRefresh:true}});",`const chapters=[...document.querySelectorAll<HTMLElement>('.security-chapter')];
 const follow=gsap.quickTo(state,'p',{duration:.7,ease:'power2.out'});
 ScrollTrigger.create({trigger:story,start:'top top',end:'bottom bottom',invalidateOnRefresh:true,onUpdate:self=>{
 const positions=[0,...chapters.map(c=>c.getBoundingClientRect().top+self.scroll()+c.clientHeight*.5-innerHeight*.5)];
 const scroll=self.scroll();let target=5;for(let i=1;i<positions.length;i++){if(scroll<=positions[i]){target=i-1+THREE.MathUtils.clamp((scroll-positions[i-1])/(positions[i]-positions[i-1]),0,1);break;}}follow(target);
 }});`);
const extras=`
 // Focus lighting belongs to the current chapter, not to the entire sculpture.
 const focusGroups=[network,vault,database,laptop,phone,cloud,chip,shell,stage,lock];
 const surfaces=new Map<THREE.Object3D,{material:THREE.MeshStandardMaterial,color:THREE.Color,emissive:THREE.Color}[]>();
 focusGroups.forEach(group=>{const list:{material:THREE.MeshStandardMaterial,color:THREE.Color,emissive:THREE.Color}[]=[];group.traverse(o=>{if(o instanceof THREE.Mesh&&o.material instanceof THREE.MeshStandardMaterial){const m=o.material.clone();o.material=m;materials.push(m);list.push({material:m,color:m.color.clone(),emissive:m.emissive.clone()});}});surfaces.set(group,list);});
 const focus=(group:THREE.Object3D,strength:number)=>{surfaces.get(group)?.forEach(({material,color,emissive})=>{material.color.copy(color).multiplyScalar(strength);material.emissive.copy(emissive).multiplyScalar(strength);});};
 const scanMaterial=new THREE.MeshBasicMaterial({color:0x83e6ff,transparent:true,opacity:.1,side:THREE.DoubleSide,depthWrite:false});materials.push(scanMaterial);
 const scan=new THREE.Mesh(new THREE.PlaneGeometry(6,4.5),scanMaterial);scan.rotation.x=-Math.PI/2;rig.add(scan);
 const scanEdge=new THREE.Mesh(new THREE.TorusGeometry(2.8,.026,8,90),cyan);scanEdge.rotation.x=Math.PI/2;rig.add(scanEdge);
 const targetRing=new THREE.Mesh(new THREE.TorusGeometry(.58,.025,8,64),amber);rig.add(targetRing);
 const shock=new THREE.Group();rig.add(shock);const rays:THREE.Mesh[]=[];for(let i=0;i<20;i++){const ray=box(.022,.2,.022,amber,.005);shock.add(ray);rays.push(ray);}
 const seal=new THREE.Mesh(new THREE.TorusGeometry(.75,.035,8,80),cyan);rig.add(seal);
 const callout=document.createElement('div');callout.className='object-callout';host.parentElement?.appendChild(callout);
 const notes=['YOUR CONNECTED BUSINESS','ASSETS MAPPED','EXPOSED ENDPOINT','THREAT BLOCKED','ACCESS VERIFIED','SECURE BY DESIGN'];
 const focusPoint=new THREE.Vector3();
`;
s=s.replace(' const resize=()=>',extras+'\n const resize=()=>');
s=s.replace('const current=Math.min(5,Math.floor(p+.65))','const current=Math.min(5,Math.floor(p+.4))');
s=s.replace("if(caption)caption.textContent=titles[current];", "if(caption)caption.textContent=titles[current];callout.textContent=notes[current];host.parentElement?.setAttribute('data-stage',String(current));gsap.fromTo(callout,{opacity:0,y:12},{opacity:1,y:0,duration:.65,ease:'power3.out'});");
s=s.replace(' renderer.render(scene,camera);};gsap.ticker.add(tick);',`
 const discovery=smooth(.3,.9,p)*(1-smooth(1.1,1.6,p));
 const exposure=smooth(1.3,1.9,p)*(1-smooth(2.3,2.7,p));
 const defending=smooth(2.2,2.8,p)*(1-smooth(3.2,3.7,p));
 const verification=smooth(3.2,3.8,p)*(1-smooth(4.2,4.7,p));
 const active=Math.max(discovery,exposure,defending,verification);
 focusGroups.forEach(g=>focus(g,1-active*.68));
 focus(network,1-active*.25);focus(vault,1-exposure*.55);focus(lock,1);
 focus(laptop,1-active*.6);focus(database,1-active*.6);focus(cloud,1-active*.6);focus(phone,1-active*.6);
 nodes[1].scale.setScalar(1+exposure*.65);nodes[1].position.z=.05+exposure*1.1;
 targetRing.visible=exposure>.01;targetRing.position.copy(nodes[1].position);targetRing.scale.setScalar(.9+Math.sin(time*2)*.04);targetRing.rotation.z=time*.25;
 scan.visible=discovery>.01;scan.position.y=-1.8+smooth(.4,1.4,p)*4;scanMaterial.opacity=discovery*.14;scanEdge.visible=scan.visible;scanEdge.position.y=scan.position.y;scanEdge.scale.setScalar(.9+discovery*.1);
 shock.visible=p>2.75&&p<3.35;shock.position.set(1.3,.5,1.55);const blast=smooth(2.75,3.35,p);rays.forEach((r,i)=>{const a=i/20*Math.PI*2;r.position.set(Math.cos(a)*blast*1.6,Math.sin(a)*blast*1.6,0);r.rotation.z=a-Math.PI/2;r.scale.setScalar(Math.sin(blast*Math.PI));});
 seal.visible=verification>.01;seal.position.copy(lock.position);seal.position.z+=.3;seal.scale.setScalar(.9+verification*.18);seal.rotation.z=time*.2;
 lock.scale.setScalar(.62+authorize*.18+verification*.38);lock.position.x=1.65-verification*.55;lock.position.z=1.1+verification*.9;
 camera.position.z=15.8-discovery*.7-exposure*.6-verification*.8;
 rim.intensity=40+defending*35+verification*20;rim.color.setHex(exposure>.5?0xf19465:0x81d1ec);
 rig.updateMatrixWorld(true);const anchor=current===2?nodes[1]:current===4?lock:current===3?impact:vault;anchor.getWorldPosition(focusPoint);focusPoint.y+=current===2?.8:1.3;focusPoint.project(camera);
 const area=host.getBoundingClientRect(),parent=host.parentElement!.getBoundingClientRect();callout.style.left=Math.max(15,Math.min(parent.width-190,(focusPoint.x*.5+.5)*area.width+area.left-parent.left))+'px';callout.style.top=Math.max(65,Math.min(parent.height-80,(-focusPoint.y*.5+.5)*area.height+area.top-parent.top))+'px';
 renderer.render(scene,camera);};gsap.ticker.add(tick);`);
// Align the threat and defenses with the highlighted endpoint, not an unrelated area.
s=s.replace('threat.position.set(3.7-approach*2.25+blocked*.55,.95-approach*.4,1.5)','threat.position.set(4.2-approach*2.9+blocked*.55,.4-approach*.0,1.5)');
fs.writeFileSync(file,s);
