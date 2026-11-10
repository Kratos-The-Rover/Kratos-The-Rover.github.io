import { gsap } from 'gsap';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#_';

export function scrambleText(element, text, duration = 1) {
  const progress = { value: 0 };
  gsap.to(progress, {
    value: 1,
    duration,
    ease: 'none',
    onUpdate: () => {
      element.innerText = [...text]
        .map((char, i) => (char === ' ' || progress.value > i / text.length
          ? char
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join('');
    },
  });
}

export function scrambleLabel(element) {
  if (element.dataset.scrambling) return;
  element.dataset.scrambling = 'true';
  scrambleText(element, element.dataset.text, 0.8);
  gsap.delayedCall(0.85, () => {
    element.textContent = element.dataset.text;
    delete element.dataset.scrambling;
  });
}
