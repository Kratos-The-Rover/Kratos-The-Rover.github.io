import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import roverImage from '../assets/mark-vi.png';
import { asset } from '../core/dom.js';
import { lenis } from '../core/scroll.js';
import { scrambleText } from '../core/scramble.js';
import { bootCrosshair } from '../core/cursor.js';
import { setSmokeActive } from '../effects/smoke.js';

const LABEL = 'OUR FLAGSHIP ROVER';

export const splashTemplate = () => `
  <div class="splash-screen" id="splash-screen">
    <div class="splash-logo-container">
      <img src="${asset('kratos-logo.png')}" alt="Kratos Logo" class="splash-logo" id="splash-logo" />
      <div class="splash-logo-text" id="splash-logo-text">
        <span class="splash-bits">BITS GOA</span>
        <span class="splash-project">PROJECT KRATOS</span>
      </div>
    </div>
  </div>`;

export const galaxyTemplate = () => `
  <div class="galaxy-slash" id="galaxy-slash">
    <div class="galaxy-core"></div>
  </div>`;

export const heroTemplate = () => `
  <section class="hero" id="hero">
    <div class="hero-graphics" id="hero-graphics">
      <div class="hero-grid" id="hero-grid">
        <div class="grid-decor grid-decor-top"><span>SEC 7G</span><span>ALIGNMENT</span></div>
        <div class="grid-decor grid-decor-side"><span>SYS.NOMINAL</span></div>
        <div class="grid-cross"></div>
      </div>
      <div class="hero-rover-wrapper" id="hero-rover-wrapper">
        <img src="${roverImage}" alt="Mark VI Rover" class="hero-rover-img" id="rover-img" />
      </div>
    </div>
    <canvas id="smoke-canvas" class="smoke-canvas"></canvas>
    <div class="hero-content" id="hero-content">
      <p class="hero-label" id="hero-label">${LABEL}</p>
      <h1 class="hero-title" id="hero-title">MARK VI</h1>
      <div class="hero-btn-wrapper" id="hero-btn-wrapper">
        <a href="#about" class="hero-btn" id="hero-btn">LEARN MORE</a>
      </div>
    </div>
  </section>`;

function heroEntrance() {
  return gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
    .from('.nav-logo-group', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 1)
    .fromTo('#hero-label', { opacity: 0 }, {
      opacity: 1,
      duration: 0.2,
      onStart: () => scrambleText(document.getElementById('hero-label'), LABEL, 0.8),
    }, 0)
    .from('#hero-btn', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0)
    .from('#hero-rover-wrapper', { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.out' }, 0)
    .from('#hero-grid', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 0)
    .fromTo('#hero-title',
      { x: -20, webkitMaskPosition: '100% 0%', maskPosition: '100% 0%' },
      { x: 0, webkitMaskPosition: '0% 0%', maskPosition: '0% 0%', duration: 2.2, ease: 'power3.out' }, 0.3)
    .to('#galaxy-slash', { scaleY: 1.5, duration: 2, ease: 'power2.out' }, 0.3)
    .to('#galaxy-slash', { scaleY: 0, opacity: 0, duration: 4, ease: 'power2.inOut' }, 2.3)
    .from('.side-nav-item', { x: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 1.5);
}

export function initIntro() {
  const entrance = heroEntrance();
  const splashParts = ['#splash-logo', '#splash-logo-text'];

  gsap.timeline({
    onComplete: () => {
      entrance.play();
      lenis.start();
      bootCrosshair();
    },
  })
    .fromTo(splashParts, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.1 })
    .to(splashParts, { opacity: 0, y: -15, duration: 0.4, ease: 'power3.in', delay: 0.4 })
    .to('#splash-screen', { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
    .set('#splash-screen', { display: 'none' });
}

export function initHeroScroll() {
  const exit = gsap.timeline({ defaults: { ease: 'none' } })
    .fromTo('#hero-label', { y: 0, opacity: 1 }, { y: -40, opacity: 0, duration: 0.35 }, 0)
    .fromTo('#hero-title', { y: 0, opacity: 1 }, { y: -70, opacity: 0, duration: 0.5 }, 0.05)
    .fromTo('#hero-btn-wrapper', { y: 0, opacity: 1 }, { y: -40, opacity: 0, duration: 0.4 }, 0.12)
    .fromTo('#rover-img', { y: 0, scale: 1, opacity: 1 }, { y: -90, scale: 0.86, opacity: 0, duration: 0.9 }, 0)
    .fromTo('#hero-grid', { scale: 1, opacity: 1 }, { scale: 1.25, opacity: 0, duration: 0.8 }, 0.05)
    .fromTo('#smoke-canvas', { opacity: 1 }, { opacity: 0, duration: 0.8 }, 0.15);

  ScrollTrigger.create({
    animation: exit,
    trigger: '#hero',
    start: 'top top',
    end: '+=110%',
    pin: true,
    scrub: true,
    onLeave: () => setSmokeActive(false),
    onEnterBack: () => setSmokeActive(true),
  });
}
