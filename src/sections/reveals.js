import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrambleLabel } from '../core/scramble.js';

export function initReveals() {
  gsap.utils.toArray('.section-label.glitch').forEach((label) => {
    ScrollTrigger.create({
      trigger: label,
      start: 'top 80%',
      onEnter: () => gsap.delayedCall(0.35, scrambleLabel, [label]),
      onEnterBack: () => scrambleLabel(label),
    });
  });

  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}
