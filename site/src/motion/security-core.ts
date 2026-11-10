import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// The scroll position is the single state driver. Every mechanism is reversible.
const smooth=(a:number,b:number,x:number)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
export function initCore(){
 const host=document.querySelector<HTMLElement>('#security-core');
 if(!host||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,70);camera.position.set(0,-.15,15.8);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 const materials:THREE.Material[]=[];
 const metal=(color:number,roughness=.28)=>{const m=new THREE.MeshStandardMaterial({color,metalness:.88,roughness});materials.push(m);return m;};
 const silver=metal(0xb6c6d4),navy=metal(0x17263a,.35),edgeMetal=metal(0x536e88);
 const glow=(color:number)=>{const m=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:1.2,metalness:.25,roughness:.3});materials.push(m);return m;};
 const cyan=glow(0x80d6ed),amber=glow(0xf19465);
 const rig=new THREE.Group();scene.add(rig);
 const box=(w:number,h:number,d:number,m:THREE.Material,r=.04)=>new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,r),m);
 const tube=(points:THREE.Vector3[],radius:number,material:THREE.Material)=>new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,radius,6,false),material);
 // A machined, split enclosure: six meridian leaves with a dark inner liner.
 const shell=new THREE.Group();rig.add(shell);const leaves:THREE.Group[]=[];
 for(let i=0;i<6;i++){
 const leaf=new THREE.Group(),angle=i*Math.PI/3;
 const outer=new THREE.Mesh(new THREE.SphereGeometry(2.16,28,22,angle+.035,Math.PI/3-.07,.25,Math.PI-.5),silver);leaf.add(outer);
 const inner=new THREE.Mesh(new THREE.SphereGeometry(2.115,28,22,angle+.035,Math.PI/3-.07,.25,Math.PI-.5),navy);inner.material.side=THREE.DoubleSide;leaf.add(inner);
 // luminous seam along the center of each leaf
 const seam=[];for(let j=0;j<=24;j++){const t=.32+j/24*(Math.PI-.64);seam.push(new THREE.Vector3(-2.18*Math.cos(angle+.52)*Math.sin(t),2.18*Math.cos(t),2.18*Math.sin(angle+.52)*Math.sin(t)));}
 leaf.add(tube(seam,.012,cyan));shell.add(leaf);leaves.push(leaf);
 }
 const collar=new THREE.Mesh(new THREE.TorusGeometry(2.04,.055,10,100),edgeMetal);collar.rotation.x=Math.PI/2;rig.add(collar);
 // Internal architecture: a real stack of server modules and etched circuit board.
 const network=new THREE.Group();rig.add(network);
 const board=box(1.7,2.2,.12,navy);board.position.set(-1.65,.25,-.42);network.add(board);
 for(let i=0;i<3;i++){
 const server=new THREE.Group();const unit=box(1.28,.44,.82,edgeMetal);server.add(unit);
 const face=box(1.14,.32,.035,navy,.015);face.position.z=.43;server.add(face);
 for(let j=0;j<5;j++){const slot=box(.055,.16,.025,silver,.008);slot.position.set(-.4+j*.11,0,.46);server.add(slot);}
 const led=new THREE.Mesh(new THREE.SphereGeometry(.035,8,8),cyan);led.position.set(.43,0,.47);server.add(led);server.position.set(-1.65,-.36+i*.58,.05);network.add(server);
 }
 const nodes:THREE.Group[]=[];const nodePositions=[[-2.5,-1.6,.65],[2.3,-1.5,.65],[-2.4,1.8,-.35],[2.25,1.8,-.35]];
 nodePositions.forEach(([x,y,z],i)=>{const n=new THREE.Group();const screen=box(.57,.42,.12,edgeMetal);n.add(screen);const display=box(.45,.3,.025,i===1?amber:cyan,.01);display.position.z=.08;n.add(display);const stand=box(.06,.19,.06,silver);stand.position.y=-.28;n.add(stand);const base=box(.34,.04,.2,silver);base.position.y=-.38;n.add(base);n.position.set(x,y,z);network.add(n);nodes.push(n);
 const trace=tube([new THREE.Vector3(x,y,-.15),new THREE.Vector3(x*.65,y,-.15),new THREE.Vector3(x*.65,0,-.15),new THREE.Vector3(0,0,-.15)],.018,cyan);network.add(trace);
 });
 // Three staggered firewall panes, physically inserted between the attacker and data.
 const defense=new THREE.Group();rig.add(defense);const panes:THREE.Group[]=[];
 for(let i=0;i<3;i++){
 const pane=new THREE.Group();const glass=new THREE.MeshPhysicalMaterial({color:0x5ca8bf,metalness:.15,roughness:.18,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false});materials.push(glass);
 pane.add(box(2.4,2.75,.035,glass));
 const frame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4,2.75,.04)),new THREE.LineBasicMaterial({color:0x86d5e7,transparent:true,opacity:.7}));pane.add(frame);
 for(let j=0;j<6;j++){const line=box(1.95,.012,.016,cyan,.004);line.position.set(0,-1.05+j*.42,.04);pane.add(line);}
 defense.add(pane);panes.push(pane);
 }
 // Incoming malicious packet and an actual impact cross, rather than meaningless dots.
 const threat=new THREE.Group();const shard=new THREE.Mesh(new THREE.OctahedronGeometry(.18),amber);threat.add(shard);
 const tail=tube([new THREE.Vector3(0,0,0),new THREE.Vector3(.65,.2,.2),new THREE.Vector3(1.2,.35,.3)],.022,amber);threat.add(tail);rig.add(threat);
 const impact=new THREE.Group();for(const angle of [-Math.PI/4,Math.PI/4]){const bar=box(.46,.055,.06,amber,.015);bar.rotation.z=angle;impact.add(bar);}rig.add(impact);
 // Final identity lock with a shackle that lowers into its body as access is verified.
 const lock=new THREE.Group();const body=box(.83,.7,.3,silver,.09);body.position.y=-.12;lock.add(body);
 const shackle=new THREE.Group();const arch=[];for(let j=0;j<=20;j++){const a=j/20*Math.PI;arch.push(new THREE.Vector3(Math.cos(a)*.27,Math.sin(a)*.32+.19,0));}shackle.add(tube(arch,.055,silver));lock.add(shackle);
 const keyhole=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.025,12),navy);keyhole.rotation.x=Math.PI/2;keyhole.position.set(0,-.1,.17);lock.add(keyhole);rig.add(lock);
 const halo=new THREE.Mesh(new THREE.TorusGeometry(2.48,.018,8,120),cyan);halo.rotation.x=.25;rig.add(halo);

 // The first frame is an assembled cutaway diorama, with every discipline visible.
 const stage=new THREE.Group();rig.add(stage);
 for(let i=0;i<3;i++){const disk=new THREE.Mesh(new THREE.CylinderGeometry(3.45-i*.15,3.6-i*.15,.12,100),i===1?silver:navy);disk.position.y=-2.35+i*.13;stage.add(disk);const rim=new THREE.Mesh(new THREE.TorusGeometry(3.45-i*.15,.019,8,120),cyan);rim.rotation.x=Math.PI/2;rim.position.y=-2.27+i*.13;stage.add(rim);}
 // Central vault: recessed door, hinge plates, dial and precision bolt array.
 const vault=new THREE.Group();rig.add(vault);vault.position.set(.05,.1,.2);
 const safe=box(1.5,1.85,1.2,edgeMetal,.13);vault.add(safe);
 const inset=box(1.29,1.64,.055,navy,.07);inset.position.z=.63;vault.add(inset);
 const door=new THREE.Group();door.position.set(-.58,0,.69);vault.add(door);
 const doorPlate=box(1.16,1.48,.12,silver,.07);doorPlate.position.x=.58;door.add(doorPlate);
 const wheel=new THREE.Mesh(new THREE.TorusGeometry(.26,.038,10,40),navy);wheel.position.set(.65,0,.1);door.add(wheel);
 for(let i=0;i<3;i++){const spoke=box(.52,.045,.055,navy,.01);spoke.position.set(.65,0,.11);spoke.rotation.z=i*Math.PI/3;door.add(spoke);}
 for(const y of [-.53,.53]){const hinge=box(.09,.23,.2,edgeMetal);hinge.position.set(.02,y,.02);door.add(hinge);}
 for(let i=0;i<8;i++){const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.035,8),navy);bolt.rotation.x=Math.PI/2;bolt.position.set(.14+(i%4)*.29,i<4?.6:-.6,.087);door.add(bolt);}
 const data=new THREE.Group();vault.add(data);for(let i=0;i<4;i++){const drive=box(.86,.2,.6,cyan,.025);drive.position.set(0,-.5+i*.3,.15);data.add(drive);}
 // Encrypted database stack, with alternating polished drums and luminous data seams.
 const database=new THREE.Group();rig.add(database);database.position.set(1.85,.1,-.1);
 for(let i=0;i<4;i++){const drum=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.24,40),silver);drum.position.y=-.48+i*.29;database.add(drum);const seam=new THREE.Mesh(new THREE.TorusGeometry(.48,.012,6,40),cyan);seam.rotation.x=Math.PI/2;seam.position.y=-.36+i*.29;database.add(seam);}
 // Laptop with actual keyboard keys, angled lid and code strokes.
 const laptop=new THREE.Group();rig.add(laptop);laptop.position.set(-1.55,-1.65,1.35);laptop.rotation.y=.28;
 laptop.add(box(1.05,.07,.7,silver));const lid=new THREE.Group();lid.position.set(0,.05,-.3);lid.rotation.x=-.2;laptop.add(lid);const lidPanel=box(1.05,.7,.055,edgeMetal);lidPanel.position.y=.34;lid.add(lidPanel);const screenPanel=box(.91,.55,.025,navy);screenPanel.position.set(0,.34,.04);lid.add(screenPanel);
 for(let j=0;j<5;j++){const code=box(.24+(j%3)*.12,.015,.013,cyan,.004);code.position.set(-.15,.15+j*.075,.06);lid.add(code);}
 for(let i=0;i<24;i++){const k=box(.065,.013,.06,navy,.005);k.position.set(-.36+i%8*.1,.05,-.13+Math.floor(i/8)*.11);laptop.add(k);}
 const phone=new THREE.Group();rig.add(phone);phone.position.set(1.15,-1.45,1.4);phone.rotation.set(-.15,-.28,-.13);phone.add(box(.47,.88,.09,silver,.065));const phoneScreen=box(.38,.7,.02,navy,.045);phoneScreen.position.z=.06;phone.add(phoneScreen);for(let i=0;i<6;i++){const app=box(.085,.085,.02,i===0?cyan:edgeMetal,.015);app.position.set(-.1+(i%2)*.19,.15-Math.floor(i/2)*.15,.08);phone.add(app);}
 // Cloud infrastructure, modeled as a polished connected cluster.
 const cloud=new THREE.Group();rig.add(cloud);cloud.position.set(.2,2.05,-.3);for(const [x,y,r] of [[-.52,0,.32],[-.12,.2,.43],[.36,.12,.36],[.65,-.04,.26]]){const puff=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),silver);puff.position.set(x,y,0);cloud.add(puff);}const cloudBase=box(1.35,.23,.42,silver,.1);cloudBase.position.y=-.12;cloud.add(cloudBase);
 // CPU tile and gold contact pins: the secure software layer.
 const chip=new THREE.Group();rig.add(chip);chip.position.set(-.35,-1.6,-1.1);chip.rotation.x=-Math.PI/2;chip.add(box(.7,.7,.12,navy));const die=box(.4,.4,.04,cyan);die.position.z=.09;chip.add(die);for(let side=0;side<4;side++)for(let i=0;i<6;i++){const pin=box(.035,.16,.025,silver,.005);const a=side*Math.PI/2;pin.position.set(Math.cos(a)*(-.25+i*.1)-Math.sin(a)*.41,Math.sin(a)*(-.25+i*.1)+Math.cos(a)*.41,0);pin.rotation.z=a;chip.add(pin);}
 // Sweeping data packets travel along the cables, always toward the vault.
 const packetRoutes:THREE.CatmullRomCurve3[]=[];const packets:THREE.Mesh[]=[];
 [...nodePositions,[.2,2.05,-.3],[-1.55,-1.65,1.35],[1.15,-1.45,1.4],[1.85,.1,-.1]].forEach(([x,y,z])=>{const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,y,z),new THREE.Vector3(x*.7,y*.7,z+.4),new THREE.Vector3(0,0,.6)]);packetRoutes.push(curve);const cable=new THREE.Mesh(new THREE.TubeGeometry(curve,30,.012,5,false),edgeMetal);rig.add(cable);const packet=new THREE.Mesh(new THREE.SphereGeometry(.045,8,8),cyan);rig.add(packet);packets.push(packet);});
 // Tiny perimeter bollards and tiled perimeter form a grounded security boundary.
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const bollard=box(.07,.17,.07,edgeMetal,.015);bollard.position.set(Math.cos(a)*3.18,-2,Math.sin(a)*3.18);stage.add(bollard);const tip=box(.07,.025,.07,cyan,.008);tip.position.copy(bollard.position);tip.position.y+=.095;stage.add(tip);}

 scene.add(new THREE.HemisphereLight(0xd8edff,0x111b2e,2.5));const key=new THREE.DirectionalLight(0xe4f0ff,5);key.position.set(-4,6,6);scene.add(key);const rim=new THREE.PointLight(0x81d1ec,40);rim.position.set(4,-1,4);scene.add(rim);

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

 const resize=()=>{renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(host);resize();
 const fallback=host.querySelector<SVGElement>('.core-fallback');if(fallback)fallback.style.opacity='0';
 const state={p:0};const story=document.querySelector('.security-story');
 if(story){ScrollTrigger.create({trigger:host.parentElement,start:()=> 'top '+Math.max(24,(innerHeight-host.parentElement!.offsetHeight)/2)+'px',endTrigger:story,end:'bottom bottom',pin:host.parentElement,pinSpacing:false,invalidateOnRefresh:true});
 const chapters=[...document.querySelectorAll<HTMLElement>('.security-chapter')];
 const follow=gsap.quickTo(state,'p',{duration:.7,ease:'power2.out'});
 ScrollTrigger.create({trigger:story,start:'top top',end:'bottom bottom',invalidateOnRefresh:true,onUpdate:self=>{
 const positions=[0,...chapters.map(c=>c.getBoundingClientRect().top+self.scroll()+c.clientHeight*.5-innerHeight*.5)];
 const scroll=self.scroll();let target=5;for(let i=1;i<positions.length;i++){if(scroll<=positions[i]){target=i-1+THREE.MathUtils.clamp((scroll-positions[i-1])/(positions[i]-positions[i-1]),0,1);break;}}follow(target);
 }});}
 const caption=document.querySelector('.art-caption>span:nth-child(2)');const label=document.querySelector('.art-label-top');
 const titles=['YOUR BUSINESS, INSIDE','MAP THE CONNECTED SYSTEM','IDENTIFY THE EXPOSED ENDPOINT','INTERCEPT BEFORE IMPACT','VERIFY EVERY CONNECTION','PROTECTION, BUILT IN'];let chapter=-1;
 let visible=true,paused=false,time=0;const io=new IntersectionObserver(e=>visible=e[0].isIntersecting);io.observe(host);
 const tick=(_t:number,dt:number)=>{if(!visible||document.hidden)return;if(!paused)time+=Math.min(dt,40)*.001;
 const p=state.p,open=smooth(.25,1.25,p),close=smooth(4.25,5,p),spread=.65+open*.35-close*.35;
 rig.rotation.set(.2,-.28+Math.sin(time*.18)*.04+smooth(1,2,p)*.18-smooth(3.5,4.5,p)*.18,0);
 leaves.forEach((leaf,i)=>{const a=i*Math.PI/3+.52;leaf.visible=i===3||i===4||i===5;leaf.position.set(-Math.cos(a)*spread*1.35,Math.cos(a*2)*spread*.15,Math.sin(a)*spread*1.35-1.3);leaf.rotation.y=(i%2?1:-1)*spread*.32;leaf.scale.setScalar(.9+spread*.08);});
 shell.rotation.y=.12+smooth(0,1,p)*.18;collar.scale.setScalar(1+spread*.38);collar.rotation.z=time*.035;
 network.scale.setScalar(1);network.visible=true;network.position.z=0;
 nodes.forEach((n,i)=>{n.position.x=nodePositions[i][0]*(.75+spread*.25);});
 const vulnerable=nodes[1].children[1] as THREE.Mesh;vulnerable.material=p>3.2?cyan:amber;
 const defenseIn=smooth(2.3,3.2,p),defenseOut=smooth(4,4.65,p);
 panes.forEach((pane,i)=>{pane.position.set((1-defenseIn)*(3+i*.5),0,.85+i*.27);pane.scale.setScalar((.8+defenseIn*.2)*(1-defenseOut*.35));pane.visible=p>2.3&&p<4.7;});
 const approach=smooth(1.6,2.8,p),blocked=smooth(2.85,3.3,p);threat.visible=p>1.6&&p<3.5;threat.position.set(4.2-approach*2.9+blocked*.55,.4-approach*.0,1.5);threat.scale.setScalar(1-blocked);shard.rotation.set(time,time*.7,0);
 impact.visible=p>2.8&&p<3.4;impact.position.set(1.3,.5,1.55);impact.scale.setScalar(Math.sin(smooth(2.8,3.4,p)*Math.PI));
 const authorize=smooth(3.2,4,p);lock.visible=true;lock.position.set(1.65,1.1,1.1);lock.scale.setScalar(.62+authorize*.18);shackle.position.y=(1-smooth(3.6,4.1,p))*.3;
 halo.scale.setScalar(.92+spread*.32);halo.rotation.z=time*.06;halo.material= p>3.2?cyan:edgeMetal;
 const current=Math.min(5,Math.floor(p+.4));if(current!==chapter){chapter=current;if(caption)caption.textContent=titles[current];callout.textContent=notes[current];host.parentElement?.setAttribute('data-stage',String(current));gsap.fromTo(callout,{opacity:0,y:12},{opacity:1,y:0,duration:.65,ease:'power3.out'});if(label)label.innerHTML='<span class="cross">+</span> '+['SECURITY BY DESIGN','01 / DISCOVER','02 / INSPECT','03 / DEFEND','04 / VERIFY','05 / SECURE'][current];}

 door.rotation.y=-smooth(.35,1.3,p)*1.65+smooth(3.8,4.8,p)*1.65;
 vault.position.y=.1+smooth(.4,1.4,p)*.25-smooth(4,5,p)*.25;
 data.children.forEach((d,i)=>{d.position.z=.15+smooth(.8,1.6,p)*(.25+i*.13)-smooth(3.8,4.8,p)*(.25+i*.13);});
 database.position.x=1.85+smooth(.7,1.5,p)*.3-smooth(4,5,p)*.3;
 cloud.position.y=2.05+Math.sin(time*.6)*.035+smooth(.5,1.4,p)*.2;
 stage.rotation.y=Math.sin(time*.12)*.025;
 packets.forEach((packet,i)=>{packet.position.copy(packetRoutes[i].getPoint((time*.14+i*.11)%1));});

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
 renderer.render(scene,camera);};gsap.ticker.add(tick);
 const button=document.querySelector<HTMLButtonElement>('#motion-toggle');button?.addEventListener('click',()=>{paused=!paused;button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'▷':'Ⅱ';button.setAttribute('aria-label',paused?'Play idle animation':'Pause idle animation');});
 window.addEventListener('pagehide',()=>{gsap.ticker.remove(tick);ro.disconnect();io.disconnect();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments)o.geometry.dispose();});materials.forEach(m=>m.dispose());env.dispose();renderer.dispose();},{once:true});
}



