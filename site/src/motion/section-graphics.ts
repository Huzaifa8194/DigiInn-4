import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const steel = new THREE.MeshStandardMaterial({ color: '#b6c6d4', metalness: 0.88, roughness: 0.27 });
const blue = new THREE.MeshStandardMaterial({ color: '#536e88', metalness: 0.84, roughness: 0.31 });
const navy = new THREE.MeshStandardMaterial({ color: '#17263a', metalness: 0.76, roughness: 0.35 });
const pale = new THREE.MeshStandardMaterial({ color: '#80d6ed', emissive: '#80d6ed', emissiveIntensity: 0.65, metalness: 0.25, roughness: 0.3 });
const amber = new THREE.MeshStandardMaterial({ color: '#f19465', emissive: '#f19465', emissiveIntensity: 0.4, roughness: 0.34 });

function piece(geometry: THREE.BufferGeometry, material = blue, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  return mesh;
}

function ring(radius: number, tube = 0.045, material = pale) {
  return piece(new THREE.TorusGeometry(radius, tube, 10, 48), material);
}

function block(w: number, h: number, d: number, x = 0, y = 0, z = 0, material = blue) {
  return piece(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d, 0.14) / 2), material, x, y, z);
}

function createVisual(motif: string) {
  const group = new THREE.Group();
  const movement: ((time: number) => void)[] = [];
  switch (motif) {
    case 'shield': {
      const outline = new THREE.Shape();
      outline.moveTo(-0.84, 0.63);
      outline.lineTo(0, 0.93);
      outline.lineTo(0.84, 0.63);
      outline.lineTo(0.84, 0.08);
      outline.quadraticCurveTo(0.75, -0.57, 0, -0.9);
      outline.quadraticCurveTo(-0.75, -0.57, -0.84, 0.08);
      outline.closePath();
      const shell = piece(new THREE.ExtrudeGeometry(outline, { depth: 0.16, bevelSize: 0.05, bevelThickness: 0.05 }), steel);
      const inset = piece(shell.geometry, navy, 0, 0, 0.08);
      inset.scale.set(0.84, 0.84, 0.7);
      const aperture = ring(0.34, 0.018);
      aperture.position.z = 0.28;
      const collar = ring(1.0, 0.023, blue);
      collar.position.z = -0.18;
      collar.rotation.set(0.35, 0.45, 0);
      group.add(collar, shell, inset, aperture);
      movement.push(t => { collar.rotation.y = 0.45 + Math.sin(t * 0.8) * 0.32; });
      for (const side of [-1, 1]) {
        const rail = new THREE.Group();
        rail.add(block(0.15, 0.87, 0.17, 0, 0, 0, steel));
        rail.add(block(0.032, 0.52, 0.024, 0, 0.03, 0.096, pale));
        for (const y of [-0.35, 0.35]) {
          const bolt = piece(new THREE.CylinderGeometry(0.037, 0.037, 0.018, 6), navy, 0, y, 0.098);
          bolt.rotation.x = Math.PI / 2;
          rail.add(bolt);
        }
        rail.rotation.z = side * -0.19;
        group.add(rail);
        movement.push(t => { rail.position.set(side * (0.72 + 0.17 * (1 + Math.sin(t * 1.45))), 0.09, 0.22); });
      }
      movement.push(t => { inset.position.z = 0.11 + 0.075 * (1 + Math.sin(t * 1.45)); aperture.position.z = inset.position.z + 0.16; });
      const short = block(0.36, 0.12, 0.07, -0.25, -0.05, 0.25, pale);
      const long = block(0.69, 0.12, 0.07, 0.08, 0.07, 0.25, pale);
      short.rotation.z = -Math.PI / 4;
      long.rotation.z = Math.PI / 4;
      group.add(short, long);
      movement.push(() => { short.position.z = long.position.z = aperture.position.z + 0.025; });
      break;
    }
    case 'layers':
      for (let i = -1; i <= 1; i++) {
        const plate = new THREE.Group();
        plate.add(block(1.74, 0.16, 1.24, 0, 0, 0, steel), block(1.61, 0.11, 1.13, 0, 0, 0.075, navy));
        for (let slot = 0; slot < 7; slot++) {
          plate.add(block(0.06, 0.047, 0.022, -0.62 + slot * 0.137, 0, 0.65, blue));
        }
        plate.add(block(0.13, 0.035, 0.026, 0.64, 0, 0.65, i === 1 ? amber : pale));
        group.add(plate);
        movement.push(t => { plate.position.y = i * (0.42 + 0.18 * Math.sin(t * 1.5)); });
      }
      break;
    case 'signal': {
      const dish = ring(0.93, 0.075, steel);
      const inner = ring(0.72, 0.023, blue);
      group.add(dish, inner);
      const sweep = new THREE.Group();
      sweep.add(block(0.82, 0.024, 0.028, 0.4, 0, 0.13, pale));
      group.add(sweep);
      movement.push(t => { sweep.rotation.z = t * 0.9; });
      for (let i = 0; i < 7; i++) {
        const bar = block(0.095, 0.85, 0.075, (i - 3) * 0.16, 0, -0.07, i === 4 ? amber : blue);
        group.add(bar);
        movement.push(t => { bar.scale.y = 0.23 + Math.pow(Math.sin(t * 2 - i * 0.47), 2) * 0.96; });
      }
      break;
    }
    case 'network': {
      const points = [[0, 0, 0], [-0.88, 0.53, 0.12], [0.86, 0.56, -0.16], [-0.78, -0.49, -0.3], [0.81, -0.48, 0.28]];
      const axis = new THREE.Vector3(0, 1, 0);
      for (const [i, [x, y, z]] of points.entries()) {
        const module = new THREE.Group();
        const size = i ? 0.34 : 0.54;
        module.position.set(x, y, z);
        module.add(block(size, size, 0.23, 0, 0, 0, steel), block(size * 0.79, size * 0.78, 0.04, 0, 0, 0.13, navy));
        module.add(block(size * 0.48, 0.032, 0.02, 0, 0, 0.16, i ? pale : amber));
        group.add(module);
        if (i === 0) continue;
        const end = new THREE.Vector3(x, y, z);
        const link = piece(new THREE.CylinderGeometry(0.024, 0.024, end.length(), 8));
        link.position.copy(end).multiplyScalar(0.5);
        link.quaternion.setFromUnitVectors(axis, end.clone().normalize());
        const pulse = piece(new THREE.SphereGeometry(0.065, 10, 8), amber);
        group.add(link, pulse);
        movement.push(t => { pulse.position.copy(end).multiplyScalar((t * 0.65 + i * 0.24) % 1); });
      }
      break;
    }
    case 'window': {
      group.add(block(1.94, 1.24, 0.14, 0, 0, 0, steel), block(1.77, 1.08, 0.04, 0, 0, 0.09, navy));
      group.add(block(1.69, 0.12, 0.03, 0, 0.42, 0.12, blue));
      for (const x of [-0.75, -0.65, -0.55]) {
        group.add(piece(new THREE.SphereGeometry(0.023, 12, 8), pale, x, 0.42, 0.15));
      }
      const rear = block(1.74, 1.1, 0.12, 0.19, 0.19, -0.4, blue);
      group.add(rear);
      movement.push(t => { rear.position.z = -0.3 - 0.25 * (1 + Math.sin(t * 1.25)); });
      const panel = block(0.66, 0.55, 0.1, -0.46, -0.02, 0.13, amber);
      group.add(panel, block(0.7, 0.11, 0.06, 0.36, 0.14, 0.12, pale), block(0.62, 0.11, 0.06, 0.32, -0.12, 0.12, pale));
      movement.push(t => { panel.position.z = 0.18 + (1 + Math.sin(t * 1.6)) * 0.13; });
      break;
    }
    case 'people':
      for (let i = -1; i <= 1; i++) {
        const profile = new THREE.Group();
        profile.add(block(0.52, 0.8, 0.13, 0, 0, 0, i ? blue : steel));
        profile.add(block(0.42, 0.66, 0.04, 0, 0, 0.075, navy));
        profile.add(piece(new THREE.SphereGeometry(0.1, 20, 12), pale, 0, 0.12, 0.12));
        profile.add(block(0.26, 0.085, 0.03, 0, -0.09, 0.12, blue));
        profile.add(block(0.17, 0.02, 0.02, 0, -0.23, 0.11, i ? pale : amber));
        profile.position.set(i * 0.57, 0, i ? -0.19 : 0.19);
        profile.rotation.y = -i * 0.28;
        group.add(profile);
        movement.push(t => { profile.position.y = 0.2 * Math.sin(t * 1.35 + i * 0.8); });
      }
      break;
    case 'message': {
      group.add(block(1.65, 1.05, 0.18, 0, 0, 0, steel), block(0.3, 0.29, 0.16, -0.54, -0.49, steel));
      group.add(block(1.47, 0.86, 0.04, 0, 0, 0.105, navy));
      const reply = block(1.34, 0.86, 0.12, 0.35, 0.26, -0.38, blue);
      group.add(reply);
      movement.push(t => { reply.position.y = 0.24 + 0.18 * Math.sin(t * 1.5); });
      for (let i = -1; i <= 1; i++) {
        const dot = piece(new THREE.SphereGeometry(0.09, 12, 10), pale, i * 0.32, 0, 0.17);
        group.add(dot);
        movement.push(t => { dot.position.y = 0.09 * Math.sin(t * 3 - i); });
      }
      break;
    }
    default: {
      group.add(piece(new THREE.IcosahedronGeometry(0.42, 2), steel));
      for (let i = 0; i < 3; i++) {
        const shell = piece(new THREE.SphereGeometry(0.57, 24, 18, i * Math.PI * 2 / 3, 1.72, 0.45, 2.22), blue);
        group.add(shell);
        movement.push(t => { shell.rotation.y = t * 0.38; shell.position.y = Math.sin(t * 1.2 + i * 2) * 0.12; });
      }
      for (let i = 0; i < 3; i++) {
        const orbit = ring(0.79 + 0.07 * i, i === 1 ? 0.023 : 0.04, i === 1 ? pale : steel);
        const dot = piece(new THREE.SphereGeometry(0.085, 12, 10), amber, 0.79 + 0.07 * i);
        orbit.add(dot);
        group.add(orbit);
        movement.push(t => { orbit.rotation.set(i * 0.9 + t * 0.32, i * 0.76, t * (0.9 - 0.19 * i)); });
      }
    }
  }
  // The assembly shares the hero's machined plinth, illuminated rim and instrument rails.
  group.scale.setScalar(0.84);
  group.position.y = 0.29;

  const stage = new THREE.Group();
  stage.add(group);
  stage.add(
    piece(new THREE.CylinderGeometry(1.34, 1.41, 0.13, 64), navy, 0, -0.81),
    piece(new THREE.CylinderGeometry(1.29, 1.34, 0.09, 64), steel, 0, -0.72),
    piece(new THREE.CylinderGeometry(1.21, 1.21, 0.025, 64), blue, 0, -0.665),
  );
  const rim = ring(1.29, 0.015, pale);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.692;
  stage.add(rim);

  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6;
    stage.add(piece(new THREE.CylinderGeometry(0.025, 0.03, 0.075, 8), steel,
      Math.sin(angle) * 1.19, -0.622, Math.cos(angle) * 1.19));
  }

  const arc = piece(new THREE.TorusGeometry(1.16, 0.017, 8, 64, Math.PI * 1.22), steel);
  arc.rotation.set(-0.16, -0.22, -0.37);
  arc.position.set(0, 0.06, -0.42);
  stage.add(arc);

  for (const side of [-1, 1]) {
    const terminal = new THREE.Group();
    terminal.position.set(side * 0.83, -0.55, 0.48);
    terminal.rotation.y = -side * 0.25;
    terminal.add(block(0.28, 0.14, 0.26, 0, 0, 0, steel));
    terminal.add(block(0.22, 0.105, 0.026, 0, 0.012, 0.137, navy));
    terminal.add(block(0.13, 0.018, 0.016, 0, 0.018, 0.153, pale));
    stage.add(terminal);
  }
  movement.push(t => { group.position.y = 0.29 + 0.07 * Math.sin(t * 1.1); });
  return { group: stage, movement };
}

export function initSectionGraphics() {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-section-graphic]')];
  if (!elements.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  } catch {
    return;
  }

  const width = 560;
  const height = 400;
  renderer.setSize(width, height, false);
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 20);
  camera.position.set(0, 0.92, 5.0);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04, 0.1, 20, { size: 64 });
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight('#effbff', '#365777', 2.2));
  const key = new THREE.DirectionalLight('#ecf9ff', 3);
  key.position.set(2, 4, 4);
  scene.add(key);
  const rimLight = new THREE.DirectionalLight('#80d6ed', 1.4);
  rimLight.position.set(-3, 1, -4);
  scene.add(rimLight);

  const visuals = new Map<string, ReturnType<typeof createVisual>>();
  const visible = new Set<HTMLElement>();
  const paused = new Set<HTMLElement>();
  let frame = 0;
  let lastRender = 0;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(element);
      else visible.delete(element);
    }
    if (!frame && visible.size) frame = requestAnimationFrame(draw);
  });
  for (const element of elements) {
    observer.observe(element);
    const button = element.querySelector('button');
    button?.addEventListener('click', () => {
      const shouldPause = !paused.has(element);
      if (shouldPause) paused.add(element);
      else paused.delete(element);
      button.setAttribute('aria-pressed', String(shouldPause));
      button.textContent = shouldPause ? '▶' : 'Ⅱ';
      if (!frame && visible.size) frame = requestAnimationFrame(draw);
    });
  }

  function draw(now: number) {
    const active = [...visible].filter(element => !paused.has(element));
    frame = active.length ? requestAnimationFrame(draw) : 0;
    if (!frame || document.hidden || now - lastRender < 40) return;
    lastRender = now;
    const time = now / 1000;
    const rendered = new Set<string>();

    for (const element of active) {
      const motif = element.dataset.sectionGraphic!;
      if (rendered.has(motif)) continue;
      rendered.add(motif);
      let visual = visuals.get(motif);
      if (!visual) {
        visual = createVisual(motif);
        visuals.set(motif, visual);
      }

      visual.group.rotation.set(0.12 + Math.sin(time * 0.61) * 0.1, -0.22 + Math.sin(time * 0.74) * 0.46, Math.sin(time * 0.65) * 0.055);
      visual.movement.forEach(update => update(time));
      scene.add(visual.group);
      renderer.render(scene, camera);
      scene.remove(visual.group);

      for (const target of active) {
        if (target.dataset.sectionGraphic !== motif) continue;
        const context = target.querySelector('canvas')?.getContext('2d');
        if (!context) continue;
        context.clearRect(0, 0, width, height);
        context.drawImage(renderer.domElement, 0, 0);
        target.dataset.animated = 'true';
      }
    }
  }
}
