import { gsap } from 'gsap';
import { lenis, maxScroll } from '../core/scroll.js';
import { createCanvasSurface, white } from '../core/dom.js';

const REACH = 16;
const INSET = 0.06;
const STRAND_COUNT = 9;

const { clamp, random } = gsap.utils;

export const scrollbarTemplate = () => '<canvas class="scroll-tri" id="scroll-tri" aria-hidden="true"></canvas>';

const scrollProgress = () => {
  const max = maxScroll();
  return max > 0 ? clamp(0, 1, window.scrollY / max) : 0;
};

function traceTriangle(ctx, width, height, apexX, apexY) {
  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(apexX, apexY);
  ctx.lineTo(width, height);
}

export function initScrollbar() {
  const canvas = document.getElementById('scroll-tri');
  const surface = createCanvasSurface(canvas);
  const { ctx } = surface;
  const strands = Array.from({ length: STRAND_COUNT }, () => ({
    y: Math.random(),
    drift: random(0.02, 0.06),
    speed: random(0.2, 0.6),
    phase: Math.random() * 6.3,
  }));

  gsap.ticker.add((time) => {
    const { width, height } = surface.sync();
    ctx.clearRect(0, 0, width, height);
    if (!width || !height) return;

    const apexX = width - REACH;
    const apexY = height * (INSET + scrollProgress() * (1 - 2 * INSET));

    ctx.fillStyle = white(0.08);
    traceTriangle(ctx, width, height, apexX, apexY);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 1;
    strands.forEach((strand) => {
      const y = height * clamp(0, 1, strand.y + Math.sin(time * strand.speed + strand.phase) * strand.drift);
      const near = 1 - Math.abs(y - apexY) / height;
      ctx.strokeStyle = white(0.08 + 0.38 * near * near);
      ctx.beginPath();
      ctx.moveTo(apexX, apexY);
      ctx.lineTo(width, y);
      ctx.stroke();
    });

    ctx.strokeStyle = white(0.55);
    traceTriangle(ctx, width, height, apexX, apexY);
    ctx.stroke();

    ctx.save();
    ctx.shadowColor = white(0.5);
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#fff';
    ctx.fillRect(apexX - 2, apexY - 2, 4, 4);
    ctx.restore();
  });

  const scrollToPointer = (event, immediate) => {
    const rect = canvas.getBoundingClientRect();
    const progress = clamp(0, 1, ((event.clientY - rect.top) / rect.height - INSET) / (1 - 2 * INSET));
    lenis.scrollTo(progress * maxScroll(), immediate ? { immediate: true } : { duration: 1 });
  };

  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    scrollToPointer(event, false);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (canvas.hasPointerCapture(event.pointerId)) scrollToPointer(event, true);
  });
}
