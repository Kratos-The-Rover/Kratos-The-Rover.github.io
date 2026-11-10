import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stats, competitions } from '../data/site.js';
import { list, offsetWithin, pad2 } from '../core/dom.js';
import { addWebTargets } from '../effects/web-layer.js';

const TRACK_INSET = 30;
const TRACK_GAP = 8;

const countValue = (value, from) => (from == null
  ? value
  : value.replace(/\d+/, (n) => `<span class="count-up" data-from="${from}" data-to="${n}">${from}</span>`));

const statTemplate = ({ value, label, countFrom }) => `
      <div class="stat">
        <span class="stat-value">${countValue(value, countFrom)}</span>
        <span class="stat-label">${label}</span>
      </div>`;

const achievementTemplate = ({ value, label, countFrom }) => `
            <li class="ach">
              <span class="ach-value">${countValue(value, countFrom)}</span>
              <span class="ach-label">${label}</span>
            </li>`;

const competitionTemplate = ({ code, side, name, body, achievements }, i) => `
    <article class="comp comp--${side}">
      <h3 class="comp-code" aria-label="${code}, ${name}">
        ${list([...code], (char) => `<span class="comp-letter" aria-hidden="true"><span>${char}</span></span>`)}
      </h3>
      <div class="comp-content">
        <div class="comp-body reveal">
          <p class="comp-kicker"><span class="comp-num">${pad2(i + 1)}</span>${name}</p>
          ${list(body, (text) => `<p class="comp-text">${text}</p>`)}
        </div>
        <div class="comp-ach reveal">
          <p class="comp-kicker">Achievements</p>
          <ul class="ach-row">${list(achievements, achievementTemplate)}
          </ul>
        </div>
      </div>
    </article>`;

export const competitionsTemplate = () => `
  <section class="competitions-section" id="competitions">
    <span class="comp-track comp-track-stub" aria-hidden="true"></span>
    <span class="comp-track comp-track-v" aria-hidden="true"></span>
    <span class="comp-track comp-track-h" aria-hidden="true"></span>
    <span class="line-head" aria-hidden="true"></span>
    <div class="section-head reveal">
      <p class="section-label glitch" data-text="where we compete">where we compete</p>
      <h2 class="section-title">COMPETITIONS</h2>
    </div>
    <p class="stats-kicker reveal">What have we accomplished</p>
    <div class="stats-row reveal">${list(stats, statTemplate)}
    </div>
    ${list(competitions, competitionTemplate)}
  </section>`;

function animateCodes() {
  gsap.utils.toArray('.comp').forEach((comp) => {
    const fromRight = comp.classList.contains('comp--right');
    const letters = gsap.utils.toArray(comp.querySelectorAll('.comp-letter > span'));
    if (fromRight) letters.reverse();

    gsap.set(letters, { yPercent: 110, x: fromRight ? 60 : -60 });
    gsap.to(letters, {
      yPercent: 0,
      x: 0,
      ease: 'power1.out',
      stagger: 0.6,
      duration: 1,
      scrollTrigger: {
        trigger: comp.querySelector('.comp-code'),
        start: 'top bottom',
        endTrigger: comp.querySelector('.comp-body'),
        end: 'top 65%',
        scrub: true,
      },
    });
  });

  gsap.utils.toArray('.comp-num').forEach((number) => {
    gsap.fromTo(number, { scale: 0, opacity: 0, rotate: -45 }, {
      scale: 1,
      opacity: 1,
      rotate: 0,
      duration: 0.6,
      delay: 0.3,
      ease: 'back.out(3)',
      scrollTrigger: { trigger: number, start: 'top 85%', toggleActions: 'play none none reverse' },
    });
  });
}

function animateTrack(section) {
  const [first, second] = section.querySelectorAll('.comp-num');
  const stub = section.querySelector('.comp-track-stub');
  const vertical = section.querySelector('.comp-track-v');
  const horizontal = section.querySelector('.comp-track-h');
  const head = section.querySelector('.line-head');
  let geometry = null;

  const layout = () => {
    const a = offsetWithin(first, section);
    const b = offsetWithin(second, section);
    const y1 = Math.round(a.y + first.offsetHeight / 2);
    const y2 = Math.round(b.y + second.offsetHeight / 2);
    const x = Math.round(a.x - TRACK_INSET);
    gsap.set(stub, { left: x, top: y1, width: TRACK_INSET - TRACK_GAP });
    gsap.set(vertical, { left: x, top: y1, height: y2 - y1 });
    gsap.set(horizontal, { left: x, top: y2, width: b.x - TRACK_GAP - x });
    geometry = { start: a.x - TRACK_GAP, x, y1, y2, end: b.x - TRACK_GAP };
  };
  layout();
  ScrollTrigger.addEventListener('refreshInit', layout);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: first,
      start: 'center 60%',
      endTrigger: second,
      end: 'center 45%',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
    .fromTo(head, { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0)
    .fromTo(stub, { scaleX: 0 }, { scaleX: 1, duration: 0.05 }, 0)
    .fromTo(head, { x: () => geometry.start, y: () => geometry.y1 }, { x: () => geometry.x, duration: 0.05 }, 0)
    .fromTo(vertical, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0.05)
    .to(head, { y: () => geometry.y2, duration: 1 }, 0.05)
    .fromTo(horizontal, { scaleX: 0 }, { scaleX: 1, duration: 0.2 }, 1.05)
    .to(head, { x: () => geometry.end, duration: 0.2 }, 1.05);

  let inView = false;
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      inView = self.isActive;
    },
  });

  addWebTargets({
    active: () => inView && geometry && head.offsetParent !== null && gsap.getProperty(head, 'opacity') > 0.01,
    targets: () => {
      const bounds = section.getBoundingClientRect();
      const dot = head.getBoundingClientRect();
      const a = gsap.getProperty(head, 'opacity');
      return [
        { x: bounds.left + geometry.start, y: bounds.top + geometry.y1, a },
        { x: dot.left + dot.width / 2, y: dot.top + dot.height / 2, a },
      ];
    },
  });
}

function animateCounters() {
  document.querySelectorAll('.count-up').forEach((el) => {
    const from = Number(el.dataset.from);
    const to = Number(el.dataset.to);
    const steps = Math.abs(to - from);
    const counter = { value: from };
    const render = () => {
      el.textContent = Math.round(counter.value);
    };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => gsap.fromTo(counter, { value: from }, {
        value: to,
        duration: steps <= 8 ? 0.25 * steps : 1.8,
        delay: 0.3,
        ease: steps <= 8 ? 'none' : 'power2.out',
        snap: { value: 1 },
        onUpdate: render,
      }),
      onLeaveBack: () => {
        gsap.killTweensOf(counter);
        counter.value = from;
        render();
      },
    });
  });
}

export function initCompetitions() {
  animateCodes();
  animateTrack(document.getElementById('competitions'));
  animateCounters();
}
