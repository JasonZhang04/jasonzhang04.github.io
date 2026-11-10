// Browser glue for the hero scene: layer loading, integer scaling, the frame loop,
// hotspots, bubbles and pausing. Simulation and drawing live in pixel/scene-core.js.
import { W, H, createState, step, render, flickerOn, wave, AVATAR_POS } from './pixel/scene-core.js';
import { NIGHT, T, hexToRgb } from './pixel/palette.js';
import { FPS, LAYERS, BUBBLE_LINES, AGENT_LINKS, AVATAR_GREETING } from './pixel/config.js';

const root = document.querySelector('[data-night-lab]');
const canvas = root.querySelector('canvas');
const stage = root.querySelector('.night-lab-stage');
const ctx = canvas.getContext('2d', { alpha: false });
const rgb = NIGHT.map(hexToRgb);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const lut = new Map(rgb.map(([r, g, b], i) => [(r << 16) | (g << 8) | b, i]));

/** Hand-drawn PNGs or colour-managed browsers may be slightly off palette: snap to the closest colour. */
function nearest(r, g, b) {
  let best = 0, bestDistance = Infinity;
  rgb.forEach(([pr, pg, pb], i) => {
    const d = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2;
    if (d < bestDistance) { bestDistance = d; best = i; }
  });
  return best;
}

/** Accepts a PNG path or a 2D matrix of palette indices. */
async function loadLayer(layer) {
  if (Array.isArray(layer.src)) return { ...layer, data: Uint8Array.from(layer.src.flat()) };
  const img = new Image();
  img.src = layer.src;
  await img.decode();
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const c = off.getContext('2d', { willReadFrequently: true });
  c.drawImage(img, 0, 0);
  const { data: px } = c.getImageData(0, 0, W, H);
  const data = new Uint8Array(W * H);
  for (let i = 0; i < data.length; i++) {
    const a = px[i * 4 + 3];
    if (a < 128) { data[i] = T; continue; }
    const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
    data[i] = lut.get((r << 16) | (g << 8) | b) ?? nearest(r, g, b);
  }
  return { ...layer, data };
}

/** Largest whole number of device pixels per logical pixel that fits the column. */
function fit() {
  const dpr = window.devicePixelRatio || 1;
  const available = root.clientWidth;
  const scale = Math.max(1, Math.floor((available * dpr) / W));
  root.style.setProperty('--scene-w', `${(W * scale) / dpr}px`);
  root.style.setProperty('--scene-px', `${scale / dpr}px`);
}

const percent = (x, y) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });
const place = (el, x, y) => { const p = percent(x, y); el.style.left = p.left; el.style.top = p.top; };

/** Position a bubble over a scene point, keeping the whole bubble inside the stage. */
function placeBubble(el, x, y) {
  const stageWidth = stage.clientWidth;
  const half = el.offsetWidth / 2 + 2;
  const cx = Math.min(stageWidth - half, Math.max(half, (x / W) * stageWidth));
  el.style.left = `${cx}px`;
  el.style.top = `${(y / H) * 100}%`;
}

async function main() {
  const layers = await Promise.all(LAYERS.map(loadLayer));
  const state = createState(layers);
  const out = new Uint8Array(W * H);
  const image = ctx.createImageData(W, H);
  const view = { dx1: 0, dx2: 0, hover: null };
  let dirty = true;

  const paint = () => {
    render(state, out, view);
    const d = image.data;
    for (let i = 0; i < out.length; i++) {
      const [r, g, b] = rgb[out[i]];
      d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
    dirty = false;
  };

  // Settle into a composed moment before the first paint.
  for (let i = 0; i < 24; i++) step(state);
  fit();
  paint();
  root.classList.add('is-live');
  new ResizeObserver(fit).observe(root);

  // Hotspots brighten their object and reveal a label.
  root.querySelectorAll('.hotspot').forEach((a) => {
    const [x, y, w, h] = a.dataset.rect.split(',').map(Number);
    const on = () => { view.hover = { x, y, w, h }; dirty = true; if (!running) paint(); };
    const off = () => { view.hover = null; dirty = true; if (!running) paint(); };
    a.addEventListener('pointerenter', on);
    a.addEventListener('pointerleave', off);
    a.addEventListener('focus', on);
    a.addEventListener('blur', off);
  });

  // Pointer parallax: foreground up to 2 logical pixels, midground 1, background 0.
  const canParallax = () => !reduced.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  stage.addEventListener('pointermove', (e) => {
    if (!canParallax()) return;
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const dx1 = -Math.round(nx);
    const dx2 = -Math.round(nx * 2);
    if (dx1 !== view.dx1 || dx2 !== view.dx2) { view.dx1 = dx1; view.dx2 = dx2; dirty = true; }
  });
  stage.addEventListener('pointerleave', () => { if (view.dx1 || view.dx2) { view.dx1 = 0; view.dx2 = 0; dirty = true; } });

  // Bubbles: at most one at a time, 2.5 seconds each.
  const bubble = root.querySelector('[data-bubble]');
  const linkBubble = root.querySelector('[data-link-bubble]');
  let bubbleUntil = 0;
  let bubbleAgent = null;
  let nextBubbleFrame = FPS * 4;
  let lineIndex = 0;
  let linkUntil = 0;
  let linkAgent = null;

  const agentAnchor = (g) => [g.x + g.sprites[g.f].w / 2 + view.dx1, g.y];
  const hideLink = () => { linkBubble.hidden = true; linkAgent = null; linkUntil = 0; };
  const hideBubble = () => { bubble.hidden = true; bubbleAgent = null; bubbleUntil = 0; };

  // Each agent has a real button that follows it around the room.
  const agentButtons = [...root.querySelectorAll('[data-agent-hit]')];
  const placeAgents = () => {
    agentButtons.forEach((b, i) => {
      const g = state.agents[i];
      const sp = g.sprites[g.f];
      place(b, g.x + view.dx1 - 2, g.y - 2);
      b.style.width = `${((sp.w + 4) / W) * 100}%`;
      b.style.height = `${((sp.h + 4) / H) * 100}%`;
    });
  };
  placeAgents();
  agentButtons.forEach((b, i) => {
    const link = AGENT_LINKS[i % AGENT_LINKS.length];
    b.setAttribute('aria-label', `Small robot: show a link to ${link.label}`);
    b.addEventListener('click', () => {
      hideBubble();
      linkBubble.replaceChildren();
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = `${link.label} ->`;
      linkBubble.append(a);
      linkBubble.hidden = false;
      linkAgent = state.agents[i];
      linkUntil = state.frame + FPS * 5;
      placeBubble(linkBubble, ...agentAnchor(linkAgent));
    });
  });

  // Avatar: turn and wave on hover, focus or tap, with a short greeting.
  const avatarHit = root.querySelector('[data-avatar-hit]');
  place(avatarHit, AVATAR_POS.x + 1, AVATAR_POS.y);
  avatarHit.style.width = `${(15 / W) * 100}%`;
  avatarHit.style.height = `${(22 / H) * 100}%`;
  const greet = () => {
    if (!reduced.matches) wave(state);
    hideLink();
    bubble.textContent = AVATAR_GREETING;
    bubble.hidden = false;
    bubbleAgent = null;
    bubbleUntil = state.frame + FPS * 2.5;
    placeBubble(bubble, AVATAR_POS.x + 7, AVATAR_POS.y);
    dirty = true;
    if (!running) { paint(); setTimeout(hideBubble, 2500); }
  };
  avatarHit.addEventListener('pointerenter', greet);
  avatarHit.addEventListener('focus', greet);
  avatarHit.addEventListener('click', greet);

  // Tubes flicker on, stepwise, when the page goes dark. This obeys the three-flash limit.
  new MutationObserver(() => {
    if (document.documentElement.getAttribute('data-theme') === 'dark' && !reduced.matches) flickerOn(state);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Frame loop: ambient motion at FPS, paused offscreen or when the tab is hidden.
  let visible = true;
  let running = false;
  let raf = 0;
  let last = 0;
  const interval = 1000 / FPS;

  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    if (now - last < interval) {
      if (dirty) paint();
      return;
    }
    last = now - ((now - last) % interval);
    step(state);

    if (linkAgent) {
      placeBubble(linkBubble, ...agentAnchor(linkAgent));
      if (state.frame >= linkUntil) hideLink();
    }
    if (bubbleUntil) {
      if (bubbleAgent) placeBubble(bubble, ...agentAnchor(bubbleAgent));
      if (state.frame >= bubbleUntil) hideBubble();
    } else if (!linkAgent && state.frame >= nextBubbleFrame) {
      bubbleAgent = state.agents[lineIndex % state.agents.length];
      bubble.textContent = BUBBLE_LINES[lineIndex % BUBBLE_LINES.length];
      lineIndex++;
      bubble.hidden = false;
      placeBubble(bubble, ...agentAnchor(bubbleAgent));
      bubbleUntil = state.frame + FPS * 2.5;
      nextBubbleFrame = state.frame + FPS * (8 + (lineIndex * 3) % 7);
    }
    placeAgents();
    paint();
  };

  const update = () => {
    const should = visible && !document.hidden && !reduced.matches;
    if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); hideBubble(); hideLink(); paint(); }
  };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); }).observe(stage);
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  update();
}

main().catch(() => { /* the static poster remains in place */ });
