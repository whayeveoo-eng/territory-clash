import { ARENA } from './data/constants.js';
import { createEventBus } from './core/events.js';
import { createMatch } from './core/match.js';
import { createStats } from './core/stats.js';
import { createLoop } from './core/loop.js';
import { drawArena } from './render/arena.js';
import { drawCannons } from './render/cannons.js';
import { drawBullets } from './render/bullets.js';
import { createEffects } from './render/effects.js';
import { drawHud } from './render/ui.js';

const canvas = document.getElementById('game');
canvas.width = ARENA.width;
canvas.height = ARENA.height;
const ctx = canvas.getContext('2d');

const bus = createEventBus();
const match = createMatch(bus);
const stats = createStats(bus);
const effects = createEffects(bus);

const overlay = document.getElementById('overlay');
const ovTitle = document.getElementById('ovTitle');
const ovSub = document.getElementById('ovSub');
const actionBtn = document.getElementById('actionBtn');

function render() {
  drawArena(ctx, match.state);
  drawBullets(ctx, match.state);
  drawCannons(ctx, match.state);
  effects.draw(ctx);
  drawHud(ctx, match.state);
}

const loop = createLoop({ update: match.update, render });

function showMenu(mode) {
  if (mode === 'playing') {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');
  if (mode === 'ended') {
    overlay.classList.add('bottom');
    ovTitle.style.display = 'none';
    ovSub.style.display = 'none';
    actionBtn.textContent = '再来一局';
  } else {
    overlay.classList.remove('bottom');
    ovTitle.style.display = '';
    ovSub.style.display = '';
    actionBtn.textContent = '开始';
  }
}

function startMatch(config = {}) {
  match.start(config);
  showMenu('playing');
  loop.start();
}

actionBtn.addEventListener('click', () => startMatch());
bus.on('matchEnded', () => showMenu('ended'));

showMenu('menu');
render();

window.__game = {
  startMatch,
  step: (frames = 1) => loop.step(frames),
  getState: () => match.state.phase,
  getFrame: () => match.state.frame,
  getWinner: () => match.state.winner,
  getStats: () => stats.get(),
  getGrid: () => ({
    cols: match.state.grid.cols,
    rows: match.state.grid.rows,
    cells: Array.from(match.state.grid.cells),
    countByTeam: match.state.grid.countByTeam(),
  }),
  getCannons: () => match.state.cannons,
  getBullets: () => match.state.bullets.filter((b) => b.alive),
};
