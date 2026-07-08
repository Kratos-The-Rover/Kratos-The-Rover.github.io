import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import roverImg from './assets/group3.png';
import logoImg from './assets/kratos-logo.png';

gsap.registerPlugin(ScrollTrigger);

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

  <!-- Inductions Radial Galaxy Bloom -->
  <div class="galaxy-radial" id="galaxy-radial">
    <div class="galaxy-radial-core"></div>
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
      <a href="#" class="side-nav-item">
        <span>MARK VI</span>
        <span class="side-nav-line"></span>
        <span class="side-nav-dot"></span>
      </a>
      <a href="#about" class="side-nav-item">
        <span>ABOUT US</span>
        <span class="side-nav-line"></span>
        <span class="side-nav-dot"></span>
      </a>
      <a href="#" class="side-nav-item">
        <span>INDUCTIONS</span>
        <span class="side-nav-line"></span>
        <span class="side-nav-dot"></span>
      </a>
      <a href="#" class="side-nav-item">
        <span>HISTORY</span>
        <span class="side-nav-line"></span>
        <span class="side-nav-dot"></span>
      </a>
      <a href="#contact" class="side-nav-item">
        <span>MORE</span>
        <span class="side-nav-line"></span>
        <span class="side-nav-dot"></span>
      </a>
    </div>
  </section>

  <!-- Unified Experience Wrapper -->
  <div class="experience-wrapper" id="experience-wrapper">
    <!-- About Section -->
    <section class="about-section" id="about">
      <p class="about-label" id="about-label">who are we?</p>
      <h2 class="about-title" id="about-title">ABOUT US</h2>
      <p class="about-text" id="about-text-1">
        Project Kratos is the Man, Project Kratos is the brand. Project Kratos is the king of all smart
        peoples. We love Project Kratos. I will name my first born child Project Kratos.
      </p>
      <p class="about-text" id="about-text-2">
        Please love Project Kratos with us. We will do satanic rituals together in the name of project kratos. I love
        love loley project kratos.
      </p>
    </section>

    <!-- Gallery -->
    <section class="gallery-section" id="gallery">
      <div class="gallery-track" id="gallery-track">
        <div class="gallery-card"></div>
        <div class="gallery-card"></div>
        <div class="gallery-card"></div>
        <div class="gallery-card"></div>
        <div class="gallery-card"></div>
        <div class="gallery-card"></div>
      </div>
    </section>
  </div>

  <!-- Inductions Section -->
  <section class="inductions-section" id="inductions">
    <p class="inductions-label" id="inductions-label">Like what we do?</p>
    <h2 class="inductions-title" id="inductions-title">INDUCTIONS</h2>
    <p class="inductions-text" id="inductions-text-1">
      We are actively looking for high-caliber individuals to join the core engineering and design teams.
      Project Kratos demands excellence and rewards it with unparalleled hands-on experience in advanced robotics.
    </p>
    <button class="hero-btn" id="openings-btn">OPENINGS</button>
  </section>

  <!-- History Section (ZELOS Reveal) -->
  <section class="history-section" id="history">
    <div class="history-phase" id="history-phase-1">
      <div class="history-poem">
        <div class="poem-line">Every prophecy has it's final verse,</div>
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

  <!-- Footer -->
  <footer class="footer" id="contact">
    <span class="footer-text">© 2026 BITS Goa — Project Kratos</span>
    <span class="footer-brand">KRATOS</span>
  </footer>
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

const interactives = document.querySelectorAll('a, button');
interactives.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
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
const heroGrid = document.getElementById('hero-grid');

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
// ROVER
// ====================================================================
const roverWrapper = document.getElementById('hero-rover-wrapper');

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

function getScrollAmount() {
  let trackWidth = galleryTrack.scrollWidth;
  return -(trackWidth - window.innerWidth / 2 + 80); // Include right padding buffer, account for 50% width container
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
// INDUCTIONS SCROLL
// ====================================================================
const inductionsTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#inductions",
    start: "top top",
    end: "+=300%",
    pin: true,
    scrub: 1,
    onEnter: () => {
      gsap.fromTo('#inductions-label',
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

      // Trigger the radial galaxy bloom and make it dissipate
      gsap.fromTo('#galaxy-radial',
        { scale: 0, opacity: 0.4 },
        { scale: 2, opacity: 0, duration: 10.0, ease: 'power2.out', overwrite: 'auto' }
      );
    },
    onLeaveBack: () => {
      gsap.set('#inductions-label', { opacity: 0 });
      gsap.set('#galaxy-radial', { opacity: 0 });
    }
  }
});

inductionsTl
  .from('#inductions-title', { y: 80, opacity: 0, duration: 0.4 })
  .from('#inductions-text-1', { y: 30, opacity: 0, duration: 0.2 }, '-=0.2')
  .from('#openings-btn', { y: 30, opacity: 0, duration: 0.2 }, '-=0.1')
  .to({}, { duration: 1.0 }) // Hold on screen
  .to('#inductions-label', {
    keyframes: [
      { opacity: 0, duration: 0.05 },
      { opacity: 1, duration: 0.05 },
      { opacity: 0, duration: 0.05 },
      { opacity: 1, duration: 0.05 },
      { opacity: 0, duration: 0.05 }
    ],
    duration: 0.4
  })
  .to('#inductions-title', { y: -50, opacity: 0, duration: 0.4 }, '-=0.2')
  .to('#inductions-text-1', { y: -30, opacity: 0, duration: 0.2 }, '-=0.2')
  .to('#openings-btn', { y: -30, opacity: 0, duration: 0.2 }, '-=0.1');


// ====================================================================
// HISTORY (ZELOS REVEAL) SCROLL
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

  // Phase 3: ZELOS Title Reveal
  .to('#history-phase-3', { opacity: 1, y: -20, duration: 1.5, ease: 'power3.out' }, '+=0.5')
  .to({}, { duration: 1.5 }) // Hold
  .to('#history', { opacity: 0, duration: 1.0, ease: 'power2.inOut' });

// ====================================================================
// HMR Cleanup
// ====================================================================
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.globalTimeline.clear();
  });
}
