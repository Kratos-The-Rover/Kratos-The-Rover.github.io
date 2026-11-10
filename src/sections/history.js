import { gsap } from 'gsap';
import { poem } from '../data/site.js';
import { list } from '../core/dom.js';

export const historyTemplate = () => `
  <section class="history-section" id="history">
    <div class="history-phase" id="history-phase-1">
      <div class="history-poem">
        ${list(poem, (line) => `<div class="poem-line">${line}</div>`)}
      </div>
    </div>
    <div class="history-phase" id="history-phase-2">
      <p class="history-transition">meet the upgrade.</p>
    </div>
    <div class="history-phase" id="history-phase-3">
      <p class="history-title-small">Project Kratos</p>
      <h2 class="history-title-large">ARIES</h2>
      <p class="history-coming">coming soon</p>
    </div>
  </section>`;

const hold = (duration) => [{}, { duration }];

export function initHistory() {
  gsap.timeline({
    scrollTrigger: { trigger: '#history', start: 'top top', end: '+=800%', pin: true, scrub: 1 },
  })
    .set('#history-phase-1', { opacity: 1 })
    .fromTo('.poem-line', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 2, stagger: 2, ease: 'power2.out' })
    .to(...hold(3))
    .to('#history-phase-1', { opacity: 0, y: -40, duration: 2, ease: 'power2.in' })
    .to('#history-phase-2', { opacity: 1, y: -20, duration: 1, ease: 'power2.out' }, '+=0.5')
    .to(...hold(1))
    .to('#history-phase-2', { opacity: 0, y: -40, duration: 1, ease: 'power2.in' })
    .to('#history-phase-3', { opacity: 1, y: -20, duration: 1.5, ease: 'power3.out' }, '+=0.5')
    .to(...hold(1.5))
    .to('#history', { opacity: 0, duration: 1, ease: 'power2.inOut' });
}
