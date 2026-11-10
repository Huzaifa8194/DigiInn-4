// Split-flap code labels. Each cell flips through a few characters and settles on the target,
// on the one GSAP clock. [data-flap-cycle] labels keep cycling their codes while on screen
// (the idle state of the board); a [data-flap-trigger] parent flips its label on hover/focus.
import { gsap } from 'gsap';
import { onPage, prefersReducedMotion } from '../engine';

const GLYPHS = 'ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789+';
const state = new WeakMap<HTMLElement, { i: number; tl?: gsap.core.Timeline; call?: gsap.core.Tween; visible: boolean }>();
let paused = false;

const pad = (v: string, w: number) => v.padEnd(w, ' ').slice(0, w);
const codesOf = (el: HTMLElement) => (el.dataset.flap || '').split('|');
const widthOf = (el: HTMLElement) => parseInt(el.dataset.flapWidth || '4', 10);

function ensureCells(el: HTMLElement, w: number) {
  const box = el.querySelector<HTMLElement>('.flap__cells')!;
  while (box.children.length < w) {
    const c = document.createElement('span');
    c.className = 'flap__cell';
    c.innerHTML = '<span class="flap__char"> </span>';
    box.appendChild(c);
  }
  return [...box.querySelectorAll<HTMLElement>('.flap__char')];
}

/** Flip a label to `value`. Returns the timeline (or null under reduced motion). */
export function flipTo(el: HTMLElement, value: string, { fast = false } = {}) {
  const w = widthOf(el);
  const target = pad(value, w);
  const chars = ensureCells(el, w);
  const s = state.get(el) ?? { i: 0, visible: false };
  state.set(el, s);
  s.tl?.kill();
  if (prefersReducedMotion()) {
    chars.forEach((c, i) => (c.textContent = target[i] === ' ' ? ' ' : target[i]));
    return null;
  }
  const tl = gsap.timeline();
  const half = fast ? 0.045 : 0.06;
  chars.forEach((c, i) => {
    const to = target[i];
    const from = c.textContent === ' ' ? ' ' : c.textContent || ' ';
    if (from === to) return;
    const steps = to === ' ' ? 1 : (fast ? 1 : 2) + ((i * 7) % 2);
    const seq = [...Array.from({ length: steps }, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]), to];
    const at = i * (fast ? 0.025 : 0.04);
    seq.forEach((ch, k) => {
      const t0 = at + k * half * 2;
      tl.to(c, { scaleY: 0, duration: half, ease: 'power2.in' }, t0)
        .add(() => { c.textContent = ch === ' ' ? ' ' : ch; }, t0 + half)
        .to(c, { scaleY: 1, duration: half, ease: k === seq.length - 1 ? 'back.out(2.2)' : 'power2.out' }, t0 + half);
    });
  });
  s.tl = tl;
  return tl;
}

function next(el: HTMLElement) {
  const codes = codesOf(el);
  if (codes.length < 2) return;
  const s = state.get(el) ?? { i: 0, visible: false };
  state.set(el, s);
  s.i = (s.i + 1) % codes.length;
  flipTo(el, codes[s.i]);
}

export function startFlaps() {
  onPage(() => {
    const labels = [...document.querySelectorAll<HTMLElement>('[data-flap]')];
    if (!labels.length) return;
    const offs: (() => void)[] = [];
    const reduced = prefersReducedMotion();

    // Idle cycling, staggered so the board never flips all at once.
    const cyclers = labels.filter((l) => l.hasAttribute('data-flap-cycle'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { const s = state.get(e.target as HTMLElement); if (s) s.visible = e.isIntersecting; });
    });
    cyclers.forEach((el, n) => {
      state.set(el, { i: 0, visible: false });
      io.observe(el);
      if (reduced) return;
      const loop = () => {
        const s = state.get(el)!;
        if (!paused && s.visible && !document.hidden) next(el);
        s.call = gsap.delayedCall(3.6, loop);
      };
      state.get(el)!.call = gsap.delayedCall(2.4 + n * 0.55, loop);
    });

    // Hover / focus on a trigger flips its label immediately.
    document.querySelectorAll<HTMLElement>('[data-flap-trigger]').forEach((t) => {
      const el = t.querySelector<HTMLElement>('[data-flap]');
      if (!el || reduced) return;
      const go = () => next(el);
      t.addEventListener('pointerenter', go);
      t.addEventListener('focus', go);
      offs.push(() => { t.removeEventListener('pointerenter', go); t.removeEventListener('focus', go); });
    });

    // Pause control (WCAG 2.2.2) for the cycling board.
    const btn = document.querySelector<HTMLButtonElement>('[data-flap-pause]');
    if (btn) {
      const sync = () => {
        btn.setAttribute('aria-pressed', String(paused));
        const txt = btn.querySelector('.board__pause-text');
        if (txt) txt.textContent = paused ? btn.dataset.labelPlay! : btn.dataset.labelPause!;
      };
      const toggle = () => { paused = !paused; sync(); };
      sync();
      btn.addEventListener('click', toggle);
      offs.push(() => btn.removeEventListener('click', toggle));
    }

    return () => {
      io.disconnect();
      cyclers.forEach((el) => { const s = state.get(el); s?.call?.kill(); s?.tl?.kill(); });
      offs.forEach((f) => f());
    };
  });
}
