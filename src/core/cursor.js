import { gsap } from 'gsap';

export const touchLayout = window.matchMedia('(hover: none), (max-width: 768px)');

let pointerMoved = false;
let square;

export const hasPointer = () => pointerMoved;

export const cursorTemplate = () => `
  <div class="crosshair-h" id="crosshair-h"></div>
  <div class="crosshair-v" id="crosshair-v"></div>
  <div class="crosshair-square" id="crosshair-sq"></div>`;

export function initCursor() {
  const horizontal = document.getElementById('crosshair-h');
  const vertical = document.getElementById('crosshair-v');
  square = document.getElementById('crosshair-sq');

  gsap.set(square, { xPercent: -50, yPercent: -50, top: 0, left: 0 });
  gsap.set(horizontal, { top: 0 });
  gsap.set(vertical, { left: 0 });

  const follow = { duration: 0.3, ease: 'power2.out' };
  const moveVertical = gsap.quickTo(vertical, 'x', follow);
  const moveHorizontal = gsap.quickTo(horizontal, 'y', follow);
  const moveSquareX = gsap.quickTo(square, 'x', follow);
  const moveSquareY = gsap.quickTo(square, 'y', follow);

  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    pointerMoved = true;
    moveVertical(clientX);
    moveHorizontal(clientY);
    moveSquareX(clientX);
    moveSquareY(clientY);
  });

  document.addEventListener('mouseover', (event) => {
    document.body.classList.toggle('cursor-hover', Boolean(event.target.closest('a, button')));
  });
}

export function cursorPosition() {
  return { x: gsap.getProperty(square, 'x'), y: gsap.getProperty(square, 'y') };
}

function revealCrosshair() {
  document.querySelectorAll('.crosshair-h, .crosshair-v, .crosshair-square').forEach((el) => {
    el.style.display = 'block';
    el.classList.add('crosshair-boot');
  });
}

export function bootCrosshair() {
  if (touchLayout.matches) return;
  if (pointerMoved) {
    revealCrosshair();
    return;
  }
  document.addEventListener('mousemove', () => setTimeout(revealCrosshair, 400), { once: true });
}
