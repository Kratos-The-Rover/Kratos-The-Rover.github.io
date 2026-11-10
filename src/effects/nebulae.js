import { gsap } from 'gsap';

const { random } = gsap.utils;

export const nebulaeTemplate = () => `
  <div class="nebula" aria-hidden="true"></div>
  <div class="nebula" aria-hidden="true"></div>`;

function surface(el) {
  const size = random(40, 70);
  gsap.set(el, {
    width: `${size}vmax`,
    height: `${size * 0.6}vmax`,
    left: `${random(-10, 70)}%`,
    top: `${random(-10, 70)}%`,
    rotate: random(-40, 40),
    opacity: 0,
    scale: 0.9,
  });
  gsap.timeline({ onComplete: () => surface(el) })
    .to(el, { opacity: random(0.5, 0.9), scale: 1, duration: random(5, 8), ease: 'sine.inOut' })
    .to(el, { opacity: 0, scale: 1.08, duration: random(5, 8), ease: 'sine.inOut' }, `+=${random(2, 5)}`)
    .to({}, { duration: random(2, 6) });
}

export function initNebulae() {
  gsap.utils.toArray('.nebula').forEach((el, i) => gsap.delayedCall(i * 7 + 2, surface, [el]));
}
