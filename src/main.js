import './styles/index.css';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './core/scroll.js';
import { reloadIfStale } from './core/freshness.js';
import { cursorTemplate, initCursor } from './core/cursor.js';
import { initStars, starsTemplate } from './effects/stars.js';
import { initSmoke } from './effects/smoke.js';
import { initNebulae, nebulaeTemplate } from './effects/nebulae.js';
import { initWebLayer, webLayerTemplate } from './effects/web-layer.js';
import { initScrollbar, scrollbarTemplate } from './effects/scrollbar.js';
import { galaxyTemplate, heroTemplate, initHeroScroll, initIntro, splashTemplate } from './sections/hero.js';
import { initInPageLinks, initSideNav, logoTemplate, sideNavTemplate } from './sections/navigation.js';
import { aboutTemplate, initAbout } from './sections/about.js';
import { competitionsTemplate, initCompetitions } from './sections/competitions.js';
import { initTeam, teamTemplate } from './sections/team.js';
import { galleryTemplate, initGallery } from './sections/gallery.js';
import { historyTemplate, initHistory } from './sections/history.js';
import { ariesTemplate, initAries } from './sections/aries.js';
import { contactTemplate, footerTemplate } from './sections/contact.js';
import { initLightbox, lightboxTemplate } from './sections/lightbox.js';
import { initReveals } from './sections/reveals.js';

document.querySelector('#app').innerHTML = [
  splashTemplate,
  nebulaeTemplate,
  starsTemplate,
  webLayerTemplate,
  galaxyTemplate,
  cursorTemplate,
  logoTemplate,
  sideNavTemplate,
  scrollbarTemplate,
  heroTemplate,
  aboutTemplate,
  competitionsTemplate,
  teamTemplate,
  galleryTemplate,
  historyTemplate,
  ariesTemplate,
  contactTemplate,
  footerTemplate,
  lightboxTemplate,
].map((template) => template()).join('');

initStars();
initCursor();
initSmoke();
initIntro();
initHeroScroll();
initAbout();
initWebLayer();
initCompetitions();
initTeam();
initHistory();
initSideNav();
initAries();
initScrollbar();
initNebulae();
initGallery();
initReveals();
initInPageLinks();
initLightbox();

window.addEventListener('load', () => ScrollTrigger.refresh());
reloadIfStale();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.globalTimeline.clear();
  });
}
