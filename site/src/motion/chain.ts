// THE CHAIN: one driver (scroll position through the home chain section, s = 0..7) moves the
// 3D cashew (three.js, cashew3d.ts), the flap label, the step counter and the GL light behind it, so they always agree.
// Blocks: 0 hero, 1 tree, 2 raw nut, 3 shelling, 4 peeling, 5 grading, 6 packing, 7 close.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, setBackground, clearBackground, prefersReducedMotion, isMobile } from '../engine';
import { flipTo } from './flap';
import type { ChainState } from './cashew3d';

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uStep;
uniform vec2 uBand;   // visible band of the chain section, in uv.y (bottom, top)
uniform float uPortrait;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
float bump(float s, float c, float w) { return clamp(1.0 - abs(s - c) / w, 0.0, 1.0); }

vec3 tint(float s) {
  vec3 T0 = vec3(0.30, 0.36, 0.14); // tree: green gold, dappled
  vec3 T2 = vec3(0.46, 0.31, 0.13); // raw nut: dry jute amber
  vec3 T3 = vec3(0.30, 0.36, 0.44); // shelling: steam
  vec3 T4 = vec3(0.56, 0.27, 0.09); // peeling: drying-oven glow
  vec3 T5 = vec3(0.44, 0.44, 0.42); // grading: neutral sorting light
  vec3 T6 = vec3(0.14, 0.27, 0.66); // packing: ONYX blue
  if (s < 1.5) return T0;
  if (s < 2.5) return mix(T0, T2, smoothstep(1.5, 2.5, s));
  if (s < 3.5) return mix(T2, T3, smoothstep(2.5, 3.5, s));
  if (s < 4.5) return mix(T3, T4, smoothstep(3.5, 4.5, s));
  if (s < 5.5) return mix(T4, T5, smoothstep(4.5, 5.5, s));
  return mix(T5, T6, smoothstep(5.5, 6.5, s));
}

void main() {
  vec2 uv = vUv;
  if (uv.y < uBand.x || uv.y > uBand.y) { gl_FragColor = vec4(0.0); return; }
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;
  float s = uStep;

  // the light pool sits behind the cashew (right on desktop, top on phones) and leans to the pointer
  vec2 lp = mix(vec2(aspect * 0.74, 0.52), vec2(aspect * 0.5, 0.78), uPortrait);
  lp += (uMouse - 0.5) * vec2(0.10 * aspect, 0.08);
  float d = length((p - lp) * vec2(1.0, 1.15));
  float pool = exp(-d * d * 2.6);

  // step patterns, each fading in and out around its block
  float leaves = smoothstep(0.48, 0.72, fbm(p * 3.2 + vec2(t * 0.04, -t * 0.03))) * bump(s, 0.5, 1.8);
  float jute = (noise(p * vec2(60.0, 8.0)) * 0.5 + noise(p * vec2(8.0, 60.0)) * 0.5) * bump(s, 2.0, 1.0);
  float steam = smoothstep(0.35, 0.9, fbm(vec2(p.x * 2.2, p.y * 1.4 - t * 0.12) + fbm(p * 1.5 + t * 0.05))) * bump(s, 3.0, 1.1);
  float heat = (0.5 + 0.5 * sin(p.y * 9.0 - t * 1.3 + fbm(p * 3.0) * 3.0)) * bump(s, 4.0, 1.0);
  float gridL = max(step(0.986, fract(p.x * 22.0)), step(0.986, fract(p.y * 22.0))) * bump(s, 5.0, 1.0);
  float lanes = smoothstep(0.92, 1.0, fract(p.y * 7.0 - t * 0.05)) * bump(s, 6.2, 1.3);

  vec3 base = vec3(0.039, 0.063, 0.125);
  vec3 c = tint(s);
  float pattern = 0.55 + 0.7 * leaves + 0.25 * jute + 0.9 * steam + 0.35 * heat + 0.5 * gridL + 0.4 * lanes;
  vec3 col = base + c * pool * pattern * 0.62;
  col += vec3(0.5, 0.55, 0.6) * steam * pool * 0.10;
  col += (hash(uv * uResolution + fract(t)) - 0.5) * 0.03; // grain
  // keep the reading side dark: fade light toward the copy column
  col = mix(base, col, mix(smoothstep(0.15, 0.75, uv.x), smoothstep(0.25, 0.75, uv.y), uPortrait));
  gl_FragColor = vec4(col, 1.0);
}`;

const STAGE_CODES = ['ONYX+', 'ANACARDE', 'RCN', '+ COQUE', '+ PEAU', 'W240', 'EXPORT', 'ONYX+'];
const GRADES = ['W180', 'W210', 'W240', 'W320', 'W450'];

export function startChain() {
  onPage(() => {
    const root = document.querySelector<HTMLElement>('[data-chain]');
    if (!root) return;
    const figure = root.querySelector<HTMLElement>('[data-chain-figure]')!;
    const flap = root.querySelector<HTMLElement>('.chain__flap');
    const indexEl = root.querySelector<HTMLElement>('[data-chain-index]');
    const dots = [...root.querySelectorAll<HTMLElement>('[data-chain-dot]')];
    const reduced = prefersReducedMotion();
    let alive = true;

    // The flap shows the block's code; while the kernel is graded (s 4..5) it sweeps the grades.
    let shown = '';
    let block = -1;
    const setBlock = (s: number) => {
      const b = Math.max(0, Math.min(7, Math.round(s)));
      if (b !== block) {
        block = b;
        if (indexEl) indexEl.textContent = String(Math.min(b, 6)).padStart(2, '0');
        dots.forEach((d, i) => d.classList.toggle('is-on', i === b - 1));
        notes.forEach((n) => n.classList.toggle('is-on', +n.dataset.note! === b));
      }
      let code = STAGE_CODES[b];
      if (s > 4.02 && s < 4.98) code = s >= 4.72 ? 'W240' : GRADES[Math.min(4, Math.floor(((s - 4) / 0.7) * 5))];
      if (flap && code !== shown) { flipTo(flap, code, { fast: s > 4.02 && s < 4.98 }); shown = code; }
    };

    if (reduced) {
      // Reduced motion: the drawn SVG still (opened shell, half-peeled kernel) and the label on W240.
      figure.classList.add('is-still');
      if (flap) flipTo(flap, 'W240');
      return;
    }

    // Scroll → s. Each step holds while its copy is centred on screen and changes between steps.
    const steps = [...root.querySelectorAll<HTMLElement>('[data-chain-step]')];
    let centers: number[] = [];
    const measure = () => {
      const top = root.getBoundingClientRect().top + scrollY;
      centers = steps.map((el) => { const r = el.getBoundingClientRect(); return r.top + scrollY - top + r.height / 2; });
      centers[0] = innerHeight / 2; // the hero holds until it starts to leave
    };
    const toS = () => {
      const y = -root.getBoundingClientRect().top + innerHeight / 2;
      if (y <= centers[0]) return 0;
      for (let i = 0; i < centers.length - 1; i++) {
        if (y < centers[i + 1]) {
          const f = (y - centers[i]) / (centers[i + 1] - centers[i]);
          return i + gsap.utils.clamp(0, 1, (f - 0.28) / 0.5);
        }
      }
      return centers.length - 1;
    };

    const uniforms = { uStep: { value: 0 }, uBand: { value: [0, 0] }, uPortrait: { value: isMobile() ? 1 : 0 } };
    const bgOn = !isMobile() && !matchMedia('(pointer: coarse)').matches;
    if (bgOn) setBackground(FRAG, uniforms); else root.classList.add('no-bg');

    // One state object, tweened by a paused timeline that the driver scrubs (one unit per block).
    const S: ChainState = { s: 0, apple: 1, nutLift: 0, open: 0, away: 0, peel: 0, spin: 0, grade: 1, pack: 0, carton: 0, x: isMobile() ? 0 : 1.05 };
    const notes = [...root.querySelectorAll<HTMLElement>('[data-note]')];
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none', duration: 1 } });
    tl.to(S, { x: 0, ease: 'power2.inOut' }, 0)             // 0→1 the object moves from beside the headline to the centre
      .to(S, { nutLift: 0.18 }, 0)                         //     tree: lean in on the nut
      .to(S, { apple: 0, ease: 'power2.in' }, 1)            // 1→2 the apple falls away
      .to(S, { nutLift: 1, ease: 'power2.inOut' }, 1)       //     the raw nut comes to the centre
      .to(S, { spin: Math.PI * 0.35, ease: 'power2.inOut' }, 1)
      .to(S, { open: 1, ease: 'power2.inOut' }, 2)          // 2→3 the shell opens like a lid
      .to(S, { spin: Math.PI * 0.1, ease: 'power2.inOut' }, 2)
      .to(S, { away: 1, duration: 0.6, ease: 'power2.in' }, 3) // 3→4 the halves leave
      .to(S, { peel: 1, ease: 'power1.inOut' }, 3)          //     the brown skin comes off
      .to(S, { spin: 0.9, ease: 'power2.inOut' }, 3)
      .to(S, { grade: 1.25, duration: 0.2 }, 4)             // 4→5 grading: W180 large … W450 small, settle W240
      .to(S, { grade: 0.8, duration: 0.5 }, 4.2)
      .to(S, { grade: 1, duration: 0.3, ease: 'power2.out' }, 4.7)
      .to(S, { spin: 0.9 + Math.PI * 2, ease: 'power2.inOut' }, 4)
      .to(S, { carton: 1, duration: 0.5, ease: 'power2.out' }, 5) // 5→6 the carton fills
      .to(S, { pack: 1, ease: 'power1.inOut' }, 5)
      .to(S, { x: isMobile() ? 0 : 1.15, ease: 'power2.inOut' }, 6) // 6→7 the carton steps aside for the closing line
      .to(S, { s: 7, duration: 7 }, 0);

    // Scroll sets the target; the ticker eases toward it (a scrub of ~0.6 s) so the motion settles.
    let target = 0, current = 0;
    const st = ScrollTrigger.create({
      trigger: root, start: 'top bottom', end: 'bottom top', invalidateOnRefresh: true,
      onRefresh: () => { measure(); target = toS(); },
      onUpdate: () => { target = toS(); },
    });
    measure();
    current = target = toS();

    let view: { update: (S: ChainState, t: number, px: number, py: number) => void; dispose: () => void } | null = null;
    import('./cashew3d').then(({ createCashew3D }) => {
      if (!alive) return;
      try {
        view = createCashew3D(figure);
        figure.classList.add('is-3d');
      } catch { figure.classList.add('is-still'); }
    });

    const aim = { x: 0, y: 0 }, pt = { x: 0, y: 0 };
    let frame = 0;
    const move = (e: PointerEvent) => { aim.x = e.clientX / innerWidth - 0.5; aim.y = e.clientY / innerHeight - 0.5; };
    addEventListener('pointermove', move, { passive: true });

    const tick = (time: number) => {
      const r = root.getBoundingClientRect();
      const vh = innerHeight;
      uniforms.uBand.value = [gsap.utils.clamp(0, 1, 1 - r.bottom / vh), gsap.utils.clamp(0, 1, 1 - r.top / vh)];
      uniforms.uPortrait.value = isMobile() ? 1 : 0;
      if (r.bottom < 0 || r.top > vh) return; // off screen: hold still
      const k = 1 - Math.pow(0.9, gsap.ticker.deltaRatio());
      current += (target - current) * k;
      tl.progress(gsap.utils.clamp(0, 1, current / 7));
      uniforms.uStep.value = current;
      setBlock(current);
      pt.x += (aim.x - pt.x) * 0.05; pt.y += (aim.y - pt.y) * 0.05;
      // full rate while the state moves; the idle sway alone renders every other frame
      const moving = Math.abs(target - current) > 0.0008 || Math.abs(aim.x - pt.x) > 0.002;
      frame++;
      if (moving || frame % 2 === 0) view?.update(S, time, pt.x, pt.y);
    };
    gsap.ticker.add(tick);

    return () => {
      alive = false;
      st.kill();
      tl.kill();
      gsap.ticker.remove(tick);
      removeEventListener('pointermove', move);
      if (bgOn) clearBackground();
      root.classList.remove('no-bg');
      view?.dispose();
      figure.classList.remove('is-3d', 'is-still');
    };
  });
}
