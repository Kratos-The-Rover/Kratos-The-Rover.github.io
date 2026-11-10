import { gsap } from 'gsap';
import gallery from '../data/gallery.json';
import { videos } from '../data/site.js';
import { asset, list } from '../core/dom.js';

const COLUMN_SHIFT = [120, 420, 220, 560, 300];
const GRID_LAG = 0.25;

const videoTemplate = ({ id, title, event }, i) => `
      <figure class="video-card reveal${i === 0 ? ' video-card--feature' : ''}">
        <button class="video-frame grow" data-video="${id}" aria-label="Play: ${title}, ${event}">
          <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" />
          <span class="video-play" aria-hidden="true"></span>
        </button>
        <figcaption><span class="video-event">${event}</span>${title}</figcaption>
      </figure>`;

const photoTemplate = ({ src, alt, w, h }, i) => `
      <button class="photo-item grow" data-lightbox="${i}" aria-label="Open photo: ${alt}">
        <img src="${asset(src)}" alt="${alt}" loading="lazy" width="${w}" height="${h}" />
      </button>`;

export const galleryTemplate = () => `
  <section class="media-section" id="media">
    <div class="media-grid-bg" aria-hidden="true"></div>
    <div class="section-head reveal">
      <p class="section-label glitch" data-text="see it in action">see it in action</p>
      <h2 class="section-title">GALLERY</h2>
    </div>
    <div class="video-grid">${list(videos, videoTemplate)}
    </div>
    <div class="photo-grid">${list(gallery, photoTemplate)}
    </div>
  </section>`;

function driftGrid(section) {
  gsap.fromTo('.media-grid-bg', { y: 0 }, {
    y: () => section.offsetHeight * GRID_LAG,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
  });
}

function rainPhotos() {
  const photos = gsap.utils.toArray('.photo-item');
  const shiftFor = (photo) => {
    const columns = [...new Set(photos.map(({ offsetLeft }) => offsetLeft))].sort((a, b) => a - b);
    return COLUMN_SHIFT[columns.indexOf(photo.offsetLeft) % COLUMN_SHIFT.length];
  };

  photos.forEach((photo) => {
    gsap.fromTo(photo, { y: () => shiftFor(photo) }, {
      y: () => -shiftFor(photo),
      ease: 'none',
      scrollTrigger: { trigger: '.photo-grid', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  });
}

function growTimeline(frame) {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
    .to(frame, { '--go': 1, duration: 0.08, ease: 'none' })
    .to(frame, { '--wx': 0, '--wy': 0, duration: 0.45 })
    .to(frame, { '--go': 0, duration: 0.25, ease: 'none' }, '-=0.05');

  const play = frame.querySelector('.video-play');
  if (play) timeline.fromTo(play, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, '-=0.2');

  const caption = frame.closest('figure')?.querySelector('figcaption');
  if (caption) timeline.fromTo(caption, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.25');

  return timeline;
}

function growFrames() {
  const frames = gsap.utils.toArray('.grow');
  gsap.set(frames, { '--wx': 1, '--wy': 1, '--go': 0 });
  const timelines = new Map(frames.map((frame) => [frame, growTimeline(frame)]));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting, boundingClientRect, rootBounds }) => {
      if (isIntersecting) timelines.get(target).play();
      else if (rootBounds && boundingClientRect.top > rootBounds.bottom) timelines.get(target).reverse();
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  frames.forEach((frame) => observer.observe(frame));
}

function embedOnClick() {
  document.querySelector('.video-grid').addEventListener('click', (event) => {
    const button = event.target.closest('.video-frame');
    if (!button) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${button.dataset.video}?autoplay=1`;
    iframe.title = button.getAttribute('aria-label');
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    button.replaceWith(iframe);
  });
}

export function initGallery() {
  driftGrid(document.getElementById('media'));
  rainPhotos();
  growFrames();
  embedOnClick();
}
