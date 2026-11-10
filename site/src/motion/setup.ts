// Global motion for ONYX PLUS GROUP: registered once on the client before the first page.
import { gsap } from 'gsap';
import { setTransition, ease } from '../engine';
import { startFlaps } from './flap';
import { startChain } from './chain';
import { startChrome } from './chrome';
import { startPage } from './page';

// Transition: a flap closes. Two panels meet on a hairline at mid-height, the destination's
// name shows on the hinge, then the flap opens on the new page.
let destination = '';
function rememberDestination(e: Event) {
  const a = (e.target as HTMLElement).closest?.('a');
  if (!a) return;
  const label = a.querySelector('.roll__in > span, .menu__label, .board__name, .btn__label > span, .index__who')?.textContent || a.textContent || '';
  destination = label.trim().replace(/\s+/g, ' ').slice(0, 40);
}

export function setupMotion() {
  document.addEventListener('click', rememberDestination, true);
  setTransition({
    leave: (c) => {
      const top = c.querySelector('.curtain__panel--top');
      const bottom = c.querySelector('.curtain__panel--bottom');
      const label = c.querySelector<HTMLElement>('.curtain__label');
      const title = c.querySelector<HTMLElement>('[data-curtain-title]');
      if (title) title.textContent = destination || 'ONYX PLUS GROUP';
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .fromTo([top, bottom], { scaleY: 0 }, { scaleY: 1, duration: 0.62, ease: ease.inOut })
        .fromTo(label, { autoAlpha: 0, rotateX: -80 }, { autoAlpha: 1, rotateX: 0, duration: 0.35, ease: ease.soft }, '-=0.2');
    },
    enter: (c) => {
      const top = c.querySelector('.curtain__panel--top');
      const bottom = c.querySelector('.curtain__panel--bottom');
      const label = c.querySelector('.curtain__label');
      return gsap.timeline()
        .to(label, { autoAlpha: 0, rotateX: 80, duration: 0.25, ease: 'power2.in' })
        .to([top, bottom], { scaleY: 0, duration: 0.7, ease: ease.inOut }, '-=0.05')
        .set(c, { autoAlpha: 0 });
    },
  });
  startChrome();
  startFlaps();
  startChain();
  startPage();
}
