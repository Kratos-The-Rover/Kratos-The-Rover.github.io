import { gsap } from 'gsap';

const STAR_COUNT = 1000;
const PARALLAX = 0.15;
const SHOOTER_INTERVAL = [6000, 7000];

export const starsTemplate = () => '<canvas class="stars-canvas" id="stars-canvas"></canvas>';

const random = (min, max) => min + Math.random() * (max - min);

function createStar(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: random(0.1, 0.5),
    opacity: random(0.2, 0.8),
    speed: random(0.0005, 0.0025),
    phase: Math.random() * Math.PI * 2,
  };
}

function createShooter(width, height, time) {
  const angle = (Math.PI / 180) * random(20, 45);
  const speed = random(0.9, 1.5);
  return {
    x: Math.random() * width * 0.8,
    y: Math.random() * height * 0.5,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    born: time,
    life: random(500, 900),
    tail: random(70, 130),
  };
}

export function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  const stars = [];
  const shooters = [];
  let nextShooter = 3000;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  for (let i = 0; i < STAR_COUNT; i++) stars.push(createStar(canvas.width, canvas.height));

  window.addEventListener('resize', () => {
    resize();
    stars.forEach((star) => Object.assign(star, { x: Math.random() * canvas.width, y: Math.random() * canvas.height }));
  });

  function drawShooters(time) {
    if (time > nextShooter) {
      shooters.push(createShooter(canvas.width, canvas.height, time));
      nextShooter = time + random(...SHOOTER_INTERVAL);
    }
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      const age = time - s.born;
      if (age > s.life) {
        shooters.splice(i, 1);
        continue;
      }
      const fade = Math.sin((age / s.life) * Math.PI);
      const headX = s.x + s.dx * age;
      const headY = s.y + s.dy * age;
      const length = Math.hypot(s.dx, s.dy);
      const tailX = headX - (s.dx / length) * s.tail;
      const tailY = headY - (s.dy / length) * s.tail;
      const gradient = ctx.createLinearGradient(headX, headY, tailX, tailY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.45 * fade})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShooters(time);

    const drift = window.scrollY * PARALLAX;
    for (const star of stars) {
      const alpha = star.opacity * (Math.sin(time * star.speed + star.phase) * 0.5 + 0.5);
      if (alpha < 0.005) continue;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(star.x, gsap.utils.wrap(0, canvas.height, star.y - drift), star.size * 2, star.size * 2);
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
