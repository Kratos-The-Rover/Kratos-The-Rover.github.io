import { gsap } from 'gsap';
import gallery from '../data/gallery.json';
import { asset, pad2 } from '../core/dom.js';
import { lenis } from '../core/scroll.js';

export const lightboxTemplate = () => `
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>
    <button class="lightbox-close" data-lb="close" aria-label="Close">CLOSE ✕</button>
    <button class="lightbox-nav lightbox-prev" data-lb="prev" aria-label="Previous photo">←</button>
    <figure class="lightbox-figure">
      <img id="lightbox-img" alt="" />
      <figcaption id="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-nav lightbox-next" data-lb="next" aria-label="Next photo">→</button>
  </div>`;

export function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  let index = 0;
  let returnFocus = null;

  const show = (i) => {
    index = (i + gallery.length) % gallery.length;
    const { src, alt } = gallery[index];
    image.src = asset(src);
    image.alt = alt;
    caption.textContent = `${pad2(index + 1)} / ${gallery.length} — ${alt}`;
  };

  const open = (i) => {
    returnFocus = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    lenis.stop();
    gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    lightbox.querySelector('.lightbox-close').focus();
  };

  const close = () => {
    gsap.to(lightbox, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        lightbox.hidden = true;
        document.body.classList.remove('no-scroll');
        lenis.start();
        returnFocus?.focus();
      },
    });
  };

  const actions = { close, prev: () => show(index - 1), next: () => show(index + 1) };
  const keys = { Escape: close, ArrowLeft: actions.prev, ArrowRight: actions.next };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-lightbox]');
    if (trigger) open(Number(trigger.dataset.lightbox));
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
    else actions[event.target.closest('[data-lb]')?.dataset.lb]?.();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.hidden) keys[event.key]?.();
  });
}
