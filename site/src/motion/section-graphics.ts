import * as THREE from 'three';

const blue = new THREE.MeshStandardMaterial({ color: '#478eba', metalness: 0.38, roughness: 0.33 });
const pale = new THREE.MeshStandardMaterial({ color: '#9ed5ed', metalness: 0.24, roughness: 0.32 });
const amber = new THREE.MeshStandardMaterial({ color: '#f5af75', roughness: 0.34 });

function piece(geometry: THREE.BufferGeometry, material = blue, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  return mesh;
}

function ring(radius: number, tube = 0.045, material = pale) {
  return piece(new THREE.TorusGeometry(radius, tube, 10, 48), material);
}

function block(w: number, h: number, d: number, x = 0, y = 0, z = 0, material = blue) {
  return piece(new THREE.BoxGeometry(w, h, d), material, x, y, z);
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
      group.add(piece(new THREE.ExtrudeGeometry(outline, { depth: 0.16, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }), blue));
      const short = block(0.36, 0.12, 0.07, -0.25, -0.05, 0.25, pale);
      const long = block(0.69, 0.12, 0.07, 0.08, 0.07, 0.25, pale);
      short.rotation.z = -Math.PI / 4;
      long.rotation.z = Math.PI / 4;
      group.add(short, long);
      break;
    }
    case 'layers':
      for (let i = -1; i <= 1; i++) {
        const plate = block(1.65, 0.11, 1.18, 0, i * 0.38, 0, i === 1 ? pale : blue);
        group.add(plate);
        movement.push(t => { plate.position.y = i * (0.42 + 0.18 * Math.sin(t * 1.5)); });
      }
      break;
    case 'signal':
      for (let i = 0; i < 9; i++) {
        const bar = block(0.14, 1, 0.24, (i - 4) * 0.24, 0, 0, i === 4 ? amber : pale);
        group.add(bar);
        movement.push(t => { bar.scale.y = 0.23 + Math.pow(Math.sin(t * 2 - i * 0.47), 2) * 0.96; });
      }
      break;
    case 'network': {
      const points = [[0, 0, 0], [-0.88, 0.53, 0.12], [0.86, 0.56, -0.16], [-0.78, -0.49, -0.3], [0.81, -0.48, 0.28]];
      const axis = new THREE.Vector3(0, 1, 0);
      for (const [i, [x, y, z]] of points.entries()) {
        group.add(piece(new THREE.IcosahedronGeometry(i ? 0.14 : 0.25, 1), i ? pale : amber, x, y, z));
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
      group.add(block(1.94, 1.24, 0.14), block(1.76, 0.11, 0.06, 0, 0.46, 0.1, pale));
      const panel = block(0.66, 0.55, 0.1, -0.46, -0.02, 0.13, amber);
      group.add(panel, block(0.7, 0.11, 0.06, 0.36, 0.14, 0.12, pale), block(0.62, 0.11, 0.06, 0.32, -0.12, 0.12, pale));
      movement.push(t => { panel.position.z = 0.18 + (1 + Math.sin(t * 1.6)) * 0.13; });
      break;
    }
    case 'people':
      for (let i = -1; i <= 1; i++) {
        const person = new THREE.Group();
        const material = i ? blue : pale;
        person.add(piece(new THREE.SphereGeometry(0.2, 20, 12), material, 0, 0.39), piece(new THREE.CapsuleGeometry(0.23, 0.22, 6, 14), material, 0, -0.19));
        person.position.set(i * 0.55, 0, i ? -0.17 : 0.19);
        group.add(person);
        movement.push(t => { person.position.y = 0.13 * Math.sin(t * 1.7 + i); });
      }
      break;
    case 'message': {
      group.add(block(1.65, 1.05, 0.16), block(0.3, 0.29, 0.16, -0.54, -0.49));
      for (let i = -1; i <= 1; i++) {
        const dot = piece(new THREE.SphereGeometry(0.09, 12, 10), pale, i * 0.32, 0, 0.1);
        group.add(dot);
        movement.push(t => { dot.position.y = 0.09 * Math.sin(t * 3 - i); });
      }
      break;
    }
    default: {
      group.add(piece(new THREE.IcosahedronGeometry(0.42, 1), blue));
      for (let i = 0; i < 3; i++) {
        const orbit = ring(0.79 + 0.07 * i);
        const dot = piece(new THREE.SphereGeometry(0.085, 12, 10), amber, 0.79 + 0.07 * i);
        orbit.add(dot);
        group.add(orbit);
        movement.push(t => { orbit.rotation.set(i * 0.9 + t * 0.32, i * 0.76, t * (0.9 - 0.19 * i)); });
      }
    }
  }
  return { group, movement };
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

  const width = 360;
  const height = 190;
  renderer.setSize(width, height, false);
  const camera = new THREE.OrthographicCamera(-1.95, 1.95, 1.95 * height / width, -1.95 * height / width, 0.1, 20);
  camera.position.set(0, 0.32, 4);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#effbff', '#365777', 2.2));
  const key = new THREE.DirectionalLight('#ecf9ff', 3);
  key.position.set(2, 4, 4);
  scene.add(key);

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

      visual.group.rotation.set(0.12, Math.sin(time * 0.85) * 0.44, Math.sin(time * 0.65) * 0.075);
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
