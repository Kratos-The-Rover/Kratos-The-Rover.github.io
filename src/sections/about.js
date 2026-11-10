import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gallery from '../data/gallery.json';
import { about } from '../data/site.js';
import { asset, list, white } from '../core/dom.js';
import { scrambleLabel } from '../core/scramble.js';
import { addWebPainter } from '../effects/web-layer.js';

const COLUMNS = 3;
const ROWS = 5;
const COLUMN_START = [1, 0.6, 0.25];
const GRID_DURATION = 3;
const GRID_BOTTOM_GAP = 40;
const RAIL_TICK = 28;
const SCROLL_PER_SECOND = 0.85;

const highlights = gallery.slice(0, COLUMNS * ROWS).map((photo, index) => ({ ...photo, index }));

const photoCard = ({ src, alt, w, h, index }) => `
        <button class="stage-card" data-lightbox="${index}" aria-label="Open photo: ${alt}">
          <img src="${asset(src)}" alt="${alt}" width="${w}" height="${h}" />
        </button>`;

export const aboutTemplate = () => `
  <div class="experience-wrapper" id="experience-wrapper">
    <section class="about-section" id="about">
      <p class="about-label glitch" id="about-label" data-text="who are we?">who are we?</p>
      <h2 class="about-title" id="about-title">ABOUT US</h2>
      ${list(about, (text, i) => `<p class="about-text" id="about-text-${i + 1}">${text}</p>`)}
    </section>
    <section class="stage" id="gallery" aria-label="Highlights">
      ${list(Array.from({ length: COLUMNS }, (_, column) => column), (column) => `
      <div class="stage-col">
        ${list(highlights.filter(({ index }) => index % COLUMNS === column), photoCard)}
      </div>`)}
    </section>
  </div>`;

function paintRails(ctx, columns, origin, height, alpha) {
  columns.forEach((column) => {
    const rect = column.getBoundingClientRect();
    const x = Math.round(rect.left - origin.left - 7) + 0.5;

    ctx.strokeStyle = white(0.22 * alpha);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    const offset = gsap.utils.wrap(0, RAIL_TICK, rect.top - origin.top);
    ctx.strokeStyle = white(0.42 * alpha);
    ctx.beginPath();
    for (let y = offset; y < height; y += RAIL_TICK) {
      ctx.moveTo(x - 2, y);
      ctx.lineTo(x + 2, y);
    }
    ctx.stroke();

    ctx.fillStyle = white(0.8 * alpha);
    for (const card of column.children) {
      const cardRect = card.getBoundingClientRect();
      const top = cardRect.top - origin.top;
      if (top + cardRect.height < 0 || top > height) continue;
      ctx.fillRect(x - 1.5, top, 3, 3);
      ctx.fillRect(x - 1.5, top + cardRect.height - 3, 3, 3);
    }
  });
}

function paintStrands(ctx, centres, isVisible, alpha) {
  ctx.strokeStyle = white(0.11 * alpha);
  ctx.beginPath();
  centres.forEach((centre, i) => {
    if (!isVisible(centre)) return;
    const right = centres[i + 1];
    const below = centres[i + COLUMNS];
    if (right && i % COLUMNS !== COLUMNS - 1) {
      ctx.moveTo(centre.x, centre.y);
      ctx.lineTo(right.x, right.y);
    }
    if (below) {
      ctx.moveTo(centre.x, centre.y);
      ctx.lineTo(below.x, below.y);
    }
  });
  ctx.stroke();
}

export function initAbout() {
  const stage = document.getElementById('gallery');
  const columns = gsap.utils.toArray('.stage-col');
  const cards = gsap.utils.toArray('.stage-card');
  const web = { alpha: 0 };
  let pinned = false;

  const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } })
    .fromTo('#about-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25 }, 0)
    .call(() => scrambleLabel(document.getElementById('about-label')), null, 0.02)
    .from('#about-title', { y: 60, opacity: 0, duration: 0.45 }, 0.05)
    .from('.about-text', { y: 30, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.25)
    .fromTo(web, { alpha: 0 }, { alpha: 1, duration: 0.4, ease: 'none' }, 0.1);

  columns.forEach((column, i) => {
    timeline.fromTo(column,
      { y: () => stage.clientHeight * COLUMN_START[i] },
      { y: () => stage.clientHeight - column.offsetHeight - GRID_BOTTOM_GAP, duration: GRID_DURATION, ease: 'none' },
      0);
  });

  timeline
    .to(web, { alpha: 0, duration: 0.35, ease: 'none' }, GRID_DURATION)
    .to('#about', { opacity: 0, duration: 0.6, ease: 'power1.inOut' }, GRID_DURATION + 0.1)
    .to({}, { duration: 0.2 });

  ScrollTrigger.create({
    animation: timeline,
    trigger: '#experience-wrapper',
    start: 'top top',
    end: () => `+=${window.innerHeight * SCROLL_PER_SECOND * timeline.duration()}`,
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
    onToggle: (self) => {
      pinned = self.isActive;
    },
  });

  addWebPainter({
    active: () => pinned && web.alpha >= 0.01,
    paint: ({ ctx, origin, height, from, line }) => {
      const area = stage.getBoundingClientRect();
      const centres = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { x: rect.left - origin.left + rect.width / 2, y: rect.top - origin.top + rect.height / 2, h: rect.height };
      });
      const isVisible = ({ y, h }) => y + h / 2 > 0 && y - h / 2 < height;

      ctx.save();
      ctx.beginPath();
      ctx.rect(area.left - origin.left - 12, area.top - origin.top, area.width + 24, area.height);
      ctx.clip();
      paintRails(ctx, columns, origin, height, web.alpha);
      paintStrands(ctx, centres, isVisible, web.alpha);
      ctx.restore();

      if (!from) return;
      centres.filter(isVisible).forEach(({ x, y }) => line(x, y, web.alpha));
    },
  });
}
