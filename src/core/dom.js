export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

export const list = (items, render) => items.map(render).join('');

export const pad2 = (n) => String(n).padStart(2, '0');

export const arrowIcon = '<svg class="ext-arrow" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3 2h5v5" fill="none" stroke="currentColor" stroke-width="1"/></svg>';

export function offsetWithin(element, ancestor) {
  let x = 0;
  let y = 0;
  for (let node = element; node && node !== ancestor; node = node.offsetParent) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
}

export function createCanvasSurface(canvas) {
  const ctx = canvas.getContext('2d');
  const size = { width: 0, height: 0, dpr: 0 };

  function sync() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (width === size.width && height === size.height && dpr === size.dpr) return size;
    Object.assign(size, { width, height, dpr });
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return size;
  }

  return { ctx, size, sync };
}

export const white = (alpha) => `rgba(255, 255, 255, ${alpha})`;
