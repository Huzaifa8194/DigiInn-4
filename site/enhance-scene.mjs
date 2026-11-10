import fs from 'node:fs';
const file='src/motion/security-core.ts';let s=fs.readFileSync(file,'utf8');
s=s.replace("camera.position.set(0,.3,13.8)","camera.position.set(0,.65,16.8)");
s=s.replace('const board=box(2.45,2.75,.12,navy);board.position.z=-.42;network.add(board);','const board=box(1.7,2.2,.12,navy);board.position.set(-1.65,.25,-.42);network.add(board);');
s=s.replace('server.position.set(0,-.58+i*.58,.05)','server.position.set(-1.65,-.36+i*.58,.05)');
s=s.replace("const nodePositions=[[-1.65,.9,.05],[1.65,.9,.05],[-1.65,-.85,.05],[1.65,-.85,.05]]","const nodePositions=[[-2.5,-1.6,.65],[2.3,-1.5,.65],[-2.4,1.8,-.35],[2.25,1.8,-.35]]");
const extra=`
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
`;
s=s.replace(' scene.add(new THREE.HemisphereLight',extra+'\n scene.add(new THREE.HemisphereLight');
s=s.replace('spread=open*(1-close)','spread=.65+open*.35-close*.35');
s=s.replace('rig.rotation.set(.12,-.35','rig.rotation.set(.2,-.28');
s=s.replace('leaf.position.set(-Math.cos(a)*spread*1.75,Math.cos(a*2)*spread*.25,Math.sin(a)*spread*1.75);','leaf.visible=i===0||i===1||i===2;leaf.position.set(-Math.cos(a)*spread*1.35,Math.cos(a*2)*spread*.15,Math.sin(a)*spread*1.35-1.3);');
s=s.replace('leaf.scale.setScalar(1+spread*.08)','leaf.scale.setScalar(.9+spread*.08)');
s=s.replace('network.scale.setScalar(.68+spread*.32);network.visible=open>.01;network.position.z=spread*.1;','network.scale.setScalar(1);network.visible=true;network.position.z=0;');
s=s.replace('const authorize=smooth(3.2,4,p);lock.visible=p>3.15;lock.position.set(0,0,1.25-close*.75);lock.scale.setScalar(authorize*(1-close*.22));','const authorize=smooth(3.2,4,p);lock.visible=true;lock.position.set(1.65,1.1,1.1);lock.scale.setScalar(.62+authorize*.18);');
s=s.replace(' renderer.render(scene,camera);};gsap.ticker.add(tick);',`
 door.rotation.y=-smooth(.35,1.3,p)*1.65+smooth(3.8,4.8,p)*1.65;
 vault.position.y=.1+smooth(.4,1.4,p)*.25-smooth(4,5,p)*.25;
 data.children.forEach((d,i)=>{d.position.z=.15+smooth(.8,1.6,p)*(.25+i*.13)-smooth(3.8,4.8,p)*(.25+i*.13);});
 database.position.x=1.85+smooth(.7,1.5,p)*.3-smooth(4,5,p)*.3;
 cloud.position.y=2.05+Math.sin(time*.6)*.035+smooth(.5,1.4,p)*.2;
 stage.rotation.y=Math.sin(time*.12)*.025;
 packets.forEach((packet,i)=>{packet.position.copy(packetRoutes[i].getPoint((time*.14+i*.11)%1));});
 renderer.render(scene,camera);};gsap.ticker.add(tick);`);
fs.writeFileSync(file,s);
