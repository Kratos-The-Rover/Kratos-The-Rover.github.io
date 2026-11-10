import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import roverImg from './assets/group3.png';
import logoImg from './assets/kratos-logo.png';
import { about, stats, competitions, videos, contact } from './data/site.js';
import { team } from './data/team.js';
import { gallery } from './data/gallery.js';

gsap.registerPlugin(ScrollTrigger);

// Smooth scrolling. Raw wheel steps driving pinned, scrubbed timelines is what made scrolling feel
// jerky; Lenis interpolates the scroll position and GSAP's ticker drives both so they stay in sync.
const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop(); // locked until the splash screen is gone

// Files in /public are served from the site root (respects Vite's `base`).
const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
// A stat value whose first number counts from `countFrom` when scrolled into view (e.g. "40+" counts 20 → 40).
const countValue = (value, from) => (from == null ? value
  : value.replace(/\d+/, (n) => `<span class="count-up" data-from="${from}" data-to="${n}">${from}</span>`));

const GRID_COLS = 3;
const GRID_ROWS = 5; // About-section photo grid is GRID_COLS × GRID_ROWS

const arrow = `<svg class="ext-arrow" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3 2h5v5" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;

// ===== DOM =====
document.querySelector('#app').innerHTML = `
  <!-- Splash Screen -->
  <div class="splash-screen" id="splash-screen">
    <div class="splash-logo-container">
      <img src="${logoImg}" alt="Kratos Logo" class="splash-logo" id="splash-logo" />
      <div class="splash-logo-text" id="splash-logo-text">
        <span class="splash-bits">BITS GOA</span>
        <span class="splash-project">PROJECT KRATOS</span>
      </div>
    </div>
  </div>

  <!-- Star noise background, with faint blue-purple nebulae drifting in and out behind it -->
  <div class="nebula" aria-hidden="true"></div>
  <div class="nebula" aria-hidden="true"></div>
  <canvas class="stars-canvas" id="stars-canvas"></canvas>
  <!-- About section's web (cursor → photos) and photo rails. A fixed full-screen layer, so it shares the cursor's
       coordinates exactly; it sits below the About section, so it still runs under the photos and text. -->
  <canvas class="web-canvas" id="web-canvas" aria-hidden="true"></canvas>

  <!-- Galaxy Slash Opening Animation -->
  <div class="galaxy-slash" id="galaxy-slash">
    <div class="galaxy-core"></div>
  </div>

  <!-- Crosshair Cursor -->
  <div class="crosshair-h" id="crosshair-h"></div>
  <div class="crosshair-v" id="crosshair-v"></div>
  <div class="crosshair-square" id="crosshair-sq"></div>

  <!-- Logo (fixed top left, back to top) -->
  <a href="#hero" class="nav-logo-group" aria-label="Project Kratos, back to top">
    <div class="nav-logo-icon">
      <img src="${logoImg}" alt="Kratos Logo" />
    </div>
    <div class="nav-logo-text">
      <span class="nav-logo-bits">BITS GOA</span>
      <span class="nav-logo-project">PROJECT<br/>KRATOS</span>
    </div>
  </a>

  <!-- Section navigation: fixed for the whole page, highlights the section in view -->
  <nav class="side-nav" aria-label="Sections">
    ${[
      ['#hero', 'HOME'],
      ['#about', 'ABOUT US'],
      ['#competitions', 'COMPETITIONS'],
      ['#team', 'TEAM'],
      ['#media', 'GALLERY'],
      ['#history', 'ARIES'],
      ['#contact', 'CONTACT'],
    ].map(([href, label]) => `
    <a href="${href}" class="side-nav-item">
      <span>${label}</span>
      <span class="side-nav-line"></span>
      <span class="side-nav-dot"></span>
    </a>`).join('')}
  </nav>

  <!-- Scrollbar: a long thin triangle on the right edge whose apex follows the scroll position -->
  <canvas class="scroll-tri" id="scroll-tri" aria-hidden="true"></canvas>

  <!-- Hero Section -->
  <section class="hero" id="hero">


    <!-- Hero Graphics Wrapper (Aligns Grid and Rover perfectly without GSAP conflicts) -->
    <div class="hero-graphics" id="hero-graphics">
      <!-- Grid with Blueprint Decor -->
      <div class="hero-grid" id="hero-grid">
        <div class="grid-decor grid-decor-top"><span>SEC 7G</span><span>ALIGNMENT</span></div>
        <div class="grid-decor grid-decor-side"><span>SYS.NOMINAL</span></div>
        <div class="grid-cross"></div>
      </div>

      <!-- Rover -->
      <div class="hero-rover-wrapper" id="hero-rover-wrapper">
        <img src="${roverImg}" alt="Mark VI Rover" class="hero-rover-img" id="rover-img" />
      </div>
    </div>

    <!-- WebGL Chromatic Smoke Canvas -->
    <canvas id="smoke-canvas" class="smoke-canvas"></canvas>

    <div class="hero-content" id="hero-content">
      <p class="hero-label" id="hero-label">OUR FLAGSHIP ROVER</p>
      <h1 class="hero-title" id="hero-title">MARK VI</h1>
      <div class="hero-btn-wrapper" id="hero-btn-wrapper">
        <a href="#about" class="hero-btn" id="hero-btn">LEARN MORE</a>
      </div>
    </div>
  </section>

  <!-- Unified Experience Wrapper -->
  <div class="experience-wrapper" id="experience-wrapper">
    <!-- About Section -->
    <section class="about-section" id="about">
      <p class="about-label glitch" id="about-label" data-text="who are we?">who are we?</p>
      <h2 class="about-title" id="about-title">ABOUT US</h2>
      ${about.map((p, i) => `<p class="about-text" id="about-text-${i + 1}">${p}</p>`).join('')}
    </section>

    <!-- Photo grid: three columns that scroll up at different speeds and land together -->
    <section class="stage" id="gallery" aria-label="Highlights">
      ${[0, 1, 2].map((col) => `
      <div class="stage-col">
        ${gallery.slice(0, GRID_COLS * GRID_ROWS).map((g, i) => [g, i]).filter(([, i]) => i % GRID_COLS === col).map(([g, i]) => `
        <button class="stage-card" data-lightbox="${i}" aria-label="Open photo: ${g.alt}">
          <img src="${asset(g.src)}" alt="${g.alt}" width="${g.w}" height="${g.h}" />
        </button>`).join('')}
      </div>`).join('')}
    </section>
  </div>

  <!-- Competitions -->
  <section class="competitions-section" id="competitions">
    <!-- Track from 01 down to 02, drawn on scroll -->
    <span class="comp-track comp-track-stub" aria-hidden="true"></span>
    <span class="comp-track comp-track-v" aria-hidden="true"></span>
    <span class="comp-track comp-track-h" aria-hidden="true"></span>
    <span class="line-head" aria-hidden="true"></span>
    <div class="section-head reveal">
      <p class="section-label glitch" data-text="where we compete">where we compete</p>
      <h2 class="section-title">COMPETITIONS</h2>
    </div>
    <p class="stats-kicker reveal">What have we accomplished</p>
    <div class="stats-row reveal">
      ${stats.map((s) => `
      <div class="stat">
        <span class="stat-value">${countValue(s.value, s.countFrom)}</span>
        <span class="stat-label">${s.label}</span>
      </div>`).join('')}
    </div>
    ${competitions.map((c, i) => `
    <article class="comp comp--${c.side}">
      <h3 class="comp-code" aria-label="${c.code}, ${c.name}">
        ${[...c.code].map((ch) => `<span class="comp-letter" aria-hidden="true"><span>${ch}</span></span>`).join('')}
      </h3>
      <div class="comp-content">
        <div class="comp-body reveal">
          <p class="comp-kicker"><span class="comp-num">0${i + 1}</span>${c.name}</p>
          ${c.body.map((p) => `<p class="comp-text">${p}</p>`).join('')}
        </div>
        <div class="comp-ach reveal">
          <p class="comp-kicker">Achievements</p>
          <ul class="ach-row">
            ${c.achievements.map((a) => `
            <li class="ach">
              <span class="ach-value">${countValue(a.value, a.countFrom)}</span>
              <span class="ach-label">${a.label}</span>
            </li>`).join('')}
          </ul>
        </div>
      </div>
    </article>`).join('')}
  </section>

  <!-- Team -->
  <section class="team-section" id="team">
    <div class="section-head reveal">
      <p class="section-label glitch" data-text="the people behind the rover">the people behind the rover</p>
      <h2 class="section-title">THE TEAM</h2>
    </div>
    <div class="team-tabs reveal" role="tablist" aria-label="Team by year">
      ${team.map((y, i) => `
      <button class="team-tab${i === 0 ? ' is-active' : ''}" role="tab" aria-selected="${i === 0}" data-year="${y.id}">
        ${i === 0 ? 'Current' : y.label.replace('AY ', '')}
      </button>`).join('')}
    </div>
    <!-- Leads as a tree: built by buildTree() in the TEAM TREE block -->
    <div class="team-tree" id="team-tree" role="tabpanel"></div>
  </section>

  <!-- Media: videos + full gallery -->
  <section class="media-section" id="media">
    <div class="media-grid-bg" aria-hidden="true"></div>
    <div class="section-head reveal">
      <p class="section-label glitch" data-text="see it in action">see it in action</p>
      <h2 class="section-title">GALLERY</h2>
    </div>
    <div class="video-grid">
      ${videos.map((v, i) => `
      <figure class="video-card reveal${i === 0 ? ' video-card--feature' : ''}">
        <button class="video-frame grow" data-video="${v.id}" aria-label="Play: ${v.title}, ${v.event}">
          <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" />
          <span class="video-play" aria-hidden="true"></span>
        </button>
        <figcaption><span class="video-event">${v.event}</span>${v.title}</figcaption>
      </figure>`).join('')}
    </div>
    <div class="photo-grid">
      ${gallery.map((g, i) => `
      <button class="photo-item grow" data-lightbox="${i}" aria-label="Open photo: ${g.alt}">
        <img src="${asset(g.src)}" alt="${g.alt}" loading="lazy" width="${g.w}" height="${g.h}" />
      </button>`).join('')}
    </div>
  </section>

  <!-- History Section (ARIES reveal) -->
  <section class="history-section" id="history">
    <div class="history-phase" id="history-phase-1">
      <div class="history-poem">
        <div class="poem-line">Every sonnet has a last verse</div>
        <div class="poem-line">Every mythology ends when the gods stop fighting</div>
        <div class="poem-line">but we gave our god a weapon</div>
      </div>
    </div>
    <div class="history-phase" id="history-phase-2">
      <p class="history-transition">meet the upgrade.</p>
    </div>
    <div class="history-phase" id="history-phase-3">
      <p class="history-title-small">Project Kratos</p>
      <h2 class="history-title-large">ARIES</h2>
      <p class="history-coming">coming soon</p>
    </div>
  </section>

  <!-- ARIES. Silhouettes rendered from the CAD model, all black and backlit so they read. -->
  <section class="aries-rover" id="aries-rover" aria-label="ARIES">
    <!-- Side view on a loop: the whole rover, front to the right, drifts right as you scroll; the front slides off
         the right edge and comes back in on the left. Two identical sets make the loop seamless. -->
    <div class="aries-band">
      <div class="aries-track">
        ${[0, 1].map((copy) => `
        <div class="aries-set"${copy ? ' aria-hidden="true"' : ''}>
          <figure class="aries-glow aries-side">
            <img src="${asset('images/aries/aries-view-side.webp')}" alt="${copy ? '' : 'ARIES from the side'}" width="2086" height="976" />
          </figure>
        </div>`).join('')}
      </div>
    </div>

    <!-- Camera move around the 3D model, driven by scroll (see ARIES CAMERA in this file) -->
    <div class="aries-orbit" id="aries-orbit">
      <div class="aries-orbit-glow" aria-hidden="true"></div>
      <canvas class="aries-orbit-canvas" id="aries-orbit-canvas" aria-label="ARIES 3D model turning as you scroll"></canvas>
      <p class="comp-kicker aries-orbit-label" id="aries-orbit-label">Front</p>
    </div>

    <div class="aries-views">
      ${[
        ['front', 'Front', 1930, 976],
        ['side', 'Side', 2086, 976],
        ['back', 'Rear', 1930, 976],
        ['top', 'Top', 1081, 1000],
      ].map(([key, label, w, h]) => `
      <figure class="aries-glow aries-view aries-view--${key}">
        <img src="${asset(`images/aries/aries-view-${key}.webp`)}" alt="ARIES, ${label.toLowerCase()} view" width="${w}" height="${h}" loading="lazy" />
        <figcaption><span class="comp-kicker">${label}</span><span class="aries-soon">coming soon</span></figcaption>
      </figure>`).join('')}
    </div>
  </section>

  <!-- Contact -->
  <section class="contact-section" id="contact">
    <div class="section-head reveal">
      <p class="section-label glitch" data-text="want to know more?">want to know more?</p>
      <h2 class="section-title">CONTACT</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-col reveal">
        <p class="contact-kicker">Write to us</p>
        <a class="contact-email" href="mailto:${contact.email}">${contact.email}</a>
        <ul class="contact-phones">
          ${contact.phones.map((p) => `
          <li>
            <span class="contact-person">${p.name}<em>${p.role}</em></span>
            <a href="tel:${p.tel}">${p.display}</a>
          </li>`).join('')}
        </ul>
      </div>
      <div class="contact-col reveal">
        <p class="contact-kicker">Follow us</p>
        <ul class="contact-socials">
          ${contact.socials.map((s) => `
          <li><a href="${s.url}" target="_blank" rel="noopener">${s.name} ${arrow}</a></li>`).join('')}
        </ul>
        <p class="contact-address">BITS Pilani, K. K. Birla Goa Campus<br />Zuarinagar, Goa 403726</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <span class="footer-text">© ${new Date().getFullYear()} BITS Goa — Project Kratos</span>
    <span class="footer-brand">KRATOS</span>
  </footer>

  <!-- Lightbox -->
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" hidden>
    <button class="lightbox-close" data-lb="close" aria-label="Close">CLOSE ✕</button>
    <button class="lightbox-nav lightbox-prev" data-lb="prev" aria-label="Previous photo">←</button>
    <figure class="lightbox-figure">
      <img id="lightbox-img" alt="" />
      <figcaption id="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-nav lightbox-next" data-lb="next" aria-label="Next photo">→</button>
  </div>
`;

// ====================================================================
// STAR NOISE BACKGROUND — dense, fading in and out
// ====================================================================
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  // Regenerate star positions on resize
  for (const star of stars) {
    star.x = Math.random() * canvas.width;
    star.y = Math.random() * canvas.height;
  }
});

const STAR_COUNT = 1000; // Double sparse stars
const STAR_PARALLAX = 0.15;
const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 0.4 + 0.1, // tiny again
    baseOpacity: Math.random() * 0.6 + 0.2, // keep visible
    fadeSpeed: Math.random() * 0.002 + 0.0005,
    fadeOffset: Math.random() * Math.PI * 2,
  });
}

// Shooting stars: one every 6–7 s, short and faint.
const shooters = [];
let nextShooter = 3000;
function spawnShooter(time) {
  const angle = (Math.PI / 180) * (20 + Math.random() * 25); // heading down-right
  const speed = 0.9 + Math.random() * 0.6;                   // px per ms
  shooters.push({
    x: Math.random() * canvas.width * 0.8,
    y: Math.random() * canvas.height * 0.5,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    born: time,
    life: 500 + Math.random() * 400,
    tail: 70 + Math.random() * 60,
  });
  nextShooter = time + 6000 + Math.random() * 1000;
}

function drawShooters(time) {
  if (time > nextShooter) spawnShooter(time);
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s = shooters[i];
    const t = time - s.born;
    if (t > s.life) { shooters.splice(i, 1); continue; }
    const fade = Math.sin((t / s.life) * Math.PI); // in and out
    const hx = s.x + s.dx * t;
    const hy = s.y + s.dy * t;
    const len = Math.hypot(s.dx, s.dy);
    const tx = hx - (s.dx / len) * s.tail;
    const ty = hy - (s.dy / len) * s.tail;
    const g = ctx.createLinearGradient(hx, hy, tx, ty);
    g.addColorStop(0, `rgba(255, 255, 255, ${0.45 * fade})`);
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }
}

function drawStars(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShooters(time);

  // Canvas is fixed behind the whole page; stars drift up slower than the content (parallax) and wrap.
  const drift = window.scrollY * STAR_PARALLAX;
  const h = canvas.height;

  for (const star of stars) {
    const cycle = Math.sin(time * star.fadeSpeed + star.fadeOffset);
    const twinkle = cycle * 0.5 + 0.5;
    const alpha = star.baseOpacity * twinkle;

    if (alpha < 0.005) continue;

    const y = gsap.utils.wrap(0, h, star.y - drift);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(star.x, y, star.size * 2, star.size * 2);
  }

  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

// ====================================================================
// CROSSHAIR CURSOR
// ====================================================================
const crossH = document.getElementById('crosshair-h');
const crossV = document.getElementById('crosshair-v');
const crossSq = document.getElementById('crosshair-sq');

gsap.set(crossSq, { xPercent: -50, yPercent: -50, top: 0, left: 0 });
gsap.set(crossH, { top: 0 });
gsap.set(crossV, { left: 0 });

const duration = 0.3;
const ease = "power2.out";

const toVX = gsap.quickTo(crossV, "x", { duration, ease });
const toHY = gsap.quickTo(crossH, "y", { duration, ease });
const toSqX = gsap.quickTo(crossSq, "x", { duration, ease });
const toSqY = gsap.quickTo(crossSq, "y", { duration, ease });

let hasMouseMoved = false;

document.addEventListener('mousemove', (e) => {
  hasMouseMoved = true;
  toVX(e.clientX);
  toHY(e.clientY);
  toSqX(e.clientX);
  toSqY(e.clientY);
});

// Delegated so links/buttons rendered later (team tabs, lightbox) also get the hover state.
document.addEventListener('mouseover', (e) => {
  document.body.classList.toggle('cursor-hover', !!e.target.closest('a, button'));
});

// ====================================================================
// WEBGL CHROMATIC SMOKE EFFECT
// ====================================================================
const smokeCanvas = document.getElementById('smoke-canvas');
const gl = smokeCanvas.getContext('webgl', { premultipliedAlpha: false, alpha: true });
// Without WebGL (some older devices, locked-down browsers) skip the smoke rather than break the whole page.
let smokeActive = true; // switched off by the hero ScrollTrigger once the hero has scrolled away
if (gl) initSmoke(gl);
else smokeCanvas.remove();

function initSmoke(gl) {
  const vertexShaderSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
  
    // Hash & Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 4; i++) {
            f += w * snoise(p);
            p *= 2.0;
            w *= 0.5;
        }
        return f;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
      
        vec2 uv_correct = uv;
        uv_correct.x *= aspect;
        vec2 mouse_correct = u_mouse;
        mouse_correct.x *= aspect;
      
        // Localize smoke to rover (right: 25%, top: 50%)
        vec2 roverPos = vec2(0.75 * aspect, 0.5);
        float distToRover = distance(uv_correct, roverPos);
        float mask = smoothstep(0.8, 0.0, distToRover);
      
        // Slower movement speed
        float t = u_time * 0.04;
      
        // Bigger smoke patches (lower multiplier) and slight mouse parallax
        vec2 p = uv_correct * 1.5 - mouse_correct * 0.1;
      
        // Subtle Chromatic Aberration interacting with cursor
        vec2 dir = normalize(uv_correct - mouse_correct);
        if(length(dir) < 0.001) dir = vec2(1.0, 0.0);
        float distToMouse = distance(uv_correct, mouse_correct);
        float chroma = distToMouse * 0.03 * mask; // Very subtle
      
        float r = fbm(p + t + dir * chroma);
        float g = fbm(p + t);
        float b = fbm(p + t - dir * chroma);
      
        r = r * 0.5 + 0.5;
        g = g * 0.5 + 0.5;
        b = b * 0.5 + 0.5;
      
        vec3 color = vec3(r, g, b);
      
        // Desaturate
        float gray = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(vec3(gray), color, 0.15); // Very low saturation (15%)
      
        float alpha = smoothstep(0.15, 0.55, gray) * mask * 0.50; // Denser smoke, 50% peak opacity
      
        gl_FragColor = vec4(color * alpha, alpha);
    }
  `;

  function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vs = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fs = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, "position");
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
  const mouseLoc = gl.getUniformLocation(program, "u_mouse");
  const timeLoc = gl.getUniformLocation(program, "u_time");

  function resize() {
    smokeCanvas.width = window.innerWidth / 2;
    smokeCanvas.height = window.innerHeight / 2;
    gl.viewport(0, 0, smokeCanvas.width, smokeCanvas.height);
    gl.uniform2f(resolutionLoc, smokeCanvas.width, smokeCanvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  const targetMouse = { x: 0.5, y: 0.5 };
  const currentMouse = { x: 0.5, y: 0.5 };

  document.addEventListener('mousemove', (e) => {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
  });

  let startTime = Date.now();
  function render() {
    requestAnimationFrame(render);
    if (!smokeActive) return;
    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

    gl.uniform2f(mouseLoc, currentMouse.x, currentMouse.y);
    gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  render();
}

// ====================================================================
// HERO ENTRANCE — brutalist, snappy
// ====================================================================
function scrambleText(element, finalString, duration = 1) {
  const chars = '!<>-_\\/[]{}—=+*^?#_';
  let dummy = { p: 0 };
  gsap.to(dummy, {
    p: 1,
    duration: duration,
    ease: 'none',
    onUpdate: () => {
      let progress = dummy.p;
      let text = '';
      for (let i = 0; i < finalString.length; i++) {
        if (finalString[i] === ' ' || progress > i / finalString.length) {
          text += finalString[i];
        } else {
          text += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.innerText = text;
    }
  });
}

const heroTl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });

const splashTl = gsap.timeline({
  onComplete: () => {
    heroTl.play();
    lenis.start();

    const triggerCrosshair = () => {
      document.querySelectorAll('.crosshair-h, .crosshair-v, .crosshair-square').forEach(el => {
        el.style.display = 'block';
        el.classList.add('crosshair-boot');
      });
    };

    if (hasMouseMoved) {
      triggerCrosshair();
    } else {
      document.addEventListener('mousemove', () => {
        setTimeout(triggerCrosshair, 400); // 0.4s delay for a snappy but perceptible lock-on
      }, { once: true });
    }
  }
});
splashTl
  .fromTo(['#splash-logo', '#splash-logo-text'],
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
  )
  .to(['#splash-logo', '#splash-logo-text'], { opacity: 0, y: -15, duration: 0.4, ease: 'power3.in', delay: 0.4 })
  .to('#splash-screen', { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
  .set('#splash-screen', { display: 'none' });

heroTl
  // ==========================================
  // PHASE 1: INSTANT/FAST BASE ELEMENTS
  // ==========================================
  .from('.nav-logo-group', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '1.0')
  .fromTo('#hero-label', { opacity: 0 }, { opacity: 1, duration: 0.2, onStart: () => scrambleText(document.getElementById('hero-label'), 'OUR FLAGSHIP ROVER', 0.8) }, '0')
  .from('#hero-btn', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '0')
  .from('#hero-rover-wrapper', { scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.out' }, '0')
  .from('#hero-grid', { opacity: 0, duration: 0.3, ease: 'power2.out' }, '0')

  // ==========================================
  // PHASE 2: HERO TITLE & GALAXY SCAR
  // ==========================================
  .fromTo('#hero-title',
    { x: -20, webkitMaskPosition: '100% 0%', maskPosition: '100% 0%' },
    { x: 0, webkitMaskPosition: '0% 0%', maskPosition: '0% 0%', duration: 2.2, ease: 'power3.out' }, '0.3'
  )
  .to('#galaxy-slash', { scaleY: 1.5, duration: 2.0, ease: 'power2.out' }, '0.3')
  .to('#galaxy-slash', { scaleY: 0, opacity: 0, duration: 4.0, ease: 'power2.inOut' }, '2.3')

  // ==========================================
  // PHASE 3: SIDE NAVIGATION
  // ==========================================
  .from('.side-nav-item', {
    x: 30, opacity: 0, duration: 0.8,
    stagger: 0.12, ease: 'power3.out',
  }, '1.5');


// ====================================================================
// SUBHEADING SCRAMBLE — same character scramble as the landing page label
// ====================================================================
function glitch(el) {
  if (el.dataset.glitching) return;
  el.dataset.glitching = '1';
  scrambleText(el, el.dataset.text, 0.8);
  gsap.delayedCall(0.85, () => {
    el.textContent = el.dataset.text;
    delete el.dataset.glitching;
  });
}



// ====================================================================
// HERO — starts dissolving on the very first scroll step
// ====================================================================
// Explicit from-values, rendered immediately. (With immediateRender:false, a refresh during the splash
// could record the intro's hidden state, and scrolling back to the top restored it: the grid vanished.)
const out = (vars) => vars;
const heroScrollTl = gsap.timeline({ defaults: { ease: 'none' } }) // linear: the first scroll step visibly moves things
  .fromTo('#hero-label', { y: 0, opacity: 1 }, out({ y: -40, opacity: 0, duration: 0.35 }), 0)
  .fromTo('#hero-title', { y: 0, opacity: 1 }, out({ y: -70, opacity: 0, duration: 0.5 }), 0.05)
  .fromTo('#hero-btn-wrapper', { y: 0, opacity: 1 }, out({ y: -40, opacity: 0, duration: 0.4 }), 0.12)
  .fromTo('#rover-img', { y: 0, scale: 1, opacity: 1 }, out({ y: -90, scale: 0.86, opacity: 0, duration: 0.9 }), 0)
  .fromTo('#hero-grid', { scale: 1, opacity: 1 }, out({ scale: 1.25, opacity: 0, duration: 0.8 }), 0.05)
  .fromTo('#smoke-canvas', { opacity: 1 }, out({ opacity: 0, duration: 0.8 }), 0.15);

ScrollTrigger.create({
  animation: heroScrollTl,
  trigger: '#hero',
  start: 'top top',
  end: '+=110%',
  pin: true,
  scrub: true, // Lenis already smooths the scroll; a second layer of scrub lag felt mushy
  onLeave: () => (smokeActive = false),
  onEnterBack: () => (smokeActive = true),
});

// ====================================================================
// ABOUT + PHOTO GRID — text stays put, photo columns scroll past on the right
// ====================================================================
const experience = document.getElementById('experience-wrapper');
const aboutSection = document.getElementById('about');
const stage = document.getElementById('gallery');
const stageCols = gsap.utils.toArray('.stage-col');
const stageCards = gsap.utils.toArray('.stage-card');
const aboutTitle = document.getElementById('about-title');
// Where each column starts, as a fraction of the stage height below its top. The first starts
// furthest down, so it has the most ground to cover in the same time and moves fastest.
const COL_START = [1.0, 0.6, 0.25];
const GRID_DURATION = 3;
const GRID_BOTTOM_GAP = 40; // space under the last row once it lands

const web = { alpha: 0 }; // opacity of the web + rails, driven by the scroll timeline
let webActive = false;    // only draw while the section is pinned

const experienceTl = gsap.timeline({ defaults: { ease: 'power2.out' } })
  .fromTo('#about-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25 }, 0)
  .call(() => glitch(document.getElementById('about-label')), null, 0.02)
  .from('#about-title', { y: 60, opacity: 0, duration: 0.45 }, 0.05)
  .from('.about-text', { y: 30, opacity: 0, duration: 0.4, stagger: 0.1 }, 0.25)
  .fromTo(web, { alpha: 0 }, { alpha: 1, duration: 0.4, ease: 'none' }, 0.1);

// All columns finish together with their last row resting at the bottom of the stage.
stageCols.forEach((col, i) => {
  experienceTl.fromTo(col,
    { y: () => stage.clientHeight * COL_START[i] },
    { y: () => stage.clientHeight - col.offsetHeight - GRID_BOTTOM_GAP, duration: GRID_DURATION, ease: 'none' },
    0);
});

// Then the web lets go and the text fades out, leaving the landed grid.
experienceTl
  .to(web, { alpha: 0, duration: 0.35, ease: 'none' }, GRID_DURATION)
  .to(aboutSection, { opacity: 0, duration: 0.6, ease: 'power1.inOut' }, GRID_DURATION + 0.1)
  .to({}, { duration: 0.2 }); // short hold, locked, before the section scrolls away

ScrollTrigger.create({
  animation: experienceTl,
  trigger: '#experience-wrapper',
  start: 'top top',
  // ~0.85 screens per timeline second: the grid takes ~2.6 screens, the slide ~1.
  end: () => `+=${window.innerHeight * 0.85 * experienceTl.duration()}`,
  pin: true,
  scrub: true,
  invalidateOnRefresh: true,
  onToggle: (self) => (webActive = self.isActive),
});

// ---------- Web + rails canvas ----------
const webCanvas = document.getElementById('web-canvas');
const webCtx = webCanvas.getContext('2d');
let webW = 0;
let webH = 0;

// Match the canvas's pixel buffer to the size it's actually displayed at. Checked every frame rather than on
// window resize: after a resize the pinned section briefly keeps its old size, so measuring then left the
// buffer stretched, and the web drew offset from the cursor until the next resize.
let webDpr = 0;
function sizeWebCanvas() {
  const w = webCanvas.clientWidth;
  const h = webCanvas.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (w === webW && h === webH && dpr === webDpr) return;
  webW = w;
  webH = h;
  webDpr = dpr;
  webCanvas.width = Math.round(w * dpr);
  webCanvas.height = Math.round(h * dpr);
  webCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const RAIL_TICK = 28;
const rgba = (a) => `rgba(255, 255, 255, ${a})`;

function drawWeb() {
  const a = web.alpha;
  if (!webActive || a < 0.01) {
    if (webW) webCtx.clearRect(0, 0, webW, webH);
    return;
  }
  sizeWebCanvas();
  webCtx.clearRect(0, 0, webW, webH);

  const origin = webCanvas.getBoundingClientRect();
  webCtx.lineWidth = 1;

  // Rails: one vertical track in the gutter left of each column, with ticks and a marker per photo
  // that ride along with the column, so you can see the photos running on it.
  stageCols.forEach((col) => {
    const r = col.getBoundingClientRect();
    const x = Math.round(r.left - origin.left - 7) + 0.5;
    webCtx.strokeStyle = rgba(0.14 * a);
    webCtx.beginPath();
    webCtx.moveTo(x, 0);
    webCtx.lineTo(x, webH);
    webCtx.stroke();

    const offset = ((r.top - origin.top) % RAIL_TICK + RAIL_TICK) % RAIL_TICK;
    webCtx.strokeStyle = rgba(0.3 * a);
    webCtx.beginPath();
    for (let y = offset; y < webH; y += RAIL_TICK) {
      webCtx.moveTo(x - 2, y);
      webCtx.lineTo(x + 2, y);
    }
    webCtx.stroke();

    webCtx.fillStyle = rgba(0.8 * a);
    for (const card of col.children) {
      const cr = card.getBoundingClientRect();
      const cy = cr.top - origin.top;
      if (cy + cr.height < 0 || cy > webH) continue;
      webCtx.fillRect(x - 1.5, cy, 3, 3);
      webCtx.fillRect(x - 1.5, cy + cr.height - 3, 3, 3);
    }
  });

  // Web: the crosshair box to every photo on screen, plus faint strands between neighbouring photos.
  // Strands end at photo centres and are drawn underneath, so they disappear behind the photos.
  const centres = stageCards.map((card) => {
    const r = card.getBoundingClientRect();
    return { x: r.left - origin.left + r.width / 2, y: r.top - origin.top + r.height / 2, h: r.height };
  });
  const onScreen = (c) => c.y + c.h / 2 > 0 && c.y - c.h / 2 < webH;

  webCtx.strokeStyle = rgba(0.07 * a);
  webCtx.beginPath();
  centres.forEach((c, i) => {
    if (!onScreen(c)) return;
    const right = centres[i + 1];
    const below = centres[i + GRID_COLS];
    if (right && i % GRID_COLS !== GRID_COLS - 1) { webCtx.moveTo(c.x, c.y); webCtx.lineTo(right.x, right.y); }
    if (below) { webCtx.moveTo(c.x, c.y); webCtx.lineTo(below.x, below.y); }
  });
  webCtx.stroke();

  if (!hasMouseMoved) return;
  const mx = gsap.getProperty(crossSq, 'x') - origin.left;
  const my = gsap.getProperty(crossSq, 'y') - origin.top;
  const reach = Math.hypot(webW, webH);
  centres.forEach((c) => {
    if (!onScreen(c)) return;
    const near = 1 - Math.hypot(c.x - mx, c.y - my) / reach;
    webCtx.strokeStyle = rgba((0.05 + 0.3 * near * near) * a);
    webCtx.beginPath();
    webCtx.moveTo(mx, my);
    webCtx.lineTo(c.x, c.y);
    webCtx.stroke();
  });
}
gsap.ticker.add(drawWeb);

// ====================================================================
// COMPETITIONS — giant codes rise letter by letter (IRC from the left, URC from the right)
// ====================================================================
gsap.utils.toArray('.comp').forEach((comp) => {
  const fromRight = comp.classList.contains('comp--right');
  let letters = gsap.utils.toArray(comp.querySelectorAll('.comp-letter > span'));
  if (fromRight) letters = letters.reverse();
  // Start state set up front so letters waiting for their turn in the stagger stay hidden.
  gsap.set(letters, { yPercent: 110, x: fromRight ? 60 : -60 });
  gsap.to(letters, {
    yPercent: 0, x: 0, ease: 'power1.out', stagger: 0.6, duration: 1,
    // From the code entering the screen until the copy under it is well up the screen.
    scrollTrigger: {
      trigger: comp.querySelector('.comp-code'),
      start: 'top bottom',
      endTrigger: comp.querySelector('.comp-body'),
      end: 'top 65%',
      scrub: true,
    },
  });
});

// 01 / 02 pop into place as their copy arrives
gsap.utils.toArray('.comp-num').forEach((num) => {
  gsap.fromTo(num,
    { scale: 0, opacity: 0, rotate: -45 },
    {
      scale: 1, opacity: 1, rotate: 0, duration: 0.6, delay: 0.3, ease: 'back.out(3)',
      scrollTrigger: { trigger: num, start: 'top 85%', toggleActions: 'play none none reverse' },
    });
});

// Track from 01 down the left edge and across to 02: "moving forward"
const compSection = document.getElementById('competitions');
const [compNum1, compNum2] = document.querySelectorAll('.comp-num');
const trackStub = compSection.querySelector('.comp-track-stub');
const trackV = compSection.querySelector('.comp-track-v');
const trackH = compSection.querySelector('.comp-track-h');
const trackHead = compSection.querySelector('.line-head');
const TRACK_INSET = 30; // how far left of 01 the vertical runs
let trackGeo = null;    // corners of the track, read by the head-dot tweens

// Layout offsets (not bounding boxes), so the reveal transforms don't skew positions.
function offsetIn(el, ancestor) {
  let x = 0;
  let y = 0;
  for (let n = el; n && n !== ancestor; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

function layoutTrack() {
  const a = offsetIn(compNum1, compSection);
  const b = offsetIn(compNum2, compSection);
  const y1 = Math.round(a.y + compNum1.offsetHeight / 2);
  const y2 = Math.round(b.y + compNum2.offsetHeight / 2);
  const x = Math.round(a.x - TRACK_INSET);
  gsap.set(trackStub, { left: x, top: y1, width: TRACK_INSET - 8 });
  gsap.set(trackV, { left: x, top: y1, height: y2 - y1 });
  gsap.set(trackH, { left: x, top: y2, width: b.x - 8 - x });
  trackGeo = { start: a.x - 8, x, y1, y2, end: b.x - 8 };
}
layoutTrack();
ScrollTrigger.addEventListener('refreshInit', layoutTrack);
// Web fonts (the giant codes especially) change the layout after first paint; re-measure once they're in.
// (Not on every resize of the section: a refresh mid-scroll inside a pinned section knocks things out of place.)
document.fonts?.ready.then(() => ScrollTrigger.refresh());

gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: compNum1,
    start: 'center 60%',
    endTrigger: compNum2,
    end: 'center 45%',
    scrub: true,
    invalidateOnRefresh: true,
  },
})
  .fromTo(trackHead, { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0)
  .fromTo(trackStub, { scaleX: 0 }, { scaleX: 1, duration: 0.05 }, 0)
  .fromTo(trackHead, { x: () => trackGeo.start, y: () => trackGeo.y1 }, { x: () => trackGeo.x, duration: 0.05 }, 0)
  .fromTo(trackV, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0.05)
  .to(trackHead, { y: () => trackGeo.y2, duration: 1 }, 0.05)
  .fromTo(trackH, { scaleX: 0 }, { scaleX: 1, duration: 0.2 }, 1.05)
  .to(trackHead, { x: () => trackGeo.end, duration: 0.2 }, 1.05);

// Numbers that count to their value when their bar comes into view (2026 → 2018, 20 → 40+, IRC 22 → 26).
// Slow enough to read each step; short ranges tick evenly, long ones ease into their final value.
document.querySelectorAll('.count-up').forEach((el) => {
  const from = Number(el.dataset.from);
  const to = Number(el.dataset.to);
  const steps = Math.abs(to - from);
  const counter = { n: from };
  const show = () => (el.textContent = Math.round(counter.n));
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    onEnter: () => gsap.fromTo(counter, { n: from }, {
      n: to, duration: steps <= 8 ? 0.25 * steps : 1.8, delay: 0.3,
      ease: steps <= 8 ? 'none' : 'power2.out', snap: { n: 1 }, onUpdate: show,
    }),
    onLeaveBack: () => { gsap.killTweensOf(counter); counter.n = from; show(); },
  });
});

// ====================================================================
// TEAM TREE — management first, then a line steps down and to the right through each subsystem
// ====================================================================
// Roles vary a little between years, so tiers are picked by keyword.
const TIER_NAMES = ['Management', 'Mechanical', 'Electronics', 'Power', 'Life Detection & Controls', 'Autonomous', 'Communication'];
function tierOf(role) {
  // Communication and power are subsystems of their own, checked first so no other keyword claims them.
  if (/communication/i.test(role)) return 6;
  if (/power/i.test(role)) return 3;
  if (/team lead|vice|operations|creative/i.test(role)) return 0;
  if (/mechanical|arm/i.test(role)) return 1;
  if (/electronics/i.test(role)) return 2;
  if (/autonomous/i.test(role)) return 5;
  return 4; // science / life detection / controls
}

function treeCard(m) {
  return `
    <article class="team-card tree-card">
      <div class="team-photo">
        <img src="${asset(m.img)}" alt="${m.name}" loading="lazy" width="640" height="640" />
      </div>
      <div class="team-meta">
        <h3 class="team-name">${m.name}</h3>
        <p class="team-role">${m.role}</p>
        ${m.linkedin ? `<a class="team-link" href="${m.linkedin}" target="_blank" rel="noopener">LinkedIn ${arrow}</a>` : ''}
      </div>
    </article>`;
}

function treeMarkup(year) {
  const tiers = TIER_NAMES.map(() => []);
  year.members.forEach((m) => tiers[tierOf(m.role)].push(m));
  return `<svg class="tree-lines" aria-hidden="true"></svg><span class="line-head" aria-hidden="true"></span>` + tiers
    .map((members, i) => ({ members, i }))
    .filter((t) => t.members.length)
    .map(({ members, i }) => `
      <p class="comp-kicker tree-label">${TIER_NAMES[i]}</p>
      <div class="tree-row" aria-label="${TIER_NAMES[i]}">${members.map(treeCard).join('')}</div>`)
    .join('');
}

const teamTree = document.getElementById('team-tree');
const SVG_NS = 'http://www.w3.org/2000/svg';
const BRANCH_ABOVE = 36; // branch line height above a tier's cards
const MERGE_BELOW = 24;  // where a tier's lines join below its cards
const LABEL_GAP = 10;    // space between the line and the subsystem name that breaks it
let treeGeo = null;

// Every line, in drawing order. A step's lines draw together; `head` is the segment the dot rides along.
// Per tier: trunk down the centre → broken by the subsystem name → trunk → branch out → drop onto each card;
// then drops from each card join back to the centre for the next tier.
function treeGeometry() {
  const rows = [...teamTree.querySelectorAll('.tree-row')];
  const labelEls = [...teamTree.querySelectorAll('.tree-label')];
  const cx = Math.round(teamTree.clientWidth / 2);
  const pts = rows.map((row) => [...row.children].map((card) => {
    const o = offsetIn(card, teamTree);
    return { x: Math.round(o.x + card.offsetWidth / 2), top: o.y, bottom: o.y + card.offsetHeight };
  }));
  const steps = [];
  const labels = [];
  let yStart = 0;
  pts.forEach((kids, i) => {
    const xs = kids.map((k) => k.x);
    const yBranch = Math.min(...kids.map((k) => k.top)) - BRANCH_ABOVE;
    if (i > 0) {
      const prev = pts[i - 1];
      const yMerge = Math.max(...prev.map((p) => p.bottom)) + MERGE_BELOW;
      const drops = prev.map((p) => [p.x, p.bottom + 12, p.x, yMerge]);
      steps.push({ lines: drops, head: drops[drops.length - 1] });
      const pxs = prev.map((p) => p.x);
      const joins = [];
      if (Math.min(...pxs) < cx) joins.push([Math.min(...pxs), yMerge, cx, yMerge]);
      if (Math.max(...pxs) > cx) joins.push([Math.max(...pxs), yMerge, cx, yMerge]);
      if (joins.length) steps.push({ lines: joins, head: joins[0], flat: true });
      yStart = yMerge;
    }
    // Trunk, interrupted by the subsystem name halfway down.
    const half = labelEls[i].offsetHeight / 2 + LABEL_GAP;
    const yLabel = Math.round((yStart + yBranch) / 2);
    const upper = [cx, yStart, cx, yLabel - half];
    const lower = [cx, yLabel + half, cx, yBranch];
    steps.push({ lines: [upper], head: upper });
    steps.push({ lines: [], head: [cx, yLabel - half, cx, yLabel + half], label: i });
    steps.push({ lines: [lower], head: lower });
    labels.push({ x: cx, y: yLabel });
    const branch = [];
    if (Math.min(...xs) < cx) branch.push([cx, yBranch, Math.min(...xs), yBranch]);
    if (Math.max(...xs) > cx) branch.push([cx, yBranch, Math.max(...xs), yBranch]);
    if (branch.length) steps.push({ lines: branch, head: branch[branch.length - 1], flat: true });
    const lands = kids.map((k) => [k.x, yBranch, k.x, k.top]);
    steps.push({ lines: lands, head: lands[lands.length - 1], cards: i });
  });
  return { steps, labels, width: teamTree.clientWidth, height: teamTree.offsetHeight };
}

let treeLineEls = [];
// Re-measure and move lines/labels; the animations don't depend on geometry (lines use pathLength=1).
function layoutTree() {
  treeGeo = treeGeometry();
  const svg = teamTree.querySelector('.tree-lines');
  svg.setAttribute('width', treeGeo.width);
  svg.setAttribute('height', treeGeo.height);
  treeGeo.steps.flatMap((s) => s.lines).forEach(([x1, y1, x2, y2], i) => {
    const el = treeLineEls[i];
    if (!el) return;
    el.setAttribute('x1', x1); el.setAttribute('y1', y1);
    el.setAttribute('x2', x2); el.setAttribute('y2', y2);
  });
  teamTree.querySelectorAll('.tree-label').forEach((label, i) => {
    label.style.left = `${treeGeo.labels[i].x}px`;
    label.style.top = `${treeGeo.labels[i].y}px`;
  });
}

let treeTrigger = null;
function buildTree(year) {
  treeTrigger?.kill(true);
  teamTree.innerHTML = treeMarkup(year);

  const svg = teamTree.querySelector('.tree-lines');
  const head = teamTree.querySelector('.line-head');
  const rows = [...teamTree.querySelectorAll('.tree-row')];
  const labelEls = [...teamTree.querySelectorAll('.tree-label')];
  const geo = treeGeometry();
  treeLineEls = geo.steps.flatMap((s) => s.lines).map(() => {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('pathLength', '1');
    svg.appendChild(line);
    return line;
  });
  layoutTree();

  // Cards are revealed the way the rest of the site reveals things: the photo wipes open top-down
  // (like the MARK VI title), the text rises in after it.
  const cards = rows.flatMap((r) => [...r.children]);
  gsap.set(cards.map((c) => c.querySelector('.team-photo')), { clipPath: 'inset(0% 0% 100% 0%)' });
  gsap.set(cards.map((c) => c.querySelector('img')), { scale: 1.2 });
  gsap.set(cards.map((c) => c.querySelector('.team-meta')), { opacity: 0, y: 16 });
  gsap.set(labelEls, { opacity: 0, y: -6 });
  gsap.set(head, { opacity: 0 });

  // Durations follow line length at one speed for every direction, so the head moves at an even pace.
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
    .to(head, { opacity: 1, duration: 0.1 }, 0);
  let li = 0;
  geo.steps.forEach((step, si) => {
    const els = step.lines.map(() => treeLineEls[li++]);
    const [hx1, hy1, hx2, hy2] = step.head;
    const dur = Math.max(0.05, Math.hypot(hx2 - hx1, hy2 - hy1) / 400);
    const at = tl.duration();
    tl.fromTo(els, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur }, at)
      // The dot rides the head segment. Coordinates are read from the latest layout, so resizes keep it on the line.
      .fromTo(head,
        { x: () => treeGeo.steps[si].head[0], y: () => treeGeo.steps[si].head[1] },
        { x: () => treeGeo.steps[si].head[2], y: () => treeGeo.steps[si].head[3], duration: dur, immediateRender: si === 0 }, at);
    if (step.label != null) {
      tl.to(labelEls[step.label], { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, at);
    }
    if (step.cards != null) {
      rows[step.cards].querySelectorAll('.tree-card').forEach((card, k) => {
        const t = at + dur * 0.6 + k * 0.1;
        tl.to(card.querySelector('.team-photo'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut' }, t)
          .to(card.querySelector('img'), { scale: 1, duration: 1.2, ease: 'power2.out' }, t)
          .to(card.querySelector('.team-meta'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, t + 0.35);
      });
    }
  });

  treeTrigger = ScrollTrigger.create({
    animation: tl,
    trigger: teamTree,
    start: 'top 70%',
    end: 'bottom 75%',
    scrub: 0.6, // a touch of easing on top of Lenis so the drawing glides instead of tracking every wheel step
    invalidateOnRefresh: true,
  });
}

buildTree(team[0]);
ScrollTrigger.addEventListener('refreshInit', layoutTree);

// ====================================================================
// HISTORY (ARIES REVEAL) SCROLL
// ====================================================================
const historyTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#history",
    start: "top top",
    end: "+=800%",
    pin: true,
    scrub: 1,
  }
});

historyTl
  // Phase 1: Poem
  .set('#history-phase-1', { opacity: 1 })
  .fromTo('.poem-line',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 2.0, stagger: 2.0, ease: 'power2.out' }
  )
  .to({}, { duration: 3.0 }) // Hold
  .to('#history-phase-1', { opacity: 0, y: -40, duration: 2.0, ease: 'power2.in' })

  // Phase 2: Transition
  .to('#history-phase-2', { opacity: 1, y: -20, duration: 1.0, ease: 'power2.out' }, '+=0.5')
  .to({}, { duration: 1.0 }) // Hold
  .to('#history-phase-2', { opacity: 0, y: -40, duration: 1.0, ease: 'power2.in' })

  // Phase 3: ARIES title reveal
  .to('#history-phase-3', { opacity: 1, y: -20, duration: 1.5, ease: 'power3.out' }, '+=0.5')
  .to({}, { duration: 1.5 }) // Hold
  .to('#history', { opacity: 0, duration: 1.0, ease: 'power2.inOut' });

// Highlight the side-nav item for the section in the middle of the screen.
// Created after the pins above so pinned sections are measured with their pin spacers.
// A pinned section (or one inside a pinned wrapper, like #about) spans its whole pin spacer.
const navItems = [...document.querySelectorAll('.side-nav-item')];
const navTargets = navItems.map((item) => {
  const section = document.querySelector(item.getAttribute('href'));
  return section.closest('.pin-spacer') ?? section;
});
navItems.forEach((item, i) => {
  // Each item stays lit until the next item's section starts, so sections without their own item
  // (e.g. the rover view after ARIES) never leave the nav blank.
  const next = navTargets[i + 1];
  ScrollTrigger.create({
    trigger: navTargets[i],
    start: 'top center',
    endTrigger: next ?? navTargets[i],
    end: next ? 'top center' : 'bottom center',
    onToggle: (self) => item.setAttribute('aria-current', self.isActive),
  });
});

// ====================================================================
// CONTENT SECTIONS — reveal on scroll
// ====================================================================
// ====================================================================
// ARIES SIDE BAND — fades up out of its glow, then holds and turns one full lap: everything drifts right,
// and what leaves the right edge re-enters on the left.
// ====================================================================
gsap.timeline({
  defaults: { ease: 'power2.out' },
  scrollTrigger: { trigger: '.aries-band', start: 'top 85%', end: 'center 60%', scrub: true },
})
  .fromTo('.aries-side', { '--glow': 0 }, { '--glow': 1, duration: 1 }, 0)
  .fromTo('.aries-side img', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0);

// The track holds two identical sets (200% wide). Either set looks the same, so sliding from -50% to 0 is one
// seamless lap; wrap() keeps it in that range.
const wrapTrack = gsap.utils.wrap(-50, 0);
const ariesLap = { p: 0 };
gsap.set('.aries-track', { xPercent: -50 });
gsap.to(ariesLap, {
  p: 1,
  ease: 'none',
  onUpdate: () => gsap.set('.aries-track', { xPercent: wrapTrack(-50 + ariesLap.p * 50) }),
  scrollTrigger: { trigger: '.aries-band', start: 'center center', end: '+=140%', pin: true, scrub: true },
});

// ====================================================================
// ARIES CAMERA — the 3D model, held on screen while the scroll moves the camera around it:
//   front → front-right corner → up the diagonal to straight overhead (rover reads turned 45°)
//   → rover spins 180° → back down the same path (now facing the opposite corner) → round to the rear.
// three.js and the model load only when the section gets close.
// ====================================================================
const orbitState = { az: 0, el: 0, spin: 0 };
let orbit = null;
const orbitLabel = document.getElementById('aries-orbit-label');
const ORBIT_STAGES = [ // [timeline position, label]
  [0, 'Front'], [1, 'Front · right corner'], [2, 'Top'], [3.5, 'Rear · left corner'], [4.5, 'Rear'],
];
const orbitTl = gsap.timeline({
  defaults: { ease: 'power1.inOut' },
  onUpdate: () => {
    orbit?.render(orbitState);
    const t = orbitTl.time();
    const label = [...ORBIT_STAGES].reverse().find(([at]) => t >= at - 0.25)?.[1] ?? 'Front';
    if (orbitLabel.textContent !== label) orbitLabel.textContent = label;
  },
})
  .fromTo('.aries-orbit-canvas', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
  .fromTo('.aries-orbit-glow', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0)
  .to(orbitState, { az: -45, duration: 1 }, 0.5)       // front → front-right corner
  .to(orbitState, { el: 90, duration: 1 }, 1.5)        // up the diagonal to overhead
  .to(orbitState, { spin: 180, duration: 1 }, 2.5)     // rover turns half a lap beneath the camera
  .to(orbitState, { el: 0, duration: 1 }, 3.5)         // back down the same path: the opposite corner
  .to(orbitState, { az: 0, duration: 1 }, 4.5)         // round to face the rear
  .to({}, { duration: 0.3 });                          // a beat on the rear view before moving on

ScrollTrigger.create({
  animation: orbitTl,
  trigger: '#aries-orbit',
  start: 'top top',
  end: '+=500%',
  pin: true,
  scrub: true,
});

new IntersectionObserver((entries, observer) => {
  if (!entries[0].isIntersecting) return;
  observer.disconnect();
  import('./aries-orbit.js')
    .then(({ mountAriesOrbit }) => {
      orbit = mountAriesOrbit(document.getElementById('aries-orbit-canvas'), asset('athena.glb'));
      orbit.render(orbitState);
    })
    .catch(() => document.getElementById('aries-orbit').classList.add('is-unavailable')); // e.g. no WebGL
}, { rootMargin: '150% 0px' }).observe(document.getElementById('aries-orbit'));

// The pins above are created after triggers further down the page (Contact's nav item and reveals); re-order
// them by page position so those are measured after the pins and include their extra scroll distance.
ScrollTrigger.sort();

// Front, side, rear and top: static, each rising out of its glow
gsap.utils.toArray('.aries-view').forEach((view, i) => {
  gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: { trigger: '.aries-views', start: 'top 90%', end: 'top 40%', scrub: true },
  })
    .fromTo(view, { '--glow': 0 }, { '--glow': 1, duration: 1 }, i * 0.15)
    .fromTo(view.querySelector('img'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, i * 0.15)
    .fromTo(view.querySelector('figcaption'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.5 + i * 0.15);
});

// ====================================================================
// SCROLLBAR — a long, thin triangle on the right edge. Its base is the screen edge and its apex
// follows the scroll position, held back from the very top and bottom so it's never right-angled.
// Faint strands run from the apex to drifting points on the edge, like the About web.
// ====================================================================
const triCanvas = document.getElementById('scroll-tri');
const triCtx = triCanvas.getContext('2d');
const TRI_REACH = 16;   // px the apex reaches in from the edge: long and thin
const TRI_INSET = 0.06; // apex range starts/ends this fraction of the height in from top/bottom
const triStrands = Array.from({ length: 9 }, () => ({
  y: Math.random(), drift: 0.02 + Math.random() * 0.04, speed: 0.2 + Math.random() * 0.4, phase: Math.random() * 6.3,
}));
let triW = 0;
let triH = 0;
let triDpr = 0;

const scrollMax = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

function drawScrollTri(time) {
  const w = triCanvas.clientWidth;
  const h = triCanvas.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (w !== triW || h !== triH || dpr !== triDpr) {
    triW = w; triH = h; triDpr = dpr;
    triCanvas.width = Math.round(w * dpr);
    triCanvas.height = Math.round(h * dpr);
    triCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  triCtx.clearRect(0, 0, w, h);
  if (!w || !h) return;

  const max = scrollMax();
  const p = max > 0 ? gsap.utils.clamp(0, 1, window.scrollY / max) : 0;
  const ax = w - TRI_REACH;
  const ay = h * (TRI_INSET + p * (1 - 2 * TRI_INSET));

  triCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  triCtx.beginPath();
  triCtx.moveTo(w, 0);
  triCtx.lineTo(ax, ay);
  triCtx.lineTo(w, h);
  triCtx.closePath();
  triCtx.fill();

  triCtx.lineWidth = 1;
  triStrands.forEach((s) => {
    const y = h * gsap.utils.clamp(0, 1, s.y + Math.sin(time * s.speed + s.phase) * s.drift);
    const near = 1 - Math.abs(y - ay) / h;
    triCtx.strokeStyle = `rgba(255, 255, 255, ${0.05 + 0.3 * near * near})`;
    triCtx.beginPath();
    triCtx.moveTo(ax, ay);
    triCtx.lineTo(w, y);
    triCtx.stroke();
  });

  triCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  triCtx.beginPath();
  triCtx.moveTo(w, 0);
  triCtx.lineTo(ax, ay);
  triCtx.lineTo(w, h);
  triCtx.stroke();

  // Same head dot as the line tips elsewhere: small square, soft glow
  triCtx.save();
  triCtx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  triCtx.shadowBlur = 6;
  triCtx.fillStyle = '#fff';
  triCtx.fillRect(ax - 2, ay - 2, 4, 4);
  triCtx.restore();
}
gsap.ticker.add(drawScrollTri);

// It still works as a scrollbar: click to jump, drag to scrub.
function scrollFromPointer(e, immediate) {
  const rect = triCanvas.getBoundingClientRect();
  const t = gsap.utils.clamp(0, 1, ((e.clientY - rect.top) / rect.height - TRI_INSET) / (1 - 2 * TRI_INSET));
  lenis.scrollTo(t * scrollMax(), immediate ? { immediate: true } : { duration: 1 });
}
triCanvas.addEventListener('pointerdown', (e) => {
  triCanvas.setPointerCapture(e.pointerId);
  scrollFromPointer(e, false);
});
triCanvas.addEventListener('pointermove', (e) => {
  if (triCanvas.hasPointerCapture(e.pointerId)) scrollFromPointer(e, true);
});

// ====================================================================
// NEBULAE — soft blue/purple glows that surface somewhere random, linger, and fade
// ====================================================================
gsap.utils.toArray('.nebula').forEach((el, i) => {
  const drift = () => {
    const size = gsap.utils.random(40, 70); // vmax
    gsap.set(el, {
      width: `${size}vmax`, height: `${size * 0.6}vmax`,
      left: `${gsap.utils.random(-10, 70)}%`, top: `${gsap.utils.random(-10, 70)}%`,
      rotate: gsap.utils.random(-40, 40), opacity: 0, scale: 0.9,
    });
    gsap.timeline({ onComplete: drift })
      .to(el, { opacity: gsap.utils.random(0.5, 0.9), scale: 1, duration: gsap.utils.random(5, 8), ease: 'sine.inOut' })
      .to(el, { opacity: 0, scale: 1.08, duration: gsap.utils.random(5, 8), ease: 'sine.inOut' }, '+=' + gsap.utils.random(2, 5))
      .to({}, { duration: gsap.utils.random(2, 6) }); // gap before it surfaces elsewhere
  };
  gsap.delayedCall(i * 7 + 2, drift);
});

// ====================================================================
// GALLERY — a grid behind the media, drifting slower than the photos moving over it
// ====================================================================
const mediaSection = document.getElementById('media');
gsap.fromTo('.media-grid-bg', { y: 0 }, {
  y: () => mediaSection.offsetHeight * 0.25, // the grid lags behind the scroll: content slides across it
  ease: 'none',
  scrollTrigger: { trigger: mediaSection, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
});

// Photo columns travel at different speeds: every column starts pushed down and ends pushed up, and the fast
// ones by much more, so they rain into view late and out of view early, sliding across the grid behind.
const photoItems = gsap.utils.toArray('.photo-item');
const COLUMN_SHIFT = [120, 420, 220, 560, 300]; // px each column starts below (and ends above) its place
function photoColumn(el) {
  const lefts = [...new Set(photoItems.map((p) => p.offsetLeft))].sort((a, b) => a - b);
  return lefts.indexOf(el.offsetLeft);
}
photoItems.forEach((item) => {
  gsap.fromTo(item, { y: () => COLUMN_SHIFT[photoColumn(item) % COLUMN_SHIFT.length] }, {
    y: () => -COLUMN_SHIFT[photoColumn(item) % COLUMN_SHIFT.length],
    ease: 'none',
    scrollTrigger: { trigger: '.photo-grid', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
  });
});

// Every video and photo grows into place from its top-left corner: a small square frame appears there, opens
// to the right, then down, revealing the image through it. The image itself never scales; only the window grows.
// --wx/--wy (1 → 0) close/open the window, --go fades its outline (see .grow in style.css).
const growEls = gsap.utils.toArray('.grow');
gsap.set(growEls, { '--wx': 1, '--wy': 1, '--go': 0 });
growEls.forEach((el) => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
    .to(el, { '--go': 1, duration: 0.08, ease: 'none' })
    .to(el, { '--wx': 0, duration: 0.32 })
    .to(el, { '--wy': 0, duration: 0.32 }, '-=0.14')
    .to(el, { '--go': 0, duration: 0.25, ease: 'none' }, '-=0.05');
  const play = el.querySelector('.video-play');
  if (play) tl.fromTo(play, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, '-=0.2');
  const caption = el.closest('figure')?.querySelector('figcaption');
  if (caption) tl.fromTo(caption, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.25');
  el.growTl = tl;
});
// Watched with an IntersectionObserver rather than ScrollTrigger: it sees where the photo actually is,
// including the raining offset. Plays on the way in; reverses only when the item drops back out the bottom.
const growObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting, boundingClientRect, rootBounds }) => {
    if (isIntersecting) target.growTl.play();
    else if (rootBounds && boundingClientRect.top > rootBounds.bottom) target.growTl.reverse();
  });
}, { rootMargin: '0px 0px -8% 0px' });
growEls.forEach((el) => growObserver.observe(el));

// Section subheadings scramble in the same way as "who are we?" in About, every time they scroll into view.
// Created after the pinned sections so their trigger points include the pin spacing (created earlier,
// they fired thousands of pixels too soon and the scramble was never seen).
gsap.utils.toArray('.section-label.glitch').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    onEnter: () => gsap.delayedCall(0.35, glitch, [el]),
    onEnterBack: () => glitch(el),
  });
});

gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
});

// ====================================================================
// TEAM TABS
// ====================================================================
document.querySelector('.team-tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.team-tab');
  if (!tab || tab.classList.contains('is-active')) return;
  document.querySelectorAll('.team-tab').forEach((t) => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', active);
  });
  const year = team.find((y) => y.id === tab.dataset.year);
  gsap.to(teamTree, {
    opacity: 0, duration: 0.2, onComplete: () => {
      buildTree(year);
      gsap.set(teamTree, { opacity: 1 });
      // Tree height changes between years; keep trigger order by page position and re-measure.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    },
  });
});

// ====================================================================
// VIDEOS — load the YouTube iframe only when clicked
// ====================================================================
document.querySelector('.video-grid').addEventListener('click', (e) => {
  const btn = e.target.closest('.video-frame');
  if (!btn) return;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.video}?autoplay=1`;
  iframe.title = btn.getAttribute('aria-label');
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  btn.replaceWith(iframe);
});

// ====================================================================
// IN-PAGE LINKS — smooth-scroll through Lenis
// ====================================================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  let target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  let offset = 0;
  if (target.id === 'about') {
    target = document.getElementById('experience-wrapper');
    offset = window.innerHeight * 0.6; // land once the About text has faded in
  }
  // Pinned sections: scroll to the spacer, which sits where the section's scroll range starts.
  if (target.parentElement.classList.contains('pin-spacer')) target = target.parentElement;
  lenis.scrollTo(target, { offset, duration: 1.4 });
});

// ====================================================================
// LIGHTBOX
// ====================================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let lightboxIndex = 0;
let lightboxReturnFocus = null;

function showPhoto(i) {
  lightboxIndex = (i + gallery.length) % gallery.length;
  const g = gallery[lightboxIndex];
  lightboxImg.src = asset(g.src);
  lightboxImg.alt = g.alt;
  lightboxCaption.textContent = `${String(lightboxIndex + 1).padStart(2, '0')} / ${gallery.length} — ${g.alt}`;
}

function openLightbox(i) {
  lightboxReturnFocus = document.activeElement;
  showPhoto(i);
  lightbox.hidden = false;
  document.body.classList.add('no-scroll');
  lenis.stop();
  gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  gsap.to(lightbox, {
    opacity: 0, duration: 0.2, onComplete: () => {
      lightbox.hidden = true;
      document.body.classList.remove('no-scroll');
      lenis.start();
      lightboxReturnFocus?.focus();
    },
  });
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-lightbox]');
  if (trigger) openLightbox(Number(trigger.dataset.lightbox));
});

lightbox.addEventListener('click', (e) => {
  const action = e.target.closest('[data-lb]')?.dataset.lb;
  if (action === 'close' || e.target === lightbox) closeLightbox();
  else if (action === 'prev') showPhoto(lightboxIndex - 1);
  else if (action === 'next') showPhoto(lightboxIndex + 1);
});

document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') showPhoto(lightboxIndex - 1);
  else if (e.key === 'ArrowRight') showPhoto(lightboxIndex + 1);
});

// Lazy images in the content sections change page height as they load.
window.addEventListener('load', () => ScrollTrigger.refresh());

// ====================================================================
// HMR Cleanup
// ====================================================================
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.globalTimeline.clear();
  });
}
