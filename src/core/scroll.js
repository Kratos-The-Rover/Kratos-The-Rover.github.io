import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

export const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

export function scrollTargetFor(element) {
  return element.parentElement?.classList.contains('pin-spacer') ? element.parentElement : element;
}
