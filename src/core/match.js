import { ARENA, CANNON, MATCH } from '../data/constants.js';
import { TEAMS } from '../data/teams.js';
import { createGrid } from './grid.js';
import { updateBullets, updateCannons } from './physics.js';

function buildCannons() {
  const cannons = [];
  let id = 0;
  for (const team of TEAMS) {
    const y = team.side === 'top' ? CANNON.edgeOffset : ARENA.height - CANNON.edgeOffset;
    for (let i = 0; i < CANNON.perSide; i++) {
      const x = (ARENA.width * (i + 1)) / (CANNON.perSide + 1);
      cannons.push({
        id: id++,
        team: team.index,
        x,
        y,
        hp: CANNON.hp,
        maxHp: CANNON.hp,
        radius: CANNON.radius,
        alive: true,
        fireCooldown: 10 + i * 13,
      });
    }
  }
  return cannons;
}

export function createMatch(bus) {
  const match = {
    phase: 'menu', // menu | playing | ended
    frame: 0,
    teams: TEAMS,
    grid: createGrid(),
    cannons: buildCannons(),
    bullets: [],
    winner: null,
    loser: null,
    reason: null,
  };

  function start(config = {}) {
    match.phase = 'playing';
    match.frame = 0;
    match.winner = null;
    match.loser = null;
    match.reason = null;
    match.grid.reset();
    match.cannons = buildCannons();
    match.bullets = [];
    bus.emit('matchStarted', { matchConfig: config });
  }

  function end(winner, reason) {
    if (match.phase === 'ended') return;
    match.phase = 'ended';
    match.winner = winner;
    match.loser = winner === null ? null : (winner === 0 ? 1 : 0);
    match.reason = reason;
    bus.emit('matchEnded', {
      winner,
      loser: match.loser,
      frame: match.frame,
      reason,
    });
  }

  function aliveCount(teamIndex) {
    let n = 0;
    for (const c of match.cannons) if (c.team === teamIndex && c.alive) n++;
    return n;
  }

  function checkWin() {
    const aliveTop = aliveCount(0);
    const aliveBottom = aliveCount(1);
    if (aliveTop === 0 && aliveBottom === 0) return end(null, 'mutualDestruction');
    if (aliveBottom === 0) return end(0, 'cannonsDestroyed');
    if (aliveTop === 0) return end(1, 'cannonsDestroyed');

    if (match.frame >= MATCH.timeoutSeconds * MATCH.fps) {
      const top = match.grid.share(0);
      const bottom = match.grid.share(1);
      if (top > bottom) return end(0, 'timeoutTerritory');
      if (bottom > top) return end(1, 'timeoutTerritory');
      return end(null, 'timeoutDraw');
    }
  }

  function update() {
    if (match.phase !== 'playing') return;
    match.frame += 1;
    updateCannons(match, bus);
    updateBullets(match, bus);

    if (match.frame % MATCH.territorySampleInterval === 0) {
      bus.emit('territorySample', {
        frame: match.frame,
        top: match.grid.share(0),
        bottom: match.grid.share(1),
      });
    }
    checkWin();
  }

  return { state: match, start, end, update };
}
