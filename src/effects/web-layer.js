import { gsap } from 'gsap';
import { createCanvasSurface, white } from '../core/dom.js';
import { cursorPosition, hasPointer, touchLayout } from '../core/cursor.js';

const painters = [];

export const webLayerTemplate = () => '<canvas class="web-canvas" id="web-canvas" aria-hidden="true"></canvas>';

export function addWebPainter(painter) {
  painters.push(painter);
}

export function addWebTargets({ active, targets }) {
  addWebPainter({
    active: () => (hasPointer() || touchLayout.matches) && active(),
    paint: ({ origin, from, line }) => {
      if (!from) return;
      targets().forEach(({ x, y, a = 1 }) => line(x - origin.left, y - origin.top, a));
    },
  });
}

function lineOrigin(origin) {
  if (touchLayout.matches) {
    const navLine = document.querySelector('.side-nav-item[aria-current="true"] .side-nav-line');
    if (!navLine) return null;
    const rect = navLine.getBoundingClientRect();
    return { x: rect.left - origin.left, y: rect.top + rect.height / 2 - origin.top };
  }
  if (!hasPointer()) return null;
  const { x, y } = cursorPosition();
  return { x: x - origin.left, y: y - origin.top };
}

export function initWebLayer() {
  const canvas = document.getElementById('web-canvas');
  const surface = createCanvasSurface(canvas);
  const { ctx, size } = surface;

  gsap.ticker.add(() => {
    const active = painters.filter((painter) => painter.active());
    if (!active.length) {
      if (size.width) ctx.clearRect(0, 0, size.width, size.height);
      return;
    }

    const { width, height } = surface.sync();
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    const origin = canvas.getBoundingClientRect();
    const from = lineOrigin(origin);
    const reach = Math.hypot(width, height);
    const line = (x, y, alpha) => {
      const near = 1 - Math.hypot(x - from.x, y - from.y) / reach;
      ctx.strokeStyle = white((0.08 + 0.38 * near * near) * alpha);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    active.forEach((painter) => painter.paint({ ctx, origin, width, height, from, line }));
  });
}
