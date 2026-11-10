// Header behaviour (tone follows the section under it, steps aside on scroll down) and the
// accessible full-screen menu.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, onScroll, stopScroll, startScroll, prefersReducedMotion, ease } from '../engine';

export function startChrome() {
  // scrolled / frame-away flags
  let last = 0;
  onScroll(({ y }) => {
    const h = document.documentElement.classList;
    h.toggle('is-scrolled', y > 24);
    if (Math.abs(y - last) < 6) return;
    h.toggle('frame-away', y > 240 && y > last && !document.querySelector('.menu:not([hidden])'));
    last = y;
  });

  onPage(() => {
    const html = document.documentElement;
    const initial = html.dataset.tone || 'light';
    const sections = [...document.querySelectorAll<HTMLElement>('[data-tone-section]')];
    const offs: (() => void)[] = [];
    sections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 40px',
        end: 'bottom 40px',
        onToggle: (self) => { if (self.isActive) html.dataset.tone = sec.dataset.toneSection; },
      });
    });
    html.dataset.tone = initial;
    html.classList.remove('frame-away');

    // menu
    const menu = document.querySelector<HTMLElement>('[data-menu]');
    const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
    const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');
    if (!menu || !openBtn || !closeBtn) return;
    const reduced = prefersReducedMotion();
    const focusables = () => [...menu.querySelectorAll<HTMLElement>('a, button')];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const f = focusables();
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    };
    function open() {
      menu!.hidden = false;
      openBtn!.setAttribute('aria-expanded', 'true');
      stopScroll();
      document.addEventListener('keydown', onKey);
      if (!reduced) {
        gsap.fromTo(menu!, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: ease.inOut });
        gsap.fromTo(menu!.querySelectorAll('.menu__list a'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: ease.out, stagger: 0.05, delay: 0.25 });
      }
      (menu!.querySelector('.menu__list a') as HTMLElement | null)?.focus();
    }
    function close() {
      if (menu!.hidden) return;
      openBtn!.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKey);
      const done = () => { menu!.hidden = true; startScroll(); openBtn!.focus(); };
      if (reduced) return done();
      gsap.to(menu!, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.55, ease: ease.inOut, onComplete: done });
    }
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    const linkClose = () => { menu.hidden = true; openBtn.setAttribute('aria-expanded', 'false'); document.removeEventListener('keydown', onKey); };
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', linkClose));
    offs.push(() => {
      openBtn.removeEventListener('click', open);
      closeBtn.removeEventListener('click', close);
      document.removeEventListener('keydown', onKey);
    });
    return () => offs.forEach((f) => f());
  });
}
