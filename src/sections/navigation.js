import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { asset, list } from '../core/dom.js';
import { lenis, scrollTargetFor } from '../core/scroll.js';

const SECTIONS = [
  ['#hero', 'HOME'],
  ['#about', 'ABOUT US'],
  ['#competitions', 'COMPETITIONS'],
  ['#team', 'TEAM'],
  ['#media', 'GALLERY'],
  ['#history', 'ARIES'],
  ['#contact', 'CONTACT'],
];
const ABOUT_LANDING = 0.6;

export const logoTemplate = () => `
  <a href="#hero" class="nav-logo-group" aria-label="Project Kratos, back to top">
    <div class="nav-logo-icon">
      <img src="${asset('kratos-logo.png')}" alt="Kratos Logo" />
    </div>
    <div class="nav-logo-text">
      <span class="nav-logo-bits">BITS GOA</span>
      <span class="nav-logo-project">PROJECT<br/>KRATOS</span>
    </div>
  </a>`;

export const sideNavTemplate = () => `
  <nav class="side-nav" aria-label="Sections">${list(SECTIONS, ([href, label]) => `
    <a href="${href}" class="side-nav-item">
      <span>${label}</span>
      <span class="side-nav-line"></span>
      <span class="side-nav-dot"></span>
    </a>`)}
  </nav>`;

export function initSideNav() {
  const items = [...document.querySelectorAll('.side-nav-item')];
  const targets = items.map((item) => {
    const section = document.querySelector(item.getAttribute('href'));
    return section.closest('.pin-spacer') ?? section;
  });

  items.forEach((item, i) => {
    const next = targets[i + 1];
    ScrollTrigger.create({
      trigger: targets[i],
      start: 'top center',
      endTrigger: next ?? targets[i],
      end: next ? 'top center' : 'bottom center',
      onToggle: (self) => item.setAttribute('aria-current', self.isActive),
    });
  });
}

export function initInPageLinks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    const section = link && document.querySelector(link.getAttribute('href'));
    if (!section) return;
    event.preventDefault();

    const isAbout = section.id === 'about';
    const target = scrollTargetFor(isAbout ? document.getElementById('experience-wrapper') : section);
    lenis.scrollTo(target, { offset: isAbout ? window.innerHeight * ABOUT_LANDING : 0, duration: 1.4 });
  });
}
