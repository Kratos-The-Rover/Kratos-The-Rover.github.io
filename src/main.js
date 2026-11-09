import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import roverImg from './assets/group3.png';
import logoImg from './assets/kratos-logo.png';
import { about, stats, competitions, videos, contact } from './data/site.js';
import { team } from './data/team.js';
import { gallery } from './data/gallery.js';

gsap.registerPlugin(ScrollTrigger);

// Files in /public are served from the site root (respects Vite's `base`).
const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const GALLERY_STRIP_COUNT = 8;

const arrow = `<svg class="ext-arrow" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3 2h5v5" fill="none" stroke="currentColor" stroke-width="1"/></svg>`;

function teamCards(year) {
  return year.members.map((m) => `
    <article class="team-card">
      <div class="team-photo">
        <img src="${asset(m.img)}" alt="${m.name}" loading="lazy" width="640" height="640" />
      </div>
      <div class="team-meta">
        <h3 class="team-name">${m.name}</h3>
        <p class="team-role">${m.role}</p>
        ${m.linkedin ? `<a class="team-link" href="${m.linkedin}" target="_blank" rel="noopener">LinkedIn ${arrow}</a>` : ''}
      </div>
    </article>`).join('');
}

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

  <!-- Star noise background -->
  <canvas class="stars-canvas" id="stars-canvas"></canvas>

  <!-- Galaxy Slash Opening Animation -->
  <div class="galaxy-slash" id="galaxy-slash">
    <div class="galaxy-core"></div>
  </div>

  <!-- Crosshair Cursor -->
  <div class="crosshair-h" id="crosshair-h"></div>
  <div class="crosshair-v" id="crosshair-v"></div>
  <div class="crosshair-square" id="crosshair-sq"></div>

  <!-- Navigation -->
  <nav class="nav" id="main-nav">
    <div class="nav-inner">
      <div class="nav-logo-group">
        <div class="nav-logo-icon">
          <img src="${logoImg}" alt="Kratos Logo" />
        </div>
        <div class="nav-logo-text">
          <span class="nav-logo-bits">BITS GOA</span>
          <span class="nav-logo-project">PROJECT<br/>KRATOS</span>
        </div>
      </div>
      <ul class="nav-links">
        <li><a href="#hero">HOME</a></li>
        <li><a href="#about">ABOUT US</a></li>
        <li><a href="#team">TEAM</a></li>
        <li><a href="#media">GALLERY</a></li>
        <li><a href="#contact">CONTACT</a></li>
      </ul>
    </div>
  </nav>

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

    <!-- Side Navigation -->
    <div class="side-nav" id="side-nav">
      ${[
        ['#hero', 'MARK VI'],
        ['#about', 'ABOUT US'],
        ['#competitions', 'COMPETITIONS'],
        ['#team', 'TEAM'],
        ['#history', 'HISTORY'],
        ['#contact', 'CONTACT'],
      ].map(([href, label]) => `
      <a href="${href}" class="side-nav-item">
        <span>${label}</span>
        <span class="side-nav-line"></span>
        <span class="side-nav-dot"></span>
      </a>`).join('')}
    </div>
  </section>

  <!-- Unified Experience Wrapper -->
  <div class="experience-wrapper" id="experience-wrapper">
    <!-- About Section -->
    <section class="about-section" id="about">
      <p class="about-label" id="about-label">who are we?</p>
      <h2 class="about-title" id="about-title">ABOUT US</h2>
      ${about.map((p, i) => `<p class="about-text" id="about-text-${i + 1}">${p}</p>`).join('')}
    </section>

    <!-- Gallery strip (highlights) -->
    <section class="gallery-section" id="gallery">
      <div class="gallery-track" id="gallery-track">
        ${gallery.slice(0, GALLERY_STRIP_COUNT).map((g, i) => `
        <button class="gallery-card" data-lightbox="${i}" aria-label="Open photo: ${g.alt}">
          <img src="${asset(g.src)}" alt="${g.alt}" />
        </button>`).join('')}
      </div>
    </section>
  </div>

  <!-- Competitions -->
  <section class="competitions-section" id="competitions">
    <div class="section-head reveal">
      <p class="section-label">where we compete</p>
      <h2 class="section-title">COMPETITIONS</h2>
    </div>
    <div class="stats-row reveal">
      ${stats.map((s) => `
      <div class="stat">
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>`).join('')}
    </div>
    <div class="comp-grid">
      ${competitions.map((c, i) => `
      <article class="comp-card reveal">
        <div class="comp-head">
          <span class="comp-index">0${i + 1}</span>
          <span class="comp-code">${c.code}</span>
        </div>
        <h3 class="comp-name">${c.name}</h3>
        ${c.body.map((p) => `<p class="comp-text">${p}</p>`).join('')}
        <ul class="comp-tags">${c.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
      </article>`).join('')}
    </div>
  </section>

  <!-- Team -->
  <section class="team-section" id="team">
    <div class="section-head reveal">
      <p class="section-label">the people behind the rover</p>
      <h2 class="section-title">THE TEAM</h2>
    </div>
    <div class="team-tabs reveal" role="tablist" aria-label="Team by year">
      ${team.map((y, i) => `
      <button class="team-tab${i === 0 ? ' is-active' : ''}" role="tab" aria-selected="${i === 0}" data-year="${y.id}">
        ${i === 0 ? 'Current' : y.label.replace('AY ', '')}
      </button>`).join('')}
    </div>
    <div class="team-grid" id="team-grid" role="tabpanel">${teamCards(team[0])}</div>
  </section>

  <!-- Media: videos + full gallery -->
  <section class="media-section" id="media">
    <div class="section-head reveal">
      <p class="section-label">see it in action</p>
      <h2 class="section-title">GALLERY</h2>
    </div>
    <div class="video-grid">
      ${videos.map((v, i) => `
      <figure class="video-card reveal${i === 0 ? ' video-card--feature' : ''}">
        <button class="video-frame" data-video="${v.id}" aria-label="Play: ${v.title}, ${v.event}">
          <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" />
          <span class="video-play" aria-hidden="true"></span>
        </button>
        <figcaption><span class="video-event">${v.event}</span>${v.title}</figcaption>
      </figure>`).join('')}
    </div>
    <div class="photo-grid">
      ${gallery.map((g, i) => `
      <button class="photo-item" data-lightbox="${i}" aria-label="Open photo: ${g.alt}">
        <img src="${asset(g.src)}" alt="${g.alt}" loading="lazy" width="${g.w}" height="${g.h}" />
      </button>`).join('')}
    </div>
  </section>

  <!-- History Section (ARIES reveal) -->
  <section class="history-section" id="history">
    <div class="history-phase" id="history-phase-1">
      <div class="history-poem">
        <div class="poem-line">Every prophecy has its final verse,</div>
        <div class="poem-line">Every myth dies when the gods stop fighting</div>
        <div class="poem-line">But we gave our myth a weapon</div>
      </div>
    </div>
    <div class="history-phase" id="history-phase-2">
      <p class="history-transition">meet the upgrade.</p>
    </div>
    <div class="history-phase" id="history-phase-3">
      <p class="history-title-small">Project Kratos</p>
      <h2 class="history-title-large">ARIES</h2>
    </div>
  </section>

  <!-- Contact -->
  <section class="contact-section" id="contact">
    <div class="section-head reveal">
      <p class="section-label">want to know more?</p>
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

function drawStars(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const star of stars) {
    // Stars cover the top half entirely, then fade out linearly in the bottom half
    let spatialFade = 1;
    if (star.y > canvas.height * 0.5) {
      spatialFade = Math.max(0, 1 - (star.y - canvas.height * 0.5) / (canvas.height * 0.5));
    }

    if (spatialFade <= 0) continue;

    const cycle = Math.sin(time * star.fadeSpeed + star.fadeOffset);
    const twinkle = cycle * 0.5 + 0.5;
    const alpha = star.baseOpacity * spatialFade * twinkle;

    if (alpha < 0.005) continue;

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(star.x, star.y, star.size * 2, star.size * 2);
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
  currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
  currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

  gl.uniform2f(mouseLoc, currentMouse.x, currentMouse.y);
  gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000.0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
render();

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
        if (progress > i / finalString.length) {
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
  .from('.nav-links li', { y: -10, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '1.0')
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
// SCROLL-TRIGGERED EFFECTS
// ====================================================================

// Hero Scroll-Pin Fade Out
const heroScrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '+=250%',
    pin: true,
    scrub: 1,
  }
});

heroScrollTl
  .to({}, { duration: 0.5 }) // "stay for a bit"
  .to(['#hero-content', '#hero-graphics', '#smoke-canvas', '#side-nav'], {
    opacity: 0,
    y: -50,
    duration: 1,
    stagger: 0.1,
    ease: 'power2.inOut'
  });

// ====================================================================
// UNIFIED EXPERIENCE SCROLL
// ====================================================================
const galleryTrack = document.getElementById('gallery-track');

// Slide the strip until its last card is in view; the track's own padding is the end margin.
// Measured from the strip's container, which is half the screen on desktop and full width on phones.
function getScrollAmount() {
  return -(galleryTrack.scrollWidth - galleryTrack.parentElement.clientWidth);
}

const experienceTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#experience-wrapper",
    start: "top top",
    end: () => `+=${Math.abs(getScrollAmount()) + window.innerHeight * 2.5}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onEnter: () => {
      gsap.fromTo('#about-label',
        { opacity: 0 },
        {
          keyframes: [
            { opacity: 1, duration: 0.05 },
            { opacity: 0, duration: 0.1 },
            { opacity: 1, duration: 0.05 },
            { opacity: 0, duration: 0.1 },
            { opacity: 1, duration: 0.05 }
          ],
          duration: 0.4,
          overwrite: "auto"
        }
      );
    },
    onLeaveBack: () => gsap.set('#about-label', { opacity: 0 })
  }
});

experienceTl
  .from('#about-title', { y: 80, opacity: 0, duration: 0.4 })
  .from('#about-text-1', { y: 30, opacity: 0, duration: 0.2 }, '-=0.2')
  .from('#about-text-2', { y: 30, opacity: 0, duration: 0.2 }, '-=0.1')
  .to({}, { duration: 1.0 }) // Hold text on screen for a bit
  .to(galleryTrack, { x: getScrollAmount, duration: 1.5, ease: 'none' })
  .to('#about-label', {
    keyframes: [
      { opacity: 0, duration: 0.05 },
      { opacity: 1, duration: 0.05 },
      { opacity: 0, duration: 0.05 },
      { opacity: 1, duration: 0.05 },
      { opacity: 0, duration: 0.05 }
    ],
    duration: 0.4
  })
  .to('#about-title', { y: -50, opacity: 0, duration: 0.4 }, '-=0.2')
  .to('#about-text-1', { y: -30, opacity: 0, duration: 0.2 }, '-=0.2')
  .to('#about-text-2', { y: -30, opacity: 0, duration: 0.2 }, '-=0.1')
  .to('.gallery-section', { opacity: 0, duration: 0.4 }, '<');


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

// Solid nav once the hero has scrolled away
ScrollTrigger.create({
  start: () => window.innerHeight * 0.5,
  onToggle: (self) => document.getElementById('main-nav').classList.toggle('is-scrolled', self.isActive),
});

// ====================================================================
// CONTENT SECTIONS — reveal on scroll
// ====================================================================
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
});

function revealTeamCards() {
  gsap.fromTo('#team-grid .team-card',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', overwrite: true });
}
ScrollTrigger.create({ trigger: '#team-grid', start: 'top 85%', once: true, onEnter: revealTeamCards });
gsap.set('#team-grid .team-card', { opacity: 0 });

// ====================================================================
// TEAM TABS
// ====================================================================
const teamGrid = document.getElementById('team-grid');
document.querySelector('.team-tabs').addEventListener('click', (e) => {
  const tab = e.target.closest('.team-tab');
  if (!tab || tab.classList.contains('is-active')) return;
  document.querySelectorAll('.team-tab').forEach((t) => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', active);
  });
  const year = team.find((y) => y.id === tab.dataset.year);
  gsap.to(teamGrid, {
    opacity: 0, duration: 0.2, onComplete: () => {
      teamGrid.innerHTML = teamCards(year);
      gsap.set(teamGrid, { opacity: 1 });
      revealTeamCards();
      // Grid height can change between years; pinned sections below need fresh offsets.
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
  gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  gsap.to(lightbox, {
    opacity: 0, duration: 0.2, onComplete: () => {
      lightbox.hidden = true;
      document.body.classList.remove('no-scroll');
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
