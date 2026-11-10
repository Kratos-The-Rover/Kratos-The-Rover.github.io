import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset, list } from '../core/dom.js';

const LAP_START = -25;
const VIEWS = [
  { key: 'front', label: 'Front', width: 1930, height: 976 },
  { key: 'side', label: 'Side', width: 2086, height: 976 },
  { key: 'back', label: 'Rear', width: 1930, height: 976 },
  { key: 'top', label: 'Top', width: 1081, height: 1000 },
];

const sideSet = (copy) => `
        <div class="aries-set"${copy ? ' aria-hidden="true"' : ''}>
          <figure class="aries-glow aries-side">
            <img src="${asset('images/aries/aries-view-side.webp')}" alt="${copy ? '' : 'ARIES from the side'}" width="2086" height="976" />
            <figcaption class="aries-side-caption"><span class="comp-kicker">Front</span><span class="comp-kicker">Rear</span></figcaption>
          </figure>
        </div>`;

const viewTemplate = ({ key, label, width, height }) => `
      <figure class="aries-glow aries-view aries-view--${key}">
        <img src="${asset(`images/aries/aries-view-${key}.webp`)}" alt="ARIES, ${label.toLowerCase()} view" width="${width}" height="${height}" loading="lazy" />
        <figcaption><span class="comp-kicker">${label}</span><span class="aries-soon">coming soon</span></figcaption>
      </figure>`;

export const ariesTemplate = () => `
  <section class="aries-rover" id="aries-rover" aria-label="ARIES">
    <div class="aries-band">
      <div class="aries-track">${list([false, true], sideSet)}
      </div>
    </div>
    <div class="aries-orbit" id="aries-orbit">
      <div class="aries-orbit-glow" aria-hidden="true"></div>
      <canvas class="aries-orbit-canvas" id="aries-orbit-canvas" aria-label="ARIES 3D model turning as you scroll"></canvas>
      <p class="comp-kicker aries-orbit-label" id="aries-orbit-label">Front</p>
    </div>
    <div class="aries-views">${list(VIEWS, viewTemplate)}
    </div>
  </section>`;

function animateSideBand() {
  gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: { trigger: '.aries-band', start: 'top 85%', end: 'center 60%', scrub: true },
  })
    .fromTo('.aries-side', { '--glow': 0 }, { '--glow': 1, duration: 1 }, 0)
    .fromTo('.aries-side img', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0)
    .fromTo('.aries-side-caption', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.5);

  const wrap = gsap.utils.wrap(-50, 0);
  const lap = { progress: 0 };
  gsap.set('.aries-track', { xPercent: LAP_START });
  gsap.to(lap, {
    progress: 1,
    ease: 'none',
    onUpdate: () => gsap.set('.aries-track', { xPercent: wrap(LAP_START + lap.progress * 50) }),
    scrollTrigger: { trigger: '.aries-band', start: 'center center', end: '+=140%', pin: true, scrub: true },
  });
}

function viewName({ az, el, spin }) {
  if (el > 65) return 'Top';
  const corner = az < -15;
  if (spin < 90) return corner ? 'Front · right corner' : 'Front';
  return corner ? 'Rear · left corner' : 'Rear';
}

function animateOrbit() {
  const camera = { az: 0, el: 0, spin: 0 };
  const label = document.getElementById('aries-orbit-label');
  const container = document.getElementById('aries-orbit');
  let orbit = null;

  const timeline = gsap.timeline({
    defaults: { ease: 'sine.inOut' },
    onUpdate: () => {
      orbit?.render(camera);
      const name = viewName(camera);
      if (label.textContent !== name) label.textContent = name;
    },
  })
    .fromTo('.aries-orbit-canvas', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
    .fromTo('.aries-orbit-glow', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0)
    .to(camera, { az: -45, duration: 1.4 }, 0.4)
    .to(camera, { el: 90, duration: 1.6 }, 0.9)
    .to(camera, { spin: 180, duration: 2.4 }, 1.6)
    .to(camera, { el: 0, duration: 1.6 }, 2.5)
    .to(camera, { az: 0, duration: 1.4 }, 3.6)
    .to({}, { duration: 0.3 });

  ScrollTrigger.create({ animation: timeline, trigger: container, start: 'top top', end: '+=500%', pin: true, scrub: true });

  new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    import('../three/aries-orbit.js')
      .then(({ mountAriesOrbit }) => {
        orbit = mountAriesOrbit(document.getElementById('aries-orbit-canvas'), asset('athena.glb'));
        orbit.render(camera);
      })
      .catch(() => container.classList.add('is-unavailable'));
  }, { rootMargin: '150% 0px' }).observe(container);
}

function animateViews() {
  gsap.utils.toArray('.aries-view').forEach((view, i) => {
    const offset = i * 0.15;
    gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: '.aries-views', start: 'top 90%', end: 'top 40%', scrub: true },
    })
      .fromTo(view, { '--glow': 0 }, { '--glow': 1, duration: 1 }, offset)
      .fromTo(view.querySelector('img'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, offset)
      .fromTo(view.querySelector('figcaption'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.5 + offset);
  });
}

export function initAries() {
  animateSideBand();
  animateOrbit();
  ScrollTrigger.sort();
  animateViews();
}
