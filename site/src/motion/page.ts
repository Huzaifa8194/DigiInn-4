// Page-level behaviours shared by inner pages: drawn figures, the grade scale, the contact form.
import { gsap } from 'gsap';
import { onPage, prefersReducedMotion } from '../engine';
import { flipTo } from './flap';

export function startPage() {
  onPage(() => {
    const reduced = prefersReducedMotion();
    const offs: (() => void)[] = [];

    // [data-draw] SVG figures: strokes draw in once, in document order, when the figure enters.
    document.querySelectorAll<SVGSVGElement>('[data-draw]').forEach((svg) => {
      const paths = [...svg.querySelectorAll<SVGGeometryElement>('[data-stroke]')];
      const fills = [...svg.querySelectorAll<SVGElement>('[data-pop]')];
      if (reduced) return;
      paths.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
      gsap.set(fills, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%', once: true } });
      tl.to(paths, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.12 })
        .to(fills, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.08 }, 0.3);
      // the current keeps flowing along the line (idle state of the diagram)
      const flow = svg.querySelectorAll('[data-flow]');
      if (flow.length) tl.add(() => { gsap.to(flow, { strokeDashoffset: -40, duration: 1.6, ease: 'none', repeat: -1 }); });
    });

    // Grade scale: kernels settle in from large to small, each flap lands on its grade.
    document.querySelectorAll<HTMLElement>('[data-grades]').forEach((box) => {
      const items = [...box.querySelectorAll<HTMLElement>('[data-grade]')];
      if (reduced) return;
      gsap.set(items.map((i) => i.querySelector('svg')), { scale: 0, rotate: -40, transformOrigin: '50% 60%' });
      items.forEach((i) => { const f = i.querySelector<HTMLElement>('[data-flap]'); if (f) flipTo(f, '', { fast: true }); });
      gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 75%', once: true } })
        .to(items.map((i) => i.querySelector('svg')), { scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.1 })
        .add(() => items.forEach((i, n) => {
          const f = i.querySelector<HTMLElement>('[data-flap]');
          if (f) gsap.delayedCall(n * 0.1, () => flipTo(f, i.dataset.grade!));
        }), 0.1);
    });

    // Contact form: validates, then opens the visitor's email app with the message composed.
    const form = document.querySelector<HTMLFormElement>('[data-contact]');
    if (form) {
      const submit = (e: SubmitEvent) => {
        e.preventDefault();
        let firstBad: HTMLElement | null = null;
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]').forEach((f) => {
          const err = form.querySelector<HTMLElement>(`#${f.id}-error`);
          let msg = '';
          if (!f.value.trim()) msg = form.dataset.msgRequired!;
          else if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value.trim())) msg = form.dataset.msgEmail!;
          f.setAttribute('aria-invalid', msg ? 'true' : 'false');
          if (err) err.textContent = msg;
          if (msg && !firstBad) firstBad = f;
        });
        const status = form.querySelector<HTMLElement>('[data-status]');
        if (firstBad) { (firstBad as HTMLElement).focus(); if (status) status.textContent = ''; return; }
        const data = new FormData(form);
        const subject = `${data.get('subject')} | ${data.get('name')}${data.get('company') ? ` (${data.get('company')})` : ''}`;
        const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('company') || ''}\n${data.get('email')}`;
        if (status) status.hidden = false;
        location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      };
      const clear = (e: Event) => {
        const f = e.target as HTMLInputElement;
        if (f.getAttribute('aria-invalid') === 'true') { f.setAttribute('aria-invalid', 'false'); const err = form.querySelector(`#${f.id}-error`); if (err) err.textContent = ''; }
      };
      form.addEventListener('submit', submit);
      form.addEventListener('input', clear);
      offs.push(() => { form.removeEventListener('submit', submit); form.removeEventListener('input', clear); });
    }
    return () => offs.forEach((f) => f());
  });
}
