import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import team from '../data/team.json';
import { arrowIcon, asset, list, offsetWithin } from '../core/dom.js';
import { addWebTargets } from '../effects/web-layer.js';

const TIERS = ['Management', 'Mechanical', 'Electronics', 'Power', 'Life Detection & Controls', 'Autonomous', 'Communication'];
const TIER_MATCHERS = [
  [/communication/i, 6],
  [/power/i, 3],
  [/team lead|vice|operations|creative/i, 0],
  [/mechanical|arm/i, 1],
  [/electronics/i, 2],
  [/autonomous/i, 5],
];
const LIFE_DETECTION_AND_CONTROLS = 4;
const BRANCH_ABOVE = 36;
const MERGE_BELOW = 24;
const DROP_OFFSET = 12;
const LABEL_GAP = 10;
const DRAW_SPEED = 400;
const SVG_NS = 'http://www.w3.org/2000/svg';

const tierOf = (role) => TIER_MATCHERS.find(([pattern]) => pattern.test(role))?.[1] ?? LIFE_DETECTION_AND_CONTROLS;

const memberCard = ({ name, role, img, linkedin }) => `
    <article class="team-card tree-card">
      <div class="team-photo">
        <img src="${asset(img)}" alt="${name}" loading="lazy" width="640" height="640" />
      </div>
      <div class="team-meta">
        <h3 class="team-name">${name}</h3>
        <p class="team-role">${role}</p>
        ${linkedin ? `<a class="team-link" href="${linkedin}" target="_blank" rel="noopener">LinkedIn ${arrowIcon}</a>` : ''}
      </div>
    </article>`;

function treeTemplate(year) {
  const tiers = TIERS.map((name) => ({ name, members: [] }));
  year.members.forEach((member) => tiers[tierOf(member.role)].members.push(member));
  const rows = list(tiers.filter(({ members }) => members.length), ({ name, members }) => `
      <p class="comp-kicker tree-label">${name}</p>
      <div class="tree-row" aria-label="${name}">${list(members, memberCard)}</div>`);
  return `<svg class="tree-lines" aria-hidden="true"></svg><span class="line-head" aria-hidden="true"></span>${rows}`;
}

export const teamTemplate = () => `
  <section class="team-section" id="team">
    <div class="section-head reveal">
      <p class="section-label glitch" data-text="the people behind the rover">the people behind the rover</p>
      <h2 class="section-title">THE TEAM</h2>
    </div>
    <div class="team-tabs reveal" role="tablist" aria-label="Team by year">
      ${list(team, ({ id, label }, i) => `
      <button class="team-tab${i === 0 ? ' is-active' : ''}" role="tab" aria-selected="${i === 0}" data-year="${id}">
        ${i === 0 ? 'Current' : label.replace('AY ', '')}
      </button>`)}
    </div>
    <div class="team-tree" id="team-tree" role="tabpanel"></div>
  </section>`;

const segmentLength = ([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1);

function spread(xs, centre, y, towardsCentre) {
  const ends = [Math.min(...xs), Math.max(...xs)].filter((x, i) => (i === 0 ? x < centre : x > centre));
  return ends.map((x) => (towardsCentre ? [x, y, centre, y] : [centre, y, x, y]));
}

function measureTree(tree) {
  const rows = [...tree.querySelectorAll('.tree-row')];
  const labels = [...tree.querySelectorAll('.tree-label')];
  const centre = Math.round(tree.clientWidth / 2);
  const tiers = rows.map((row) => [...row.children].map((card) => {
    const offset = offsetWithin(card, tree);
    return { x: Math.round(offset.x + card.offsetWidth / 2), top: offset.y, bottom: offset.y + card.offsetHeight };
  }));

  const steps = [];
  const labelPositions = [];
  let trunkTop = 0;

  tiers.forEach((cards, i) => {
    const xs = cards.map(({ x }) => x);
    const branchY = Math.min(...cards.map(({ top }) => top)) - BRANCH_ABOVE;

    if (i > 0) {
      const previous = tiers[i - 1];
      const mergeY = Math.max(...previous.map(({ bottom }) => bottom)) + MERGE_BELOW;
      const drops = previous.map(({ x, bottom }) => [x, bottom + DROP_OFFSET, x, mergeY]);
      steps.push({ lines: drops, head: drops.at(-1) });
      const joins = spread(previous.map(({ x }) => x), centre, mergeY, true);
      if (joins.length) steps.push({ lines: joins, head: joins[0] });
      trunkTop = mergeY;
    }

    const labelY = Math.round((trunkTop + branchY) / 2);
    const halfGap = labels[i].offsetHeight / 2 + LABEL_GAP;
    const upper = [centre, trunkTop, centre, labelY - halfGap];
    const lower = [centre, labelY + halfGap, centre, branchY];
    steps.push({ lines: [upper], head: upper });
    steps.push({ lines: [], head: [centre, labelY - halfGap, centre, labelY + halfGap], label: i });
    steps.push({ lines: [lower], head: lower });
    labelPositions.push({ x: centre, y: labelY });

    const branch = spread(xs, centre, branchY, false);
    if (branch.length) steps.push({ lines: branch, head: branch.at(-1) });
    const landings = cards.map(({ x, top }) => [x, branchY, x, top]);
    steps.push({ lines: landings, head: landings.at(-1), tier: i });
  });

  return { steps, labels: labelPositions, width: tree.clientWidth, height: tree.offsetHeight };
}

function createTree(tree) {
  let geometry = null;
  let lines = [];
  let trigger = null;

  const layout = () => {
    geometry = measureTree(tree);
    const svg = tree.querySelector('.tree-lines');
    svg.setAttribute('width', geometry.width);
    svg.setAttribute('height', geometry.height);
    geometry.steps.flatMap(({ lines: segments }) => segments).forEach(([x1, y1, x2, y2], i) => {
      lines[i]?.setAttribute('x1', x1);
      lines[i]?.setAttribute('y1', y1);
      lines[i]?.setAttribute('x2', x2);
      lines[i]?.setAttribute('y2', y2);
    });
    tree.querySelectorAll('.tree-label').forEach((label, i) => {
      label.style.left = `${geometry.labels[i].x}px`;
      label.style.top = `${geometry.labels[i].y}px`;
    });
  };

  function build(year) {
    trigger?.kill(true);
    tree.innerHTML = treeTemplate(year);

    const svg = tree.querySelector('.tree-lines');
    const head = tree.querySelector('.line-head');
    const rows = [...tree.querySelectorAll('.tree-row')];
    const labels = [...tree.querySelectorAll('.tree-label')];
    const cards = rows.flatMap((row) => [...row.children]);
    const { steps } = measureTree(tree);

    lines = steps.flatMap(({ lines: segments }) => segments).map(() => {
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('pathLength', '1');
      svg.appendChild(line);
      return line;
    });
    layout();

    gsap.set(cards.map((card) => card.querySelector('.team-photo')), { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set(cards.map((card) => card.querySelector('img')), { scale: 1.2 });
    gsap.set(cards.map((card) => card.querySelector('.team-meta')), { opacity: 0, y: 16 });
    gsap.set(labels, { opacity: 0, y: -6 });
    gsap.set(head, { opacity: 0 });

    const timeline = gsap.timeline({ defaults: { ease: 'none' } }).to(head, { opacity: 1, duration: 0.1 }, 0);
    let lineIndex = 0;

    steps.forEach((step, i) => {
      const segments = step.lines.map(() => lines[lineIndex++]);
      const duration = Math.max(0.05, segmentLength(step.head) / DRAW_SPEED);
      const at = timeline.duration();

      timeline
        .fromTo(segments, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration }, at)
        .fromTo(head,
          { x: () => geometry.steps[i].head[0], y: () => geometry.steps[i].head[1] },
          { x: () => geometry.steps[i].head[2], y: () => geometry.steps[i].head[3], duration, immediateRender: i === 0 },
          at);

      if (step.label != null) {
        timeline.to(labels[step.label], { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, at);
      }

      if (step.tier != null) {
        rows[step.tier].querySelectorAll('.tree-card').forEach((card, k) => {
          const start = at + duration * 0.6 + k * 0.1;
          timeline
            .to(card.querySelector('.team-photo'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut' }, start)
            .to(card.querySelector('img'), { scale: 1, duration: 1.2, ease: 'power2.out' }, start)
            .to(card.querySelector('.team-meta'), { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, start + 0.35);
        });
      }
    });

    trigger = ScrollTrigger.create({
      animation: timeline,
      trigger: tree,
      start: 'top 70%',
      end: 'bottom 75%',
      scrub: 0.6,
      invalidateOnRefresh: true,
    });
  }

  return { build, layout };
}

function revealedLeads(tree) {
  return [...tree.querySelectorAll('.tree-card')].flatMap((card) => {
    const a = gsap.getProperty(card.querySelector('.team-meta'), 'opacity');
    if (a < 0.05) return [];
    const rect = card.querySelector('.team-photo').getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return [];
    return [{ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, a }];
  });
}

export function initTeam() {
  const tree = document.getElementById('team-tree');
  const { build, layout } = createTree(tree);

  build(team[0]);
  ScrollTrigger.addEventListener('refreshInit', layout);

  let inView = false;
  ScrollTrigger.create({
    trigger: tree,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      inView = self.isActive;
    },
  });
  addWebTargets({ active: () => inView, targets: () => revealedLeads(tree) });

  document.querySelector('.team-tabs').addEventListener('click', (event) => {
    const tab = event.target.closest('.team-tab');
    if (!tab || tab.classList.contains('is-active')) return;

    document.querySelectorAll('.team-tab').forEach((t) => {
      t.classList.toggle('is-active', t === tab);
      t.setAttribute('aria-selected', t === tab);
    });

    const year = team.find(({ id }) => id === tab.dataset.year);
    gsap.to(tree, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        build(year);
        gsap.set(tree, { opacity: 1 });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      },
    });
  });
}
