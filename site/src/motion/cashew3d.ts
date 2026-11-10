// The home "chain" cashew, modelled and lit in three.js: a cashew apple, the raw nut in its
// two-part shell, the kernel (brown skin that peels to ivory), and a vacuum bag of kernels.
// Everything is driven by one state object (ChainState) set by the scroll timeline in chain.ts.
// Rendered on the GSAP ticker (one clock), only while the stage is on screen.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type ChainState = {
  s: number;          // driver, 0..7
  apple: number;      // 1 on the tree, 0 gone
  nutLift: number;    // 0 hanging under the apple, 1 centred
  open: number;       // shell opening 0..1
  away: number;       // shell halves leaving 0..1
  peel: number;       // skin peeled 0..1
  spin: number;       // extra turns (radians)
  grade: number;      // kernel scale multiplier while grading
  pack: number;       // carton fill 0..1
  carton: number;     // carton presence 0..1
  x: number;          // horizontal offset (beside the hero copy, then centred)
};

export const initialState = (): ChainState => ({ s: 0, apple: 1, nutLift: 0, open: 0, away: 0, peel: 0, spin: 0, grade: 1, pack: 0, carton: 0, x: 0 });

const deg = (d: number) => (d * Math.PI) / 180;

/** Sweep an elliptical section along a circular arc, with rounded (capsule) ends and a seam groove. */
function sweep(o: { R: number; a0: number; a1: number; w: number; d: number; seam: number; bulge?: number; th0?: number; thL?: number; segU?: number; segV?: number }) {
  const lite = matchMedia('(max-width: 900px), (pointer: coarse)').matches;
  const segU = Math.round((o.segU ?? 160) * (lite ? 0.6 : 1)), segV = Math.round((o.segV ?? 64) * (lite ? 0.6 : 1));
  const th0 = o.th0 ?? 0, thL = o.thL ?? Math.PI * 2;
  const L = o.R * Math.abs(o.a1 - o.a0);
  const re = o.w * 1.05;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
  for (let i = 0; i <= segU; i++) {
    const t = 0.5 - 0.5 * Math.cos((Math.PI * i) / segU); // denser at the ends
    const a = o.a0 + (o.a1 - o.a0) * t;
    const px = o.R * Math.cos(a), py = o.R * Math.sin(a);
    const rx = Math.cos(a), ry = Math.sin(a);
    const s = Math.min(t, 1 - t) * L;
    const k = s < re ? Math.sqrt(Math.max(0, 1 - (1 - s / re) ** 2)) : 1;
    const wt = o.w * (1 + (o.bulge ?? 0.08) * Math.sin(Math.PI * t)) * (1 + 0.05 * Math.sin(t * 9.0) * 0.3);
    for (let j = 0; j <= segV; j++) {
      const th = th0 + (thL * j) / segV;
      const c = Math.cos(th), sn = Math.sin(th);
      const g = 1 - o.seam * (Math.exp(-(wrap(th) ** 2) / 0.012) + Math.exp(-(wrap(th - Math.PI) ** 2) / 0.012));
      const r = wt * k * c * g;
      pos.push(px + rx * r, py + ry * r, o.d * k * sn * (0.94 + 0.06 * g));
      uv.push(t, j / segV);
    }
  }
  for (let i = 0; i < segU; i++) for (let j = 0; j < segV; j++) {
    const a = i * (segV + 1) + j, b = a + segV + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.center();
  return g;
}

/** Tileable-ish organic noise on a canvas, used for bump and colour variation. */
function noiseTexture(size = 512, cells = 7, seed = 1) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d')!;
  x.fillStyle = '#808080';
  x.fillRect(0, 0, size, size);
  let r = seed;
  const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647);
  for (let o = 0; o < 4; o++) {
    const n = cells * 2 ** o * 60;
    const rad = (size / (cells * 2 ** o)) * 0.6;
    for (let i = 0; i < n; i++) {
      const v = rnd() > 0.5 ? 255 : 0;
      x.fillStyle = `rgba(${v},${v},${v},${0.05 / (o + 1)})`;
      x.beginPath();
      x.ellipse(rnd() * size, rnd() * size, rad * (0.4 + rnd()), rad * (0.2 + rnd() * 0.6), rnd() * Math.PI, 0, Math.PI * 2);
      x.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function labelTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const x = c.getContext('2d')!;
  x.fillStyle = '#b98a55'; x.fillRect(0, 0, 1024, 512);
  x.fillStyle = 'rgba(70,45,20,0.08)';
  for (let i = 0; i < 60; i++) x.fillRect(0, Math.random() * 512, 1024, 1 + Math.random() * 2);
  x.fillStyle = '#efe2c2'; x.fillRect(110, 268, 804, 214);
  x.fillStyle = '#0a1020';
  x.font = '600 80px Martian, monospace'; x.fillText('W240', 150, 360);
  x.font = '500 30px Martian, monospace'; x.fillText('WHITE WHOLES  ·  CASHEW KERNELS', 150, 412);
  x.fillStyle = '#4a5366'; x.font = '400 27px Martian, monospace'; x.fillText('ONYX AGRO-INDUSTRY  ·  CÔTE D’IVOIRE', 150, 458);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Inject a two-tone peel (testa → ivory) and darker shell interiors into a physical material. */
function kernelMaterial(noise: THREE.Texture) {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, map: noise, bumpMap: noise, bumpScale: 2.2, roughness: 0.58,
    sheen: 0.12, sheenRoughness: 0.6, sheenColor: new THREE.Color('#ffe7c0'),
    clearcoat: 0.08, clearcoatRoughness: 0.6,
  });
  const uniforms = { uPeel: { value: 0 } };
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uPeel = uniforms.uPeel;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uPeel;')
      .replace('#include <map_fragment>', `
        float nz = texture2D(map, vMapUv * vec2(3.0, 2.0)).r;
        float nz2 = texture2D(map, vMapUv * vec2(9.0, 5.0) + 0.37).r;
        float thr = vMapUv.x * 0.78 + nz * 0.22;
        float peeled = 1.0 - smoothstep(uPeel - 0.05, uPeel + 0.05, thr * 1.1 - 0.05);
        vec3 testa = mix(vec3(0.26, 0.10, 0.04), vec3(0.47, 0.22, 0.10), nz2) * (0.7 + 0.5 * nz);
        vec3 ivory = mix(vec3(0.78, 0.64, 0.42), vec3(0.93, 0.85, 0.68), smoothstep(0.35, 0.7, nz)) * (0.92 + 0.12 * nz2);
        diffuseColor.rgb = mix(testa, ivory, peeled);
      `)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(0.82, 0.5, peeled);');
  };
  return { m, uniforms };
}

function shellMaterial(noise: THREE.Texture) {
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#8b7b5a'), map: noise, bumpMap: noise, bumpScale: 3.5, roughness: 0.85,
    side: THREE.DoubleSide,
  });
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `
      float nz = texture2D(map, vMapUv * vec2(4.0, 2.0)).r;
      float nz3 = texture2D(map, vMapUv * vec2(1.3, 0.7) + 0.6).r;
      vec3 outer = mix(vec3(0.16, 0.13, 0.08), vec3(0.40, 0.34, 0.22), nz) * mix(0.7, 1.15, smoothstep(0.3, 0.7, nz3));
      vec3 inner = mix(vec3(0.20, 0.12, 0.05), vec3(0.42, 0.26, 0.10), nz); // the honeycomb layer inside
      diffuseColor.rgb = gl_FrontFacing ? outer : inner;
    `);
  };
  return m;
}

function appleGeometry() {
  const prof = [[0.0, -0.02], [0.3, 0.0], [0.52, 0.1], [0.62, 0.3], [0.63, 0.62], [0.58, 0.98], [0.5, 1.32], [0.38, 1.62], [0.22, 1.82], [0.08, 1.9], [0.0, 1.91]];
  const curve = new THREE.SplineCurve(prof.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.LatheGeometry(curve.getPoints(60), 96);
  const p = g.attributes.position as THREE.BufferAttribute;
  const col: number[] = [];
  const top = new THREE.Color('#9e1f1c'), mid = new THREE.Color('#d0382a'), low = new THREE.Color('#f0a63a');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const ang = Math.atan2(z, x);
    const lobe = 1 + 0.035 * Math.sin(ang * 3 + y * 1.5) + 0.02 * Math.sin(ang * 5);
    p.setX(i, x * lobe); p.setZ(i, z * lobe);
    const h = y / 1.9;
    const c = h < 0.35 ? low.clone().lerp(mid, h / 0.35) : mid.clone().lerp(top, (h - 0.35) / 0.65);
    c.lerp(low, Math.max(0, Math.cos(ang - 0.6)) * 0.25 * (1 - h)); // a yellow blush on one cheek
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

export function createCashew3D(host: HTMLElement) {
  const lite = matchMedia('(max-width: 900px), (pointer: coarse)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: !lite, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, lite ? 1.25 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.domElement.className = 'cashew3d';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0, 9);

  const key = new THREE.DirectionalLight(0xfff0d8, 1.9);
  key.position.set(-3, 4, 5);
  const rim = new THREE.DirectionalLight(0x9fb8ff, 1.1);
  rim.position.set(4, 1.5, -4);
  const fill = new THREE.HemisphereLight(0xfff6e8, 0x1a1408, 0.22);
  scene.add(key, rim, fill);

  const noise = noiseTexture(512, 6, 7);
  const fine = noiseTexture(512, 18, 3);

  // ---- objects
  const root = new THREE.Group(); scene.add(root);
  const fruit = new THREE.Group(); root.add(fruit);   // apple + nut while on the tree
  const nut = new THREE.Group(); fruit.add(nut);

  const kernelGeo = sweep({ R: 0.92, a0: deg(92), a1: deg(300), w: 0.36, d: 0.3, seam: 0.06, bulge: 0.12 });
  const { m: kernelMat, uniforms: peelU } = kernelMaterial(fine);
  const kernel = new THREE.Mesh(kernelGeo, kernelMat); nut.add(kernel);

  const shellOpts = { R: 0.9, a0: deg(100), a1: deg(292), w: 0.56, d: 0.44, seam: -0.035, bulge: 0.05, segU: 140, segV: 40 };
  const shellMat = shellMaterial(noise);
  const halfFront = new THREE.Mesh(sweep({ ...shellOpts, th0: 0, thL: Math.PI }), shellMat);
  const halfBack = new THREE.Mesh(sweep({ ...shellOpts, th0: Math.PI, thL: Math.PI }), shellMat);
  // sweep().center() recentres each half; re-align them on the shared seam plane
  halfFront.geometry.translate(0, 0, 0.44 * 0.5);
  halfBack.geometry.translate(0, 0, -0.44 * 0.5);
  const shellFront = new THREE.Group(); shellFront.add(halfFront);
  const shellBack = new THREE.Group(); shellBack.add(halfBack);
  nut.add(shellFront, shellBack);

  const appleMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.25, bumpMap: fine, bumpScale: 0.6, sheen: 0.2 });
  const apple = new THREE.Mesh(appleGeometry(), appleMat);
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.55, 12), new THREE.MeshStandardMaterial({ color: '#56702f', roughness: 0.7 }));
  stalk.position.set(0.05, 2.12, 0); stalk.rotation.z = -0.3;
  const appleG = new THREE.Group(); appleG.add(apple, stalk);
  fruit.add(appleG);

  // vacuum bag (clear plastic) that fills with kernels, and a pallet of finished bags behind it
  const plastic = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transparent: true, opacity: 0.2, roughness: 0.14, metalness: 0,
    clearcoat: 1, clearcoatRoughness: 0.12, bumpMap: fine, bumpScale: 6, side: THREE.DoubleSide, depthWrite: false,
  });
  const BW = 2.5, BH = 1.2, BD = 1.45;
  const carton = new THREE.Group(); root.add(carton); // ("carton" = the packing group)
  const bag = new THREE.Mesh(new RoundedBoxGeometry(BW, BH, BD, 6, 0.22), plastic);
  bag.renderOrder = 2;
  const seal = new THREE.Mesh(new THREE.BoxGeometry(BW * 1.02, 0.06, 0.12), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, roughness: 0.2, clearcoat: 1 }));
  seal.position.set(0, BH / 2 + 0.02, 0); seal.renderOrder = 3;
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.7 }));
  tag.position.set(-0.55, -0.05, BD / 2 + 0.012); tag.renderOrder = 3;
  const bagG = new THREE.Group(); bagG.add(bag, seal, tag); carton.add(bagG);
  const N = 108;
  const small = kernelGeo.clone(); small.scale(0.25, 0.25, 0.25);
  const packed = new THREE.InstancedMesh(small, kernelMat, N);
  packed.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  bagG.add(packed);

  // export carton: the sealed bag goes into it
  const kraft = new THREE.MeshStandardMaterial({ color: '#b98a55', roughness: 0.92, bumpMap: noise, bumpScale: 1.2, side: THREE.DoubleSide });
  const front = new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.9, side: THREE.DoubleSide });
  const hidden = new THREE.MeshBasicMaterial({ visible: false });
  const CW = BW + 0.3, CH = 1.0, CD = BD + 0.3;
  const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(CW, CH, CD), [kraft, kraft, hidden, kraft, front, kraft]);
  const flapF = new THREE.Mesh(new THREE.PlaneGeometry(CW, CD / 2).translate(0, CD / 4, 0), kraft);
  const flapK = new THREE.Mesh(new THREE.PlaneGeometry(CW, CD / 2).translate(0, CD / 4, 0), kraft);
  flapF.position.set(0, CH / 2, CD / 2); flapK.position.set(0, CH / 2, -CD / 2);
  const box = new THREE.Group(); box.add(boxMesh, flapF, flapK);
  carton.add(box);
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const slots = Array.from({ length: N }, (_, i) => {
    const gx = i % 9, gz = Math.floor(i / 9) % 4, gy = Math.floor(i / 36);
    return {
      x: -BW / 2 + 0.28 + gx * ((BW - 0.56) / 8) + (rnd() - 0.5) * 0.08,
      z: -BD / 2 + 0.3 + gz * ((BD - 0.6) / 3) + (rnd() - 0.5) * 0.08,
      y: -BH / 2 + 0.26 + gy * 0.34 + (rnd() - 0.5) * 0.06,
      r: new THREE.Euler(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28),
      delay: gy * 0.22 + rnd() * 0.2,
    };
  });
  const tmp = new THREE.Object3D();

  // pallet of finished vacuum bags (textured bricks under the same plastic)
  const brickTex = new THREE.TextureLoader().load('/tex/kernels.jpg');
  brickTex.colorSpace = THREE.SRGBColorSpace;
  brickTex.wrapS = brickTex.wrapT = THREE.RepeatWrapping;
  const brickMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.6, color: '#e9dcc0' });
  const pallet = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.8 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.18, 3.0), wood); base.position.y = -0.7; pallet.add(base);
  const brickGeo = new RoundedBoxGeometry(BW * 0.98, BH * 0.95, BD * 0.98, 4, 0.2);
  [[-1.35, 0, -0.75], [1.35, 0, -0.75], [-1.35, 0, 0.75], [1.35, 0, 0.75], [-1.35, 1.2, -0.75], [1.35, 1.2, -0.75], [0, 2.4, -0.75]].forEach(([x, y, z], i) => {
    const b = new THREE.Group();
    b.add(new THREE.Mesh(brickGeo, brickMat), new THREE.Mesh(brickGeo, plastic));
    b.position.set(x, y, z); b.rotation.y = (i % 3 - 1) * 0.04;
    pallet.add(b);
  });
  pallet.position.set(0.4, -0.6, -3.4);
  pallet.scale.setScalar(0.85);
  carton.add(pallet);

  // soft contact shadow
  const shC = document.createElement('canvas'); shC.width = shC.height = 128;
  const sx = shC.getContext('2d')!; const gr = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shC), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.1;
  root.add(shadow);

  // ---- layout
  let w = 1, h = 1;
  const resize = () => {
    const r = host.getBoundingClientRect();
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = 9 * Math.max(1, 1.0 / camera.aspect);
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize); ro.observe(host);

  const tints = [new THREE.Color('#ffe9b8'), new THREE.Color('#ffe9b8'), new THREE.Color('#ffd9a0'), new THREE.Color('#e8eef8'), new THREE.Color('#ffc48a'), new THREE.Color('#ffffff'), new THREE.Color('#d6e2ff'), new THREE.Color('#d6e2ff')];
  const lerpTint = (s: number) => { const i = Math.min(6, Math.floor(s)); return tints[i].clone().lerp(tints[i + 1], s - i); };

  const ease = (x: number) => x * x * (3 - 2 * x);
  let lastPack = -1;
  function update(S: ChainState, time: number, px: number, py: number) {
    peelU.uPeel.value = S.peel * 1.15;
    key.color.copy(lerpTint(S.s));

    // tree → centred nut
    const lift = ease(Math.min(1, S.nutLift));
    appleG.visible = S.apple > 0.001;
    appleG.position.set(-0.05, 0.42 + (1 - S.apple) * 3.2, 0);
    appleG.rotation.z = (1 - S.apple) * 0.5;
    appleG.scale.setScalar(1.05);
    (apple.material as THREE.MeshPhysicalMaterial).opacity = 1;
    const nutScale = THREE.MathUtils.lerp(0.62, 1.25, lift);
    nut.scale.setScalar(nutScale * S.grade * (1 - 0.82 * ease(Math.min(1, S.pack * 1.4))));
    nut.position.set(THREE.MathUtils.lerp(0.12, 0, lift), THREE.MathUtils.lerp(-0.12, 0.05, lift), 0);
    nut.rotation.set(THREE.MathUtils.lerp(0, -0.25, lift), THREE.MathUtils.lerp(0.15, -0.55, lift) + S.spin, THREE.MathUtils.lerp(-0.45, 0.1, lift));
    fruit.position.y = THREE.MathUtils.lerp(-0.85, 0, lift);

    // shell: the front half lifts like a lid, then both halves leave
    const op = ease(Math.min(1, S.open)), aw = ease(Math.min(1, S.away));
    kernel.visible = S.open > 0.02;
    shellFront.visible = shellBack.visible = aw < 0.999;
    shellFront.position.set(-0.35 * op - 2.6 * aw, 0.55 * op + 2.4 * aw, 0.9 * op + 1.5 * aw);
    shellFront.rotation.set(-0.5 * op - 1.2 * aw, -0.9 * op - 1.0 * aw, 0.3 * op);
    shellBack.position.set(0.25 * op + 2.6 * aw, -0.35 * op - 2.6 * aw, -0.5 * op - 1.0 * aw);
    shellBack.rotation.set(0.35 * op + 0.9 * aw, 0.45 * op + 1.2 * aw, -0.2 * op);

    // the bag fills, kernel by kernel, then pulls tight under vacuum; a pallet of bags appears behind
    const cp = ease(Math.min(1, S.carton));
    carton.visible = cp > 0.001;
    carton.scale.setScalar(0.62 + 0.38 * cp);
    carton.position.set(0, -0.45 - (1 - cp) * 0.8, 0);
    carton.rotation.set(0.32, -0.5 + (1 - cp) * 0.6, 0);
    const vac = ease(Math.min(1, Math.max(0, (S.pack - 0.82) / 0.18)));
    bag.scale.set(1 - 0.04 * vac, 1 - 0.1 * vac, 1 - 0.06 * vac);
    plastic.bumpScale = 6 + 10 * vac;
    seal.visible = vac > 0.5;
    // 6→7: the carton rises around the sealed bag, which settles into it; flaps fold open
    const bx = ease(Math.min(1, Math.max(0, (S.s - 6.12) / 0.6)));
    box.visible = bx > 0.001;
    box.position.y = -BH / 2 + CH / 2 - 0.12 - (1 - bx) * 3.2;
    bagG.position.y = -0.22 * bx;
    tag.visible = vac > 0.5 && bx < 0.6;
    flapF.visible = false; // front flap tucked in: the label and the bag stay readable
    flapK.rotation.x = THREE.MathUtils.lerp(0.1, -deg(30), bx);
    const pal = ease(Math.min(1, Math.max(0, (S.s - 6.1) / 0.6)));
    pallet.visible = pal > 0.001;
    pallet.position.y = -0.6 - (1 - pal) * 2.5;
    if (S.pack !== lastPack) { lastPack = S.pack; for (let i = 0; i < N; i++) {
      const sl = slots[i];
      const p = Math.min(1, Math.max(0, (S.pack - sl.delay) / 0.35));
      const e = 1 - (1 - p) ** 3;
      tmp.position.set(sl.x * (1 - 0.04 * vac), sl.y * (1 - 0.1 * vac) + (1 - e) * 2.6, sl.z * (1 - 0.06 * vac));
      tmp.rotation.set(sl.r.x + (1 - e) * 2, sl.r.y, sl.r.z);
      tmp.scale.setScalar(p > 0 ? 1 : 0.0001);
      tmp.updateMatrix();
      packed.setMatrixAt(i, tmp.matrix);
    }
    packed.instanceMatrix.needsUpdate = true; }

    // idle + pointer: the fruit sways a little; light leans with the pointer
    root.rotation.y = Math.sin(time * 0.35) * 0.12 + px * 0.35;
    root.rotation.x = py * 0.12;
    root.position.y = Math.sin(time * 0.8) * 0.04;
    root.position.x = S.x * camera.aspect;
    shadow.material.opacity = 0.7 * (1 - cp) * (1 - 0.4 * lift);
    key.position.x = -3 + px * 2.5;

    renderer.render(scene, camera);
  }

  return {
    update,
    dispose() {
      ro.disconnect();
      renderer.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mt) => { Object.values(mt).forEach((v) => (v as THREE.Texture)?.isTexture && (v as THREE.Texture).dispose()); mt.dispose(); });
      });
      renderer.domElement.remove();
    },
  };
}
